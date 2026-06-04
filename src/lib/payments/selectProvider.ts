// Lógica de selección de proveedor de pago.
// Stripe → preferente para España + UE.
// Paddle → preferente para LATAM e internacional (Merchant of Record).

import { EU_CODES, LATAM_CODES } from "./countries";

export type PaymentProvider = "stripe" | "paddle" | "none";

export interface ProductLike {
  stripe_price_id?: string | null;
  paddle_price_id?: string | null;
}

export interface ProviderSelection {
  provider: PaymentProvider;
  reason: string;
}

export function selectPaymentProvider(
  countryCode: string | null | undefined,
  product: ProductLike,
): ProviderSelection {
  const hasStripe = !!product.stripe_price_id;
  const hasPaddle = !!product.paddle_price_id;

  if (!hasStripe && !hasPaddle) {
    return { provider: "none", reason: "Este producto aún no tiene checkout configurado." };
  }

  const cc = (countryCode ?? "").toUpperCase();

  // Regla 1: España / UE → Stripe si está disponible
  if (cc && EU_CODES.has(cc) && hasStripe) {
    return { provider: "stripe", reason: "Stripe recomendado para España y Unión Europea." };
  }

  // Regla 2: LATAM → Paddle si está disponible
  if (cc && LATAM_CODES.has(cc) && hasPaddle) {
    return { provider: "paddle", reason: "Paddle recomendado para Latinoamérica (Merchant of Record)." };
  }

  // Regla 3: fallback al único disponible
  if (hasStripe && !hasPaddle) return { provider: "stripe", reason: "Único proveedor configurado para este producto." };
  if (hasPaddle && !hasStripe) return { provider: "paddle", reason: "Único proveedor configurado para este producto." };

  // Ambos disponibles pero país desconocido o resto del mundo → preferir Paddle (MoR global)
  return { provider: "paddle", reason: "Paddle recomendado para compradores internacionales." };
}
