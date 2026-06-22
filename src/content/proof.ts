import type { Testimonial, Metric, ProcessStep } from "./types";

/** PLACEHOLDER testimonials — replace with attributed quotes (photo + name + role + company + number). */
export const testimonials: Testimonial[] = [
  {
    id: "t1",
    quote: {
      es: "En una semana teníamos el agente de IA atendiendo a todos nuestros clientes. Bajamos el tiempo de respuesta de 4 horas a minutos.",
      en: "In a week we had the AI agent serving all our customers. We cut response time from 4 hours to minutes.",
    },
    author: "Nombre Apellido",
    role: { es: "CEO", en: "CEO" },
    company: "Empresa S.A.",
    metric: { es: "Respuesta: 15 min vs 4 h", en: "Response: 15 min vs 4 h" },
  },
  {
    id: "t2",
    quote: {
      es: "La web nueva no solo se ve increíble: duplicó las consultas en el primer mes.",
      en: "The new site doesn't just look incredible: it doubled inquiries in the first month.",
    },
    author: "Nombre Apellido",
    role: { es: "Directora de Marketing", en: "Head of Marketing" },
    company: "Marca",
    metric: { es: "+118% consultas", en: "+118% inquiries" },
  },
  {
    id: "t3",
    quote: {
      es: "Automatizaron procesos que nos comían días. Ahora corren solos sin errores.",
      en: "They automated processes that ate up days. Now they run on their own, error-free.",
    },
    author: "Nombre Apellido",
    role: { es: "Director de Operaciones", en: "COO" },
    company: "Compañía",
    metric: { es: "1.300+ horas ahorradas", en: "1,300+ hours saved" },
  },
];

export const metrics: Metric[] = [
  { value: "40+", label: { es: "Proyectos entregados", en: "Projects delivered" } },
  { value: "<7", label: { es: "Días de implementación", en: "Days to implement" } },
  { value: "98%", label: { es: "Clientes que repiten", en: "Returning clients" } },
  { value: "24/7", label: { es: "Sistemas funcionando", en: "Systems running" } },
];

/** Client logos — PLACEHOLDER names; swap for real SVGs (with permission). */
export const clientLogos: string[] = [
  "ACME",
  "NOVA",
  "VERTEX",
  "ORBIT",
  "PULSE",
  "FORGE",
];

export const processSteps: ProcessStep[] = [
  {
    index: 1,
    title: { es: "Llamada de diagnóstico", en: "Discovery call" },
    description: {
      es: "15 minutos para entender tu negocio y elegir el producto correcto.",
      en: "15 minutes to understand your business and pick the right product.",
    },
  },
  {
    index: 2,
    title: { es: "Personalización", en: "Tailoring" },
    description: {
      es: "Ajustamos parámetros, contenido y estética a tu medida.",
      en: "We adjust parameters, content and aesthetics to fit you.",
    },
  },
  {
    index: 3,
    title: { es: "Implementación", en: "Implementation" },
    description: {
      es: "Lo dejamos funcionando e integrado con tus herramientas.",
      en: "We ship it running and integrated with your tools.",
    },
  },
  {
    index: 4,
    title: { es: "Entrega y soporte", en: "Handover & support" },
    description: {
      es: "Capacitación, documentación y soporte. En menos de 7 días.",
      en: "Training, docs and support. In under 7 days.",
    },
  },
];
