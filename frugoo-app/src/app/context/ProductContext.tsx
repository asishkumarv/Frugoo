import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Product } from "./CartContext";

interface ProductContextType {
  products: Product[];
  loading: boolean;
}

const ProductContext = createContext<ProductContextType>({ products: [], loading: true });

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://frugoo.onrender.com/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch products:", err);
        setLoading(false);
      });
  }, []);

  return (
    <ProductContext.Provider value={{ products, loading }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  return useContext(ProductContext);
}
