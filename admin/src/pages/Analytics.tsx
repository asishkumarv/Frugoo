import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { TrendingUp, TrendingDown, Users, ShoppingCart, IndianRupee, Eye } from "lucide-react";

const revenueData = [
  { month: "Oct", revenue: 42000, orders: 85 },
  { month: "Nov", revenue: 58000, orders: 120 },
  { month: "Dec", revenue: 75000, orders: 165 },
  { month: "Jan", revenue: 62000, orders: 130 },
  { month: "Feb", revenue: 88000, orders: 195 },
  { month: "Mar", revenue: 105000, orders: 247 },
];

const categoryData = [
  { name: "Mangoes", value: 35, color: "hsl(35, 90%, 55%)" },
  { name: "Apples", value: 20, color: "hsl(0, 72%, 51%)" },
  { name: "Citrus", value: 18, color: "hsl(35, 90%, 55%)" },
  { name: "Dry Fruits", value: 15, color: "hsl(145, 63%, 42%)" },
  { name: "Others", value: 12, color: "hsl(200, 70%, 50%)" },
];

const dailyOrders = [
  { day: "Mon", orders: 32 }, { day: "Tue", orders: 28 }, { day: "Wed", orders: 45 },
  { day: "Thu", orders: 38 }, { day: "Fri", orders: 52 }, { day: "Sat", orders: 65 }, { day: "Sun", orders: 42 },
];

const kpis = [
  { label: "Total Revenue", value: "₹4,30,000", change: "+18.2%", up: true, icon: IndianRupee },
  { label: "Total Orders", value: "942", change: "+12.5%", up: true, icon: ShoppingCart },
  { label: "New Customers", value: "156", change: "+8.3%", up: true, icon: Users },
  { label: "Avg. Order Value", value: "₹456", change: "-2.1%", up: false, icon: Eye },
];

const Analytics = () => (
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
          <AreaChart data={revenueData}>
            <defs>
              <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(145, 63%, 42%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(145, 63%, 42%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(140, 15%, 88%)" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(150, 10%, 45%)" }} />
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
            <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value">
              {categoryData.map((entry) => (
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
        <BarChart data={dailyOrders}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(140, 15%, 88%)" />
          <XAxis dataKey="day" tick={{ fontSize: 12, fill: "hsl(150, 10%, 45%)" }} />
          <YAxis tick={{ fontSize: 12, fill: "hsl(150, 10%, 45%)" }} />
          <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid hsl(140,15%,88%)", fontSize: "13px" }} />
          <Bar dataKey="orders" fill="hsl(145, 63%, 42%)" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default Analytics;
