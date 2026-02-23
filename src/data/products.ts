import { BookOpen, Calendar, Lightbulb, PieChart, FileSpreadsheet } from "lucide-react";
import React from "react";
import ebookCover from "@/assets/ebook-cover.jpg";
import workbookCover from "@/assets/workbook-cover.png";
import promptsCover from "@/assets/prompts-cover.png";
import dashboardCover from "@/assets/dashboard-cover.png";
import plannerCover from "@/assets/planner-cover.png";
import excelInfproducto from "@/assets/excel-infoproducto.png";
import excelEcomochilas from "@/assets/excel-ecomochilas.png";

export interface Product {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  longDescription: string;
  price: number;
  originalPrice?: number;
  image: string;
  type: "ebook" | "app" | "excel";
  iconName: "BookOpen" | "Calendar" | "Lightbulb" | "PieChart" | "FileSpreadsheet";
  featured?: boolean;
  offerEndDate?: string;
  benefits: string[];
  whatYouGet: string[];
}

export const ebookProduct: Product = {
  id: "ebook",
  title: "El Big Bang de los Negocios",
  subtitle: "Ebook Principal",
  description: "Guía práctica para transformar tus ideas en negocios rentables. 15 capítulos con metodología paso a paso.",
  longDescription: "El Big Bang de los Negocios es la guía definitiva para emprendedores que quieren pasar de la idea al negocio rentable. A lo largo de 15 capítulos, descubrirás una metodología probada que te llevará paso a paso desde la concepción de tu idea hasta la puesta en marcha de tu negocio. Escrito con un enfoque práctico y directo, sin teoría innecesaria.",
  originalPrice: 28.56,
  price: 19.99,
  image: ebookCover,
  type: "ebook",
  iconName: "BookOpen",
  featured: true,
  offerEndDate: "31/03",
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
};

export const products: Product[] = [
  {
    id: "bitacora",
    title: "La Bitácora del Capitán",
    subtitle: "Workbook Interactivo",
    description: "30 días para detonar tu mentalidad emprendedora. El cuaderno de trabajo oficial del ebook.",
    longDescription: "La Bitácora del Capitán es el compañero perfecto del ebook. Un workbook interactivo diseñado para 30 días de trabajo intensivo donde transformarás tu mentalidad emprendedora. Cada día incluye ejercicios prácticos, reflexiones guiadas y espacios para planificar tu próximo paso. No es solo un cuaderno: es tu hoja de ruta personal.",
    price: 19.99,
    image: workbookCover,
    type: "app",
    iconName: "Calendar",
    benefits: [
      "Programa estructurado de 30 días para desarrollar hábitos emprendedores",
      "Ejercicios diarios que transforman tu mentalidad de negocio",
      "Reflexiones guiadas para superar bloqueos y miedos",
      "Seguimiento de progreso con métricas claras",
      "Complemento perfecto del ebook para pasar a la acción",
      "Espacios de planificación semanal y mensual",
    ],
    whatYouGet: [
      "Workbook interactivo digital",
      "30 días de ejercicios estructurados",
      "Plantillas de reflexión y planificación",
      "Guía de uso paso a paso",
    ],
  },
  {
    id: "prompts",
    title: "La Guía de Prompts",
    subtitle: "Para Emprendedores",
    description: "Tu copiloto de IA para pasar de la lectura a la acción. Prompts optimizados para cada etapa.",
    longDescription: "La Guía de Prompts para Emprendedores es tu copiloto de inteligencia artificial. Contiene prompts cuidadosamente diseñados y optimizados para cada etapa del proceso emprendedor. Desde la ideación hasta el marketing, estos prompts te ayudarán a aprovechar al máximo herramientas de IA como ChatGPT para acelerar tu negocio.",
    price: 9.99,
    image: promptsCover,
    type: "app",
    iconName: "Lightbulb",
    benefits: [
      "Prompts optimizados para cada fase del emprendimiento",
      "Acelera tu productividad usando IA de forma estratégica",
      "Genera ideas de negocio, planes de marketing y copy en minutos",
      "Análisis de competencia automatizado con IA",
      "Plantillas de prompts reutilizables y personalizables",
      "Actualizaciones incluidas con nuevos prompts",
    ],
    whatYouGet: [
      "Guía digital con prompts organizados por categoría",
      "Prompts para ideación, validación, marketing y ventas",
      "Instrucciones de uso para cada prompt",
      "Acceso a futuras actualizaciones",
    ],
  },
  {
    id: "dashboard",
    title: "Dashboard Financiero",
    subtitle: "App Web",
    description: "Gestiona gastos fijos, ventas, inversiones y analiza tu rentabilidad en tiempo real.",
    longDescription: "El Dashboard Financiero es una aplicación web completa que te permite gestionar todos los aspectos financieros de tu negocio en un solo lugar. Controla gastos fijos, registra ventas, analiza inversiones y visualiza tu rentabilidad en tiempo real con gráficos intuitivos. Diseñado específicamente para emprendedores que necesitan claridad financiera sin complicaciones.",
    price: 27.99,
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
  },
  {
    id: "planner",
    title: "Planner de Ejecución 90 Días",
    subtitle: "App Web",
    description: "Transforma tu negocio en 90 días con un plan de ejecución estructurado y seguimiento.",
    longDescription: "El Planner de Ejecución 90 Días es tu herramienta para transformar la visión de tu negocio en resultados tangibles. Con un plan estructurado semana a semana, objetivos claros y un sistema de seguimiento integrado, este planner te mantiene enfocado y productivo durante los 90 días más importantes de tu emprendimiento.",
    price: 14.99,
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
  },
  {
    id: "excel-infoproducto",
    title: "Plan Financiero Infoproducto",
    subtitle: "Plantilla Excel",
    description: "Análisis de rentabilidad, punto muerto y márgenes comerciales para tu infoproducto.",
    longDescription: "La Plantilla de Plan Financiero para Infoproductos es una herramienta profesional en Excel que te permite analizar la viabilidad financiera de tu infoproducto antes de lanzarlo. Calcula tu punto muerto, márgenes comerciales, proyecciones de ventas y escenarios de rentabilidad con fórmulas automáticas y gráficos profesionales.",
    price: 15.99,
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
  },
  {
    id: "excel-ecomochilas",
    title: "Plan Financiero E-commerce",
    subtitle: "Plantilla Excel",
    description: "Inversión, amortización y análisis financiero completo para negocios de productos físicos.",
    longDescription: "La Plantilla de Plan Financiero para E-commerce es tu herramienta esencial para planificar las finanzas de un negocio de productos físicos. Incluye análisis de inversión inicial, amortización, costes de inventario, logística y un análisis financiero completo con proyecciones realistas para tu tienda online.",
    price: 15.99,
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
  },
];

export const allProducts: Product[] = [ebookProduct, ...products];

export const getProductById = (id: string) => allProducts.find((p) => p.id === id);
