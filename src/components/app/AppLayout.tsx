import { useEffect, useRef } from "react";
import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import AppTopbar from "./AppTopbar";
import { useAuth } from "@/hooks/useAuth";
import { syncPurchasesForCurrentUser } from "@/hooks/usePurchases";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const AppLayout = () => {
  const { user } = useAuth();
  const qc = useQueryClient();
  const syncedFor = useRef<string | null>(null);

  useEffect(() => {
    if (!user?.id) return;
    if (syncedFor.current === user.id) return;
    syncedFor.current = user.id;

    (async () => {
      try {
        const { claimed, granted } = await syncPurchasesForCurrentUser();
        if (claimed > 0 || granted > 0) {
          await qc.invalidateQueries({ queryKey: ["clientes", "purchases-bundle"] });
          toast.success("Tus productos ya están disponibles.");
        }
      } catch (e) {
        console.error("sync purchases error", e);
      }
    })();
  }, [user?.id, qc]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <AppTopbar />
          <main className="flex-1 p-6 md:p-8">
            <div className="mx-auto w-full max-w-6xl">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
