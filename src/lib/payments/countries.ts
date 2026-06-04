// Catálogos de países para routing de checkout NOVA EMPRENDE.
// Fase 4 — Stripe (UE) + Paddle (LATAM/internacional).

export interface CountryOption {
  code: string;
  name: string;
  region: "ES" | "EU" | "LATAM" | "OTHER";
}

export const COUNTRIES: CountryOption[] = [
  // España
  { code: "ES", name: "España", region: "ES" },
  // Unión Europea (resto)
  { code: "DE", name: "Alemania", region: "EU" },
  { code: "AT", name: "Austria", region: "EU" },
  { code: "BE", name: "Bélgica", region: "EU" },
  { code: "BG", name: "Bulgaria", region: "EU" },
  { code: "CY", name: "Chipre", region: "EU" },
  { code: "HR", name: "Croacia", region: "EU" },
  { code: "DK", name: "Dinamarca", region: "EU" },
  { code: "SK", name: "Eslovaquia", region: "EU" },
  { code: "SI", name: "Eslovenia", region: "EU" },
  { code: "EE", name: "Estonia", region: "EU" },
  { code: "FI", name: "Finlandia", region: "EU" },
  { code: "FR", name: "Francia", region: "EU" },
  { code: "GR", name: "Grecia", region: "EU" },
  { code: "HU", name: "Hungría", region: "EU" },
  { code: "IE", name: "Irlanda", region: "EU" },
  { code: "IT", name: "Italia", region: "EU" },
  { code: "LV", name: "Letonia", region: "EU" },
  { code: "LT", name: "Lituania", region: "EU" },
  { code: "LU", name: "Luxemburgo", region: "EU" },
  { code: "MT", name: "Malta", region: "EU" },
  { code: "NL", name: "Países Bajos", region: "EU" },
  { code: "PL", name: "Polonia", region: "EU" },
  { code: "PT", name: "Portugal", region: "EU" },
  { code: "CZ", name: "República Checa", region: "EU" },
  { code: "RO", name: "Rumanía", region: "EU" },
  { code: "SE", name: "Suecia", region: "EU" },
  // Latinoamérica
  { code: "AR", name: "Argentina", region: "LATAM" },
  { code: "BO", name: "Bolivia", region: "LATAM" },
  { code: "CL", name: "Chile", region: "LATAM" },
  { code: "CO", name: "Colombia", region: "LATAM" },
  { code: "CR", name: "Costa Rica", region: "LATAM" },
  { code: "EC", name: "Ecuador", region: "LATAM" },
  { code: "SV", name: "El Salvador", region: "LATAM" },
  { code: "GT", name: "Guatemala", region: "LATAM" },
  { code: "HN", name: "Honduras", region: "LATAM" },
  { code: "MX", name: "México", region: "LATAM" },
  { code: "NI", name: "Nicaragua", region: "LATAM" },
  { code: "PA", name: "Panamá", region: "LATAM" },
  { code: "PY", name: "Paraguay", region: "LATAM" },
  { code: "PE", name: "Perú", region: "LATAM" },
  { code: "DO", name: "República Dominicana", region: "LATAM" },
  { code: "UY", name: "Uruguay", region: "LATAM" },
  { code: "VE", name: "Venezuela", region: "LATAM" },
  // Otros
  { code: "US", name: "Estados Unidos", region: "OTHER" },
  { code: "GB", name: "Reino Unido", region: "OTHER" },
  { code: "CA", name: "Canadá", region: "OTHER" },
];

export const EU_CODES = new Set(
  COUNTRIES.filter((c) => c.region === "ES" || c.region === "EU").map((c) => c.code),
);
export const LATAM_CODES = new Set(
  COUNTRIES.filter((c) => c.region === "LATAM").map((c) => c.code),
);

export const getCountry = (code: string) => COUNTRIES.find((c) => c.code === code);
