import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Phone, Mail, MapPin, ShoppingBag } from "lucide-react";

const customers = [
  { id: 1, name: "Rajesh Kumar", email: "rajesh@email.com", phone: "+91 98765 43210", city: "Pune", orders: 12, spent: 8450, status: "Active", joined: "2025-11-15" },
  { id: 2, name: "Priya Sharma", email: "priya@email.com", phone: "+91 87654 32109", city: "Hyderabad", orders: 8, spent: 5200, status: "Active", joined: "2025-12-01" },
  { id: 3, name: "Amit Patel", email: "amit@email.com", phone: "+91 76543 21098", city: "Ahmedabad", orders: 15, spent: 12800, status: "VIP", joined: "2025-09-20" },
  { id: 4, name: "Sneha Reddy", email: "sneha@email.com", phone: "+91 65432 10987", city: "Bangalore", orders: 3, spent: 1200, status: "New", joined: "2026-03-10" },
  { id: 5, name: "Vikram Singh", email: "vikram@email.com", phone: "+91 54321 09876", city: "Jaipur", orders: 20, spent: 18500, status: "VIP", joined: "2025-08-05" },
  { id: 6, name: "Ananya Iyer", email: "ananya@email.com", phone: "+91 43210 98765", city: "Chennai", orders: 6, spent: 3800, status: "Active", joined: "2026-01-12" },
  { id: 7, name: "Deepak Joshi", email: "deepak@email.com", phone: "+91 32109 87654", city: "Pune", orders: 1, spent: 450, status: "Inactive", joined: "2026-02-28" },
  { id: 8, name: "Kavita Nair", email: "kavita@email.com", phone: "+91 21098 76543", city: "Kochi", orders: 9, spent: 6700, status: "Active", joined: "2025-10-08" },
];

const statusColor: Record<string, string> = {
  Active: "bg-primary/15 text-primary",
  VIP: "bg-secondary/15 text-secondary",
  New: "bg-chart-5/15 text-chart-5",
  Inactive: "bg-muted text-muted-foreground",
};

const Customers = () => {
  const [search, setSearch] = useState("");
  const filtered = customers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase()) || c.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-foreground">Customers</h1>
        <p className="text-muted-foreground text-sm">View and manage your customer base</p>
      </div>

      <div className="relative max-w-md mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search by name, email, or city..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((customer) => (
          <div key={customer.id} className="bg-card rounded-xl border border-border p-5 shadow-card hover:shadow-card-hover transition-all">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-foreground">{customer.name}</h3>
                <p className="text-xs text-muted-foreground">Joined {customer.joined}</p>
              </div>
              <Badge className={`${statusColor[customer.status]} border-0 text-xs`}>{customer.status}</Badge>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground truncate"><Mail className="w-3.5 h-3.5 shrink-0" /> <span className="truncate">{customer.email}</span></div>
              <div className="flex items-center gap-2 text-muted-foreground"><Phone className="w-3.5 h-3.5" /> {customer.phone}</div>
              <div className="flex items-center gap-2 text-muted-foreground"><MapPin className="w-3.5 h-3.5" /> {customer.city}</div>
            </div>
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
              <div className="flex items-center gap-1 text-sm"><ShoppingBag className="w-3.5 h-3.5 text-primary" /> <span className="font-medium text-foreground">{customer.orders}</span> <span className="text-muted-foreground">orders</span></div>
              <span className="text-sm font-bold text-primary">₹{customer.spent.toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Customers;
