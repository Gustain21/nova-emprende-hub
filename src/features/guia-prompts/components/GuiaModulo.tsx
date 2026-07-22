import { useEffect } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Circle,
  List,
  Star,
} from "lucide-react";
import { getAdjacentChapters, getChapterBySlug } from "../data/chapters";
import { PromptBlock } from "./PromptBlock";
import { useGuiaProgress } from "../hooks/useGuiaProgress";

const GuiaModulo = () => {
  const { slug = "" } = useParams();
  const chapter = getChapterBySlug(slug);
  const navigate = useNavigate();
  const { isCompleted, toggleCompleted, isFavorite, toggleFavorite } = useGuiaProgress();

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [slug]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLElement && ["INPUT", "TEXTAREA"].includes(e.target.tagName)) return;
      const { prev, next } = getAdjacentChapters(slug);
      if (e.key === "ArrowLeft" && prev) navigate(`../${prev.slug}`);
      if (e.key === "ArrowRight" && next) navigate(`../${next.slug}`);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [slug, navigate]);

  if (!chapter) return <Navigate to=".." replace />;
  const { prev, next, index } = getAdjacentChapters(chapter.slug);
  const done = isCompleted(chapter.slug);
  const fav = isFavorite(chapter.slug);

  return (
    <article className="mx-auto max-w-[820px] px-5 pb-24 pt-8 sm:px-8 sm:pt-12">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          to=".."
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground transition hover:text-brand-orange"
        >
          <List className="h-3.5 w-3.5" /> Índice
        </Link>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => toggleFavorite(chapter.slug)}
            className={
              "inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] transition " +
              (fav
                ? "border-brand-orange bg-brand-orange/10 text-brand-orange"
                : "border-border bg-card text-muted-foreground hover:border-brand-orange hover:text-brand-orange")
            }
          >
            <Star className={"h-3.5 w-3.5 " + (fav ? "fill-current" : "")} />
            {fav ? "Favorito" : "Marcar favorito"}
          </button>
          <button
            type="button"
            onClick={() => toggleCompleted(chapter.slug)}
            className={
              "inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] transition " +
              (done
                ? "border-emerald-500 bg-emerald-500/10 text-emerald-500"
                : "border-border bg-card text-muted-foreground hover:border-brand-orange hover:text-brand-orange")
            }
          >
            {done ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Circle className="h-3.5 w-3.5" />}
            {done ? "Completado" : "Marcar"}
          </button>
        </div>
      </div>

      <header className="mb-12 mt-10 sm:mb-16">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-display text-sm tracking-[0.2em] text-brand-orange">{chapter.module}</span>
          <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
          <span className="rounded-full bg-muted px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            {chapter.category}
          </span>
          <span className="ml-auto text-xs text-muted-foreground">{index + 1} / 18</span>
        </div>

        <h1 className="mt-6 font-heading text-[2.4rem] font-extrabold leading-[1.05] sm:text-[3rem]">
          {chapter.title}
        </h1>
        <p className="mt-5 text-xl italic text-muted-foreground">{chapter.subtitle}</p>
        <p className="mt-8 text-lg leading-[1.7] text-foreground/90">{chapter.description}</p>
      </header>

      <div className="mb-10 flex items-start gap-4 rounded-2xl border border-dashed border-brand-orange/40 bg-brand-orange/5 p-6 sm:p-7">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-orange text-white">
          <BookOpen className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-brand-orange">Herramienta</p>
          <p className="mt-1.5 font-heading text-lg font-extrabold leading-snug">{chapter.toolName}</p>
          <p className="mt-1 text-sm text-muted-foreground">{chapter.toolTagline}</p>
        </div>
      </div>

      <PromptBlock prompt={chapter.prompt} />

      <nav className="mt-16 grid gap-4 border-t border-border pt-10 sm:grid-cols-2">
        {prev ? (
          <Link
            to={`../${prev.slug}`}
            className="group flex flex-col rounded-2xl border border-border bg-card p-5 transition hover:border-brand-orange"
          >
            <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.24em] text-muted-foreground">
              <ArrowLeft className="h-3 w-3" /> Anterior
            </span>
            <span className="mt-2 font-heading font-extrabold transition group-hover:text-brand-orange">
              {prev.module} · {prev.title}
            </span>
          </Link>
        ) : (
          <div />
        )}
        {next ? (
          <Link
            to={`../${next.slug}`}
            className="group flex flex-col rounded-2xl border border-border bg-card p-5 text-right transition hover:border-brand-orange sm:items-end"
          >
            <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.24em] text-muted-foreground">
              Siguiente <ArrowRight className="h-3 w-3" />
            </span>
            <span className="mt-2 font-heading font-extrabold transition group-hover:text-brand-orange">
              {next.module} · {next.title}
            </span>
          </Link>
        ) : (
          <Link
            to=".."
            className="group flex flex-col rounded-2xl border border-brand-orange bg-brand-orange/10 p-5 text-right transition hover:bg-brand-orange hover:text-white sm:items-end"
          >
            <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.24em] text-brand-orange">
              Volver al índice
            </span>
            <span className="mt-2 font-heading font-extrabold text-brand-orange group-hover:text-white">
              Cierre de la guía
            </span>
          </Link>
        )}
      </nav>
    </article>
  );
};

export default GuiaModulo;
