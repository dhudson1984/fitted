export interface SurveyOption {
  icon: string;
  label: string;
  sub: string;
}

export interface SurveyStep {
  id: string;
  label: string;
  eyebrow: string;
  question: string;
  hint: string;
  type: "multi" | "single" | "palette" | "avoid" | "sizing" | "basics" | "brands" | "swipe" | "intro";
  conditional?: "work" | "weekend";
  options?: SurveyOption[];
}

export interface SurveySection {
  id: string;
  name: string;
  steps: SurveyStep[];
}

export interface PaletteItem {
  name: string;
  sub: string;
  swatches: string[];
}

export interface AvoidItem {
  label: string;
}

export interface SurveyState {
  current: number;
  visited: Set<number>;
  lifestyle: Set<string>;
  selections: Record<string, string | string[] | Record<string, string>>;
}

export const SECTIONS: SurveySection[] = [
  {
    id: "intro",
    name: "Get Started",
    steps: [
      {
        id: "intro-1",
        label: "Your details",
        eyebrow: "Welcome to Fitted",
        question: "First, let\u2019s get to know you.",
        hint: "We\u2019ll use this to personalise your experience.",
        type: "intro",
      },
    ],
  },
  {
    id: "lifestyle",
    name: "Your Lifestyle",
    steps: [
      {
        id: "lifestyle-1",
        label: "What you dress for",
        eyebrow: "Section 1 · Lifestyle",
        question: "What are you regularly dressing for?",
        hint: "Select all that apply — this shapes every look we build for you.",
        type: "multi",
        options: [
          { label: "Work", sub: "Professional settings" },
          { label: "Smart Casual", sub: "Weekends, brunch, errands" },
          { label: "Athletic & Outdoors", sub: "Gym, hikes, sport" },
          { label: "Night Out", sub: "Dinner, bars, events" },
        ],
      },
      {
        id: "lifestyle-2",
        label: "Work style",
        eyebrow: "Section 1 · Lifestyle",
        question: "How would you describe your work style?",
        hint: "",
        type: "single",
        conditional: "work",
        options: [
          { icon: "👔", label: "Polished & Formal", sub: "Suits, dress shirts" },
          { icon: "🧥", label: "Elevated Casual", sub: "Smart separates" },
          { icon: "👕", label: "Relaxed Professional", sub: "Clean, comfortable" },
        ],
      },
      {
        id: "lifestyle-3",
        label: "Weekend style",
        eyebrow: "Section 1 · Lifestyle",
        question: "And on weekends — what's your vibe?",
        hint: "",
        type: "single",
        conditional: "weekend",
        options: [
          { icon: "🏛️", label: "Timeless", sub: "Classic, enduring pieces" },
          { icon: "⚡", label: "Sharp", sub: "Intentional, put-together" },
          { icon: "🌿", label: "Effortless", sub: "Easy, low-maintenance" },
        ],
      },
      {
        id: "lifestyle-4",
        label: "Overall style",
        eyebrow: "Section 1 · Lifestyle",
        question: "How do you describe your style overall?",
        hint: "Pick the one that feels most like you right now.",
        type: "single",
        options: [
          { label: "Classic & Clean", sub: "Timeless, refined basics" },
          { label: "Relaxed & Casual", sub: "Comfort-forward, laid-back" },
          { label: "Sharp & Polished", sub: "Crisp, intentional" },
          { label: "Streetwear Influenced", sub: "Urban, graphic-forward" },
        ],
      },
    ],
  },
  {
    id: "colors",
    name: "Your Colors",
    steps: [
      {
        id: "colors-1",
        label: "Color palettes",
        eyebrow: "Section 2 · Colors",
        question: "Which color palettes speak to you?",
        hint: "Select all that feel right — we'll mix them thoughtfully.",
        type: "palette",
      },
    ],
  },
  {
    id: "avoid",
    name: "Pieces to Avoid",
    steps: [
      {
        id: "avoid-1",
        label: "What to skip",
        eyebrow: "Section 3 · Avoid",
        question: "Anything we should never suggest?",
        hint: "Select pieces you'd rather not see in your recommendations.",
        type: "avoid",
      },
    ],
  },
  {
    id: "sizing",
    name: "Fit & Sizing",
    steps: [
      {
        id: "sizing-1",
        label: "Your body",
        eyebrow: "Section 4 · Sizing",
        question: "Tell us about your build.",
        hint: "This helps us find pieces that fit right, not just look good on a hanger.",
        type: "sizing",
      },
    ],
  },
  {
    id: "basics",
    name: "The Basics",
    steps: [
      {
        id: "basics-1",
        label: "Age & budget",
        eyebrow: "Section 5 · Basics",
        question: "A couple of quick ones.",
        hint: "",
        type: "basics",
      },
    ],
  },
  {
    id: "inspiration",
    name: "Inspiration",
    steps: [
      {
        id: "inspo-1",
        label: "Brands you love",
        eyebrow: "Section 6 · Inspiration",
        question: "Any brands you're already a fan of?",
        hint: "Type them in or pick from the list below. We'll pull from these first.",
        type: "brands",
      },
      {
        id: "inspo-2",
        label: "Rate some looks",
        eyebrow: "Section 6 · Inspiration",
        question: "Quick reactions — like or pass?",
        hint: "Don't overthink it. Your gut says more than you think.",
        type: "swipe",
      },
    ],
  },
];

