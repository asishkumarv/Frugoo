import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useSidebarContext } from "@/contexts/SidebarContext";
import {
  LayoutDashboard, Package, ShoppingCart, Users, Tag, Truck,
  MessageSquare, BarChart3, LogOut, ChevronLeft, ChevronRight, Video,
} from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import frugooLogo from "@/assets/frugoo-logo.png";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: Video, label: "Hero Videos", path: "/hero-videos" },
  { icon: Package, label: "Products", path: "/products" },
  { icon: ShoppingCart, label: "Orders", path: "/orders" },
  { icon: Users, label: "Customers", path: "/customers" },
  { icon: Tag, label: "Coupons", path: "/coupons" },
  { icon: Truck, label: "Delivery", path: "/delivery" },
  { icon: BarChart3, label: "Analytics", path: "/analytics" },
  { icon: MessageSquare, label: "Messages", path: "/messages" },
] as const;

const SidebarBody = ({ collapsed, onNavClick }: { collapsed: boolean; onNavClick?: () => void }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => { logout(); navigate("/login"); };

  return (
    <>
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-sidebar-border ${collapsed ? "justify-center" : ""}`}>
        <div className={`bg-white rounded-xl shadow-md shrink-0 flex items-center justify-center overflow-hidden ${collapsed ? "w-12 h-12" : "w-14 h-14"}`}>
          <img src={frugooLogo} alt="Frugoo" className="w-[140%] h-[140%] max-w-none object-contain scale-110" />
        </div>
        {!collapsed && (
          <div className="animate-slide-in min-w-0">
            <h1 className="text-xl font-display font-bold text-sidebar-foreground leading-tight">Frugoo</h1>
            <p className="text-xs text-sidebar-foreground/70">Admin Panel</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onNavClick}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              }`}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span className="animate-slide-in">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-sidebar-border">
        <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-all w-full">
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </>
  );
};

const AdminSidebar = () => {
  const { collapsed, setCollapsed, mobileOpen, setMobileOpen, isMobile } = useSidebarContext();

  if (isMobile) {
    return (
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="p-0 w-64 border-0" style={{ background: "var(--gradient-sidebar)" }}>
          <SidebarBody collapsed={false} onNavClick={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <aside
      className={`fixed left-0 top-0 h-screen z-50 flex flex-col transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
      style={{ background: "var(--gradient-sidebar)" }}
    >
      <SidebarBody collapsed={collapsed} />

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-8 w-6 h-6 rounded-full bg-card shadow-card-hover flex items-center justify-center text-foreground hover:scale-110 transition-transform"
      >
        {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>
    </aside>
  );
};

export default AdminSidebar;
