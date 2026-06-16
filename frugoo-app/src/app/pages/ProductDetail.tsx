import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { useProducts } from "../context/ProductContext";
import { useCart } from "../context/CartContext";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Card, CardContent } from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import { Plus, Minus, ShoppingCart, Zap, ArrowLeft, CheckCircle2, Truck, Shield } from "lucide-react";
import { toast } from "sonner";

export function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, loading } = useProducts();
  const { addToCart, getCartItemQuantity } = useCart();
  const [quantity, setQuantity] = useState(1);

  const product = products.find(p => p.id === Number(id));

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Product not found</h2>
        <Link to="/shop">
          <Button>Back to Shop</Button>
        </Link>
      </div>
    );
  }

  const cartQuantity = getCartItemQuantity(product.id);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    toast.success(`${quantity} ${product.name} added to cart!`);
  };

  const handleBuyNow = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    toast.success("Proceeding to checkout...");
    setTimeout(() => {
      navigate("/checkout");
    }, 500);
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= 99) {
      setQuantity(newQuantity);
    }
  };

  // Related products (from same category)
  const relatedProducts = products
    .filter(p => p.id !== product.id && p.category === product.category)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Link to="/shop">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Shop
            </Button>
          </Link>
        </div>
      </div>

      {/* Product Detail */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Image */}
          <div className="relative">
            <Card className="overflow-hidden">
              <div className="relative aspect-square bg-white">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain p-4"
                />
                {product.tag && (
                  <Badge className="absolute top-4 right-4 bg-orange-500 text-lg px-4 py-2">
                    {product.tag}
                  </Badge>
                )}
                {!product.inStock && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Badge variant="destructive" className="text-xl px-6 py-3">
                      Out of Stock
                    </Badge>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
              {product.category && (
                <Badge variant="outline" className="text-sm capitalize">
                  {product.category}
                </Badge>
              )}
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-green-700">₹{product.price.toFixed(2)}</span>
              <span className="text-xl text-gray-500">/ {product.unit}</span>
            </div>

            <Separator />

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              {product.inStock ? (
                <>
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span className="text-green-600 font-semibold">In Stock</span>
                </>
              ) : (
                <>
                  <span className="text-red-600 font-semibold">Out of Stock</span>
                </>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div>
                <h3 className="font-semibold text-lg mb-2">Description</h3>
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Product Details */}
            <Card>
              <CardContent className="p-4 space-y-3">
                <h3 className="font-semibold text-lg mb-3">Product Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Unit:</span>
                    <span className="ml-2 font-medium">{product.unit}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Category:</span>
                    <span className="ml-2 font-medium capitalize">{product.category || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Availability:</span>
                    <span className={`ml-2 font-medium ${product.inStock ? "text-green-600" : "text-red-600"}`}>
                      {product.inStock ? "In Stock" : "Out of Stock"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Product ID:</span>
                    <span className="ml-2 font-medium">#{product.id}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quantity Selector */}
            {product.inStock && (
              <div>
                <label className="block font-semibold mb-2">Quantity</label>
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="text-2xl font-semibold w-16 text-center">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10"
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= 99}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-row gap-4">
              <Button
                size="lg"
                className="flex-1 bg-green-600 hover:bg-green-700 h-14 text-lg"
                onClick={handleAddToCart}
                disabled={!product.inStock}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
              <Button
                size="lg"
                className="flex-1 bg-orange-600 hover:bg-orange-700 h-14 text-lg"
                onClick={handleBuyNow}
                disabled={!product.inStock}
              >
                <Zap className="mr-2 h-5 w-5" />
                Buy Now
              </Button>
            </div>

            {cartQuantity > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 font-medium">
                  {cartQuantity} {cartQuantity === 1 ? "item" : "items"} of this product in your cart
                </p>
              </div>
            )}

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                <Truck className="h-8 w-8 text-green-600" />
                <div className="text-sm">
                  <div className="font-semibold">Fast Delivery</div>
                  <div className="text-gray-600">Same day available</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
                <div className="text-sm">
                  <div className="font-semibold">100% Fresh</div>
                  <div className="text-gray-600">Farm fresh quality</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                <Shield className="h-8 w-8 text-green-600" />
                <div className="text-sm">
                  <div className="font-semibold">Quality Guarantee</div>
                  <div className="text-gray-600">Money back</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Card
                  key={relatedProduct.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => {
                    navigate(`/product/${relatedProduct.id}`);
                    window.scrollTo(0, 0);
                  }}
                >
                  <div className="relative bg-white">
                    <img
                      src={relatedProduct.image}
                      alt={relatedProduct.name}
                      className="w-full h-48 object-contain p-2"
                    />
                    {relatedProduct.tag && (
                      <Badge className="absolute top-2 right-2 bg-orange-500">
                        {relatedProduct.tag}
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{relatedProduct.name}</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-bold text-green-700">₹{relatedProduct.price.toFixed(2)}</span>
                      <span className="text-sm text-gray-500">/ {relatedProduct.unit}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}</div>
          </div>
        )}
      </div>
    </div>
  );
}