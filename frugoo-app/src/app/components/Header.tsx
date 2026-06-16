import { ShoppingCart, Menu, X, Search, User, LogOut } from "lucide-react";
import { Button } from "./ui/button";
// Logo removed from import
import { Badge } from "./ui/badge";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useProducts } from "../context/ProductContext";
import { Input } from "./ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { toast } from "sonner";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { getTotalItems } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const { products } = useProducts();
  const location = useLocation();
  const navigate = useNavigate();
  const totalItems = getTotalItems();

  const isActive = (path: string) => location.pathname === path;

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleProductClick = (productId: number) => {
    setIsSearchOpen(false);
    setSearchQuery("");
    navigate(`/shop?highlight=${productId}`);
  };

  const handleLogout = () => {
    const userName = user?.name;
    logout();
    toast.success(`Goodbye, ${userName}! See you soon.`);
    navigate("/");
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex h-20 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <img 
                src="/assets/6189c5d394e4632f53a1664a1d90ef60c97ad6dd.png" 
                alt="Frugoo" 
                className="h-20 w-20 object-contain"
                style={{ 
                  imageRendering: 'crisp-edges',
                  filter: 'contrast(1.1) brightness(1.05)'
                }}
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <Link
                to="/"
                className={`text-sm font-medium transition-colors ${
                  isActive('/') ? 'text-green-700' : 'hover:text-green-700'
                }`}
              >
                Home
              </Link>
              <Link
                to="/shop"
                className={`text-sm font-medium transition-colors ${
                  isActive('/shop') ? 'text-green-700' : 'hover:text-green-700'
                }`}
              >
                Shop
              </Link>
              <Link
                to="/track-order"
                className={`text-sm font-medium transition-colors ${
                  isActive('/track-order') ? 'text-green-700' : 'hover:text-green-700'
                }`}
              >
                Track Order
              </Link>
              <Link
                to="/about"
                className={`text-sm font-medium transition-colors ${
                  isActive('/about') ? 'text-green-700' : 'hover:text-green-700'
                }`}
              >
                About Us
              </Link>
              <Link
                to="/contact"
                className={`text-sm font-medium transition-colors ${
                  isActive('/contact') ? 'text-green-700' : 'hover:text-green-700'
                }`}
              >
                Contact
              </Link>
            </nav>

            {/* Right side actions */}
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsSearchOpen(true)}
              >
                <Search className="h-5 w-5" />
              </Button>
              
              <Link to="/cart">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="relative"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {totalItems > 0 && (
                    <Badge 
                      className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-green-600"
                    >
                      {totalItems}
                    </Badge>
                  )}
                </Button>
              </Link>

              {/* User Account Link */}
              {isAuthenticated && user ? (
                <Link to="/account" className="hidden md:block">
                  <Button variant="ghost" size="icon" className="relative">
                    <div className="h-8 w-8 rounded-full bg-green-600 text-white flex items-center justify-center font-semibold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  </Button>
                </Link>
              ) : (
                <Link to="/login" className="hidden md:block">
                  <Button variant="outline" size="sm">
                    Login
                  </Button>
                </Link>
              )}

              {/* Mobile menu button */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <nav className="md:hidden py-4 space-y-2 border-t">
              <Link
                to="/"
                className={`block py-2 text-sm font-medium transition-colors ${
                  isActive('/') ? 'text-green-700' : 'hover:text-green-700'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/shop"
                className={`block py-2 text-sm font-medium transition-colors ${
                  isActive('/shop') ? 'text-green-700' : 'hover:text-green-700'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Shop
              </Link>
              <Link
                to="/track-order"
                className={`block py-2 text-sm font-medium transition-colors ${
                  isActive('/track-order') ? 'text-green-700' : 'hover:text-green-700'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Track Order
              </Link>
              <Link
                to="/about"
                className={`block py-2 text-sm font-medium transition-colors ${
                  isActive('/about') ? 'text-green-700' : 'hover:text-green-700'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About Us
              </Link>
              <Link
                to="/contact"
                className={`block py-2 text-sm font-medium transition-colors ${
                  isActive('/contact') ? 'text-green-700' : 'hover:text-green-700'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </Link>
              <div className="border-t pt-2">
                {isAuthenticated && user ? (
                  <>
                    <Link 
                      to="/account" 
                      className="block py-2 text-sm font-medium hover:text-green-700"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      My Account
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="block py-2 text-sm font-medium hover:text-green-700 w-full text-left"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <Link 
                    to="/login" 
                    className="block py-2 text-sm font-medium hover:text-green-700"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                )}
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Global Search Dialog */}
      <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Search Products</DialogTitle>
          </DialogHeader>
          
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search for fruits..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              autoFocus
            />
          </div>

          <div className="flex-1 overflow-y-auto">
            {searchQuery.length > 0 ? (
              filteredProducts.length > 0 ? (
                <div className="space-y-2">
                  {filteredProducts.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => handleProductClick(product.id)}
                      className="w-full flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors text-left"
                    >
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold">{product.name}</h3>
                        <p className="font-bold text-green-700 mt-1">₹{product.price.toFixed(2)}</p>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">No products found for "{searchQuery}"</p>
                </div>
              )
            ) : (
              <div className="text-center py-12">
                <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">Start typing to search for products</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}