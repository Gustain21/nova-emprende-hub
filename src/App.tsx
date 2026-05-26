import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Contacto from "./pages/Contacto";
import Testimonios from "./pages/Testimonios";
import Login from "./pages/Login";
import Privacidad from "./pages/Privacidad";
import Terminos from "./pages/Terminos";
import AvisoLegal from "./pages/AvisoLegal";
import NotFound from "./pages/NotFound";
import Producto from "./pages/Producto";

// Zona privada de clientes (Fase 1 — mock)
import { AuthProvider } from "./lib/auth/AuthProvider";
import ProtectedRoute from "./components/app/ProtectedRoute";
import AppLayout from "./components/app/AppLayout";
import Dashboard from "./pages/app/Dashboard";
import Biblioteca from "./pages/app/Biblioteca";
import ProductoPrivado from "./pages/app/ProductoPrivado";
import Descargas from "./pages/app/Descargas";
import Apps from "./pages/app/Apps";
import AppDetalle from "./pages/app/AppDetalle";
import Compras from "./pages/app/Compras";
import Cuenta from "./pages/app/Cuenta";
import PlanFinanciero from "./pages/app/PlanFinanciero";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Públicas — intactas */}
            <Route path="/" element={<Index />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/testimonios" element={<Testimonios />} />
            <Route path="/login" element={<Login />} />
            <Route path="/privacidad" element={<Privacidad />} />
            <Route path="/terminos" element={<Terminos />} />
            <Route path="/aviso-legal" element={<AvisoLegal />} />
            <Route path="/producto/:id" element={<Producto />} />

            {/* Zona privada de clientes */}
            <Route
              path="/app"
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="biblioteca" element={<Biblioteca />} />
              <Route path="biblioteca/:productId" element={<ProductoPrivado />} />
              <Route path="descargas" element={<Descargas />} />
              <Route path="apps" element={<Apps />} />
              <Route path="apps/:appId" element={<AppDetalle />} />
              <Route path="plan-financiero" element={<PlanFinanciero />} />
              <Route path="compras" element={<Compras />} />
              <Route path="cuenta" element={<Cuenta />} />
            </Route>

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
