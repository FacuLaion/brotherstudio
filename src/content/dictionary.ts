import type { Locale } from "@/lib/i18n";

/**
 * UI copy dictionary. Every visible non-data string lives here in ES + EN.
 * Section/product/project data live in their own typed modules.
 */
export interface Dictionary {
  meta: { title: string; description: string };
  nav: {
    manifesto: string;
    services: string;
    work: string;
    products: string;
    proof: string;
    contact: string;
    bookCall: string;
  };
  gesture: {
    enable: string;
    disable: string;
    experimental: string;
    privacy: string;
    title: string;
    loading: string;
    showHand: string;
    detected: string;
    hint: string;
    denied: string;
    unsupported: string;
  };
  hero: {
    kicker: string;
    headline: string;
    sub: string;
    ctaPrimary: string;
    ctaSecondary: string;
    scrollHint: string;
  };
  manifesto: { kicker: string; lines: string[]; tags: string[] };
  services: { kicker: string; title: string; sub: string };
  work: { kicker: string; title: string; sub: string; viewCase: string };
  products: {
    kicker: string;
    title: string;
    sub: string;
    popular: string;
    from: string;
    turnaroundLabel: string;
    includes: string;
    ctaBuyPrefix: string;
    ctaCall: string;
    note: string;
  };
  process: { kicker: string; title: string; sub: string };
  proof: { kicker: string; title: string; sub: string; guarantee: string };
  contact: {
    kicker: string;
    title: string;
    sub: string;
    cta: string;
    or: string;
    email: string;
  };
  footer: {
    tagline: string;
    nav: string;
    language: string;
    privacy: string;
    terms: string;
    rights: string;
    builtWith: string;
  };
}

const es: Dictionary = {
  meta: {
    title: "Brother Studios — Desarrollo web inmersivo + IA y automatización",
    description:
      "Estudio de desarrollo web, IA y automatización para empresas. Productos listos, personalizados a tu negocio e implementados en menos de 7 días.",
  },
  nav: {
    manifesto: "Manifiesto",
    services: "Servicios",
    work: "Proyectos",
    products: "Productos",
    proof: "Confianza",
    contact: "Contacto",
    bookCall: "Agendar llamada",
  },
  gesture: {
    enable: "Modo inmersivo",
    disable: "Salir del modo inmersivo",
    experimental: "experimental",
    privacy: "El video nunca sale de tu navegador.",
    title: "Modo inmersivo",
    loading: "Cargando modelos…",
    showHand: "Mostrá tu mano a la cámara",
    detected: "Mano detectada",
    hint: "✊ Pellizcá (pulgar + índice) y arrastrá ↑/↓ · soltá para fijar · mové la cabeza para mirar",
    denied: "Necesitamos permiso de cámara para esto.",
    unsupported: "Tu dispositivo no soporta este modo.",
  },
  hero: {
    kicker: "Desarrollo web · IA · Automatización",
    headline: "Software que impresiona y trabaja solo.",
    sub: "Construimos experiencias web inmersivas y soluciones de IA y automatización a medida para empresas. Productos probados, ajustados a tu negocio y funcionando en menos de 7 días.",
    ctaPrimary: "Ver lo que hacemos",
    ctaSecondary: "Agendar llamada",
    scrollHint: "Desplazá para entrar",
  },
  manifesto: {
    kicker: "Manifiesto",
    lines: [
      "No hacemos páginas. Construimos experiencias que la gente recuerda y sistemas que tu empresa siente.",
      "Tomamos un producto probado, lo personalizamos a tu medida y lo dejamos funcionando. Profundidad y movimiento como herramienta, no como decoración.",
    ],
    tags: ["WebGL & 3D", "Agentes de IA", "Automatización", "UX estratégica"],
  },
  services: {
    kicker: "Qué hacemos",
    title: "Una sola casa para tu producto digital.",
    sub: "Diseño, ingeniería e inteligencia: medimos todo por el resultado de tu negocio, no por la tecnología.",
  },
  work: {
    kicker: "Proyectos",
    title: "Trabajo que habla por sí solo.",
    sub: "Un recorrido por lo que construimos para nuestros clientes.",
    viewCase: "Ver caso",
  },
  products: {
    kicker: "Productos enlatados",
    title: "Listos para arrancar. Tuyos en menos de 7 días.",
    sub: "Soluciones probadas que personalizamos a tu negocio: ajustamos parámetros, contenido y estética, y quedan implementadas y funcionando.",
    popular: "Más elegido",
    from: "Desde",
    turnaroundLabel: "Implementación",
    includes: "Incluye",
    ctaBuyPrefix: "Quiero",
    ctaCall: "Agendar llamada",
    note: "Precios de referencia. Ajustamos el alcance a tu caso en una llamada de 30 min sin compromiso.",
  },
  process: {
    kicker: "Cómo funciona",
    title: "De la llamada a producción en una semana.",
    sub: "Un proceso simple, transparente y con plazos reales.",
  },
  proof: {
    kicker: "Confianza",
    title: "Resultados, no promesas.",
    sub: "Empresas que ya confían en nosotros y los números que lo respaldan.",
    guarantee: "Entrega a tiempo o te devolvemos el dinero. Sin compromiso, sin presión de venta.",
  },
  contact: {
    kicker: "Contacto",
    title: "¿En qué te podemos ayudar?",
    sub: "Agendá una llamada de 30 minutos y resolvemos tus dudas sobre el producto, el alcance y los tiempos.",
    cta: "Agendar mi llamada",
    or: "o escribinos a",
    email: "Escribinos",
  },
  footer: {
    tagline: "Desarrollo web inmersivo, IA y automatización para empresas.",
    nav: "Navegación",
    language: "Idioma",
    privacy: "Privacidad",
    terms: "Términos",
    rights: "Todos los derechos reservados.",
    builtWith: "Hecho con obsesión por el detalle.",
  },
};

