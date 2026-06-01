// MOCK TEMPORAL — Fase 1.
// Datos simulados de compras, descargas y apps privadas del cliente.
// En fase 3 esto vendrá de Supabase (tablas purchases, resources, apps + RLS).

import type { Purchase, Resource, PrivateApp, Profile } from "@/types/account";

export const MOCK_PROFILE: Profile = {
  id: "mock-user-001",
  email: "cliente@ejemplo.com",
  fullName: "Cliente Demo",
  createdAt: "2026-01-15T10:00:00Z",
};

export const MOCK_PURCHASES: Purchase[] = [
  {
    id: "pur_001",
    productId: "ebook",
    productTitle: "El Big Bang de los Negocios",
    amount: 19.99,
    currency: "EUR",
    status: "paid",
    purchasedAt: "2026-02-10T12:30:00Z",
    invoiceUrl: "#mock-invoice",
  },
  {
    id: "pur_002",
    productId: "dashboard",
    productTitle: "Dashboard Plan Financiero",
    amount: 24.99,
    currency: "EUR",
    status: "paid",
    purchasedAt: "2026-03-05T09:15:00Z",
    invoiceUrl: "#mock-invoice",
  },
];

export const MOCK_RESOURCES: Resource[] = [
  {
    id: "res_001",
    productId: "ebook",
    title: "El Big Bang de los Negocios — PDF",
    type: "pdf",
    sizeLabel: "4.2 MB",
    mockUrl: "#mock-download",
  },
  {
    id: "res_002",
    productId: "ebook",
    title: "Workbook complementario",
    type: "pdf",
    sizeLabel: "1.8 MB",
    mockUrl: "#mock-download",
  },
  {
    id: "res_003",
    productId: "dashboard",
    title: "Dashboard Plan Financiero — Excel",
    type: "excel",
    sizeLabel: "850 KB",
    mockUrl: "#mock-download",
  },
];

export const MOCK_APPS: PrivateApp[] = [
  {
    id: "app_plan_financiero",
    productId: "dashboard",
    title: "Plan Financiero",
    description:
      "Calcula proyecciones, márgenes y punto de equilibrio de tu negocio.",
    route: "/clientes/herramientas/plan-financiero",
    status: "ready",
  },
  {
    id: "app_validador_idea",
    productId: "ebook",
    title: "Validador de Idea",
    description: "Próximamente: valida tu idea de negocio en 5 pasos.",
    route: "/clientes/herramientas/validador-idea",
    status: "coming-soon",
  },
];

export function hasPurchased(productId: string, purchases: Purchase[]) {
  return purchases.some((p) => p.productId === productId && p.status === "paid");
}
