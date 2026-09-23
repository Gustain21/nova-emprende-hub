import { useEffect, useState } from "react";
import { resolveRegion, resolveRegionSync, subscribeRegion, type ResolvedRegion } from "./resolveCountry";

/** Región efectiva compartida (primer render sincrónico + actualización). */
export function useResolvedRegion(): ResolvedRegion {
  const [region, setRegion] = useState<ResolvedRegion>(() => resolveRegionSync());
  useEffect(() => {
    let alive = true;
    const unsub = subscribeRegion((r) => alive && setRegion(r));
    resolveRegion().then((r) => alive && setRegion(r));
    return () => {
      alive = false;
      unsub();
    };
  }, []);
  return region;
}
