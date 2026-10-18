# Auditoría de lanzamiento (solo lectura) — 18/10/2026 16:25 UTC

Nada modificado, publicado, enviado ni cobrado. Leyenda: **R** = dato real consultado hoy · **C** = revisión de código/sesiones previas · **S** = prueba simulada/QA aislado · **NV** = no verificable con mis herramientas.

## Tabla de bloqueos

| # | Área | Estado | Evidencia | Acción mínima |
|---|---|---|---|---|
| 1 | Pagos | Paddle Live es el único procesador (C). Stripe sin claves; sus funciones responden 503 (C, 14/10) | 10 productos activos con precio EUR y USD; pack-completo-nova inactivo (R, tabla `products`). Ebook: oferta USD ya alineada a 19,99 (R) | Ninguna técnica. Impuestos: el precio es con impuestos incluidos según la ficha; el cálculo real lo hace Paddle (NV) |
| 2 | Webhook | Firma, idempotencia, reembolsos parciales/totales: pruebas simuladas PASS (S/C). 0 incidencias sin resolver (R) | `payment_webhook_deadletters` sin resolver = 0. Última compra pagada en Paddle: 22/07/2026; 42 «pending» antiguas de junio (R) | **No hay ninguna compra Live desde el despliegue del 14/10.** Hace falta una primera compra real pequeña con reembolso |
| 3 | Archivos | **BLOQUEO PARCIAL** | Tabla `files`: solo 3 archivos activos (PDF del ebook, 2 Excel de planes financieros); los 3 existen en almacenamiento (R). El almacenamiento tiene 6 objetos: 3 sin ficha de descarga (R). Apps enlazadas: bitácora, dashboard, planner, guía (R). Packs: 13 relaciones pack→producto (R) | Confirmar si faltan más Excel o recursos reales; los 3 objetos sin ficha no aparecen en Descargas |
| 4 | Cuentas | Registro, confirmación y recuperación: correo real recibido y confirmado por el usuario (14/10). Vinculación de compra por email: código + pruebas (C/S) | `claim_purchases_by_email` | Primera compra real: probar con email sin cuenta y luego registrarse |
| 5 | Email | Contacto: 1 envío real, aceptado por Resend (R, 10/10). **Aviso de compra: 0 envíos reales** (R, `email_outbox` solo tiene 1 contacto) | Corte activo desde 10/10 19:10 UTC (R) | Se comprobará con la primera compra real |
| 6 | Móvil/errores | Arreglo móvil publicado y comprobado 14/10 (C). Sin registros de errores nuevos disponibles hoy | — | Ninguna |
| 7 | Legal | NIF y contacto coinciden en Aviso legal y Términos (R, código). Desistimiento digital y casillas de consentimiento guardadas en servidor (C) | `Terminos.tsx`, `Reembolsos.tsx`, `legal_consents` | Sin inconsistencias observadas; no es un dictamen jurídico |
| 8 | Cookies/analítica | Consentimiento propio, GTM sin etiquetas (C). **No hay evento de compra con deduplicación por transacción en servidor** | `track.ts` | Opcional para la primera venta |
| 9 | Seguridad | Escaneo 14/10: sin críticos. Tablas privadas sin acceso público; descargas exigen sesión y compra; límite de envíos en contacto (C/R) | — | Ninguna |
| 10 | Externos | Aprobación de cuenta Paddle, KYC, cobros a banco, estado fiscal, dominios aprobados en Paddle Live | — | **NV**: revisar en el panel de Paddle |

## Mínimo para la primera venta
1. Datos bancarios y verificación de la cuenta en Paddle (externo).
2. Confirmar qué archivos tiene que recibir cada producto y pack, y añadir las fichas que falten.
3. Una compra real pequeña con un email propio → comprobar acceso, descarga, email de compra y luego el reembolso.

## Detalles técnicos
- Consulta agregada sobre `products`, `files`, `app_access`, `bundle_items`, `storage.objects` (bucket `nova-products`), `purchases` (conteo por estado), `email_outbox`, `email_delivery_config`, `payment_webhook_deadletters`.
- QA aislado (14/10) solo demuestra el modo de pruebas, no la entrega real.
