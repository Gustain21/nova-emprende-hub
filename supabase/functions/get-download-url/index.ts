// NOVA EMPRENDE — get-download-url
// Genera una URL firmada temporal para un archivo del bucket privado `nova-products`.
// Requiere JWT válido y entitlement activo sobre el producto al que pertenece el archivo.

import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return json({ error: "Unauthorized" }, 401);
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const ANON = Deno.env.get("SUPABASE_ANON_KEY")!;
    const SERVICE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Validar JWT del usuario
    const supaUser = createClient(SUPABASE_URL, ANON, {
      global: { headers: { Authorization: authHeader } },
    });
    const token = authHeader.replace("Bearer ", "");
    const { data: claims, error: claimsErr } = await supaUser.auth.getClaims(token);
    if (claimsErr || !claims?.claims?.sub) {
      return json({ error: "Unauthorized" }, 401);
    }
    const userId = claims.claims.sub as string;

    // Validar body
    const body = await req.json().catch(() => ({}));
    const fileId: string | undefined = body?.fileId;
    const expiresIn: number = Math.min(Math.max(Number(body?.expiresIn) || 300, 30), 3600);
    if (!fileId || typeof fileId !== "string") {
      return json({ error: "fileId requerido" }, 400);
    }

    // Cliente con service role para leer files + storage sin RLS
    const admin = createClient(SUPABASE_URL, SERVICE);

    // Buscar archivo
    const { data: file, error: fileErr } = await admin
      .from("files")
      .select("id, product_id, file_name, storage_path, active")
      .eq("id", fileId)
      .maybeSingle();
    if (fileErr) return json({ error: fileErr.message }, 500);
    if (!file || !file.active || !file.storage_path) {
      return json({ error: "Archivo no disponible" }, 404);
    }

    // Verificar entitlement activo
    const { data: hasAccess, error: rpcErr } = await admin.rpc("has_active_entitlement", {
      _user_id: userId,
      _product_id: file.product_id,
    });
    if (rpcErr) return json({ error: rpcErr.message }, 500);
    if (!hasAccess) return json({ error: "Sin acceso a este producto" }, 403);

    // Generar signed URL
    const { data: signed, error: signErr } = await admin.storage
      .from("nova-products")
      .createSignedUrl(file.storage_path, expiresIn, { download: file.file_name });
    if (signErr || !signed) return json({ error: signErr?.message ?? "sign failed" }, 500);

    return json({
      url: signed.signedUrl,
      fileName: file.file_name,
      expiresIn,
    });
  } catch (err: any) {
    console.error("[get-download-url]", err);
    return json({ error: err?.message ?? "Internal error" }, 500);
  }
});

function json(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
