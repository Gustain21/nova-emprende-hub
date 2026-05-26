// Tipos de la zona privada de clientes. Fase 1: mock. Fase 2: Supabase.

export interface Profile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface Purchase {
  id: string;
  productId: string;
  productTitle: string;
  amount: number;
  currency: "EUR";
  status: "paid" | "pending" | "refunded";
  purchasedAt: string;
  invoiceUrl?: string;
}

export interface Resource {
  id: string;
  productId: string;
  title: string;
  type: "pdf" | "excel" | "zip" | "video";
  sizeLabel: string;
  // En fase posterior será un signed URL desde Supabase Storage.
  mockUrl: string;
}

export interface PrivateApp {
  id: string;
  productId: string;
  title: string;
  description: string;
  route: string; // ruta interna (/app/<slug>) o externa
  status: "ready" | "coming-soon";
}
