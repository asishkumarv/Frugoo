import { Badge } from "@/components/ui/badge";
import { Truck, MapPin, Clock, CheckCircle, Package, AlertCircle } from "lucide-react";

const deliveries = [
  { id: "DEL-001", order: "ORD-001", customer: "Rajesh Kumar", address: "12 MG Road, Pune", rider: "Suresh M.", status: "Delivered", eta: "Completed", time: "2:30 PM" },
  { id: "DEL-002", order: "ORD-002", customer: "Priya Sharma", address: "45 Banjara Hills, Hyderabad", rider: "Ramesh K.", status: "In Transit", eta: "15 mins", time: "3:45 PM" },
  { id: "DEL-003", order: "ORD-003", customer: "Amit Patel", address: "78 SG Highway, Ahmedabad", rider: "Kiran D.", status: "Picked Up", eta: "45 mins", time: "4:00 PM" },
  { id: "DEL-004", order: "ORD-004", customer: "Sneha Reddy", address: "23 Koramangala, Bangalore", rider: "Unassigned", status: "Pending", eta: "—", time: "4:15 PM" },
  { id: "DEL-005", order: "ORD-007", customer: "Deepak Joshi", address: "89 Aundh, Pune", rider: "Suresh M.", status: "In Transit", eta: "25 mins", time: "3:30 PM" },
  { id: "DEL-006", order: "ORD-008", customer: "Kavita Nair", address: "12 MG Road, Kochi", rider: "Anil P.", status: "Failed", eta: "—", time: "1:00 PM" },
];

const statusConfig: Record<string, { color: string; icon: typeof Truck }> = {
  Delivered: { color: "bg-primary/15 text-primary", icon: CheckCircle },
  "In Transit": { color: "bg-chart-5/15 text-chart-5", icon: Truck },
  "Picked Up": { color: "bg-secondary/15 text-secondary", icon: Package },
  Pending: { color: "bg-muted text-muted-foreground", icon: Clock },
  Failed: { color: "bg-destructive/15 text-destructive", icon: AlertCircle },
};

const stats = [
  { label: "Today's Deliveries", value: "12", icon: Truck, color: "text-primary" },
  { label: "In Transit", value: "4", icon: MapPin, color: "text-chart-5" },
  { label: "Completed", value: "7", icon: CheckCircle, color: "text-primary" },
  { label: "Failed", value: "1", icon: AlertCircle, color: "text-destructive" },
];

const Delivery = () => (
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
            const cfg = statusConfig[d.status];
            return (
              <tr key={d.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                <td className="px-4 py-3">
                  <p className="text-sm font-mono font-medium text-foreground">{d.id}</p>
                  <p className="text-xs text-muted-foreground">{d.order}</p>
                </td>
                <td className="px-4 py-3 text-sm text-foreground">{d.customer}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground max-w-[200px] truncate">{d.address}</td>
                <td className="px-4 py-3 text-sm text-foreground">{d.rider}</td>
                <td className="px-4 py-3 text-sm text-foreground">{d.eta}</td>
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

export default Delivery;
