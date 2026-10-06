# Auditoría final de pagos (solo lectura) — informe y correcciones propuestas

No se ha cambiado nada: ni código, ni datos, ni secretos, ni configuración. No se ha publicado, ni comprado, ni creado usuarios. Leyenda: **[H]** hecho comprobado · **[I]** inferencia · **[NP]** no se ha podido comprobar.

## 1. Estado desplegado y límites de la auditoría
- **[NP]** Ninguna herramienta disponible permite descargar el código desplegado de las funciones, así que no puedo comparar lo desplegado con el repositorio. Solo `create-paddle-checkout` tiene un despliegue confirmado en esta sesión (la versión con `price_id`, `currency_code` y `total_minor`). Las otras cuatro se dan por iguales al repositorio, pero sin prueba.
- **[H]** Los registros de las funciones `paddle-webhook`, `create-paddle-checkout` y `get-download-url` no devuelven ninguna entrada, y la consulta de estadísticas de los últimos 14 días sale vacía. **[NP]** No hay forma de distinguir entre "no hubo errores" y "los registros no están disponibles o caducaron". No hay evidencia de errores recientes, pero tampoco de que no los haya.
- **[NP]** No tengo acceso de lectura a Paddle: no puedo ver la URL del webhook ni los eventos suscritos, ni el historial de entregas, ni los dominios aprobados.

## 2. Secretos (solo se comprueba si existen)
- **[H]** Existen: `PADDLE_API_KEY`, `PADDLE_API_KEY_LIVE`, `PADDLE_CLIENT_TOKEN(_LIVE)`, `PADDLE_WEBHOOK_SECRET(_LIVE)`, `PADDLE_ENVIRONMENT` y `SUPABASE_SERVICE_ROLE_KEY`.
- **[H]** No existen `STRIPE_SECRET_KEY` ni `STRIPE_WEBHOOK_SECRET`. Por código, `create-stripe-checkout` y `stripe-webhook` responden 503 "pendiente de configurar". Son restos sin uso, porque Paddle es el único proveedor.
- **[H]** El modo de trabajo viene de `PADDLE_ENVIRONMENT`. Los registros de la sesión anterior mostraron `live`. **[NP]** El valor actual no se puede leer.

## 3. Monedas
- **[H]** La misma regla de monedas (`_shared/currencyRule.ts`) se usa en el servidor y en la web: AR/MX → USD, ES/DE → EUR. Los 10 productos activos tienen identificador de precio en EUR y en USD. `pack-completo-nova` está inactivo y sin identificadores.
- **[H]** Campos antiguos de la base de datos no cuadran con Paddle. `regular_price_usd` vale 19, 29, 9, 38, 76, 126… y `sale_price_usd` del ebook vale 19, cuando `price_usd` es 19.99. **[I]** Lo que se cobra es el precio de Paddle, no estos campos, pero cualquier sitio que los muestre enseñaría importes erróneos.

## 4. Webhook de Paddle — incidencias
| # | Severidad | Hallazgo |
|---|---|---|
| W1 | **Alta** | **[H]** Ningún `insert`, `update` ni llamada a función comprueba si hubo error, y el webhook responde siempre 200. Si falla la base de datos, Paddle no reintenta y la compra se pierde sin aviso. |
| W2 | Media | **[H]** `create-paddle-checkout` no envía `purchase_id` en `custom_data`, así que el webhook siempre inserta. Con `transaction.paid` y después `transaction.completed`, el segundo `insert` choca con el índice único `purchases_provider_payment_id_unique`. El error se ignora y la respuesta es 200. **[I]** No se crean compras duplicadas gracias al índice, pero por accidente: el segundo evento tampoco actualiza el importe ni el usuario. |
| W3 | Media | **[H]** El acceso se concede con `p_purchase_id = null`, de modo que los accesos de Paddle quedan sin `source_purchase_id`. En la base de datos hay 3 de 14 accesos sin origen. Se pierde la trazabilidad del acceso hasta su compra. Al reclamar por email (`claim_purchases_by_email`) sí se rellena. |
| W4 | Media | **[H]** El email que manda es `custom_data.buyer_email`, el del formulario. El usuario se busca con `listUsers` limitado a la página 1 y 200 usuarios. **[I]** A partir de 200 cuentas, los compradores que ya tienen cuenta no se reconocerán al momento: recibirán el acceso cuando inicien sesión, gracias al reclamo por email. Si escriben otro email en Paddle, el recibo va a ese correo y el acceso al del formulario. |
| W5 | **Alta** | **[H]** Cualquier ajuste `refund` aprobado, también los **parciales**, marca la compra entera como reembolsada y revoca **todos** los accesos de ese usuario a ese producto. **[I]** Hay dos casos problemáticos: (a) un reembolso parcial quita el acceso completo; (b) si el comprador tiene el mismo producto por otra compra (suelto y dentro de un pack), el reembolso del pack le quita también el producto pagado aparte. |
| W6 | Baja | **[H]** Los eventos `transaction.canceled` y `payment_failed` no hacen nada sin `purchase_id`, que es siempre el caso. Efecto inocuo. |
| W7 | Baja | **[H]** La firma admite como máximo 5 s de antigüedad. **[I]** Es correcto, pero un desfase de reloj podría rechazar eventos válidos (Paddle reintenta). |
| W8 | Baja | **[H]** Los registros guardan `buyerEmail` en claro, lo que contradice la regla de no registrar datos personales. |

