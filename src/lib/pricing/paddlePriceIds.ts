// Mapa único slug -> paddle price_id (Sandbox). Fuente de verdad.
// No modificar los Price IDs ni los slugs.

export const PADDLE_PRICE_IDS: Record<string, string> = {
  "el-big-bang-de-los-negocios": "pri_01kv63jdrsedw2fd5g2qxq30th",
  "bitacora-del-capitan": "pri_01kvgftw6zsjzdmym1y0bgzbbn",
  "guia-de-prompts": "pri_01kvgfj7czqcx84z2swvvtr98y",
  "dashboard-financiero": "pri_01kvgre944ejfvhq6aa3mcepzz",
  "planner-ejecucion-90-dias": "pri_01kvgrz5weqhs49fjgdvaja41m",
  "plan-financiero-infoproducto": "pri_01kvgsh779mhnsh8vn7e362sjf",
  "plan-financiero-ecommerce": "pri_01kvgsyds6we0cvyp32vr5330f",
  "pack-base": "pri_01kvmppgntzky6xjkjmna3gqfq",
  "pack-impulso": "pri_01kvmpyxftmq3m6g33yc3rsd0j",
  "pack-dominio": "pri_01kvmqbfdg05pymwj15htfh7ns",
};

export const ALL_PADDLE_PRICE_IDS = Object.values(PADDLE_PRICE_IDS);

export const getPaddlePriceIdBySlug = (slug: string | undefined | null): string | null => {
  if (!slug) return null;
  return PADDLE_PRICE_IDS[slug] || null;
};
