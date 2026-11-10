# Roadmap

- [x] Corregir moneda AUTO (Argentina → USD).
- [x] Promoción ebook: fecha única 31/01/2027 Europe/Madrid (BD sale_ends_at pendiente de actualizar por el propietario), sin "30%", BD alineada.
- [x] Contacto: recepción real persistida + validación servidor + antispam; FAQ enlazado.
- [x] paddle-webhook: idempotencia, errores → 500, source_purchase_id, reembolsos parcial/total con recálculo.
- [x] Revisión 025cd77: registro+concesión atómicos, claim con bloqueo, validación ajustes, dead-letter, product_id persistido, atribución, sin emails en logs, IP fiable contacto.
- [x] Correos de compra/contacto vía Resend en producción: activos desde 10/10/2026; cola con 0 pendientes en la última lectura (09/11/2026).
- [x] Analytics frontend (corrección selectiva de compra) publicado en producción.
- [x] QA: alta normal confirmada; registro temporal cerrado el 09/11/2026. Compra automática, correo, acceso y descarga en QA confirmados por el usuario.
- [x] Auth producción Site URL = https://editorialnovaemprende.com (guardado manualmente por el propietario; verificado 09/11/2026 22:10 Madrid; antes https://bigbang-business-suite.lovable.app). Lista de redirecciones sin cambios (9 entradas); registro abierto, confirmación por email obligatoria, email activo, servidor OAuth desactivado.
- [ ] Compra real en PRODUCCIÓN (pago + reembolso total): no ejecutada; requiere autorización específica.
- [ ] Remitente de Auth: sigue el genérico por defecto. Plantillas ES preparadas en QA, no activas. Dominio de correo Lovable en estado Failed; NS de `notify` sin tocar porque Resend lo usa actualmente — no redelegar sin plan y autorización aparte.
- Nota: las versiones desplegadas de las funciones no son verificables con las lecturas disponibles (fechas de fuente ≠ despliegue); ETag ≠ SHA-256 y metadatos/bytes no prueban contenido actual.
