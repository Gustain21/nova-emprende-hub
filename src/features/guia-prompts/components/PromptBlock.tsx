import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { parsePrompt } from "../data/chapters";

function PlaceholderText({ text }: { text: string }) {
  const parts = text.split(/(\[[^\]]+\])/g);
  return (
    <>
      {parts.map((p, i) =>
        /^\[[^\]]+\]$/.test(p) ? (
          <span
            key={i}
            className="mx-0.5 rounded-md bg-brand-orange/20 px-1.5 py-0.5 font-semibold text-foreground"
          >
            {p}
          </span>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  );
}

export function PromptBlock({ prompt }: { prompt: string }) {
  const [copied, setCopied] = useState(false);
  const sections = parsePrompt(prompt);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {}
  }

  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-6 py-4 sm:px-8">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-orange">
          Prompt listo para copiar
        </p>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-xs font-bold uppercase tracking-wider text-background transition hover:opacity-90"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copiado" : "Copiar prompt"}
        </button>
      </div>

      <div className="border-b border-border bg-brand-orange/10 px-6 py-3 text-sm text-foreground/80 sm:px-8">
        <strong className="font-semibold">Nota:</strong> Completa los campos entre{" "}
        <span className="rounded bg-brand-orange/20 px-1 font-semibold">[corchetes]</span> antes
        de pegar el prompt en tu IA. No elimines los corchetes.
      </div>

      <div className="space-y-7 px-6 py-7 sm:px-8 sm:py-8">
        {sections.map((s, i) => (
          <div key={i}>
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.24em] text-brand-orange">
              {`0${i + 1}`.slice(-2)} · {s.label}
            </p>
            <p className="whitespace-pre-line text-[17px] leading-[1.75] text-foreground/90">
              <PlaceholderText text={s.body} />
            </p>
          </div>
        ))}
      </div>

      {copied && (
        <div className="border-t border-border bg-brand-orange/10 px-6 py-3 text-center text-sm font-medium text-brand-orange sm:px-8">
          ✓ Prompt copiado correctamente.
        </div>
      )}
    </div>
  );
}
