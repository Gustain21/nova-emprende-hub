import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

const Cuenta = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">Cuenta</h1>
        <p className="text-muted-foreground mt-1">Gestiona tu perfil y sesión.</p>
      </div>

      <div className="border border-border rounded-2xl p-6 bg-card/40 space-y-4 max-w-xl">
        <div className="space-y-2">
          <label className="text-sm font-bold text-foreground">Nombre</label>
          <Input defaultValue={user?.fullName} disabled />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-foreground">Email</label>
          <Input defaultValue={user?.email} disabled />
        </div>
        <p className="text-xs text-muted-foreground">
          La edición de perfil se habilitará al conectar Supabase.
        </p>
      </div>

      <div className="border border-border rounded-2xl p-6 bg-card/40 max-w-xl space-y-3">
        <h2 className="text-lg font-bold text-foreground">Sesión</h2>
        <Button
          variant="outline"
          onClick={async () => {
            await signOut();
            navigate("/login");
          }}
        >
          Cerrar sesión
        </Button>
      </div>
    </div>
  );
};

export default Cuenta;
