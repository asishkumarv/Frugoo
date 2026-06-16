import { Routes, Route } from "react-router-dom";
import AdminLayout from "./components/admin/AdminLayout";
import Analytics from "./pages/Analytics";
import Coupons from "./pages/Coupons";
import Customers from "./pages/Customers";
import Delivery from "./pages/Delivery";
import HeroVideos from "./pages/HeroVideos";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Messages from "./pages/Messages";
import Orders from "./pages/Orders";
import Products from "./pages/Products";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<Index />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="coupons" element={<Coupons />} />
        <Route path="customers" element={<Customers />} />
        <Route path="delivery" element={<Delivery />} />
        <Route path="hero-videos" element={<HeroVideos />} />
        <Route path="messages" element={<Messages />} />
        <Route path="orders" element={<Orders />} />
        <Route path="products" element={<Products />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
