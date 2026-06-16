import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, Plus, Edit2, Trash2, Package, Upload, X } from "lucide-react";

type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  unit: string;
  status: string;
  image: string;
  description: string;
  tag?: string;
  inStock?: boolean;
};

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [editProduct, setEditProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetch('http://localhost:3001/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error(err));
  }, []);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ name: "", category: "", price: "", stock: "", unit: "kg", image: "", description: "" });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const statusColor = (s: string) =>
    s === "Active" ? "bg-primary/15 text-primary" : s === "Low Stock" ? "bg-secondary/15 text-secondary" : "bg-destructive/15 text-destructive";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const url = reader.result as string;
        setImagePreview(url);
        setForm({ ...form, image: url });
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setImagePreview(null);
    setForm({ ...form, image: "" });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const openAdd = () => {
    setEditProduct(null);
    setForm({ name: "", category: "", price: "", stock: "", unit: "kg", image: "", description: "" });
    setImagePreview(null);
    setDialogOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditProduct(p);
    setForm({ name: p.name, category: p.category, price: String(p.price), stock: String(p.stock), unit: p.unit, image: p.image, description: p.description });
    setImagePreview(p.image);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.category || !form.price) return;
    const stock = parseInt(form.stock) || 0;
    const status = stock === 0 ? "Out of Stock" : stock < 50 ? "Low Stock" : "Active";
    const payload = {
      name: form.name,
      category: form.category,
      price: parseFloat(form.price),
      stock,
      unit: form.unit,
      image: form.image,
      description: form.description,
      status
    };

    if (editProduct) {
      const res = await fetch(`http://localhost:3001/api/products/${editProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const updated = await res.json();
      setProducts(products.map((p) => p.id === editProduct.id ? updated : p));
    } else {
      const res = await fetch('http://localhost:3001/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const created = await res.json();
      setProducts([...products, created]);
    }
    setDialogOpen(false);
  };

  const handleDelete = async (id: number) => {
    await fetch(`http://localhost:3001/api/products/${id}`, { method: 'DELETE' });
    setProducts(products.filter((p) => p.id !== id));
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Products</h1>
          <p className="text-muted-foreground text-sm">Manage your fruit inventory</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAdd} style={{ background: "var(--gradient-primary)" }} className="text-primary-foreground shrink-0">
              <Plus className="w-4 h-4 mr-2" /> Add Product
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Product Image</label>
                {imagePreview ? (
                  <div className="relative w-full h-40 rounded-lg border border-border overflow-hidden bg-muted/30">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-contain" />
                    <button type="button" onClick={clearImage} className="absolute top-2 right-2 p-1 rounded-full bg-destructive/80 text-destructive-foreground hover:bg-destructive transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="flex flex-col items-center justify-center w-full h-40 rounded-lg border-2 border-dashed border-border bg-muted/30 cursor-pointer hover:border-primary/50 transition-colors"
                  >
                    <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground">Click to upload image</span>
                    <span className="text-xs text-muted-foreground/60 mt-1">JPG, PNG up to 5MB</span>
                  </div>
                )}
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </div>
              <Input placeholder="Product name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <Input placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
              <div className="grid grid-cols-2 gap-3">
                <Input placeholder="Price (₹)" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
                <Input placeholder="Stock" type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
              </div>
              <Input placeholder="Unit (kg, dozen, piece)" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} />
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Description</label>
                <Textarea
                  placeholder="Enter product description..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                />
              </div>
              <Button onClick={handleSave} className="w-full text-primary-foreground" style={{ background: "var(--gradient-primary)" }}>
                {editProduct ? "Update Product" : "Add Product"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((product) => (
          <div key={product.id} className="bg-card rounded-xl border border-border p-4 shadow-card hover:shadow-card-hover transition-all group">
            <div className="w-full h-20 mb-3 flex items-center justify-center rounded-lg bg-muted/30 overflow-hidden">
              {product.image ? (
                <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
              ) : (
                <span className="text-4xl">📦</span>
              )}
            </div>
            <h3 className="font-semibold text-foreground">{product.name}</h3>
            <p className="text-xs text-muted-foreground mb-2">{product.category}</p>
            <div className="flex items-center justify-between mb-3">
              <span className="text-lg font-bold text-primary">₹{product.price}<span className="text-xs text-muted-foreground font-normal">/{product.unit}</span></span>
              <Badge className={`${statusColor(product.status)} border-0 text-xs`}>{product.status}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Package className="w-3 h-3" /> Stock: {product.stock}
              </span>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEdit(product)} className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground">
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => handleDelete(product.id)} className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
