import { BookOpen, Calendar, Lightbulb, PieChart, FileSpreadsheet } from "lucide-react";
import ebookCover from "@/assets/ebook-cover.jpg";
import workbookCover from "@/assets/workbook-cover.png";
import promptsCover from "@/assets/prompts-cover.png";
import dashboardCover from "@/assets/dashboard-cover.png";
import plannerCover from "@/assets/planner-cover.png";
import excelInfproducto from "@/assets/excel-infoproducto.png";
import excelEcomochilas from "@/assets/excel-ecomochilas.png";

export interface Product {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  longDescription: string;
  // Precios EUR
  price: number;
  originalPrice?: number;
  // Precios USD
  priceUsd: number;
  originalPriceUsd?: number;
  image: string;
  type: "ebook" | "app" | "excel";
  iconName: "BookOpen" | "Calendar" | "Lightbulb" | "PieChart" | "FileSpreadsheet";
  featured?: boolean;
  offerEndDate?: string;
  saleActive?: boolean;
  benefits: string[];
  whatYouGet: string[];
  crossSellText?: string;
}

// Vigencia común de la promoción de lanzamiento del ebook
export const EBOOK_OFFER_END = "2026-08-31";

export const ebookProduct: Product = {
  id: "ebook",
  slug: "el-big-bang-de-los-negocios",
  title: "El Big Bang de los Negocios",
  subtitle: "Ebook Principal",
  description: "Guía práctica para transformar tus ideas en negocios rentables. 15 capítulos con metodología paso a paso.",
  longDescription:
    "El Big Bang de los Negocios es la guía definitiva para emprendedores que quieren pasar de la idea al negocio rentable. A lo largo de 15 capítulos, descubrirás una metodología probada que te llevará paso a paso desde la concepción de tu idea hasta la puesta en marcha de tu negocio. Escrito con un enfoque práctico y directo, sin teoría innecesaria.",
  // EUR (oferta de lanzamiento)
  price: 19.99,
  originalPrice: 29.99,
  // USD (oferta de lanzamiento)
  priceUsd: 19,
  originalPriceUsd: 29,
  image: ebookCover,
  type: "ebook",
  iconName: "BookOpen",
  featured: true,
  offerEndDate: EBOOK_OFFER_END,
  saleActive: true,
  benefits: [
    "Metodología paso a paso para validar tu idea de negocio",
    "15 capítulos con ejercicios prácticos aplicables desde el día 1",
    "Estrategias de monetización probadas en negocios reales",
    "Herramientas para definir tu propuesta de valor única",
    "Frameworks para analizar tu mercado y competencia",
    "Plantillas de modelo de negocio incluidas",
  ],
  whatYouGet: [
    "Ebook en formato PDF (descarga inmediata)",
    "15 capítulos con metodología completa",
    "Ejercicios prácticos en cada capítulo",
    "Acceso de por vida al contenido",
  ],
  crossSellText: "¿Quieres aplicar el método completo? Mira el Pack Impulso.",
};

