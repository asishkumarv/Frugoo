import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const RevenueChart = ({ data = [] }: { data?: any[] }) => (
  <div className="bg-card rounded-xl shadow-card p-5 animate-fade-in">
    <h2 className="text-lg font-display font-bold text-foreground mb-4">Revenue Overview</h2>
    {data.length === 0 ? (
      <div className="flex items-center justify-center w-full h-[280px] text-sm text-muted-foreground">
        Loading revenue data...
      </div>
    ) : (
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data}>
          <defs>
          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(145 63% 42%)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="hsl(145 63% 42%)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(140 15% 88%)" />
        <XAxis dataKey="name" tick={{ fontSize: 12, fill: "hsl(150 10% 45%)" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 12, fill: "hsl(150 10% 45%)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
        <Tooltip
          contentStyle={{
            background: "hsl(0 0% 100%)",
            border: "1px solid hsl(140 15% 88%)",
            borderRadius: "0.75rem",
            boxShadow: "0 4px 16px hsl(150 20% 20% / 0.08)",
          }}
          formatter={(value: number) => [`₹${value.toLocaleString()}`, "Revenue"]}
        />
        <Area type="monotone" dataKey="revenue" stroke="hsl(145 63% 42%)" strokeWidth={2.5} fill="url(#colorRevenue)" />
      </AreaChart>
    </ResponsiveContainer>
    )}
  </div>
);

export default RevenueChart;
