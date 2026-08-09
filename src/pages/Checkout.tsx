// Ruta heredada /checkout/:productSlug.
// Ya no contiene lógica de pago propia (leía paddle_price_id de Sandbox).
// Redirige al flujo actual /pagar/:slug, que centraliza la selección de
// entorno, país, moneda y Price ID en el servidor.

import { useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";

const Checkout = () => {
  const { productSlug } = useParams<{ productSlug: string }>();

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.debug("[checkout] ruta heredada -> /pagar", { slug: productSlug });
  }, [productSlug]);

  if (!productSlug) return <Navigate to="/" replace />;
  return <Navigate to={`/pagar/${productSlug}`} replace />;
};

export default Checkout;
