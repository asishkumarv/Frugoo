import { Facebook, Twitter, Instagram, Mail } from "lucide-react";
import { Link } from "react-router";
import logo from "figma:asset/6189c5d394e4632f53a1664a1d90ef60c97ad6dd.png";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 pt-12 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-white rounded-lg p-1">
                <img src={logo} alt="Frugoo" className="h-12 w-12 object-contain" />
              </div>
              <span className="text-xl font-semibold text-white">Frugoo</span>
            </div>
            <p className="text-sm">
              Naturally delicious, perfectly yours. Fresh fruits delivered with love.
            </p>
            <div className="flex gap-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-green-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              {/* <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-green-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a> */}
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-green-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="mailto:contact@frugoo.com" className="hover:text-green-400 transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-green-400 transition-colors">Home</Link></li>
              <li><Link to="/shop" className="hover:text-green-400 transition-colors">Shop</Link></li>
              <li><Link to="/about" className="hover:text-green-400 transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-green-400 transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-semibold text-white mb-4">Customer Service</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/track-order" className="hover:text-green-400 transition-colors">Track Order</Link></li>
              <li><Link to="/cart" className="hover:text-green-400 transition-colors">My Cart</Link></li>
              <li><Link to="/account" className="hover:text-green-400 transition-colors">My Account</Link></li>
              <li><Link to="/contact" className="hover:text-green-400 transition-colors">Help & Support</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm">
          <p className="mb-0">&copy; 2026 Frugoo. All rights reserved. Naturally delicious, perfectly yours.</p>
        </div>
      </div>
    </footer>
  );
}
