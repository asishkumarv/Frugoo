import { useState, useEffect } from "react";
import { Search, Eye, Download, ChevronLeft, ChevronRight, FileText } from "lucide-react";
import jsPDF from "jspdf";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

interface Order {
  id: string;
  product: string;
  customer: string;
  date: string;
  payment: string;
  total: string;
  status: "Pending" | "Delivered" | "Cancelled" | "Processing" | "In Transit";
}

const statusVariants: Record<string, string> = {
  Pending: "bg-secondary/15 text-secondary border-secondary/30",
  Delivered: "bg-primary/15 text-primary border-primary/30",
  Cancelled: "bg-destructive/15 text-destructive border-destructive/30",
  Processing: "bg-accent/15 text-accent border-accent/30",
  "In Transit": "bg-chart-5/15 text-chart-5 border-chart-5/30",
};

const generateInvoicePDF = (order: Order) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("INVOICE", pageWidth / 2, 25, { align: "center" });

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Invoice #INV-${order.id}`, 20, 40);
  doc.text(`Date: ${order.date}`, 20, 47);

  // Customer
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Customer Details", 20, 62);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Name: ${order.customer}`, 20, 70);
  doc.text(`Payment: ${order.payment}`, 20, 77);

  // Table header
  const tableY = 92;
  doc.setFillColor(34, 197, 94);
  doc.rect(20, tableY, pageWidth - 40, 10, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.text("Item", 25, tableY + 7);
  doc.text("Qty", 110, tableY + 7);
  doc.text("Price", pageWidth - 25, tableY + 7, { align: "right" });

  // Table row
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "normal");
  const rowY = tableY + 18;
  doc.text(order.product, 25, rowY);
  doc.text("1", 110, rowY);
  doc.text(order.total, pageWidth - 25, rowY, { align: "right" });

  // Line
  doc.line(20, rowY + 5, pageWidth - 20, rowY + 5);

  // Total
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text(`Total: ${order.total}`, pageWidth - 25, rowY + 15, { align: "right" });

  // Footer
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(128, 128, 128);
  doc.text("Thank you for your purchase!", pageWidth / 2, 270, { align: "center" });

  doc.save(`Invoice-${order.id}.pdf`);
};

const OrdersTable = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [tempStatus, setTempStatus] = useState<string>("");
  const ordersPerPage = 50;

  useEffect(() => {
    fetch("https://frugoo.onrender.com/api/orders")
      .then(res => res.json())
      .then(data => {
        const formatted = data.map((o: any) => ({
          ...o,
          id: o.id,
          product: Array.isArray(o.items) ? o.items.join(", ") : "Items",
          customer: o.customer,
          date: new Date(o.date).toLocaleDateString(),
          payment: o.payment.toUpperCase(),
          total: `₹${o.total}`,
          status: o.status,
          dateObj: new Date(o.date)
        })).sort((a: any, b: any) => b.dateObj.getTime() - a.dateObj.getTime());
        setOrders(formatted);
      })
      .catch(console.error);
  }, []);

  const updateOrderStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`https://frugoo.onrender.com/api/orders/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus as any } : o));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = orders.filter(
    (o) =>
      o.product.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.toLowerCase().includes(search.toLowerCase()) ||
      `#${o.id}`.includes(search)
  );

  const totalPages = Math.ceil(filtered.length / ordersPerPage);
  const paginated = filtered.slice((currentPage - 1) * ordersPerPage, currentPage * ordersPerPage);

  return (
    <div className="bg-card rounded-xl shadow-card animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 gap-3 border-b border-border">
        <h2 className="text-lg font-display font-bold text-foreground">Recent Orders</h2>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial min-w-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search orders..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="pl-9 pr-4 py-2 rounded-lg bg-muted text-sm text-foreground placeholder:text-muted-foreground border border-border focus:outline-none focus:ring-2 focus:ring-ring/30 w-full sm:w-64 transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity shrink-0">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto -mx-0">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Order</th>
              <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Product</th>
              <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Customer</th>
              <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Date</th>
              <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Payment</th>
              <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Total</th>
              <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Status</th>
              <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Invoice</th>
              <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((order, i) => (
              <tr
                key={order.id}
                className="border-b border-border/50 hover:bg-muted/50 transition-colors"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <td className="px-5 py-3.5 text-sm font-semibold text-foreground">#{order.id}</td>
                <td className="px-5 py-3.5 text-sm text-foreground">{order.product}</td>
                <td className="px-5 py-3.5 text-sm text-muted-foreground">{order.customer}</td>
                <td className="px-5 py-3.5 text-sm text-muted-foreground">{order.date}</td>
                <td className="px-5 py-3.5">
                  <span className={`text-xs font-semibold px-2 py-1 rounded ${
                    order.payment === "ONLINE" ? "bg-primary/10 text-primary" : "bg-secondary/10 text-secondary"
                  }`}>
                    {order.payment}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-sm font-semibold text-foreground">{order.total}</td>
                <td className="px-5 py-3.5">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${statusVariants[order.status]}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <button
                    onClick={() => generateInvoicePDF(order)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    PDF
                  </button>
                </td>
                <td className="px-5 py-3.5">
                  <button 
                    onClick={() => {
                      setSelectedOrder(order);
                      setTempStatus(order.status);
                    }}
                    className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-primary"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between px-5 py-3 border-t border-border">
        <p className="text-sm text-muted-foreground">
          Showing {((currentPage - 1) * ordersPerPage) + 1}–{Math.min(currentPage * ordersPerPage, filtered.length)} of {filtered.length}
        </p>
        <div className="flex items-center gap-1">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="p-1.5 rounded-lg hover:bg-muted disabled:opacity-40 transition-colors text-muted-foreground"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                currentPage === i + 1 ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="p-1.5 rounded-lg hover:bg-muted disabled:opacity-40 transition-colors text-muted-foreground"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Update Order Status</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Status for #{selectedOrder?.id}</label>
              <select 
                value={tempStatus}
                onChange={(e) => setTempStatus(e.target.value)}
                className="w-full bg-card border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary text-sm text-foreground"
              >
                <option value="Pending">Pending</option>
                <option value="Processing">In Progress</option>
                <option value="In Transit">In Transit</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <button
              className="px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-lg text-sm transition-colors"
              onClick={() => setSelectedOrder(null)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-sm transition-colors"
              onClick={() => {
                if (selectedOrder) {
                  updateOrderStatus(selectedOrder.id, tempStatus);
                  setSelectedOrder(null);
                }
              }}
            >
              Save Changes
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrdersTable;
