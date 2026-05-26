// Hook de compras del usuario. Fase 1: datos mock.
// Fase 3: SELECT a tabla `purchases` filtrado por auth.uid() vía RLS.

import { useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { MOCK_PURCHASES, MOCK_RESOURCES, MOCK_APPS, hasPurchased } from "@/data/privateResources";

export const usePurchases = () => {
  const { user } = useAuth();

  return useMemo(() => {
    if (!user) {
      return { purchases: [], resources: [], apps: [], owns: () => false };
    }
    const purchases = MOCK_PURCHASES;
    const ownedIds = new Set(purchases.filter((p) => p.status === "paid").map((p) => p.productId));
    const resources = MOCK_RESOURCES.filter((r) => ownedIds.has(r.productId));
    const apps = MOCK_APPS.filter((a) => ownedIds.has(a.productId));
    return {
      purchases,
      resources,
      apps,
      owns: (productId: string) => hasPurchased(productId, purchases),
    };
  }, [user]);
};