export const PALETTES: PaletteItem[] = [
  { name: "Versatile Neutrals", sub: "Greys, whites, blacks", swatches: ["#2C2C2A", "#7A7268", "#C4B89A", "#F5F0E8"] },
  { name: "Earth Tones", sub: "Browns, tans, terracotta", swatches: ["#5C3D2E", "#8B6914", "#C4A265", "#E8D5B0"] },
  { name: "True Blues", sub: "Navy, slate, sky", swatches: ["#1A2744", "#2E4A7A", "#5B7FA6", "#B8CCE0"] },
  { name: "Natural Greens", sub: "Olive, sage, moss", swatches: ["#2A3020", "#4A5C38", "#7A8C60", "#B8C4A0"] },
  { name: "Understated Basics", sub: "Cream, oat, warm white", swatches: ["#EAD9C0", "#D4BF9C", "#BEA47C", "#A08560"] },
];

export const AVOID_ITEMS: AvoidItem[] = [
  { label: "Neckwear" },
  { label: "Hats" },
  { label: "Sunglasses" },
  { label: "Watches" },
  { label: "Bags" },
  { label: "Scarves" },
  { label: "Shorts" },
  { label: "Boots" },
  { label: "High-tops" },
  { label: "Graphic Tees" },
  { label: "Bold Prints" },
  { label: "Cargo Pants" },
];

export const BRAND_SUGGESTIONS = [
  "Faherty", "Vuori", "Bonobos", "Todd Snyder", "Everlane", "J.Crew",
  "Banana Republic", "Reigning Champ", "Club Monaco", "Buck Mason", "Veja", "Common Projects",
];

export const SWIPE_LOOKS = [
  { id: "sw1", name: "Earthy Layers", gradient: "linear-gradient(165deg,#8B7355 0%,#5C4A32 30%,#2C2416 100%)" },
  { id: "sw2", name: "Clean Athleisure", gradient: "linear-gradient(165deg,#4A5E4A 0%,#2E3D2E 40%,#1A2318 100%)" },
  { id: "sw3", name: "Night Sharp", gradient: "linear-gradient(165deg,#5C5A6E 0%,#3A3848 40%,#1E1C28 100%)" },
  { id: "sw4", name: "Summer Casual", gradient: "linear-gradient(165deg,#6E4E3A 0%,#4A3226 40%,#221815 100%)" },
];

export function getActiveSteps(lifestyle: Set<string>) {
  const steps: (SurveyStep & { sectionId: string; sectionName: string })[] = [];
  SECTIONS.forEach((sec) => {
    sec.steps.forEach((step) => {
      if (step.conditional === "work" && !lifestyle.has("Work")) return;
      if (
        step.conditional === "weekend" &&
        !["Smart Casual", "Athletic & Outdoors", "Night Out"].some((v) => lifestyle.has(v))
      )
        return;
      steps.push({ ...step, sectionId: sec.id, sectionName: sec.name });
    });
  });
  return steps;
}
