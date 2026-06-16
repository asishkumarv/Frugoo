import { Outlet, useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { SidebarProvider, useSidebarContext } from "@/contexts/SidebarContext";
import { Menu } from "lucide-react";
import { useEffect } from "react";

const AdminContent = () => {
  const { collapsed, isMobile, setMobileOpen } = useSidebarContext();

  return (
    <div className="flex min-h-screen bg-background overflow-x-hidden">
      <AdminSidebar />
      <main
        className={`flex-1 p-4 sm:p-6 lg:p-8 transition-all duration-300 min-w-0 w-full overflow-x-hidden ${
          isMobile ? "ml-0" : collapsed ? "ml-20" : "ml-64"
        }`}
      >
        {isMobile && (
          <button
            onClick={() => setMobileOpen(true)}
            className="mb-4 p-2 rounded-lg bg-card shadow-card text-foreground hover:bg-muted transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <Outlet />
      </main>
    </div>
  );
};

const AdminLayout = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) navigate("/login", { replace: true });
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  return (
    <SidebarProvider>
      <AdminContent />
    </SidebarProvider>
  );
};

export default AdminLayout;
