import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, Eye, ChevronLeft, ChevronRight } from "lucide-react";

type Order = {
  id: string;
  customer: string;
  items: string[];
  total: number;
  status: string;
  date: string;
  address: string;
  phone: string;
  payment: string;
};

const statusStyle: Record<string, string> = {
  Delivered: "bg-primary/15 text-primary",
  Shipped: "bg-chart-5/15 text-chart-5",
  Processing: "bg-secondary/15 text-secondary",
  Pending: "bg-muted text-muted-foreground",
  Cancelled: "bg-destructive/15 text-destructive",
};

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [page, setPage] = useState(1);
  const perPage = 6;

  useEffect(() => {
    fetch('http://localhost:3001/api/orders')
      .then(res => res.json())
      .then(data => setOrders(data))
      .catch(err => console.error(err));
  }, []);

  const statuses = ["All", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
  const filtered = orders.filter(
    (o) =>
      (o.id.toLowerCase().includes(search.toLowerCase()) || o.customer.toLowerCase().includes(search.toLowerCase())) &&
      (statusFilter === "All" || o.status === statusFilter)
  );
  const totalPages = Math.ceil(filtered.length / perPage);
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-foreground">Orders</h1>
        <p className="text-muted-foreground text-sm">Track and manage customer orders</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search orders..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="pl-10" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => { setStatusFilter(s); setPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                statusFilter === s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Order ID</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Customer</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Date</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Total</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Status</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Action</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((order) => (
              <tr key={order.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                <td className="px-4 py-3 text-sm font-mono font-medium text-foreground">{order.id}</td>
                <td className="px-4 py-3 text-sm text-foreground">{order.customer}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{order.date}</td>
                <td className="px-4 py-3 text-sm font-semibold text-foreground">₹{order.total}</td>
                <td className="px-4 py-3"><Badge className={`${statusStyle[order.status]} border-0 text-xs`}>{order.status}</Badge></td>
                <td className="px-4 py-3">
                  <button onClick={() => setSelectedOrder(order)} className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground">
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border">
            <span className="text-xs text-muted-foreground">Page {page} of {totalPages}</span>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" onClick={() => setPage(page - 1)} disabled={page === 1}><ChevronLeft className="w-4 h-4" /></Button>
              <Button variant="outline" size="sm" onClick={() => setPage(page + 1)} disabled={page === totalPages}><ChevronRight className="w-4 h-4" /></Button>
            </div>
          </div>
        )}
      </div>

      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Order {selectedOrder?.id}</DialogTitle></DialogHeader>
          {selectedOrder && (
            <div className="space-y-4 mt-2">
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-xs text-muted-foreground">Customer</p><p className="font-medium text-foreground">{selectedOrder.customer}</p></div>
                <div><p className="text-xs text-muted-foreground">Date</p><p className="font-medium text-foreground">{selectedOrder.date}</p></div>
                <div><p className="text-xs text-muted-foreground">Phone</p><p className="font-medium text-foreground">{selectedOrder.phone}</p></div>
                <div><p className="text-xs text-muted-foreground">Payment</p><p className="font-medium text-foreground">{selectedOrder.payment}</p></div>
              </div>
              <div><p className="text-xs text-muted-foreground mb-1">Delivery Address</p><p className="text-sm text-foreground">{selectedOrder.address}</p></div>
              <div>
                <p className="text-xs text-muted-foreground mb-2">Items</p>
                <div className="space-y-1">
                  {selectedOrder.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm bg-muted/30 rounded-lg px-3 py-2">
                      <span className="text-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <Badge className={`${statusStyle[selectedOrder.status]} border-0`}>{selectedOrder.status}</Badge>
                <span className="text-lg font-bold text-foreground">₹{selectedOrder.total}</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Orders;
