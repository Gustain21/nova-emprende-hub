import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const AppTopbar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <header className="h-14 border-b border-border bg-background/80 backdrop-blur-md flex items-center justify-between px-4 sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <SidebarTrigger />
        <span className="text-xs uppercase tracking-widest text-muted-foreground hidden sm:inline">
          Área de clientes
        </span>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex flex-col text-right leading-tight">
          <span className="text-sm font-medium text-foreground">{user?.fullName}</span>
          <span className="text-xs text-muted-foreground">{user?.email}</span>
        </div>
        <Button variant="ghost" size="sm" onClick={handleLogout}>
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Salir</span>
        </Button>
      </div>
    </header>
  );
};

export default AppTopbar;
