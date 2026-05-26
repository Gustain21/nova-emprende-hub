## Objetivo

Añadir una **zona privada de clientes** a NOVA EMPRENDE preparada para:
- Autenticación (Lovable Cloud / Supabase)
- Pagos (Stripe / Paddle) y desbloqueo por compra
- Descargas privadas (PDFs, recursos) servidas desde Storage
- Acceso a apps web internas asociadas a productos

Sin modificar la web pública existente (Home, secciones, páginas legales, Testimonios, Contacto, Producto, Header, Footer, estilos globales en `index.css` / `tailwind.config.ts`).

---

## Principios

1. **Aislamiento total**: todo lo nuevo vive bajo `/app/*` (zona privada) y en carpetas nuevas. La web pública sigue intacta.
2. **Header/Footer públicos no se tocan**. La zona privada usa su propio `AppLayout` con su propio header lateral/superior.
3. **Reutilizamos solo tokens del design system** (colores, fuentes ya definidas). Cero cambios a `index.css` salvo añadir variables nuevas si hicieran falta (no se prevén).
4. **Sin backend aún**: se crean stubs y mocks. Cuando confirmes, activamos Lovable Cloud y conectamos.
5. **Login existente (`/login`)** se mantiene como entrada; tras autenticar redirige a `/app`.

---

## Arquitectura de rutas

```text
Públicas (no se tocan):
  /, /contacto, /testimonios, /privacidad, /terminos, /aviso-legal,
  /producto/:id, /login

Privadas (nuevas, bajo guard de auth):
  /app                       → Dashboard (resumen de compras y accesos)
  /app/biblioteca            → Listado de productos comprados
  /app/biblioteca/:productId → Detalle + descargas + acceso a app
  /app/descargas             → Todas las descargas privadas
  /app/apps                  → Listado de apps web del cliente
  /app/apps/:appId           → Embed / launcher de cada app
  /app/compras               → Historial de pagos y facturas
  /app/cuenta                → Perfil, email, contraseña, cerrar sesión
```

---

## Archivos a crear

### Layout y guard
- `src/components/app/AppLayout.tsx` — Layout privado con sidebar + topbar propios, sin Header/Footer públicos.
- `src/components/app/AppSidebar.tsx` — Navegación lateral (Dashboard, Biblioteca, Descargas, Apps, Compras, Cuenta).
- `src/components/app/AppTopbar.tsx` — Barra superior con avatar, email, logout.
- `src/components/app/ProtectedRoute.tsx` — Guard que redirige a `/login` si no hay sesión.
- `src/components/app/PurchaseGate.tsx` — Bloquea un recurso si el usuario no lo ha comprado (muestra CTA a `/producto/:id`).

### Páginas privadas
- `src/pages/app/Dashboard.tsx`
- `src/pages/app/Biblioteca.tsx`
- `src/pages/app/ProductoPrivado.tsx`
- `src/pages/app/Descargas.tsx`
- `src/pages/app/Apps.tsx`
- `src/pages/app/AppDetalle.tsx`
- `src/pages/app/Compras.tsx`
- `src/pages/app/Cuenta.tsx`

### Lógica / datos
- `src/lib/auth/AuthProvider.tsx` — Context de sesión (stub ahora, Supabase después).
- `src/hooks/useAuth.ts` — Hook de acceso a sesión.
- `src/hooks/usePurchases.ts` — Hook que devuelve compras del usuario (mock → Supabase).
- `src/data/privateResources.ts` — Mapeo productId → { descargas[], appUrl, appId }.
- `src/types/account.ts` — Tipos: `Profile`, `Purchase`, `Resource`, `PrivateApp`.

### Modificaciones mínimas en código existente
- `src/App.tsx` — Añadir las rutas `/app/*` envueltas en `AuthProvider` + `ProtectedRoute`. **No se modifican rutas públicas.**
- `src/pages/Login.tsx` — Solo enganchar el submit al `AuthProvider` (cuando se conecte Cloud) y redirigir a `/app`. Diseño intacto.

Nada más se toca en la web pública.

---

## Fases de implementación (propuestas)

**Fase 1 — Esqueleto UI privado (sin backend)**
Crear layout, sidebar, todas las páginas con datos mock, guard que por ahora deja pasar siempre, y navegación funcional. Permite validar diseño y flujo end-to-end.

**Fase 2 — Auth real**
Activar Lovable Cloud, tabla `profiles` con trigger, email+password + Google, conectar `Login.tsx` y `Cuenta.tsx`, activar el guard real.

**Fase 3 — Compras y desbloqueo**
Tablas `products` (catálogo espejo), `purchases` (user_id, product_id, status), RLS estricto. `usePurchases` lee de Supabase. `PurchaseGate` decide acceso.

**Fase 4 — Pagos**
Elegir proveedor (recomendaré tras `recommend_payment_provider`). Edge function de checkout + webhook que inserta en `purchases`. Botón "Comprar" en `/producto/:id` apunta al checkout.

**Fase 5 — Descargas privadas**
Bucket privado en Storage. Edge function `get-download-url` que valida compra y devuelve signed URL temporal.

**Fase 6 — Apps web privadas**
`/app/apps/:appId` lanza/embebe apps internas. Si son externas, SSO por token firmado; si viven en este mismo proyecto, simple guard por compra.

---

## Decisiones que necesito que confirmes antes de implementar

1. ¿Empezamos por **Fase 1 (UI mock)** o quieres que active Lovable Cloud ya en la primera tanda?
2. **Métodos de login**: email+password y Google (recomendado), ¿añadimos Apple?
3. **Pagos**: ¿tienes preferencia (Stripe / Paddle), o ejecuto el análisis y te recomiendo?
4. **Apps web privadas**: ¿son apps que construiremos dentro de este mismo proyecto Lovable, o son externas que solo enlazamos/embebemos?

Confirma y arranco con la fase que indiques.