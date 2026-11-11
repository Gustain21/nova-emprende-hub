type VideoEntry = { title: string; src: string; poster: string; vertical?: boolean; subtitles?: string };

export const productVideos: Record<string, VideoEntry> = {
  ebook: { title: "Presentación del libro", src: "/media/ebook.mp4", poster: "/media/ebook-poster.jpg", vertical: true },
  bitacora: { title: "La Bitácora en acción", src: "/media/bitacora.mp4", poster: "/media/bitacora-poster.jpg" },
  prompts: { title: "Así funciona la Guía de Prompts", src: "/media/prompts.mp4", poster: "/media/prompts-poster.jpg" },
  dashboard: {
    title: "Así funciona el Dashboard",
    src: "/media/nova-dashboard-demo.mp4",
    poster: "/media/nova-dashboard-poster.png",
    subtitles: "/media/nova-dashboard-demo.es.vtt",
  },
  planner: { title: "El Planner en acción", src: "/media/planner.mp4", poster: "/media/planner-poster.jpg" },
  "excel-infoproducto": { title: "El plan para infoproductos en acción", src: "/media/excel-infoproducto.mp4", poster: "/media/excel-infoproducto-poster.jpg" },
  "excel-ecomochilas": { title: "El plan para e-commerce en acción", src: "/media/excel-ecomochilas.mp4", poster: "/media/excel-ecomochilas-poster.jpg" },
};

export const ProductVideo = ({ productId }: { productId: string }) => {
  const v = productVideos[productId];
  if (!v) return null;
  return (
    <section id="video" aria-labelledby="product-video-title" className="mb-16 scroll-mt-28">
      <h2 id="product-video-title" className="text-2xl font-bold text-foreground mb-6 text-center">
        {v.title}
      </h2>
      <div className={v.vertical ? "mx-auto w-full max-w-sm" : "mx-auto w-full max-w-4xl"}>
        <video
          controls
          playsInline
          preload="metadata"
          poster={v.poster}
          aria-label={v.title}
          className={`block w-full rounded-2xl border border-border bg-brand-dark-elevated object-contain ${v.vertical ? "aspect-[9/16] max-h-[80vh]" : "aspect-video"}`}
        >
          <source src={v.src} type="video/mp4" />
          {v.subtitles && <track kind="subtitles" src={v.subtitles} srcLang="es" label="Español" />}
        </video>
      </div>
    </section>
  );
};
