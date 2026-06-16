import { useEffect, useState } from "react";
import StatsCard from "@/components/admin/StatsCard";
import OrdersTable from "@/components/admin/OrdersTable";
import RevenueChart from "@/components/admin/RevenueChart";
import TopProducts from "@/components/admin/TopProducts";
import { ShoppingCart, IndianRupee, Clock, Truck } from "lucide-react";

const Dashboard = () => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("http://localhost:3001/api/analytics")
      .then(res => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  return (
    <div className="animate-fade-in min-w-0 overflow-hidden">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-foreground">Frugoo Admin</h1>
        <p className="text-muted-foreground mt-1">Welcome back! Here's your store overview.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatsCard title="Total Orders" value={data ? data.totalOrders : "..."} icon={ShoppingCart} variant="primary" trend="Up to date" trendUp />
        <StatsCard title="Total Revenue" value={data ? `₹${data.totalRevenue.toLocaleString()}` : "..."} icon={IndianRupee} variant="secondary" trend="Up to date" trendUp />
        <StatsCard title="Pending Orders" value={data ? data.pendingOrders : "..."} icon={Clock} variant="accent" trend="Needs attention" trendUp={false} />
        <StatsCard title="Delivered Today" value={data ? data.totalOrders - data.pendingOrders : "..."} icon={Truck} variant="muted" trend="On track" trendUp />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8">
        <div className="lg:col-span-2"><RevenueChart data={data?.recentRevenue} /></div>
        <TopProducts data={data?.topProducts} />
      </div>

      <OrdersTable />
    </div>
  );
};

export default Dashboard;
