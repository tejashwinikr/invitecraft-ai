export type Template = {
  id: string;
  name: string;
  category: string;
  bg: string;
  accent: string;
  fontFamily: "serif" | "sans" | "display";
  layout: "centered" | "left" | "framed" | "split" | "stacked" | "ornate" | "minimal" | "playful";
  emoji: string;
  description: string;
};

export const templates: Template[] = [
  {
    id: "birthday",
    name: "Birthday Bash",
    category: "Birthday",
    bg: "#fde6f1",
    accent: "#9b72cf",
    fontFamily: "display",
    layout: "centered",
    emoji: "🎂",
    description: "Playful confetti energy for milestone moments.",
  },
  {
    id: "wedding",
    name: "Wedding Elegance",
    category: "Wedding",
    bg: "#fbf3ee",
    accent: "#8c6a4d",
    fontFamily: "display",
    layout: "ornate",
    emoji: "💍",
    description: "Timeless typography framed in romantic detail.",
  },
  {
    id: "baby-shower",
    name: "Little One",
    category: "Baby Shower",
    bg: "#eaf3fb",
    accent: "#7aa7d6",
    fontFamily: "display",
    layout: "framed",
    emoji: "🍼",
    description: "Soft pastels for new arrivals.",
  },
  {
    id: "engagement",
    name: "Forever Yes",
    category: "Engagement",
    bg: "#f3e8ff",
    accent: "#7c3aed",
    fontFamily: "display",
    layout: "split",
    emoji: "💞",
    description: "Modern minimalist with a romantic edge.",
  },
  {
    id: "farewell",
    name: "Bon Voyage",
    category: "Farewell",
    bg: "#fff4e0",
    accent: "#c2782a",
    fontFamily: "sans",
    layout: "left",
    emoji: "✈️",
    description: "Warm send-off with editorial typography.",
  },
  {
    id: "graduation",
    name: "Cap & Gown",
    category: "Graduation",
    bg: "#0f1b3d",
    accent: "#f0d78c",
    fontFamily: "display",
    layout: "stacked",
    emoji: "🎓",
    description: "Sophisticated navy and gold.",
  },
  {
    id: "festival",
    name: "Festival of Lights",
    category: "Festival",
    bg: "#ffe4cc",
    accent: "#e84393",
    fontFamily: "display",
    layout: "playful",
    emoji: "🪔",
    description: "Vibrant warmth for cultural celebrations.",
  },
  {
    id: "party-night",
    name: "Party Night",
    category: "Party",
    bg: "#1a1033",
    accent: "#ff6bd6",
    fontFamily: "sans",
    layout: "minimal",
    emoji: "🪩",
    description: "Neon mood for after-dark gatherings.",
  },
];

export const getTemplate = (id: string) =>
  templates.find((t) => t.id === id) ?? templates[0];

export const fontStyleMap: Record<string, string> = {
  serif: "'Cormorant Garamond', serif",
  display: "'Cormorant Garamond', serif",
  sans: "'Karla', system-ui, sans-serif",
};
