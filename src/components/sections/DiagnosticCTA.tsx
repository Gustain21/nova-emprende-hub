import { Compass, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DIAGNOSTIC_URL,
  DIAGNOSTIC_COPY,
  trackDiagnosticClick,
  type DiagnosticSource,
} from "@/config/diagnostic";

interface DiagnosticCTAProps {
  source: DiagnosticSource;
  variant?: "block" | "strip";
  className?: string;
  title?: string;
  text?: string;
  cta?: string;
}

const DiagnosticCTA = ({
  source,
  variant = "block",
  className = "",
  title = DIAGNOSTIC_COPY.title,
  text = DIAGNOSTIC_COPY.text,
  cta = DIAGNOSTIC_COPY.cta,
}: DiagnosticCTAProps) => {
  const handleClick = () => trackDiagnosticClick(source);

  if (variant === "strip") {
    return (
      <section className={`border-t border-border bg-brand-dark-card/40 ${className}`}>
        <div className="brand-container py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="max-w-2xl">
            <p className="text-base md:text-lg font-semibold text-foreground mb-1">
              {DIAGNOSTIC_COPY.title}
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">{DIAGNOSTIC_COPY.text}</p>
            <p className="mt-2 text-xs text-muted-foreground">{DIAGNOSTIC_COPY.trust}</p>
          </div>
          <Button variant="outline" size="lg" className="w-full md:w-auto shrink-0" asChild>
            <a href={DIAGNOSTIC_URL} onClick={handleClick}>
              <Compass className="w-4 h-4" />
              {DIAGNOSTIC_COPY.cta}
            </a>
          </Button>
        </div>
      </section>
    );
  }

  return (
    <div
      className={`rounded-2xl border border-brand-gold/25 bg-gradient-to-br from-brand-dark-card to-brand-dark p-7 md:p-10 ${className}`}
    >
      <div className="flex flex-col md:flex-row md:items-center gap-6">
        <div className="flex-1">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gold/10 border border-brand-gold/30 text-xs font-bold text-brand-gold mb-4">
            <Compass className="w-3.5 h-3.5" />
            Diagnóstico gratuito
          </span>
          <h2 className="font-sans text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-3 leading-tight">
            {DIAGNOSTIC_COPY.title}
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-2xl">
            {DIAGNOSTIC_COPY.text}
          </p>
          <p className="mt-3 text-xs md:text-sm text-muted-foreground">{DIAGNOSTIC_COPY.trust}</p>
        </div>
        <div className="w-full md:w-auto">
          <Button variant="heroOutline" size="xl" className="w-full md:w-auto" asChild>
            <a href={DIAGNOSTIC_URL} onClick={handleClick}>
              {DIAGNOSTIC_COPY.cta}
              <ArrowRight className="w-5 h-5" />
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DiagnosticCTA;