const en: Dictionary = {
  meta: {
    title: "Brother Studios — Immersive web development + AI & automation",
    description:
      "Web development, AI and automation studio for companies. Ready-made products, tailored to your business and live in under 7 days.",
  },
  nav: {
    manifesto: "Manifesto",
    services: "Services",
    work: "Work",
    products: "Products",
    proof: "Trust",
    contact: "Contact",
    bookCall: "Book a call",
  },
  gesture: {
    enable: "Immersive mode",
    disable: "Exit immersive mode",
    experimental: "experimental",
    privacy: "Video never leaves your browser.",
    title: "Immersive mode",
    loading: "Loading models…",
    showHand: "Show your hand to the camera",
    detected: "Hand detected",
    hint: "✊ Pinch (thumb + index) and drag ↑/↓ · release to lock · move your head to look",
    denied: "We need camera permission for this.",
    unsupported: "Your device doesn't support this mode.",
  },
  hero: {
    kicker: "Web development · AI · Automation",
    headline: "Software that stuns — and runs itself.",
    sub: "We build immersive web experiences and custom AI & automation for companies. Proven products, tailored to your business and live in under 7 days.",
    ctaPrimary: "See what we do",
    ctaSecondary: "Book a call",
    scrollHint: "Scroll to enter",
  },
  manifesto: {
    kicker: "Manifesto",
    lines: [
      "We don't build pages. We build experiences people remember and systems your company feels.",
      "We take a proven product, tailor it to you and ship it running. Depth and motion as a tool, not decoration.",
    ],
    tags: ["WebGL & 3D", "AI agents", "Automation", "Strategic UX"],
  },
  services: {
    kicker: "What we do",
    title: "One home for your digital product.",
    sub: "Design, engineering and intelligence: we measure everything by your business outcome, not the technology.",
  },
  work: {
    kicker: "Work",
    title: "Work that speaks for itself.",
    sub: "A journey through what we've built for our clients.",
    viewCase: "View case",
  },
  products: {
    kicker: "Ready-made products",
    title: "Ready to launch. Yours in under 7 days.",
    sub: "Proven solutions we tailor to your business: we adjust parameters, content and aesthetics, and ship them implemented and running.",
    popular: "Most chosen",
    from: "From",
    turnaroundLabel: "Implementation",
    includes: "Includes",
    ctaBuyPrefix: "I want",
    ctaCall: "Book a call",
    note: "Reference pricing. We scope your exact case in a free 30-min call.",
  },
  process: {
    kicker: "How it works",
    title: "From call to production in a week.",
    sub: "A simple, transparent process with real timelines.",
  },
  proof: {
    kicker: "Trust",
    title: "Results, not promises.",
    sub: "Companies that already trust us and the numbers behind it.",
    guarantee: "On-time delivery or your money back. No commitment, no sales pressure.",
  },
  contact: {
    kicker: "Contact",
    title: "How can we help you?",
    sub: "Book a 30-minute call and we'll clear up your questions about the product, scope and timelines.",
    cta: "Book my call",
    or: "or email us at",
    email: "Email us",
  },
  footer: {
    tagline: "Immersive web development, AI and automation for companies.",
    nav: "Navigation",
    language: "Language",
    privacy: "Privacy",
    terms: "Terms",
    rights: "All rights reserved.",
    builtWith: "Built with obsessive attention to detail.",
  },
};

const dictionaries: Record<Locale, Dictionary> = { es, en };

export function getDictionary(lang: Locale): Dictionary {
  return dictionaries[lang];
}
