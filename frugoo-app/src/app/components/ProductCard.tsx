import { Plus, Minus, Zap } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Badge } from "./ui/badge";
import { Product } from "../context/CartContext";
import { useNavigate } from "react-router";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  cartQuantity?: number;
  onUpdateQuantity?: (productId: number, quantity: number) => void;
}

export function ProductCard({ 
  product, 
  onAddToCart, 
  cartQuantity = 0,
  onUpdateQuantity 
}: ProductCardProps) {
  const navigate = useNavigate();

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product);
    toast.success("Proceeding to checkout...");
    setTimeout(() => {
      navigate("/checkout");
    }, 500);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product);
  };

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer h-full flex flex-col" onClick={handleCardClick}>
      <div className="relative bg-gradient-to-b from-gray-50 to-white overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center"
        />
        {product.tag && (
          <Badge className="absolute top-2 right-2 bg-orange-500 z-10">
            {product.tag}
          </Badge>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
            <Badge variant="destructive" className="text-lg px-4 py-1">Out of Stock</Badge>
          </div>
        )}
      </div>

      <CardContent className="p-3 pb-1.5 flex-1 flex flex-col">
        <h3 className="font-semibold text-base mb-0.5 line-clamp-2 min-h-[2.5rem]">{product.name}</h3>
        <div className="flex items-baseline gap-1 mt-auto">
          <span className="text-xl font-bold text-green-700">₹{product.price.toFixed(2)}</span>
          <span className="text-xs text-gray-500">/ {product.unit}</span>
        </div>
      </CardContent>

      <CardFooter className="p-3 pt-1.5 flex-col gap-1.5 mt-auto">
        {cartQuantity > 0 && (
          <div className="flex items-center justify-between w-full mb-0.5">
            <Button
              variant="outline"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onUpdateQuantity?.(product.id, cartQuantity - 1);
              }}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="font-semibold text-lg">{cartQuantity}</span>
            <Button
              variant="outline"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onUpdateQuantity?.(product.id, cartQuantity + 1);
              }}
              disabled={!product.inStock}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        )}
        <div className="flex flex-col sm:flex-row gap-2 w-full">
          <Button
            className="w-full sm:flex-1 bg-green-600 hover:bg-green-700 h-10"
            onClick={handleAddToCart}
            disabled={!product.inStock}
          >
            <Plus className="h-4 w-4 mr-1.5" />
            Add to Cart
          </Button>
          <Button
            className="w-full sm:flex-1 bg-orange-600 hover:bg-orange-700 h-10"
            onClick={handleBuyNow}
            disabled={!product.inStock}
          >
            <Zap className="h-4 w-4 mr-1.5" />
            Buy Now
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}