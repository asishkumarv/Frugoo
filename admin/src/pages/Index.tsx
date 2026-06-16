import StatsCard from "@/components/admin/StatsCard";
import OrdersTable from "@/components/admin/OrdersTable";
import RevenueChart from "@/components/admin/RevenueChart";
import TopProducts from "@/components/admin/TopProducts";
import { ShoppingCart, IndianRupee, Clock, Truck } from "lucide-react";

const Dashboard = () => {
  return (
    <div className="animate-fade-in min-w-0 overflow-hidden">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-foreground">Frugoo Admin</h1>
        <p className="text-muted-foreground mt-1">Welcome back! Here's your store overview.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatsCard title="Total Orders" value="247" icon={ShoppingCart} variant="primary" trend="12% from last month" trendUp />
        <StatsCard title="Total Revenue" value="₹1,87,450" icon={IndianRupee} variant="secondary" trend="8.2% from last month" trendUp />
        <StatsCard title="Pending Orders" value="18" icon={Clock} variant="accent" trend="3 less than yesterday" trendUp />
        <StatsCard title="Delivered Today" value="12" icon={Truck} variant="muted" trend="On track" trendUp />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8">
        <div className="lg:col-span-2"><RevenueChart /></div>
        <TopProducts />
      </div>

      <OrdersTable />
    </div>
  );
};

export default Dashboard;
