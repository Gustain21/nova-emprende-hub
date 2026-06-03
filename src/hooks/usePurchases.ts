// Fase 3 — Conectado a Supabase.
// Lee entitlements, products, files, app_access y purchases del usuario actual.
// RLS garantiza que sólo se devuelven datos del propio usuario.

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface PurchaseRow {
  id: string;
  productId: string; // slug
  productUuid: string;
  productTitle: string;
  amount: number;
  currency: string;
  status: string;
  provider: string | null;
  purchasedAt: string;
}

export interface ResourceRow {
  id: string;
  productId: string; // slug
  productUuid: string;
  title: string;
  type: "pdf" | "xlsx" | "zip" | "other";
  storagePath: string;
  available: boolean;
}

export interface AppRow {
  id: string;
  productId: string; // slug
  productUuid: string;
  title: string;
  description: string;
  route: string;
  status: "ready";
}

export const usePurchases = () => {
  const { user } = useAuth();
  const userId = user?.id ?? null;

  const query = useQuery({
    enabled: !!userId,
    queryKey: ["clientes", "purchases-bundle", userId],
    queryFn: async () => {
      // 1) Productos a los que tiene acceso (entitlements activos)
      const { data: ents, error: entErr } = await supabase
        .from("entitlements")
        .select("id, product_id, active, expires_at, products(id, slug, name)")
        .eq("active", true);
      if (entErr) throw entErr;

      const ownedProducts = (ents ?? [])
        .filter((e: any) => !e.expires_at || new Date(e.expires_at) > new Date())
        .map((e: any) => e.products)
        .filter(Boolean);
      const ownedUuids = ownedProducts.map((p: any) => p.id);
      const slugByUuid = new Map<string, string>(ownedProducts.map((p: any) => [p.id, p.slug]));
      const nameByUuid = new Map<string, string>(ownedProducts.map((p: any) => [p.id, p.name]));

      // 2) Archivos disponibles (RLS filtra por entitlement activo)
      const { data: files, error: filesErr } = await supabase
        .from("files")
        .select("id, product_id, file_name, storage_path, file_type, active")
        .eq("active", true);
      if (filesErr) throw filesErr;

      const resources: ResourceRow[] = (files ?? []).map((f: any) => ({
        id: f.id,
        productId: slugByUuid.get(f.product_id) ?? "",
        productUuid: f.product_id,
        title: f.file_name,
        type: (["pdf", "xlsx", "zip"].includes(f.file_type) ? f.file_type : "other") as ResourceRow["type"],
        storagePath: f.storage_path ?? "",
        available: !!f.storage_path,
      }));

      // 3) Herramientas web disponibles (RLS filtra por entitlement)
      const { data: apps, error: appsErr } = await supabase
        .from("app_access")
        .select("id, product_id, app_name, app_slug, app_route, active")
        .eq("active", true);
      if (appsErr) throw appsErr;

      const appsList: AppRow[] = (apps ?? []).map((a: any) => ({
        id: a.id,
        productId: slugByUuid.get(a.product_id) ?? "",
        productUuid: a.product_id,
        title: a.app_name,
        description: "",
        route: a.app_route,
        status: "ready" as const,
      }));

      // 4) Compras del usuario
      const { data: purchasesRaw, error: purErr } = await supabase
        .from("purchases")
        .select("id, product_id, amount, currency, status, provider, purchased_at, products(slug, name)")
        .order("purchased_at", { ascending: false });
      if (purErr) throw purErr;

      const purchases: PurchaseRow[] = (purchasesRaw ?? []).map((p: any) => ({
        id: p.id,
        productId: p.products?.slug ?? "",
        productUuid: p.product_id,
        productTitle: p.products?.name ?? "Producto",
        amount: Number(p.amount ?? 0),
        currency: p.currency ?? "EUR",
        status: p.status,
        provider: p.provider,
        purchasedAt: p.purchased_at,
      }));

      // 5) Lista de "productos comprados" (acceso) para la vista Mis productos
      const products = ownedProducts.map((p: any) => ({
        productId: p.slug,
        productUuid: p.id,
        productTitle: p.name,
      }));

      const ownedSlugs = new Set(products.map((p) => p.productId));
      const ownedUuidSet = new Set(ownedUuids);

      return { purchases, resources, apps: appsList, products, ownedSlugs, ownedUuidSet };
    },
  });

  const data = query.data;
  const owns = (productIdOrSlug: string) =>
    !!data && (data.ownedSlugs.has(productIdOrSlug) || data.ownedUuidSet.has(productIdOrSlug));

  return {
    loading: query.isLoading,
    purchases: data?.purchases ?? [],
    resources: data?.resources ?? [],
    apps: data?.apps ?? [],
    products: data?.products ?? [],
    owns,
    refetch: query.refetch,
  };
};

// Genera una URL firmada temporal para un archivo del bucket privado.
export async function getSignedDownloadUrl(storagePath: string, expiresInSeconds = 300) {
  const { data, error } = await supabase.storage
    .from("nova-products")
    .createSignedUrl(storagePath, expiresInSeconds);
  if (error) throw error;
  return data.signedUrl;
}
