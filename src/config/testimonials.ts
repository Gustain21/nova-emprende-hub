/**
 * Testimonios reactivados: el propietario (Gustavo) confirmó el 11/11/2026
 * que los testimonios son reales y autorizó su publicación. Se muestran en
 * portada (TestimonialsPreview) y en /testimonios (Testimonios), con los
 * enlaces de header/footer ya condicionados a este valor.
 */
export const SHOW_TESTIMONIALS = true;

/**
 * Cifras agregadas de /testimonios (500+, 4.9/5, 15+, 98%): NO confirmadas
 * ni con fuente. Los datos se conservan en Testimonios.tsx pero el bloque
 * solo se muestra poniendo este valor a true cuando exista evidencia.
 * La confirmación del propietario cubre los testimonios, no estas cifras.
 */
export const SHOW_TESTIMONIAL_STATS = false;
