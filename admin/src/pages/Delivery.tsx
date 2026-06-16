import { Badge } from "@/components/ui/badge";
import { Truck, MapPin, Clock, CheckCircle, Package, AlertCircle } from "lucide-react";

import { useState, useEffect } from "react";

const statusConfig: Record<string, { color: string; icon: typeof Truck }> = {
  Delivered: { color: "bg-primary/15 text-primary", icon: CheckCircle },
  "In Transit": { color: "bg-chart-5/15 text-chart-5", icon: Truck },
  "Picked Up": { color: "bg-secondary/15 text-secondary", icon: Package },
  Processing: { color: "bg-accent/15 text-accent", icon: Package },
  Pending: { color: "bg-muted text-muted-foreground", icon: Clock },
  Cancelled: { color: "bg-destructive/15 text-destructive", icon: AlertCircle },
};

const Delivery = () => {
  const [deliveries, setDeliveries] = useState<any[]>([]);

  useEffect(() => {
    fetch("https://frugoo.onrender.com/api/orders")
      .then(res => res.json())
      .then(data => setDeliveries(data.reverse()))
      .catch(console.error);
  }, []);

  const todayDeliveries = deliveries.filter(d => new Date(d.date).toDateString() === new Date().toDateString()).length;
  const inTransit = deliveries.filter(d => d.status === "In Transit").length;
  const completed = deliveries.filter(d => d.status === "Delivered").length;
  const cancelled = deliveries.filter(d => d.status === "Cancelled").length;

  const stats = [
    { label: "Today's Deliveries", value: todayDeliveries, icon: Truck, color: "text-primary" },
    { label: "In Transit", value: inTransit, icon: MapPin, color: "text-chart-5" },
    { label: "Completed", value: completed, icon: CheckCircle, color: "text-primary" },
    { label: "Cancelled", value: cancelled, icon: AlertCircle, color: "text-destructive" },
  ];

  return (
  <div className="animate-fade-in">
    <div className="mb-6">
      <h1 className="text-2xl font-display font-bold text-foreground">Delivery</h1>
      <p className="text-muted-foreground text-sm">Track all deliveries in real-time</p>
    </div>

    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((s) => (
        <div key={s.label} className="bg-card rounded-xl border border-border p-4 shadow-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center"><s.icon className={`w-5 h-5 ${s.color}`} /></div>
            <div>
              <p className="text-2xl font-bold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          </div>
        </div>
      ))}
    </div>

    <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
      <div className="overflow-x-auto">
      <table className="w-full min-w-[600px]">
        <thead>
          <tr className="border-b border-border bg-muted/30">
            <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Delivery</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Customer</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Address</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Rider</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">ETA</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Status</th>
          </tr>
        </thead>
        <tbody>
          {deliveries.map((d) => {
            const cfg = statusConfig[d.status] || statusConfig["Pending"];
            return (
              <tr key={d.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                <td className="px-4 py-3">
                  <p className="text-sm font-mono font-medium text-foreground">{d.id}</p>
                  <p className="text-xs text-muted-foreground">{new Date(d.date).toLocaleDateString()}</p>
                </td>
                <td className="px-4 py-3 text-sm text-foreground">{d.customer}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground max-w-[200px] truncate">{d.address}</td>
                <td className="px-4 py-3 text-sm text-foreground">Unassigned</td>
                <td className="px-4 py-3 text-sm text-foreground">—</td>
                <td className="px-4 py-3"><Badge className={`${cfg.color} border-0 text-xs`}>{d.status}</Badge></td>
              </tr>
            );
          })}
        </tbody>
      </table>
      </div>
    </div>
  </div>
  );
};

export default Delivery;
