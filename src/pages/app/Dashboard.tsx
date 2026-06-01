import { Link } from "react-router-dom";
import { ArrowRight, Library, Rocket, Download, Receipt } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { usePurchases } from "@/hooks/usePurchases";

const Stat = ({ icon: Icon, label, value, to }: any) => (
  <Link
    to={to}
    className="border border-border rounded-2xl p-5 bg-card/40 hover:bg-card/70 transition-colors block"
  >
    <div className="flex items-center justify-between mb-3">
      <Icon className="w-5 h-5 text-brand-orange" />
      <ArrowRight className="w-4 h-4 text-muted-foreground" />
    </div>
    <div className="text-3xl font-bold text-foreground">{value}</div>
    <div className="text-sm text-muted-foreground mt-1">{label}</div>
  </Link>
);

const Dashboard = () => {
  const { user } = useAuth();
  const { purchases, resources, apps } = usePurchases();

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-widest text-brand-orange font-bold">
          Bienvenido
        </p>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">
          Hola, {user?.fullName.split(" ")[0]}
        </h1>
        <p className="text-muted-foreground">
          Este es tu espacio privado en NOVA EMPRENDE. Datos mostrados con datos demo.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat icon={Library} label="Productos comprados" value={purchases.length} to="/clientes/mis-productos" />
        <Stat icon={Download} label="Descargas disponibles" value={resources.length} to="/clientes/descargas" />
        <Stat icon={Rocket} label="Herramientas activas" value={apps.filter((a) => a.status === "ready").length} to="/clientes/herramientas" />
        <Stat icon={Receipt} label="Facturas" value={purchases.length} to="/clientes/compras-facturas" />
      </div>

      <div className="border border-border rounded-2xl p-6 bg-card/40">
        <h2 className="text-lg font-bold text-foreground mb-1">Próximamente</h2>
        <p className="text-sm text-muted-foreground">
          En la siguiente fase conectaremos autenticación real (Supabase), compras y descargas privadas.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