## 5. Datos actuales (sin datos personales)
- **[H]** En `purchases` hay 3 compras pagadas de Paddle (1 sin email), 1 pagada de demo y **42 pendientes de Paddle sin email**. Estas pendientes vienen de versiones anteriores; la versión actual no crea pendientes. No hay importes de transacción duplicados. La compra de `guia-de-prompts` pagada no tiene importe.

## 6. Descargas (`get-download-url`)
- **[H]** El código exige sesión iniciada y validada y un acceso activo, y genera un enlace firmado que caduca entre 30 y 3600 s (300 por defecto). **[NP]** Sin prueba en vivo.

## 7. Precio promocional del ebook — inconsistencia confirmada
- **[H]** En la web, la oferta termina el 31/12/2026 (`EBOOK_OFFER_END`), con 19,99 € frente a 29,99 € tachado.
- **[H]** En la base de datos, `sale_ends_at` es el 31/08/2026 (**ya pasado**), mientras `sale_active` sigue en true y `sale_discount_percent` vale 30.
- **[H]** 19,99 sobre 29,99 es un **33 %** de descuento, no un 30 %. El precio de 28,56 € pedido al principio no aparece en ningún sitio.
- **[I]** Paddle cobra lo que diga el identificador de precio (19,99). Cuando la web "termine" la oferta y muestre 29,99, Paddle seguiría cobrando 19,99 hasta que se cambie allí el precio. Esto **bloquea** cualquier anuncio que hable de fecha límite o de porcentaje.

## Bloqueos antes de lanzar publicidad
1. W1 y W5 (riesgo de perder compras o de revocar accesos por error).
2. Oferta del ebook incoherente (fechas, porcentaje, y que Paddle no revierte solo).
3. No se puede verificar lo desplegado ni los registros, ni ver la configuración del webhook en Paddle. Hace falta que confirmes en Paddle la URL del webhook, los eventos suscritos y entregas recientes con respuesta 200.

## Correcciones propuestas (solo si apruebas este plan; nada se publica sin tu autorización)
1. **Webhook:** comprobar cada error de la base de datos y responder 500 para que Paddle reintente. Pasar a `upsert` por `provider_payment_id`. Usar el id de la compra resultante como `p_purchase_id`. Quitar el email de los registros.
2. **Reembolsos:** revocar solo con reembolso total. Revocar solo los accesos cuyo `source_purchase_id` sea esa compra. Los parciales quedan registrados sin quitar el acceso.
3. **Búsqueda de usuario:** sustituir `listUsers` (200) por una búsqueda exacta por email en `profiles`.
4. **Oferta del ebook:** que decidas fecha y porcentaje (31/12/2026, "33 %" o precio real). Después, alinear la base de datos con la web y documentar que, al terminar, el precio se cambia en Paddle.
5. Opcional: retirar las funciones de Stripe sin uso y limpiar los campos USD antiguos.

Cada paso con pruebas, comprobación de tipos y build, y un despliegue de funciones aparte con tu autorización expresa.
