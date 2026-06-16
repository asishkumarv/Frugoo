import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Copy, Trash2, Tag, Percent } from "lucide-react";
import { toast } from "sonner";

type Coupon = {
  id: number;
  code: string;
  discount: number;
  type: "percent" | "flat";
  minOrder: number;
  maxUses: number;
  used: number;
  status: "Active" | "Exhausted" | "Scheduled" | "Expired";
  expires: string;
};

const STORAGE_KEY = "frugoo_coupons";

const defaultCoupons: Coupon[] = [
  { id: 1, code: "MANGO25", discount: 25, type: "percent", minOrder: 500, maxUses: 100, used: 45, status: "Active", expires: "2026-04-30" },
  { id: 2, code: "FRESH100", discount: 100, type: "flat", minOrder: 800, maxUses: 50, used: 50, status: "Exhausted", expires: "2026-03-31" },
  { id: 3, code: "NEWUSER", discount: 15, type: "percent", minOrder: 200, maxUses: 500, used: 230, status: "Active", expires: "2026-06-30" },
  { id: 4, code: "SUMMER50", discount: 50, type: "flat", minOrder: 400, maxUses: 200, used: 0, status: "Scheduled", expires: "2026-05-15" },
  { id: 5, code: "FRUITS10", discount: 10, type: "percent", minOrder: 300, maxUses: 1000, used: 890, status: "Active", expires: "2026-12-31" },
];

const statusColor: Record<string, string> = {
  Active: "bg-primary/15 text-primary",
  Exhausted: "bg-destructive/15 text-destructive",
  Scheduled: "bg-chart-5/15 text-chart-5",
  Expired: "bg-muted text-muted-foreground",
};

const Coupons = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [form, setForm] = useState({ code: "", discount: "", type: "percent" as "percent" | "flat", minOrder: "", maxUses: "", expires: "" });

  // Load from API on mount
  useEffect(() => {
    fetch('http://localhost:3001/api/coupons')
      .then(res => res.json())
      .then(data => setCoupons(data))
      .catch(err => console.error(err));
  }, []);

  const handleAdd = async () => {
    if (!form.code || !form.discount) return;
    const payload = {
      code: form.code.toUpperCase(),
      discount: parseFloat(form.discount),
      type: form.type,
      minOrder: parseInt(form.minOrder) || 0,
      maxUses: parseInt(form.maxUses) || 100,
      used: 0,
      status: "Active",
      expires: form.expires || "2026-12-31",
    };

    try {
      const res = await fetch('http://localhost:3001/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const created = await res.json();
      setCoupons([...coupons, created]);
      setDialogOpen(false);
      setForm({ code: "", discount: "", type: "percent", minOrder: "", maxUses: "", expires: "" });
      toast.success("Coupon created");
    } catch (err) {
      toast.error("Failed to create coupon");
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success(`Copied ${code}`);
  };

  const confirmDelete = async () => {
    if (deleteId == null) return;
    try {
      await fetch(`http://localhost:3001/api/coupons/${deleteId}`, { method: 'DELETE' });
      const removed = coupons.find((c) => c.id === deleteId);
      setCoupons(coupons.filter((c) => c.id !== deleteId));
      setDeleteId(null);
      toast.success(`Deleted ${removed?.code ?? "coupon"}`);
    } catch (err) {
      toast.error("Failed to delete coupon");
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Coupons</h1>
          <p className="text-muted-foreground text-sm">Create, manage and remove discount codes</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button style={{ background: "var(--gradient-primary)" }} className="text-primary-foreground shrink-0">
              <Plus className="w-4 h-4 mr-2" /> Create Coupon
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>New Coupon</DialogTitle></DialogHeader>
            <div className="space-y-4 mt-4">
              <Input placeholder="Coupon code (e.g. SUMMER20)" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} />
              <div className="grid grid-cols-2 gap-3">
                <Input placeholder="Discount value" type="number" value={form.discount} onChange={(e) => setForm({ ...form, discount: e.target.value })} />
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as "percent" | "flat" })} className="rounded-md border border-input bg-background px-3 text-sm">
                  <option value="percent">Percentage (%)</option>
                  <option value="flat">Flat (₹)</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input placeholder="Min order ₹" type="number" value={form.minOrder} onChange={(e) => setForm({ ...form, minOrder: e.target.value })} />
                <Input placeholder="Max uses" type="number" value={form.maxUses} onChange={(e) => setForm({ ...form, maxUses: e.target.value })} />
              </div>
              <Input type="date" value={form.expires} onChange={(e) => setForm({ ...form, expires: e.target.value })} />
              <Button onClick={handleAdd} className="w-full text-primary-foreground" style={{ background: "var(--gradient-primary)" }}>Create Coupon</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {coupons.length === 0 ? (
        <div className="bg-card rounded-xl border border-border p-12 text-center shadow-card">
          <Tag className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
          <p className="text-muted-foreground">No coupons yet. Create your first one above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {coupons.map((coupon) => (
            <div key={coupon.id} className="bg-card rounded-xl border border-border p-5 shadow-card hover:shadow-card-hover transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    {coupon.type === "percent" ? <Percent className="w-5 h-5 text-primary" /> : <Tag className="w-5 h-5 text-primary" />}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-foreground truncate">{coupon.code}</span>
                      <button onClick={() => copyCode(coupon.code)} className="text-muted-foreground hover:text-foreground shrink-0" aria-label="Copy code">
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground">Expires {coupon.expires}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge className={`${statusColor[coupon.status]} border-0 text-xs`}>{coupon.status}</Badge>
                  <button
                    onClick={() => setDeleteId(coupon.id)}
                    className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                    aria-label={`Delete coupon ${coupon.code}`}
                    title="Delete coupon"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="text-2xl font-bold text-primary mb-3">
                {coupon.type === "percent" ? `${coupon.discount}%` : `₹${coupon.discount}`}{" "}
                <span className="text-sm font-normal text-muted-foreground">off</span>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Min: ₹{coupon.minOrder}</span>
                <span>Used: {coupon.used}/{coupon.maxUses}</span>
              </div>
              <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
                <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${Math.min(100, (coupon.used / coupon.maxUses) * 100)}%` }} />
              </div>
            </div>
          ))}
        </div>
      )}

      <AlertDialog open={deleteId !== null} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this coupon?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes the coupon. It will no longer work on the website.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Coupons;
