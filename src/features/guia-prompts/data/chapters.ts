export type Category =
  | "Estrategia"
  | "Mentalidad"
  | "Marketing"
  | "Planificación"
  | "Mercado"
  | "Finanzas"
  | "Operaciones"
  | "Equipo"
  | "Salida";

export interface Chapter {
  slug: string;
  module: string;
  moduleNumber: string;
  title: string;
  subtitle: string;
  description: string;
  toolName: string;
  toolTagline: string;
  category: Category;
  prompt: string;
}

export const chapters: Chapter[] = [
  {
    slug: "modulo-01-nuevo-escenario",
    module: "MÓDULO 01",
    moduleNumber: "01",
    title: "El Nuevo Escenario del Emprendimiento",
    subtitle: "Entender cómo la IA y las nuevas tendencias impactan en tu idea.",
    description:
      "Explora el cruce entre tecnología, propósito e impacto para detectar dónde tu negocio puede crecer hoy. Aprende a identificar oportunidades reales de IA y de sostenibilidad, conectando con los valores de las nuevas generaciones para diferenciarte desde el primer día.",
    toolName: "El Amplificador de Capacidades",
    toolTagline: "Detecta oportunidades de innovación y sostenibilidad.",
    category: "Estrategia",
    prompt: `Actúa como un estratega senior en innovación digital y sostenibilidad empresarial. Mi idea de negocio es: [Describe tu idea]. Tu tarea es diseñar un ecosistema de crecimiento basado en la tríada 'Tecnología + Propósito + Impacto'.

Especificaciones: Identifica 3 oportunidades críticas para integrar Inteligencia Artificial que mejoren la experiencia del cliente o la eficiencia operativa. Además, propone 3 iniciativas de impacto social o ambiental que conecten con los valores de la Generación Z.

Criterios de Calidad: Las ideas deben ser disruptivas pero ejecutables en una fase inicial, evitando generalidades teóricas.

Formato de Respuesta: Presenta una tabla comparativa con: Propuesta, Valor Diferencial y Primer Paso para implementar.`,
  },
  {
    slug: "modulo-02-mentalidad",
    module: "MÓDULO 02",
    moduleNumber: "02",
    title: "Cambio de Mentalidad y Cultura Emprendedora",
    subtitle: "Reprogramar creencias limitantes y enfocar la mente en la abundancia.",
    description:
      "Trabaja sobre los miedos y bloqueos que paralizan al emprendedor. A través del Método 3R reconocerás el origen de cada miedo, lo reemplazarás por un mantra de poder y lo consolidarás con micro-acciones diarias que rompen la parálisis y construyen una mentalidad de abundancia.",
    toolName: "El Coach de Mentalidad (Método 3R)",
    toolTagline: "Rompe parálisis y miedos irracionales.",
    category: "Mentalidad",
    prompt: `Actúa como un psicólogo cognitivo y coach de alto rendimiento para emprendedores. Mi miedo o bloqueo actual es: [Escribe tu miedo]. Aplica el 'Método 3R' para reprogramar mi respuesta ante este estímulo.

Tarea: 1) Reconocer: Explica el origen evolutivo de este miedo para neutralizarlo. 2) Reemplazar: Genera un mantra de poder basado en la abundancia de recursos. 3) Repetir: Define un protocolo de micro-acción de 15 minutos.

Especificaciones: El tono debe ser directo, empoderador y libre de clichés motivacionales vacíos.

Criterios de Calidad: El diagnóstico debe ser lógico y la solución inmediatamente accionable.

Formato de Respuesta: Un plan de acción 'Quick-Fix' con diagnóstico, mantra y tarea inmediata.`,
  },
  {
    slug: "modulo-03-marketing",
    module: "MÓDULO 03",
    moduleNumber: "03",
    title: "Evolución del Marketing",
    subtitle: "Alinear tu estrategia con el Marketing 6.0 (Inmersivo y Figital).",
    description:
      "Diseña experiencias que eliminen la fricción entre el mundo físico y el digital. Aprenderás a construir puentes phygital con QR, realidad aumentada o automatización, aportando valor real al cliente y creando momentos memorables que potencian la conveniencia y la sorpresa.",
    toolName: "Estrategia Figital (Físico + Digital)",
    toolTagline: "Elimina la fricción entre el mundo online y offline.",
    category: "Marketing",
    prompt: `Actúa como un consultor experto en Marketing 6.0 y experiencias inmersivas. Mi negocio es: [Tu Negocio]. Necesito diseñar un puente 'Phygital' (físico + digital) que elimine la fricción en el customer journey.

Tarea: Propone 3 puntos de contacto donde la tecnología (QR, Realidad Aumentada o automatización) aporte valor real a una interacción física, o viceversa.

Especificaciones: El enfoque debe ser la 'Inmersión Total' y la conveniencia del usuario.

Criterios de Calidad: No busco tecnología por moda, sino para mejorar el tiempo de respuesta o la sorpresa del cliente.

Formato de Respuesta: Desglose de cada idea incluyendo: Concepto, Herramienta sugerida y Beneficio Percibido.`,
  },
  {
    slug: "modulo-04-planificacion",
    module: "MÓDULO 04",
    moduleNumber: "04",
    title: "Planificación",
    subtitle: "Validar rápido y detectar riesgos antes de invertir.",
    description:
      "Aplica la filosofía Lean Startup para probar tu idea con bajo presupuesto antes de comprometer recursos. Diseñarás un MVP simple y un cronograma de 4 semanas que te permitirá medir hipótesis, captar tráfico y entender métricas clave de conversión para fallar rápido y barato.",
    toolName: "El Plan de Validación Rápida (Lean Startup)",
    toolTagline: "Diseña un MVP de bajo coste.",
    category: "Planificación",
    prompt: `Actúa como un Mentor de Lean Startup especializado en validación ágil. Mi idea es: [Tu Idea]. Tu tarea es diseñar un experimento de mercado real con presupuesto mínimo.

Especificaciones: Crea un cronograma de 4 semanas. Semana 1: Hipótesis de Valor. Semana 2: Construcción de MVP funcional. Semana 3: Captación de tráfico. Semana 4: Análisis de Conversión.

Criterios de Calidad: El MVP debe ser tan simple que resuelva solo el problema principal, permitiendo fallar rápido y barato.

Formato de Respuesta: Calendario semanal con hitos críticos y la métrica de éxito (North Star Metric) recomendada.`,
  },
  {
    slug: "modulo-05-plan-empresa",
    module: "MÓDULO 05",
    moduleNumber: "05",
    title: "El Plan de Empresa",
    subtitle: "Estructurar el índice de tu documento madre.",
    description:
      "Construye la estructura ósea de tu plan de negocio adaptada a tu sector. Obtendrás un índice personalizado que prioriza lo relevante (escalabilidad, ubicación, propósito, IA) y proyecta solvencia ante bancos e inversores, sirviendo como hoja de ruta para toda la planificación posterior.",
    toolName: "El Arquitecto del Plan",
    toolTagline: "Crea un índice personalizado para tu sector.",
    category: "Planificación",
    prompt: `Actúa como un Consultor de Estrategia para Pymes. Mi negocio es: [Tu Negocio]. Necesito la estructura ósea de mi Plan de Empresa.

Tarea: Genera el índice detallado de mi documento maestro, personalizando los apartados según las necesidades financieras de mi sector específico.

Especificaciones: No uses un índice genérico. Si es tecnológico, prioriza escalabilidad; si es local, prioriza ubicación y flujo. Incluye secciones para Propósito e IA.

Criterios de Calidad: El índice debe proyectar solvencia ante bancos o inversores.

Formato de Respuesta: Listado jerarquizado de secciones con una breve nota sobre qué dato clave incluir en cada una.`,
  },
  {
    slug: "modulo-06-resumen-ejecutivo",
    module: "MÓDULO 06",
    moduleNumber: "06",
    title: "Resumen Ejecutivo",
    subtitle: "Redactar la página más importante del plan.",
    description:
      "Aprende a sintetizar tu proyecto en la pieza más leída del plan: el resumen ejecutivo. Conseguirás un texto de 250 palabras con gancho emocional, datos de mercado y llamada a la acción, capaz de generar urgencia y curiosidad en inversores y aliados clave en menos de dos minutos.",
    toolName: "El Redactor de Pitch (Elevator Pitch)",
    toolTagline: "Engancha al lector en 250 palabras.",
    category: "Estrategia",
    prompt: `Actúa como un Copywriter Senior experto en Narrativa de Negocios. Aquí tienes los datos de mi proyecto: [Problema, Solución, Mercado, Ingresos].

Tarea: Redacta el Resumen Ejecutivo de mi plan siguiendo la estructura: Gancho emocional, Datos de mercado, El 'Cómo' (Solución) y Llamada a la acción.

Especificaciones: Máximo 250 palabras. Tono: Autoritario, visionario y directo.

Criterios de Calidad: Debe leerse en menos de 2 minutos y generar urgencia o curiosidad inmediata.

Formato de Respuesta: Un bloque de texto persuasivo listo para usar.`,
  },
  {
    slug: "modulo-07-informacion-proyecto",
    module: "MÓDULO 07",
    moduleNumber: "07",
    title: "Información del Proyecto",
    subtitle: "Definir identidad básica y aspectos legales.",
    description:
      "Define la identidad básica de tu marca y el marco legal en el que operarás. Generarás nombres memorables y compatibles con dominios digitales y, además, ubicarás tu actividad en el epígrafe fiscal correcto para evitar problemas y proyectar una imagen profesional desde el inicio.",
    toolName: "Generador de Naming y Categoría",
    toolTagline: "Encuentra nombres memorables y tu epígrafe fiscal.",
    category: "Estrategia",
    prompt: `Actúa como un equipo de Branding Creativo y Consultoría Legal. Mi negocio se dedica a: [Tu sector].

Tarea: 1) Genera 10 nombres de marca que sean cortos, evocadores y fáciles de recordar. 2) Define mi actividad técnica según el catálogo fiscal de [Tu País].

Especificaciones: Los nombres deben ser compatibles con dominios digitales. El epígrafe debe ser preciso para evitar problemas legales.

Criterios de Calidad: Evita nombres genéricos; busca sonoridad y distinción de marca.

Formato de Respuesta: Listado de Naming + Justificación creativa + Sugerencia de epígrafe fiscal.`,
  },
  {
    slug: "modulo-08-promotores",
    module: "MÓDULO 08",
    moduleNumber: "08",
    title: "Promotores del Proyecto",
    subtitle: "Vender la capacidad del equipo fundador.",
    description:
      "Convierte tu trayectoria en una historia de liderazgo que genere confianza inmediata. Aprenderás a destacar logros, cifras y verbos de acción para demostrar a inversores y aliados que tienes la capacidad y el compromiso necesarios para ejecutar este proyecto con éxito.",
    toolName: "Optimizador de Biografía del Fundador",
    toolTagline: "Transmite confianza y liderazgo.",
    category: "Equipo",
    prompt: `Actúa como un Especialista en Marca Personal y Storytelling Ejecutivo. Mi historial es: [Pega aquí tus datos]. Mi proyecto es: [Tu Negocio].

Tarea: Redacta mi perfil profesional para la sección de 'Promotores'. No hagas un CV, haz una historia de liderazgo.

Especificaciones: Resalta solo los logros que validan mi capacidad para ejecutar este negocio específico. Usa verbos de acción y cifras.

Criterios de Calidad: Debe generar confianza inmediata y demostrar que tengo 'piel en el juego'.

Formato de Respuesta: Biografía narrativa de 3 párrafos: Origen, Éxitos y Compromiso.`,
  },
  {
    slug: "modulo-09-descripcion-negocio",
    module: "MÓDULO 09",
    moduleNumber: "09",
    title: "Descripción del Negocio",
    subtitle: "Definir Misión, Visión y Valores.",
    description:
      "Construye la brújula moral de tu empresa con misión, visión y valores claros y operativos. Inspirado en el Golden Circle de Simon Sinek, este ejercicio te ayuda a articular tu 'por qué', alinear al equipo y comunicar una cultura coherente que conecta con clientes y colaboradores.",
    toolName: "El Creador de Propósito",
    toolTagline: "Misión y Visión inspiradoras.",
    category: "Estrategia",
    prompt: `Actúa como un Estratega de Cultura Corporativa. Mi empresa: [Lo que haces] para [Tu cliente].

Tarea: Define la brújula moral de mi organización: 1) Misión (Presente accionable). 2) Visión (Futuro aspiracional a 10 años). 3) 3 Valores Core con definición operativa.

Especificaciones: Inspírate en el 'Golden Circle' de Simon Sinek. El 'Por qué' debe ser el centro.

Criterios de Calidad: Textos cortos, memorables y fáciles de comunicar al equipo.

Formato de Respuesta: Estructura clara por bloques: Misión, Visión, Valores.`,
  },
  {
    slug: "modulo-10-operaciones",
    module: "MÓDULO 10",
    moduleNumber: "10",
    title: "Plan de Producción / Operaciones",
    subtitle: "Operativizar el 'cómo se hace'.",
    description:
      "Diseña el workflow real de tu negocio desde la captación hasta la post-venta. Identificarás entradas, procesos, entregas, soporte y los posibles cuellos de botella, sentando las bases de un sistema escalable que pueda funcionar incluso sin la supervisión constante del fundador.",
    toolName: "El Ingeniero de Procesos",
    toolTagline: "Desglosa el paso a paso de tu servicio.",
    category: "Operaciones",
    prompt: `Actúa como un Director de Operaciones (COO) obsesionado con la eficiencia. Mi oferta es: [Describe tu producto/servicio].

Tarea: Mapea el flujo de trabajo (Workflow) desde la captación hasta la post-venta.

Especificaciones: Divide el proceso en: Entrada, Procesamiento, Entrega y Soporte. Identifica los 2 puntos donde el equipo podría saturarse.

Criterios de Calidad: El proceso debe ser escalable y diseñado para funcionar sin supervisión constante.

Formato de Respuesta: Diagrama de pasos numerados con 'Alertas de Cuello de Botella'.`,
  },
  {
    slug: "modulo-11-pestel",
    module: "MÓDULO 11",
    moduleNumber: "11",
    title: "Análisis de Mercado — PESTEL",
    subtitle: "Analizar el entorno macro de tu sector.",
    description:
      "Realiza un análisis PESTEL profundo que ilumina los factores políticos, económicos, sociales, tecnológicos, ecológicos y legales del entorno. Más que definiciones, obtendrás datos de tendencia y conclusiones estratégicas concretas para anticipar cambios y proteger a tu pequeña empresa.",
    toolName: "Radar de Tendencias (PESTEL)",
    toolTagline: "Análisis del entorno macro.",
    category: "Mercado",
    prompt: `Actúa como un Consultor de Inteligencia de Mercado. Mi sector es [Sector] en [Región].

Tarea: Realiza un Análisis PESTEL profundo enfocado en el año en curso.

Especificaciones: Analiza factores Políticos, Económicos (inflación), Sociales (hábitos), Tecnológicos (IA), Ecológicos y Legales.

Criterios de Calidad: No quiero definiciones; quiero datos de tendencia y cómo afectan a una pequeña empresa.

Formato de Respuesta: Informe ejecutivo por dimensiones con una 'Conclusión Estratégica' para cada una.`,
  },
  {
    slug: "modulo-12-buyer-persona",
    module: "MÓDULO 12",
    moduleNumber: "12",
    title: "Análisis de Mercado — Buyer Persona",
    subtitle: "Empatiza con tu cliente ideal.",
    description:
      "Crea el perfil completo de tu cliente ideal con datos demográficos, dolores, deseos ocultos y rutina digital. Definir su 'día en la vida' te permite detectar el momento exacto en que tu producto se vuelve indispensable y diseñar ganchos de venta que conecten con frustraciones reales.",
    toolName: "Define a tu Avatar (Buyer Persona)",
    toolTagline: "Empatiza con tu cliente ideal.",
    category: "Mercado",
    prompt: `Actúa como un Psicólogo del Consumidor y Experto en Segmentación. Vendo: [Tu Producto/Servicio].

Tarea: Crea el perfil de mi 'Cliente Ideal'. 1) Datos demográficos básicos. 2) Psicografía (dolores, miedos, deseos ocultos). 3) Rutina digital.

Especificaciones: Define su 'Día en la vida' para entender cuándo mi producto se vuelve una necesidad.

Criterios de Calidad: El avatar debe sentirse como una persona real con frustraciones específicas que yo resuelvo.

Formato de Respuesta: Ficha de Avatar con sección de 'Ganchos de Venta' recomendados.`,
  },
  {
    slug: "modulo-13-benchmarking",
    module: "MÓDULO 13",
    moduleNumber: "13",
    title: "Análisis de Mercado — Benchmarking",
    subtitle: "Encuentra tu Océano Azul.",
    description:
      "Estudia a tu competencia para detectar brechas de servicio y diseñar tu diferencial irresistible. En lugar de copiar, descubrirás el océano azul donde tus competidores no llegan por rigidez o falta de visión y construirás una propuesta única realmente competitiva en el mercado.",
    toolName: "Espía de la Competencia (Benchmarking)",
    toolTagline: "Encuentra tu Océano Azul.",
    category: "Mercado",
    prompt: `Actúa como un Especialista en Benchmarking. Mis competidores directos son: [Nombra o describe].

Tarea: Identifica las brechas de servicio en mi mercado analizando sus debilidades y fortalezas.

Especificaciones: Diseña mi 'Diferencial Irresistible' basado en quejas comunes de clientes de la competencia.

Criterios de Calidad: No copies; busca el 'Océano Azul' donde ellos no llegan por rigidez o falta de visión.

Formato de Respuesta: Tabla comparativa (Ellos vs Yo) y definición de mi Propuesta Única de Venta.`,
  },
  {
    slug: "modulo-14-foda",
    module: "MÓDULO 14",
    moduleNumber: "14",
    title: "Análisis de Mercado — FODA",
    subtitle: "Debilidades, Amenazas, Fortalezas, Oportunidades.",
    description:
      "Genera una matriz FODA cruzada y obtén estrategias accionables, no teorías abstractas. Identificarás factores internos y externos y diseñarás movimientos de crecimiento (FO) y supervivencia (DA) que puedes empezar a ejecutar al día siguiente para fortalecer tu posición competitiva.",
    toolName: "Simulador de Estrategia FODA",
    toolTagline: "Matriz FODA cruzada y accionable.",
    category: "Mercado",
    prompt: `Actúa como un Estratega de Negocios Senior. Sector: [Sector].

Tarea: Genera un Análisis FODA (SWOT) cruzado.

Especificaciones: Identifica Fortalezas/Debilidades internas y Oportunidades/Amenazas externas. Crea 2 estrategias FO (crecimiento) y 2 estrategias DA (supervivencia).

Criterios de Calidad: Las estrategias deben ser accionables mañana mismo, no teorías abstractas.

Formato de Respuesta: Matriz FODA clásica seguida de una 'Hoja de Ruta Estratégica'.`,
  },
  {
    slug: "modulo-15-marketing",
    module: "MÓDULO 15",
    moduleNumber: "15",
    title: "Plan de Marketing",
    subtitle: "Definir las 4P y la estrategia de promoción.",
    description:
      "Crea un calendario de contenidos de 30 días equilibrado entre educación, autoridad y conversión. Diseñarás ganchos virales y un ecosistema de publicaciones pensado para generar confianza primero y ventas después, evitando el spam corporativo y conectando con tu audiencia ideal.",
    toolName: "El Planificador de Contenidos 30 Días",
    toolTagline: "Calendario de contenidos equilibrado.",
    category: "Marketing",
    prompt: `Actúa como un Director de Contenidos y Growth Hacker. Propuesta: [Tu propuesta]. Cliente: [Tu cliente].

Tarea: Diseña un ecosistema de contenido para 30 días dividido en fases.

Especificaciones: Educación (50%), Autoridad (25%) y Conversión (25%). Crea 3 ganchos (Hooks) virales para video corto.

Criterios de Calidad: El contenido debe generar confianza primero y venta después. Evita el spam corporativo.

Formato de Respuesta: Calendario semanal con: Idea de post, Formato sugerido y Objetivo del contenido.`,
  },
  {
    slug: "modulo-16-rrhh",
    module: "MÓDULO 16",
    moduleNumber: "16",
    title: "Plan de Recursos Humanos",
    subtitle: "Definir el equipo y organigrama.",
    description:
      "Diseña el organigrama ideal de tu primer año y la oferta para tu primera contratación clave. Definirás misiones, KPIs y cultura de trabajo para atraer talento de alto nivel incluso con presupuesto limitado, construyendo un equipo sólido que impulse el crecimiento desde el inicio.",
    toolName: "El Reclutador Virtual",
    toolTagline: "Contratación y descripciones de puesto.",
    category: "Equipo",
    prompt: `Actúa como un Headhunter especializado en startups. Mi negocio: [Tipo de negocio].

Tarea: 1) Diseña el organigrama ideal para el primer año. 2) Redacta el 'Job Description' para mi primera contratación clave.

Especificaciones: Define misiones, KPIs y cultura de trabajo deseada.

Criterios de Calidad: La oferta debe ser tan atractiva que atraiga talento de alto nivel incluso con presupuesto limitado.

Formato de Respuesta: Estructura de Organigrama + Oferta de empleo persuasiva.`,
  },
  {
    slug: "modulo-17-financiero",
    module: "MÓDULO 17",
    moduleNumber: "17",
    title: "Plan Económico / Financiero",
    subtitle: "Estimar costes e ingresos.",
    description:
      "Audita tu estructura financiera para detectar fugas de caja y costes ocultos. Clasificarás inversiones (CAPEX) y gastos mensuales (OPEX), calcularás tu punto de equilibrio teórico y recibirás consejos de optimización para entender con claridad cuándo tu negocio será realmente rentable.",
    toolName: "El Asistente de Costes",
    toolTagline: "Detecta costes ocultos y financieros.",
    category: "Finanzas",
    prompt: `Actúa como un Director Financiero (CFO) obsesionado con el flujo de caja. Mi negocio: [Tu negocio].

Tarea: Realiza una auditoría preventiva de mi estructura de costes e identifica 'Fugas de Caja'.

Especificaciones: Clasifica en CAPEX (Inversión) y OPEX (Gasto mensual). Incluye costes ocultos como licencias o mermas.

Criterios de Calidad: Ayúdame a calcular mi 'Punto de Equilibrio' teórico para saber cuándo seré rentable.

Formato de Respuesta: Listado categorizado con consejos de optimización financiera.`,
  },
  {
    slug: "modulo-18-salida",
    module: "MÓDULO 18",
    moduleNumber: "18",
    title: "Plan de Salida",
    subtitle: "Pensar en el largo plazo (Exit Strategy).",
    description:
      "Piensa desde el día uno en cómo construir una empresa vendible. Identificarás las métricas que multiplican el valor en cinco años (EBITDA, base de datos, procesos) y diseñarás un negocio que pueda funcionar sin su dueño, condición clave para resultar atractivo a futuros compradores.",
    toolName: "El Visionario de Exit",
    toolTagline: "Estrategias para vender la empresa en el futuro.",
    category: "Salida",
    prompt: `Actúa como un Asesor de Fusiones y Adquisiciones (M&A). Sector: [Tu sector].

Tarea: Diseña mi 'Estrategia de Salida' desde el día 1 para construir una empresa vendible.

Especificaciones: Identifica qué métricas (EBITDA, base de datos) multiplicarán el valor de venta en 5 años.

Criterios de Calidad: El negocio debe poder funcionar sin su dueño para ser atractivo a un comprador.

Formato de Respuesta: Guía de 3 pasos para maximizar la valoración final del negocio.`,
  },
];

