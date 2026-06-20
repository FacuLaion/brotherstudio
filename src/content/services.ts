import type { Service } from "./types";

export const services: Service[] = [
  {
    id: "web",
    index: 1,
    title: { es: "Desarrollo web a medida", en: "Custom web development" },
    outcome: {
      es: "Sitios y apps rápidas que convierten visitas en clientes.",
      en: "Fast sites and apps that turn visits into customers.",
    },
    bullets: {
      es: ["Next.js + diseño premium", "SEO y performance reales", "Editable por tu equipo"],
      en: ["Next.js + premium design", "Real SEO & performance", "Editable by your team"],
    },
  },
  {
    id: "immersive",
    index: 2,
    title: { es: "Experiencias inmersivas 3D", en: "Immersive 3D experiences" },
    outcome: {
      es: "Webs con WebGL que detienen la mirada y se recuerdan.",
      en: "WebGL sites that stop the scroll and stick.",
    },
    bullets: {
      es: ["Escenas 3D en tiempo real", "Scroll cinematográfico", "Optimizado para móvil"],
      en: ["Real-time 3D scenes", "Cinematic scroll", "Mobile-optimized"],
    },
  },
  {
    id: "ai",
    index: 3,
    title: { es: "Soluciones de IA", en: "AI solutions" },
    outcome: {
      es: "Agentes que atienden, venden y responden 24/7 por vos.",
      en: "Agents that support, sell and answer 24/7 for you.",
    },
    bullets: {
      es: ["Chat y voz entrenados con tu negocio", "Integrados a WhatsApp y web", "Con datos tuyos (RAG)"],
      en: ["Chat & voice trained on your business", "Integrated with WhatsApp & web", "Grounded in your data (RAG)"],
    },
  },
  {
    id: "automation",
    index: 4,
    title: { es: "Automatización de procesos", en: "Process automation" },
    outcome: {
      es: "Conectamos tus herramientas y eliminamos el trabajo manual.",
      en: "We connect your tools and kill the manual work.",
    },
    bullets: {
      es: ["Flujos n8n / Make a medida", "CRM, email, facturación, datos", "Menos errores, más horas"],
      en: ["Custom n8n / Make flows", "CRM, email, billing, data", "Fewer errors, more hours"],
    },
  },
];
