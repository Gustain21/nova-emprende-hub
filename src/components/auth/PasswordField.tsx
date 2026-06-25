import { useState, forwardRef } from "react";
import { Lock, Eye, EyeOff, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export const PASSWORD_HELP_TEXT =
  "La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un símbolo especial.";

export const passwordChecks = (pwd: string) => ({
  length: pwd.length >= 8,
  upper: /[A-Z]/.test(pwd),
  number: /[0-9]/.test(pwd),
  symbol: /[!@#$%&*?_\-.]/.test(pwd),
});

export const isPasswordValid = (pwd: string) => {
  const c = passwordChecks(pwd);
  return c.length && c.upper && c.number && c.symbol;
};

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  showRequirements?: boolean;
  helpText?: boolean;
};

export const PasswordField = forwardRef<HTMLInputElement, Props>(
  ({ showRequirements = false, helpText = true, className, value, ...props }, ref) => {
    const [visible, setVisible] = useState(false);
    const pwd = typeof value === "string" ? value : "";
    const checks = passwordChecks(pwd);

    const items: Array<[keyof typeof checks, string]> = [
      ["length", "8 caracteres mínimo"],
      ["upper", "Una letra mayúscula"],
      ["number", "Un número"],
      ["symbol", "Un símbolo especial"],
    ];

    return (
      <div className="space-y-2">
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            ref={ref}
            {...props}
            value={value}
            type={visible ? "text" : "password"}
            className={cn("bg-muted border-border pl-11 pr-11 h-12", className)}
          />
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-brand-orange transition-colors"
            tabIndex={-1}
          >
            {visible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        {helpText && !showRequirements && (
          <p className="text-xs text-muted-foreground leading-relaxed">{PASSWORD_HELP_TEXT}</p>
        )}

        {showRequirements && (
          <ul className="space-y-1 pt-1">
            {items.map(([key, label]) => {
              const ok = checks[key];
              return (
                <li
                  key={key}
                  className={cn(
                    "flex items-center gap-2 text-xs transition-colors",
                    ok ? "text-emerald-500" : pwd ? "text-brand-orange" : "text-muted-foreground"
                  )}
                >
                  <Check
                    className={cn(
                      "w-3.5 h-3.5 shrink-0",
                      ok ? "opacity-100" : "opacity-40"
                    )}
                  />
                  {label}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    );
  }
);

PasswordField.displayName = "PasswordField";
