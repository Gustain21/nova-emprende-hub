import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import Contacto from "./pages/Contacto";
import Testimonios from "./pages/Testimonios";
import Login from "./pages/Login";
import Privacidad from "./pages/Privacidad";
import Terminos from "./pages/Terminos";
import AvisoLegal from "./pages/AvisoLegal";
import NotFound from "./pages/NotFound";
import Producto from "./pages/Producto";
import Registro from "./pages/Registro";
import ResetPassword from "./pages/ResetPassword";

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

// Legacy redirect: /app/* → /clientes/* (con remapeo de subrutas renombradas)
const LegacyAppRedirect = () => {
  const { pathname, search, hash } = useLocation();
  let target = pathname.replace(/^\/app/, "/clientes");
  target = target
    .replace(/^\/clientes\/biblioteca/, "/clientes/mis-productos")
    .replace(/^\/clientes\/apps/, "/clientes/herramientas")
    .replace(/^\/clientes\/compras\b/, "/clientes/compras-facturas")
    .replace(/^\/clientes\/plan-financiero/, "/clientes/herramientas/plan-financiero");
  return <Navigate to={target + search + hash} replace />;
};

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
            <Route path="/registro" element={<Registro />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/privacidad" element={<Privacidad />} />
            <Route path="/terminos" element={<Terminos />} />
            <Route path="/aviso-legal" element={<AvisoLegal />} />
            <Route path="/producto/:id" element={<Producto />} />

            {/* Zona privada de clientes — rutas comerciales /clientes */}
            <Route
              path="/clientes"
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="mis-productos" element={<Biblioteca />} />
              <Route path="mis-productos/:productId" element={<ProductoPrivado />} />
              <Route path="descargas" element={<Descargas />} />
              <Route path="herramientas" element={<Apps />} />
              {/* Específica antes de :appId para evitar conflictos */}
              <Route path="herramientas/plan-financiero" element={<PlanFinanciero />} />
              <Route path="herramientas/:appId" element={<AppDetalle />} />
              <Route path="compras-facturas" element={<Compras />} />
              <Route path="cuenta" element={<Cuenta />} />
            </Route>

            {/* Compatibilidad: rutas internas antiguas /app/* redirigen a /clientes/* */}
            <Route path="/app/*" element={<LegacyAppRedirect />} />
            <Route path="/app" element={<LegacyAppRedirect />} />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
