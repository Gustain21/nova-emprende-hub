import { Helmet } from "react-helmet-async";

interface SeoProps {
  title: string;
  description?: string;
  noindex?: boolean;
}

/** Título y metadatos por ruta. No altera lógica de negocio. */
const Seo = ({ title, description, noindex }: SeoProps) => (
  <Helmet>
    <title>{title}</title>
    <meta property="og:title" content={title} />
    {description && <meta name="description" content={description} />}
    {description && <meta property="og:description" content={description} />}
    {noindex && <meta name="robots" content="noindex, follow" />}
  </Helmet>
);

export default Seo;
