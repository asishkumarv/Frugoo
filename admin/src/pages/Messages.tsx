import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, CheckCheck } from "lucide-react";

const initialMessages = [
  { id: 1, name: "Sneha", email: "sneha@example.com", message: "Hi, how to order?", status: "READ", createdAt: "1/30/2026, 12:14:48 PM" },
  { id: 2, name: "Rajesh Kumar", email: "rajesh@example.com", message: "When will my mangoes arrive?", status: "UNREAD", createdAt: "3/25/2026, 10:30:00 AM" },
  { id: 3, name: "Priya Sharma", email: "priya@example.com", message: "Thanks for the quick delivery!", status: "REPLIED", createdAt: "3/24/2026, 3:45:12 PM" },
  { id: 4, name: "Amit Patel", email: "amit@example.com", message: "Can I change my order?", status: "UNREAD", createdAt: "3/23/2026, 9:15:30 AM" },
  { id: 5, name: "Sneha Reddy", email: "snehareddy@example.com", message: "Do you have organic fruits?", status: "READ", createdAt: "3/22/2026, 2:00:00 PM" },
  { id: 6, name: "Vikram Singh", email: "vikram@example.com", message: "Great quality as always!", status: "REPLIED", createdAt: "3/20/2026, 11:20:45 AM" },
  { id: 7, name: "Ananya Iyer", email: "ananya@example.com", message: "I'd like a refund please", status: "UNREAD", createdAt: "3/19/2026, 4:30:00 PM" },
];

const Messages = () => {
  const [messages, setMessages] = useState(initialMessages);

  const statusBadge = (status: string) => {
    switch (status) {
      case "READ":
        return <Badge className="bg-primary/15 text-primary border-0 font-semibold">READ</Badge>;
      case "UNREAD":
        return <Badge className="bg-secondary/15 text-secondary border-0 font-semibold">UNREAD</Badge>;
      case "REPLIED":
        return <Badge className="bg-accent/30 text-accent-foreground border-0 font-semibold">REPLIED</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const markReplied = (id: number) => {
    setMessages(messages.map((m) => m.id === id ? { ...m, status: "REPLIED" } : m));
  };

  const deleteMessage = (id: number) => {
    setMessages(messages.filter((m) => m.id !== id));
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-foreground">Customer Messages</h1>
        <p className="text-muted-foreground text-sm">View and manage customer inquiries</p>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
        <Table className="min-w-[800px]">
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="w-16">ID</TableHead>
              <TableHead>Full Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Message</TableHead>
              <TableHead className="w-24">Status</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="w-40 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {messages.map((msg) => (
              <TableRow key={msg.id}>
                <TableCell className="font-medium text-muted-foreground">{msg.id}</TableCell>
                <TableCell className="font-medium text-foreground">{msg.name}</TableCell>
                <TableCell className="text-muted-foreground">{msg.email}</TableCell>
                <TableCell className="text-foreground max-w-[250px] truncate">{msg.message}</TableCell>
                <TableCell>{statusBadge(msg.status)}</TableCell>
                <TableCell className="text-muted-foreground text-sm">{msg.createdAt}</TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end">
                    {msg.status !== "REPLIED" && (
                      <Button size="sm" onClick={() => markReplied(msg.id)} className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs">
                        <CheckCheck className="w-3.5 h-3.5 mr-1" /> Mark Replied
                      </Button>
                    )}
                    <Button size="sm" variant="destructive" onClick={() => deleteMessage(msg.id)} className="text-xs">
                      <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {messages.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No messages found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Messages;
