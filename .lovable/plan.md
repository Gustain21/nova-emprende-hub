# Corrección definitiva de moneda AUTO

## Objetivo
Unificar país, moneda, precios visibles y pago para que AUTO detecte Argentina como AR/USD incluso con datos heredados de España, sin publicar ni cambiar importes, productos, packs o diseño.

## Cambios
- Convertir `resolveCountry.ts` en la única fuente de país/moneda: ignorar y retirar las preferencias/cachés antiguas invisibles, mantener solo `?country=XX` y `__lp_country`, priorizar zona horaria argentina sobre un locale `es-ES`, y usar una caché nueva versionada con país y fuente.
- Hacer que `RegionContext` consuma esa resolución compartida y publique sus actualizaciones, eliminando su detección y caché paralelas.
- Formatear el estado de carga/error de cada precio con la moneda efectiva resuelta, de modo que AR use USD aunque Paddle PricePreview falle.
- Al cambiar el selector de pruebas, limpiar estado heredado y reiniciar en conjunto la resolución, los Price IDs y la caché de PricePreview antes de volver a detectar.
- Alinear la moneda e importe del evento `begin_checkout` con la región resuelta; el país enviado al checkout y el Price ID seguirán procediendo de la misma resolución.

## Validación
- Añadir regresiones para preferencias y cachés antiguas, Argentina por zona horaria, AUTO, fallback visual USD y UE/EUR.
- Simular en navegador Buenos Aires + `es-ES` + valores antiguos ES/EU y comprobar que las tarjetas muestran `$`.
- Ejecutar todas las pruebas, comprobación de tipos y compilación; revisar errores de vista previa.

## Alcance
No publicaré. No modificaré importes, Price IDs, packs, productos, diseño ni la lógica comercial del checkout.
