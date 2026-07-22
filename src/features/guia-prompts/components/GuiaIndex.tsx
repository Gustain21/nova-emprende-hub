import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Search, Copy as CopyIcon, Sparkles, Star, CheckCircle2 } from "lucide-react";
import { chapters, categories, type Category } from "../data/chapters";
import { useGuiaProgress } from "../hooks/useGuiaProgress";

const GuiaIndex = () => {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<Category | "Todos" | "Favoritos">("Todos");
  const { isFavorite, isCompleted, toggleFavorite, favorites } = useGuiaProgress();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return chapters.filter((c) => {
      const matchCat =
        active === "Todos" ||
        (active === "Favoritos" ? isFavorite(c.slug) : c.category === active);
      const matchQ =
        !q ||
        c.title.toLowerCase().includes(q) ||
        c.subtitle.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.module.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [query, active, favorites, isFavorite]);

  return (
    <>
      <section className="border-b border-border bg-card/40 px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-[820px]">
          <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-brand-orange">
            Guía de operación
          </p>
          <h1 className="mt-4 font-heading text-4xl font-extrabold leading-[1.05] sm:text-5xl">
            De la lectura <span className="text-brand-orange">a la acción</span> en dos pasos.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-[1.7] text-muted-foreground">
            Cada prompt corresponde a un capítulo del libro. Copia el texto, pégalo en tu
            herramienta de IA favorita y rellena los espacios entre corchetes con la
            información de tu proyecto.
          </p>

          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-7">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-orange/20 text-brand-orange">
                <CopyIcon className="h-5 w-5" />
              </div>
              <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.28em] text-brand-orange">Fase 1</p>
              <h3 className="mt-2 font-heading text-2xl font-extrabold">Copiado</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
                Copia el prompt técnico con un solo clic desde la tarjeta de cada módulo.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-7">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-orange/20 text-brand-orange">
                <Sparkles className="h-5 w-5" />
              </div>
              <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.28em] text-brand-orange">Fase 2</p>
              <h3 className="mt-2 font-heading text-2xl font-extrabold">Pegado</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
                Insértalo en tu IA y completa los datos reales entre [corchetes].
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-brand-orange">Índice</p>
              <h2 className="mt-2 font-heading text-3xl font-extrabold sm:text-4xl">Módulos del manual</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              {filtered.length} de {chapters.length} módulos
            </p>
          </div>

          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por módulo, tema o palabra clave..."
              className="w-full rounded-full border border-border bg-card px-12 py-4 text-[15px] outline-none transition focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
            />
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {(["Todos", "Favoritos", ...categories] as const).map((cat) => {
              const isActive = active === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActive(cat)}
                  className={
                    "rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition " +
                    (isActive
                      ? "border-brand-orange bg-brand-orange text-white"
                      : "border-border bg-card text-muted-foreground hover:border-brand-orange hover:text-brand-orange")
                  }
                >
                  {cat === "Favoritos" ? `★ ${cat}` : cat}
                </button>
              );
            })}
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((c) => {
              const fav = isFavorite(c.slug);
              const done = isCompleted(c.slug);
              return (
                <article
                  key={c.slug}
                  className="group relative flex flex-col rounded-2xl border border-border bg-card p-7 transition hover:-translate-y-1 hover:border-brand-orange hover:shadow-lg"
                >
                  <button
                    type="button"
                    aria-label={fav ? "Quitar de favoritos" : "Añadir a favoritos"}
                    onClick={(e) => {
                      e.preventDefault();
                      toggleFavorite(c.slug);
                    }}
                    className={
                      "absolute right-4 top-4 rounded-full p-2 transition " +
                      (fav
                        ? "bg-brand-orange/15 text-brand-orange"
                        : "text-muted-foreground hover:bg-brand-orange/10 hover:text-brand-orange")
                    }
                  >
                    <Star className={"h-4 w-4 " + (fav ? "fill-current" : "")} />
                  </button>
                  <div className="flex items-center justify-between pr-10">
                    <span className="font-display text-3xl text-brand-orange">{c.moduleNumber}</span>
                    <span className="rounded-full bg-muted px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                      {c.category}
                    </span>
                  </div>
                  <h3 className="mt-5 font-heading text-xl font-extrabold leading-snug">{c.title}</h3>
                  <p className="mt-3 text-sm italic text-muted-foreground">{c.subtitle}</p>
                  <p className="mt-4 text-[15px] leading-[1.65] text-foreground/80">
                    {c.description.split(".").slice(0, 2).join(".") + "."}
                  </p>
                  <div className="mt-7 flex items-center justify-between">
                    <Link
                      to={c.slug}
                      className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-brand-orange transition group-hover:gap-3"
                    >
                      Abrir módulo <ArrowRight className="h-4 w-4" />
                    </Link>
                    {done && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-500">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Completado
                      </span>
                    )}
                  </div>
                </article>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <p className="mt-16 text-center text-muted-foreground">
              No se encontraron módulos para tu búsqueda.
            </p>
          )}
        </div>
      </section>
    </>
  );
};

export default GuiaIndex;
