import { useState, useEffect } from "react";
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { TrendingUp, TrendingDown, Users, ShoppingCart, IndianRupee, Eye } from "lucide-react";

// Using dynamic data from backend now

const Analytics = () => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("http://localhost:3001/api/analytics")
      .then(res => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  const kpis = data ? [
    { label: "Total Revenue", value: `₹${data.totalRevenue.toLocaleString()}`, change: "Up to date", up: true, icon: IndianRupee },
    { label: "Total Orders", value: `${data.totalOrders}`, change: "Up to date", up: true, icon: ShoppingCart },
    { label: "Pending Orders", value: `${data.pendingOrders}`, change: "Needs attention", up: false, icon: Users },
    { label: "Avg. Order Value", value: `₹${(data.totalOrders ? data.totalRevenue / data.totalOrders : 0).toFixed(0)}`, change: "Up to date", up: true, icon: Eye },
  ] : [
    { label: "Total Revenue", value: "...", change: "", up: true, icon: IndianRupee },
    { label: "Total Orders", value: "...", change: "", up: true, icon: ShoppingCart },
    { label: "Pending Orders", value: "...", change: "", up: true, icon: Users },
    { label: "Avg. Order Value", value: "...", change: "", up: true, icon: Eye },
  ];

  return (
  <div className="animate-fade-in">
    <div className="mb-6">
      <h1 className="text-2xl font-display font-bold text-foreground">Analytics</h1>
      <p className="text-muted-foreground text-sm">Business insights and performance metrics</p>
    </div>

    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {kpis.map((kpi) => (
        <div key={kpi.label} className="bg-card rounded-xl border border-border p-4 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <kpi.icon className="w-5 h-5 text-primary" />
            <span className={`text-xs font-medium flex items-center gap-1 ${kpi.up ? "text-primary" : "text-destructive"}`}>
              {kpi.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />} {kpi.change}
            </span>
          </div>
          <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
          <p className="text-xs text-muted-foreground">{kpi.label}</p>
        </div>
      ))}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
      <div className="lg:col-span-2 bg-card rounded-xl border border-border p-5 shadow-card">
        <h3 className="font-display font-semibold text-foreground mb-4">Revenue Trend</h3>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={data?.recentRevenue || []}>
            <defs>
              <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(145, 63%, 42%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(145, 63%, 42%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(140, 15%, 88%)" />
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: "hsl(150, 10%, 45%)" }} />
            <YAxis tick={{ fontSize: 12, fill: "hsl(150, 10%, 45%)" }} />
            <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid hsl(140,15%,88%)", fontSize: "13px" }} />
            <Area type="monotone" dataKey="revenue" stroke="hsl(145, 63%, 42%)" fill="url(#revGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-card rounded-xl border border-border p-5 shadow-card">
        <h3 className="font-display font-semibold text-foreground mb-4">Sales by Category</h3>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie data={data?.categoryData || []} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value">
              {(data?.categoryData || []).map((entry: any) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid hsl(140,15%,88%)", fontSize: "13px" }} />
            <Legend wrapperStyle={{ fontSize: "12px" }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>

    <div className="bg-card rounded-xl border border-border p-5 shadow-card">
      <h3 className="font-display font-semibold text-foreground mb-4">Orders This Week</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data?.recentRevenue || []}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(140, 15%, 88%)" />
          <XAxis dataKey="name" tick={{ fontSize: 12, fill: "hsl(150, 10%, 45%)" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 12, fill: "hsl(150, 10%, 45%)" }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid hsl(140,15%,88%)", fontSize: "13px" }} />
          <Bar dataKey="orders" fill="hsl(145, 63%, 42%)" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);
}

export default Analytics;
