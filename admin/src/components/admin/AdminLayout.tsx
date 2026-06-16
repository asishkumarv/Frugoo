import { Outlet, useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { SidebarProvider, useSidebarContext } from "@/contexts/SidebarContext";
import { Menu, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";

const AdminContent = () => {
  const { collapsed, isMobile, setMobileOpen } = useSidebarContext();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setRefreshKey(prev => prev + 1);
    // Simulate a short spin to give visual feedback
    setTimeout(() => setIsRefreshing(false), 500);
  };

  return (
    <div className="flex min-h-screen bg-background overflow-x-hidden">
      <AdminSidebar />
      <main
        className={`flex-1 p-4 sm:p-6 lg:p-8 transition-all duration-300 min-w-0 w-full overflow-x-hidden ${
          isMobile ? "ml-0" : collapsed ? "ml-20" : "ml-64"
        }`}
      >
        <div className="flex items-center justify-between mb-6">
          {isMobile ? (
            <button
              onClick={() => setMobileOpen(true)}
              className="p-2 rounded-lg bg-card shadow-card text-foreground hover:bg-muted transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
          ) : <div />}
          
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-foreground bg-card border border-border shadow-sm hover:bg-muted transition-colors rounded-lg"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh Data
          </button>
        </div>
        <div key={refreshKey} className="animate-fade-in">
          <Outlet />
        </div>
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
