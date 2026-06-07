// Detección de país por headers del request (sin APIs externas, sin geolocalización del navegador).
// Supabase Edge Functions corren detrás de Cloudflare y reciben `cf-ipcountry`.
// Devuelve { country, region, currency }.

import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const EU = new Set([
  "ES","DE","AT","BE","BG","CY","HR","DK","SK","SI","EE","FI","FR","GR","HU",
  "IE","IT","LV","LT","LU","MT","NL","PL","PT","CZ","RO","SE",
]);
const LATAM = new Set([
  "AR","BO","CL","CO","CR","EC","SV","GT","HN","MX","NI","PA","PY","PE","DO","UY","VE",
]);

const classify = (country: string | null) => {
  const cc = (country || "").toUpperCase();
  if (EU.has(cc)) return { country: cc, region: "EU", currency: "EUR" };
  if (LATAM.has(cc)) return { country: cc, region: "LATAM", currency: "USD" };
  if (cc) return { country: cc, region: "INTL", currency: "USD" };
  return { country: null, region: null, currency: null };
};

Deno.serve((req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const h = req.headers;
  const country =
    h.get("cf-ipcountry") ||
    h.get("x-vercel-ip-country") ||
    h.get("x-country-code") ||
    h.get("x-geo-country") ||
    null;

  const result = classify(country);

  return new Response(JSON.stringify(result), {
    headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "no-store" },
    status: 200,
  });
});