export const products: Product[] = [
  {
    id: "bitacora",
    slug: "bitacora-del-capitan",
    title: "La Bitácora del Capitán",
    subtitle: "Cuaderno de trabajo oficial",
    description:
      "Cuaderno de trabajo oficial para aplicar paso a paso el método del ebook. Ordena ideas, toma decisiones y avanza con ejercicios prácticos.",
    longDescription:
      "La Bitácora del Capitán es el cuaderno de trabajo oficial para transformar la lectura del ebook en acción concreta. Te ayuda a ordenar ideas, tomar decisiones y avanzar con ejercicios prácticos diseñados para acompañar el método del ebook durante 30 días de trabajo enfocado.",
    price: 19.99,
    priceUsd: 19,
    image: workbookCover,
    type: "app",
    iconName: "Calendar",
    benefits: [
      "Programa estructurado de 30 días para desarrollar hábitos emprendedores",
      "Ejercicios diarios que transforman la lectura del ebook en acción",
      "Reflexiones guiadas para superar bloqueos y decisiones difíciles",
      "Seguimiento de progreso con métricas claras",
      "Complemento oficial del ebook para pasar de la teoría a la acción",
      "Espacios de planificación semanal y mensual",
    ],
    whatYouGet: [
      "Workbook interactivo digital",
      "30 días de ejercicios estructurados",
      "Plantillas de reflexión y planificación",
      "Guía de uso paso a paso",
    ],
    crossSellText: "Incluida también en Pack Base, Pack Impulso y Pack Dominio.",
  },
  {
    id: "prompts",
    slug: "guia-de-prompts",
    title: "La Guía de Prompts",
    subtitle: "IA aplicada al emprendimiento",
    description:
      "Guía práctica para usar inteligencia artificial como apoyo en la creación, planificación y mejora de tu proyecto emprendedor.",
    longDescription:
      "Una guía práctica para usar inteligencia artificial como apoyo en la creación, planificación y mejora de tu proyecto emprendedor. Contiene prompts cuidadosamente diseñados y organizados por etapa: ideación, validación, marketing, ventas y operaciones.",
    price: 9.99,
    priceUsd: 9,
    image: promptsCover,
    type: "app",
    iconName: "Lightbulb",
    benefits: [
      "Prompts organizados por fase del emprendimiento",
      "Apoya con IA la creación, planificación y mejora de tu proyecto",
      "Genera ideas, planes y copy en menos tiempo",
      "Análisis de competencia y validación con IA",
      "Plantillas de prompts reutilizables y personalizables",
      "Actualizaciones incluidas con nuevos prompts",
    ],
    whatYouGet: [
      "Guía digital con prompts organizados por categoría",
      "Prompts para ideación, validación, marketing y ventas",
      "Instrucciones de uso para cada prompt",
      "Acceso a futuras actualizaciones",
    ],
    crossSellText: "Incluida también en Pack Impulso y Pack Dominio.",
  },
  {
    id: "dashboard",
    slug: "dashboard-financiero",
    title: "Dashboard Financiero",
    subtitle: "Herramienta web de gestión",
    description:
      "Herramienta web para visualizar la salud financiera de tu proyecto, analizar gastos, ventas, márgenes y tomar decisiones con más claridad.",
    longDescription:
      "Una herramienta web para visualizar la salud financiera de tu proyecto. Permite analizar gastos, ventas, márgenes y rentabilidad con gráficos intuitivos para tomar decisiones con más claridad. Diseñada para emprendedores que necesitan control financiero sin complicaciones contables.",
    price: 27.99,
    priceUsd: 29,
    image: dashboardCover,
    type: "app",
    iconName: "PieChart",
    benefits: [
      "Control total de gastos fijos y variables en tiempo real",
      "Registro y análisis de ventas con gráficos intuitivos",
      "Cálculo automático de rentabilidad y márgenes",
      "Seguimiento de inversiones y retorno (ROI)",
      "Informes financieros automáticos",
      "Interfaz intuitiva sin necesidad de conocimientos contables",
    ],
    whatYouGet: [
      "Acceso a la aplicación web",
      "Dashboard personalizable",
      "Módulos de gastos, ventas e inversiones",
      "Gráficos y reportes automáticos",
    ],
    crossSellText: "Incluido también en Pack Impulso y Pack Dominio.",
  },
  {
    id: "planner",
    slug: "planner-ejecucion-90-dias",
    title: "Planner de Ejecución 90 Días",
    subtitle: "Sistema de planificación",
    description:
      "Sistema de planificación para transformar objetivos en acciones concretas durante los próximos 90 días.",
    longDescription:
      "El Planner de Ejecución 90 Días es un sistema de planificación para transformar objetivos en acciones concretas durante los próximos 90 días. Combina visión estratégica, revisiones semanales y un sistema de seguimiento integrado para mantener el foco en lo importante.",
    price: 14.99,
    priceUsd: 15,
    image: plannerCover,
    type: "app",
    iconName: "Calendar",
    benefits: [
      "Plan de acción estructurado semana a semana durante 90 días",
      "Objetivos SMART con seguimiento automático de progreso",
      "Sistema de priorización de tareas por impacto",
      "Revisiones semanales guiadas para mantener el foco",
      "Plantillas de planificación estratégica incluidas",
      "Ideal para lanzar o escalar tu negocio en 3 meses",
    ],
    whatYouGet: [
      "Acceso a la aplicación web",
      "Plan de 90 días estructurado",
      "Sistema de seguimiento de objetivos",
      "Plantillas de revisión semanal",
    ],
    crossSellText: "Incluido también en Pack Dominio.",
  },
  {
    id: "excel-infoproducto",
    slug: "plan-financiero-infoproducto",
    title: "Plan Financiero Infoproducto",
    subtitle: "Plantilla Excel",
    description:
      "Plantilla financiera pensada específicamente para infoproductos, cursos, ebooks, plantillas digitales y productos online.",
    longDescription:
      "Plantilla financiera pensada específicamente para infoproductos, cursos, ebooks, plantillas digitales y productos online. Incluye cálculo de punto muerto, márgenes, proyecciones de ventas y escenarios de rentabilidad con fórmulas automáticas y gráficos profesionales.",
    price: 15.99,
    priceUsd: 16,
    image: excelInfproducto,
    type: "excel",
    iconName: "FileSpreadsheet",
    benefits: [
      "Cálculo automático de punto muerto y break-even",
      "Análisis de márgenes comerciales por producto",
      "Proyecciones de ventas a 12 meses",
      "Escenarios optimista, realista y pesimista",
      "Gráficos profesionales listos para presentar a inversores",
      "Fórmulas automáticas: solo introduce tus datos",
    ],
    whatYouGet: [
      "Archivo Excel profesional (.xlsx)",
      "Hojas de cálculo con fórmulas automáticas",
      "Gráficos de análisis financiero",
      "Guía de uso incluida",
    ],
    crossSellText: "Incluido también en Pack Dominio.",
  },
  {
    id: "excel-ecomochilas",
    slug: "plan-financiero-ecommerce",
    title: "Plan Financiero E-commerce",
    subtitle: "Plantilla Excel",
    description:
      "Plantilla financiera pensada para e-commerce, venta de productos físicos, control de costes, márgenes, inversión y rentabilidad.",
    longDescription:
      "Plantilla financiera pensada para e-commerce, venta de productos físicos y dropshipping. Permite controlar costes, márgenes, inversión inicial, amortización y proyecciones realistas para tu tienda online.",
    price: 15.99,
    priceUsd: 16,
    image: excelEcomochilas,
    type: "excel",
    iconName: "FileSpreadsheet",
    benefits: [
      "Análisis completo de inversión inicial y amortización",
      "Control de costes de inventario y logística",
      "Proyecciones de ventas para e-commerce",
      "Cálculo de pricing y márgenes por producto",
      "Análisis de flujo de caja mensual",
      "Perfecto para negocios de productos físicos y dropshipping",
    ],
    whatYouGet: [
      "Archivo Excel profesional (.xlsx)",
      "Módulos de inversión, inventario y logística",
      "Proyecciones financieras automáticas",
      "Guía de uso paso a paso",
    ],
    crossSellText: "Incluido también en Pack Dominio.",
  },
];