export const categories: Category[] = [
  "Estrategia",
  "Mentalidad",
  "Marketing",
  "Planificación",
  "Mercado",
  "Finanzas",
  "Operaciones",
  "Equipo",
  "Salida",
];

export function getChapterBySlug(slug: string) {
  return chapters.find((c) => c.slug === slug);
}

export function getAdjacentChapters(slug: string) {
  const idx = chapters.findIndex((c) => c.slug === slug);
  return {
    prev: idx > 0 ? chapters[idx - 1] : null,
    next: idx >= 0 && idx < chapters.length - 1 ? chapters[idx + 1] : null,
    index: idx,
  };
}

export interface PromptSection {
  label: string;
  body: string;
}

const SECTION_LABELS = ["Tarea", "Especificaciones", "Criterios de Calidad", "Formato de Respuesta"];

export function parsePrompt(prompt: string): PromptSection[] {
  const labelRegex = new RegExp(`(^|\\n)\\s*(${SECTION_LABELS.join("|")})\\s*:`, "g");
  const matches: { label: string; start: number; contentStart: number }[] = [];
  let m: RegExpExecArray | null;
  while ((m = labelRegex.exec(prompt))) {
    matches.push({
      label: m[2],
      start: m.index + (m[1] ? m[1].length : 0),
      contentStart: m.index + m[0].length,
    });
  }
  const sections: PromptSection[] = [];
  const firstStart = matches.length ? matches[0].start : prompt.length;
  const intro = prompt.slice(0, firstStart).trim();
  if (intro) sections.push({ label: "Contexto y rol", body: intro });
  for (let i = 0; i < matches.length; i++) {
    const end = i + 1 < matches.length ? matches[i + 1].start : prompt.length;
    sections.push({
      label: matches[i].label,
      body: prompt.slice(matches[i].contentStart, end).trim(),
    });
  }
  return sections;
}
