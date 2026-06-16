import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, CheckCheck } from "lucide-react";

const Messages = () => {
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/messages");
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error(err);
    }
  };

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

  const markReplied = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:3001/api/messages/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "REPLIED" })
      });
      if (res.ok) {
        setMessages(messages.map((m) => m.id === id ? { ...m, status: "REPLIED" } : m));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteMessage = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:3001/api/messages/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setMessages(messages.filter((m) => m.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
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
                <TableCell className="text-muted-foreground text-sm">{new Date(msg.createdAt).toLocaleString()}</TableCell>
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