export const allProducts: Product[] = [ebookProduct, ...products];

export const getProductById = (id: string) =>
  allProducts.find((p) => p.id === id || p.slug === id);

// ============================================================
// Packs (bundles) — visibles en la web pública
// ============================================================

export interface Pack {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  // Precios EUR
  price: number;
  originalPrice: number;
  // Precios USD
  priceUsd: number;
  originalPriceUsd: number;
  productIds: string[];
  productTitles: string[];
  featured?: boolean;
  badge?: string;
}

export const packs: Pack[] = [
  {
    id: "base",
    slug: "pack-base",
    name: "Pack Base",
    tagline: "Para empezar con foco",
    description:
      "El punto de partida ideal para comprender el método y comenzar a aplicarlo con una guía práctica de trabajo.",
    price: 31.99,
    originalPrice: 39.98,
    priceUsd: 32,
    originalPriceUsd: 38,
    productIds: ["ebook", "bitacora"],
    productTitles: ["El Big Bang de los Negocios", "La Bitácora del Capitán"],
  },
  {
    id: "impulso",
    slug: "pack-impulso",
    name: "Pack Impulso",
    tagline: "Para avanzar con más claridad",
    description:
      "El pack ideal para emprendedores que quieren avanzar con más claridad: método, acción, IA práctica y control financiero en una misma compra.",
    price: 55.99,
    originalPrice: 77.96,
    priceUsd: 59,
    originalPriceUsd: 76,
    productIds: ["ebook", "bitacora", "prompts", "dashboard"],
    productTitles: [
      "El Big Bang de los Negocios",
      "La Bitácora del Capitán",
      "La Guía de Prompts",
      "Dashboard Financiero",
    ],
    featured: true,
    badge: "Más recomendable",
  },
  {
    id: "dominio",
    slug: "pack-dominio",
    name: "Pack Dominio",
    tagline: "Para entrar con todo",
    description:
      "La opción más completa para quien quiere apoyarse desde el inicio en contenidos, ejecución, planificación, IA y control financiero.",
    price: 89.99,
    originalPrice: 124.93,
    priceUsd: 89,
    originalPriceUsd: 126,
    productIds: ["ebook", "bitacora", "prompts", "dashboard", "planner", "excel-infoproducto", "excel-ecomochilas"],
    productTitles: [
      "El Big Bang de los Negocios",
      "La Bitácora del Capitán",
      "La Guía de Prompts",
      "Dashboard Financiero",
      "Planner de Ejecución 90 Días",
      "Plan Financiero Infoproducto",
      "Plan Financiero E-commerce",
    ],
    badge: "Mayor profundidad",
  },
];
