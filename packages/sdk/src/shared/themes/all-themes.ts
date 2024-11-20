import type { Theme } from "../theme";

export const themes: Theme[] = [
  {
    id: "clarity",
    name: "Clarity",
    tags: ["modern", "professional", "minimal", "tech", "light", "corporate", "flat"],
    description: "Clean and focused design with confident, purposeful elements",

    colors: {
      primary: "#2563eb",
      secondary: "#3b82f6",
      accent: "#f59e0b",
      neutral: "#64748b",
    },
    typography: { base: 16, heading: "neo-grotesque", body: "system-ui" },
  },
  {
    id: "vivid",
    name: "Vivid",
    tags: ["bold", "energetic", "vibrant", "creative", "modern", "gradient", "startup"],
    description: "Bold and expressive design with dynamic color combinations",

    colors: {
      primary: "#8b5cf6",
      secondary: "#ec4899",
      accent: "#f43f5e",
      neutral: "#71717a",
    },
    typography: { base: 18, heading: "transitional", body: "geometric-humanist" },
    customFonts: [
      {
        name: "ClashDisplay",
        src: "https://fonts.cdnfonts.com/css/clash-display",
        weight: "700",
        display: "swap",
      },
    ],
  },
  {
    id: "serene",
    name: "Serene",
    description: "Balanced and harmonious design with natural undertones",
    tags: ["organic", "calm", "earthy", "healthcare", "light", "wellness", "minimal"],

    colors: {
      primary: "#059669",
      secondary: "#10b981",

      accent: "#f59e0b",
      neutral: "#6b7280",
    },
    typography: { base: 16, heading: "humanist", body: "humanist" },
  },
  {
    id: "authority",
    name: "Authority",
    description: "Strong and reliable design with established presence",
    tags: ["professional", "corporate", "serious", "dark", "finance", "classic", "business"],

    colors: {
      primary: "#1e40af",
      secondary: "#0369a1",

      accent: "#b91c1c",
      neutral: "#4b5563",
    },
    typography: { base: 16, heading: "classical-humanist", body: "transitional" },
  },
  {
    id: "prestige",
    name: "Prestige",
    description: "Refined and sophisticated design with subtle luxury",
    tags: ["luxury", "elegant", "dark", "fashion", "professional", "premium", "minimal"],

    colors: {
      primary: "#18181b",
      secondary: "#27272a",

      accent: "#c2855a",
      neutral: "#71717a",
    },
    typography: { base: 16, heading: "didone", body: "transitional" },
  },
  {
    id: "momentum",
    name: "Momentum",
    description: "Dynamic and progressive design with forward movement",
    tags: ["modern", "energetic", "vibrant", "startup", "tech", "gradient", "bold"],

    // Former "Startup Fresh" theme - rest remains the same

    colors: {
      primary: "#7c3aed",
      secondary: "#2dd4bf",

      accent: "#f43f5e",
      neutral: "#6b7280",
    },
    typography: { base: 16, heading: "geometric-humanist", body: "neo-grotesque" },
  },
  {
    id: "tranquil",
    name: "Tranquil",
    description: "Peaceful and balanced design with gentle flow",
    tags: ["calm", "minimal", "light", "wellness", "healthcare", "professional", "clean"],

    colors: {
      primary: "#0891b2",
      secondary: "#14b8a6",

      accent: "#f97316",
      neutral: "#78716c",
    },
    typography: { base: 16, heading: "humanist", body: "geometric-humanist" },
  },
  {
    id: "wisdom",
    name: "Wisdom",
    description: "Engaging and insightful design with clear hierarchy",
    tags: ["professional", "education", "modern", "light", "clean", "minimal", "academic"],

    colors: {
      primary: "#3b82f6",
      secondary: "#6366f1",

      accent: "#22c55e",
      neutral: "#6b7280",
    },
    typography: { base: 16, heading: "geometric-humanist", body: "system-ui" },
  },
  {
    id: "warmth",
    name: "Warmth",
    description: "Rich and welcoming design with comfortable presence",
    tags: ["organic", "friendly", "earthy", "hospitality", "welcoming", "restaurant", "warm"],

    colors: {
      primary: "#b91c1c",
      secondary: "#c2855a",

      accent: "#059669",
      neutral: "#78716c",
    },
    typography: { base: 18, heading: "transitional", body: "humanist" },
    customFonts: [
      {
        name: "Cormorant Garamond",
        src: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600&display=swap",
        weight: "600",
        display: "swap",
      },
    ],
  },
  {
    id: "trust",
    name: "Trust",
    description: "Stable and confident design with professional appeal",
    tags: ["corporate", "professional", "serious", "finance", "business", "classic", "reliable"],

    colors: {
      primary: "#0c4a6e",
      secondary: "#475569",

      accent: "#84cc16",
      neutral: "#64748b",
    },
    typography: { base: 16, heading: "classical-humanist", body: "system-ui" },
  },
  {
    id: "energy",
    name: "Energy",
    description: "Bold and dynamic design with vibrant intensity",
    tags: ["bold", "vibrant", "modern", "startup", "tech", "gradient", "dynamic"],

    colors: {
      primary: "#6d28d9",
      secondary: "#22d3ee",

      accent: "#dc2626",
      neutral: "#1f2937",
    },
    typography: { base: 16, heading: "neo-grotesque", body: "geometric-humanist" },
  },
  {
    id: "elegance",
    name: "Elegance",
    description: "Graceful and refined design with subtle sophistication",
    tags: ["luxury", "elegant", "fashion", "premium", "sophisticated", "modern", "refined"],

    colors: {
      primary: "#831843",
      secondary: "#581c87",

      accent: "#ca8a04",
      neutral: "#404040",
    },
    typography: { base: 16, heading: "didone", body: "transitional" },
  },
  {
    id: "playful",
    name: "Playful",
    description: "Cheerful and lively design with joyful spirit",
    tags: ["friendly", "creative", "vibrant", "education", "startup", "modern", "fun"],

    colors: {
      primary: "#f97316",
      secondary: "#4ade80",

      accent: "#f43f5e",
      neutral: "#737373",
    },
    typography: { base: 16, heading: "rounded-sans", body: "geometric-humanist" },
  },
  {
    id: "pulse",
    name: "Pulse",
    description: "Rhythmic and engaging design with dynamic flow",
    tags: ["dynamic", "modern", "creative", "tech", "startup", "vibrant", "bold"],

    colors: {
      primary: "#7e22ce",
      secondary: "#f43f5e",

      accent: "#eab308",
      neutral: "#525252",
    },
    typography: { base: 16, heading: "neo-grotesque", body: "system-ui" },
  },
  {
    id: "clarity-plus",
    name: "Clarity Plus",
    description: "Precise and reassuring design with professional confidence",
    tags: ["professional", "clean", "modern", "tech", "corporate", "minimal", "precise"],

    colors: {
      primary: "#0891b2",
      secondary: "#0284c7",

      accent: "#6366f1",
      neutral: "#4b5563",
    },
    typography: { base: 16, heading: "humanist", body: "system-ui" },
  },
  {
    id: "elevate",
    name: "Elevate",
    description: "Bold and optimistic design for ambitious startups",
    tags: ["startup", "modern", "bold", "professional", "tech", "energetic", "ambitious"],

    colors: {
      primary: "#6366f1", // Vibrant indigo
      secondary: "#818cf8", // Lighter indigo
      // Soft indigo
      accent: "#f43f5e", // Action red
      neutral: "#64748b", // Business grey
    },
    typography: {
      base: 16,
      heading: "geometric-humanist",
      body: "neo-grotesque",
    },
    customFonts: [
      {
        name: "GeneralSans",
        src: "https://fonts.googleapis.com/css2?family=GeneralSans:wght@600&display=swap",
        weight: "600",
        display: "swap",
      },
    ],
  },
  {
    id: "scale",
    name: "Scale",
    description: "Growth-focused design with data-friendly aesthetics",
    tags: ["professional", "data", "tech", "growth", "clean", "modern", "analytical"],

    colors: {
      primary: "#0f766e", // Deep teal
      secondary: "#14b8a6", // Bright teal
      // Light teal
      accent: "#f59e0b", // Attention orange
      neutral: "#4b5563", // Professional grey
    },
    typography: {
      base: 16,
      heading: "neo-grotesque",
      body: "system-ui",
    },
  },
  {
    id: "vertex",
    name: "Vertex",
    description: "Sharp, decisive design for tech innovators",
    tags: ["tech", "professional", "modern", "bold", "innovative", "sharp", "decisive"],

    colors: {
      primary: "#1e293b", // Deep blue-grey
      secondary: "#334155", // Medium blue-grey
      // Light blue-grey
      accent: "#06b6d4", // Electric cyan
      neutral: "#94a3b8", // Soft grey
    },
    typography: {
      base: 16,
      heading: "industrial",
      body: "geometric-humanist",
    },
  },
  {
    id: "launch",
    name: "Launch",
    description: "High-energy design for product launches",
    tags: ["startup", "energetic", "dynamic", "modern", "bold", "tech", "vibrant"],

    colors: {
      primary: "#4f46e5", // Electric indigo
      secondary: "#6366f1", // Bright indigo
      // Light indigo
      accent: "#22c55e", // Success green
      neutral: "#6b7280", // Balanced grey
    },
    typography: {
      base: 16,
      heading: "neo-grotesque",
      body: "system-ui",
    },
    customFonts: [
      {
        name: "Switzer",
        src: "https://fonts.googleapis.com/css2?family=Switzer:wght@700&display=swap",
        weight: "700",
        display: "swap",
      },
    ],
  },
  {
    id: "pulse-pro",
    name: "Pulse Pro",
    description: "Dynamic design for SaaS and analytics platforms",
    tags: ["tech", "analytics", "professional", "modern", "dynamic", "data", "saas"],

    colors: {
      primary: "#2e1065", // Deep purple
      secondary: "#4c1d95", // Rich purple
      // Bright purple
      accent: "#10b981", // Action green
      neutral: "#4b5563", // Dark grey
    },
    typography: {
      base: 16,
      heading: "geometric-humanist",
      body: "neo-grotesque",
    },
  },
  {
    id: "horizon",
    name: "Horizon",
    description: "Forward-looking design for innovative platforms",
    tags: ["innovative", "modern", "tech", "professional", "forward", "clean", "bold"],

    colors: {
      primary: "#0c4a6e", // Deep blue
      secondary: "#0369a1", // Ocean blue
      // Bright blue
      accent: "#ec4899", // Vibrant pink
      neutral: "#64748b", // Slate grey
    },
    typography: {
      base: 16,
      heading: "neo-grotesque",
      body: "system-ui",
    },
  },
  {
    id: "nexus",
    name: "Nexus",
    description: "Connected design for platform startups",
    tags: ["tech", "startup", "modern", "professional", "connected", "dark", "sleek"],

    colors: {
      primary: "#18181b", // Rich black
      secondary: "#27272a", // Soft black
      // Dark grey
      accent: "#3b82f6", // Connection blue
      neutral: "#52525b", // Balanced grey
    },
    typography: {
      base: 16,
      heading: "geometric-humanist",
      body: "neo-grotesque",
    },
  },
  {
    id: "spark",
    name: "Spark",
    description: "Creative design for innovative solutions",
    tags: ["creative", "modern", "innovative", "vibrant", "dynamic", "bold", "tech"],

    colors: {
      primary: "#db2777", // Vibrant pink
      secondary: "#ec4899", // Light pink
      // Soft pink
      accent: "#0ea5e9", // Electric blue
      neutral: "#6b7280", // Cool grey
    },
    typography: {
      base: 16,
      heading: "industrial",
      body: "geometric-humanist",
    },
  },
  {
    id: "fusion",
    name: "Fusion",
    description: "Seamless design for integrated platforms",
    tags: ["tech", "modern", "integrated", "professional", "clean", "sophisticated", "seamless"],

    colors: {
      primary: "#7c3aed", // Deep purple
      secondary: "#8b5cf6", // Medium purple
      // Light purple
      accent: "#f59e0b", // Warm yellow
      neutral: "#71717a", // Zinc grey
    },
    typography: {
      base: 16,
      heading: "neo-grotesque",
      body: "system-ui",
    },
    customFonts: [
      {
        name: "Aspekta",
        src: "https://fonts.googleapis.com/css2?family=Aspekta:wght@700&display=swap",
        weight: "700",
        display: "swap",
      },
    ],
  },
  {
    id: "metric",
    name: "Metric",
    description: "Data-driven design for analytics startups",
    tags: ["data", "analytics", "tech", "professional", "precise", "modern", "structured"],

    colors: {
      primary: "#0f172a", // Deep navy
      secondary: "#1e293b", // Dark blue
      // Slate blue
      accent: "#22c55e", // Success green
      neutral: "#475569", // Slate
    },
    typography: {
      base: 16,
      heading: "monospace-code",
      body: "neo-grotesque",
    },
  },
  {
    id: "radius",
    name: "Radius",
    description: "Approachable design for community platforms",
    tags: ["community", "friendly", "modern", "approachable", "clean", "professional", "social"],

    colors: {
      primary: "#0284c7", // Bright blue
      secondary: "#0ea5e9", // Light blue
      // Sky blue
      accent: "#f43f5e", // Coral red
      neutral: "#94a3b8", // Cool grey
    },
    typography: {
      base: 16,
      heading: "rounded-sans",
      body: "geometric-humanist",
    },
  },
  {
    id: "swift",
    name: "Swift",
    description: "High-performance design for tech products",
    tags: ["tech", "performance", "modern", "professional", "dark", "sleek", "powerful"],

    colors: {
      primary: "#020617", // Deep space
      secondary: "#0f172a", // Dark blue
      // Navy
      accent: "#10b981", // Speed green
      neutral: "#334155", // Slate
    },
    typography: {
      base: 16,
      heading: "industrial",
      body: "neo-grotesque",
    },
  },
  {
    id: "accelerate",
    name: "Accelerate",
    description: "High-velocity design for fast-growing startups",
    tags: ["startup", "tech", "modern", "dynamic", "professional", "bold", "energetic"],

    colors: {
      primary: "#3b82f6", // Action blue
      secondary: "#60a5fa", // Light blue
      // Soft blue
      accent: "#f43f5e", // Conversion red
      neutral: "#475569", // Professional slate
    },
    typography: {
      base: 16,
      heading: "geometric-humanist",
      body: "neo-grotesque",
    },
    customFonts: [
      {
        name: "Geist",
        src: "https://fonts.googleapis.com/css2?family=Geist:wght@600&display=swap",
        weight: "600",
        display: "swap",
      },
    ],
  },
  {
    id: "nucleus-pro",
    name: "Nucleus Pro",
    description: "Core-focused design for enterprise solutions",
    tags: ["tech", "corporate", "professional", "modern", "clean", "enterprise", "focused"],

    colors: {
      primary: "#1e40af", // Deep blue
      secondary: "#2563eb", // Royal blue
      // Bright blue
      accent: "#22c55e", // Success green
      neutral: "#64748b", // Business grey
    },
    typography: {
      base: 16,
      heading: "neo-grotesque",
      body: "system-ui",
    },
  },
  {
    id: "quantum-edge",
    name: "Quantum Edge",
    description: "Cutting-edge design for AI/ML startups",
    tags: ["tech", "ai", "modern", "dark", "futuristic", "innovative", "cutting-edge"],

    colors: {
      primary: "#18181b", // Deep black
      secondary: "#27272a", // Rich black
      // Dark grey
      accent: "#06b6d4", // Tech cyan
      neutral: "#52525b", // Modern grey
    },
    typography: {
      base: 16,
      heading: "monospace-code",
      body: "neo-grotesque",
    },
  },
  {
    id: "synapse",
    name: "Synapse",
    description: "Neural network-inspired design for tech innovators",
    tags: ["tech", "ai", "modern", "bold", "innovative", "dynamic", "scientific"],

    colors: {
      primary: "#4c1d95", // Deep purple
      secondary: "#6d28d9", // Rich purple
      // Bright purple
      accent: "#2dd4bf", // Electric teal
      neutral: "#6b7280", // Cool grey
    },
    typography: {
      base: 16,
      heading: "industrial",
      body: "geometric-humanist",
    },
  },
  {
    id: "helios",
    name: "Helios",
    description: "Bright, energetic design for breakthrough products",
    tags: ["energetic", "bright", "modern", "tech", "professional", "bold", "dynamic"],

    colors: {
      primary: "#0369a1", // Ocean blue
      secondary: "#0891b2", // Bright blue
      // Cyan
      accent: "#eab308", // Sunny yellow
      neutral: "#94a3b8", // Light slate
    },
    typography: {
      base: 16,
      heading: "geometric-humanist",
      body: "system-ui",
    },
  },
  {
    id: "vault",
    name: "Vault",
    description: "Secure, trustworthy design for fintech",
    tags: ["fintech", "corporate", "professional", "secure", "trustworthy", "serious", "business"],

    colors: {
      primary: "#0f172a", // Deep navy
      secondary: "#1e293b", // Dark blue
      // Slate
      accent: "#059669", // Trust green
      neutral: "#475569", // Professional grey
    },
    typography: {
      base: 16,
      heading: "classical-humanist",
      body: "transitional",
    },
  },
  {
    id: "covalent",
    name: "Covalent",
    description: "Connected design for collaboration platforms",
    tags: ["collaboration", "modern", "tech", "professional", "connected", "clean", "startup"],

    colors: {
      primary: "#7c3aed", // Vibrant purple
      secondary: "#8b5cf6", // Light purple
      // Soft purple
      accent: "#14b8a6", // Fresh teal
      neutral: "#71717a", // Modern grey
    },
    typography: {
      base: 16,
      heading: "neo-grotesque",
      body: "geometric-humanist",
    },
    customFonts: [
      {
        name: "Plus Jakarta Sans",
        src: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700&display=swap",
        weight: "700",
        display: "swap",
      },
    ],
  },
  {
    id: "prime",
    name: "Prime",
    description: "Premium design for high-end B2B solutions",
    tags: ["corporate", "premium", "business", "professional", "elegant", "serious", "enterprise"],

    colors: {
      primary: "#0c4a6e", // Deep blue
      secondary: "#075985", // Rich blue
      // Ocean blue
      accent: "#ca8a04", // Premium gold
      neutral: "#64748b", // Corporate grey
    },
    typography: {
      base: 16,
      heading: "transitional",
      body: "system-ui",
    },
  },
  {
    id: "flux",
    name: "Flux",
    description: "Adaptive design for transformative platforms",
    tags: ["dynamic", "modern", "tech", "startup", "bold", "innovative", "energetic"],

    colors: {
      primary: "#581c87", // Deep purple
      secondary: "#7e22ce", // Rich purple
      // Bright purple
      accent: "#f59e0b", // Energy orange
      neutral: "#6b7280", // Balance grey
    },
    typography: {
      base: 16,
      heading: "geometric-humanist",
      body: "neo-grotesque",
    },
  },
  {
    id: "beacon",
    name: "Beacon",
    description: "Clear, guiding design for analytics platforms",
    tags: ["analytics", "tech", "professional", "data", "clean", "precise", "modern"],

    colors: {
      primary: "#0f766e", // Deep teal
      secondary: "#0d9488", // Rich teal
      // Bright teal
      accent: "#f43f5e", // Signal red
      neutral: "#4b5563", // Data grey
    },
    typography: {
      base: 16,
      heading: "monospace-code",
      body: "system-ui",
    },
  },
  {
    id: "apex",
    name: "Apex",
    description: "Peak performance design for optimization tools",
    tags: ["tech", "performance", "professional", "bold", "modern", "powerful", "focused"],

    colors: {
      primary: "#1e1b4b", // Deep indigo
      secondary: "#312e81", // Rich indigo
      // Bright indigo
      accent: "#22c55e", // Performance green
      neutral: "#4b5563", // Tech grey
    },
    typography: {
      base: 16,
      heading: "industrial",
      body: "neo-grotesque",
    },
  },
  {
    id: "nova",
    name: "Nova",
    description: "Brilliant design for innovative solutions",
    tags: ["creative", "modern", "vibrant", "bold", "innovative", "dynamic", "energetic"],

    colors: {
      primary: "#be185d", // Deep pink
      secondary: "#db2777", // Rich pink
      // Bright pink
      accent: "#0ea5e9", // Electric blue
      neutral: "#6b7280", // Modern grey
    },
    typography: {
      base: 16,
      heading: "geometric-humanist",
      body: "system-ui",
    },
    customFonts: [
      {
        name: "Supreme",
        src: "https://fonts.googleapis.com/css2?family=Supreme:wght@700&display=swap",
        weight: "700",
        display: "swap",
      },
    ],
  },
  {
    id: "heritage",
    name: "Heritage",
    description: "Authentic and timeless design with natural character",
    tags: ["traditional", "natural", "rustic", "authentic", "earthy", "timeless", "organic"],

    colors: {
      primary: "#854d0e",
      secondary: "#a16207",

      accent: "#4d7c0f",
      neutral: "#57534e",
    },
    typography: { base: 16, heading: "slab-serif", body: "transitional" },
  },
  {
    id: "power",
    name: "Power",
    description: "Strong and decisive design with bold presence",
    tags: ["bold", "dynamic", "strong", "modern", "energetic", "powerful", "decisive"],

    colors: {
      primary: "#dc2626",
      secondary: "#171717",

      accent: "#eab308",
      neutral: "#404040",
    },
    typography: { base: 16, heading: "industrial", body: "neo-grotesque" },
  },
  {
    id: "frost",
    name: "Frost",
    description: "Modern glassmorphic design with ethereal transparency and depth",
    tags: ["glassmorphic", "modern", "light", "tech", "minimal", "clean", "elegant"],

    colors: {
      primary: "#0ea5e9", // Bright blue
      secondary: "#38bdf8", // Light blue
      // Pale blue
      accent: "#f0f9ff", // Ice white
      neutral: "#94a3b8", // Cool grey
    },
    typography: {
      base: 16,
      heading: "geometric-humanist",
      body: "neo-grotesque",
    },
  },
  {
    id: "midnight",
    name: "Midnight",
    description: "Rich dark mode design with vibrant accent highlights",
    tags: ["dark", "modern", "tech", "professional", "sleek", "minimal", "bold"],

    colors: {
      primary: "#0f172a", // Deep navy
      secondary: "#1e293b", // Dark blue grey
      // Slate blue
      accent: "#38bdf8", // Electric blue
      neutral: "#475569", // Slate
    },
    typography: {
      base: 16,
      heading: "neo-grotesque",
      body: "system-ui",
    },
    customFonts: [
      {
        name: "Cal Sans",
        src: "https://fonts.googleapis.com/css2?family=Cal+Sans:wght@600&display=swap",
        weight: "600",
        display: "swap",
      },
    ],
  },
  {
    id: "prism",
    name: "Prism",
    description: "Dynamic gradient-rich design with flowing color transitions",
    tags: ["gradient", "creative", "vibrant", "modern", "dynamic", "bold", "artistic"],

    colors: {
      primary: "#8b5cf6", // Purple
      secondary: "#6366f1", // Indigo
      // Blue
      accent: "#ec4899", // Pink
      neutral: "#64748b", // Cool grey
    },
    typography: {
      base: 16,
      heading: "geometric-humanist",
      body: "transitional",
    },
  },
  {
    id: "zen",
    name: "Zen",
    description: "Ultra-minimal design with thoughtful whitespace and balance",
    tags: ["minimal", "calm", "clean", "modern", "professional", "elegant", "focused"],

    colors: {
      primary: "#262626", // Near black
      secondary: "#404040", // Dark grey
      // Medium grey
      accent: "#525252", // Charcoal
      neutral: "#a3a3a3", // Light grey
    },
    typography: {
      base: 16,
      heading: "humanist",
      body: "system-ui",
    },
  },
  {
    id: "neomorph",
    name: "Neomorph",
    description: "Soft UI design with subtle shadows and dimensional depth",
    tags: ["neumorphic", "modern", "minimal", "tech", "clean", "soft", "elegant"],

    colors: {
      primary: "#e2e8f0", // Light grey blue
      secondary: "#f1f5f9", // Pale grey
      // Medium grey blue
      accent: "#0ea5e9", // Bright blue
      neutral: "#64748b", // Slate
    },
    typography: {
      base: 16,
      heading: "geometric-humanist",
      body: "system-ui",
    },
  },
  {
    id: "botanical",
    name: "Botanical",
    description: "Organic design with natural hues and breathing space",
    tags: ["organic", "natural", "light", "wellness", "calm", "eco", "fresh"],

    colors: {
      primary: "#f0fdf4", // Mint white
      secondary: "#dcfce7", // Pale green
      // Light green
      accent: "#16a34a", // Forest green
      neutral: "#84cc16", // Lime
    },
    typography: {
      base: 16,
      heading: "transitional",
      body: "humanist",
    },
  },
  {
    id: "aurora",
    name: "Aurora",
    description: "Vibrant gradients with ethereal color transitions",
    tags: ["gradient", "vibrant", "modern", "creative", "dynamic", "artistic", "bold"],

    colors: {
      primary: "#7c3aed", // Purple
      secondary: "#2dd4bf", // Teal
      // Cyan
      accent: "#ec4899", // Pink
      neutral: "#4b5563", // Grey
    },
    typography: {
      base: 16,
      heading: "neo-grotesque",
      body: "geometric-humanist",
    },
    customFonts: [
      {
        name: "Cabinet Grotesk",
        src: "https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@700&display=swap",
        weight: "700",
        display: "swap",
      },
    ],
  },
  {
    id: "cosmic",
    name: "Cosmic",
    description: "Space-inspired design with deep backgrounds and bright accents",
    tags: ["dark", "tech", "modern", "bold", "futuristic", "dramatic", "space"],

    colors: {
      primary: "#020617", // Deep space
      secondary: "#0f172a", // Dark blue
      // Navy
      accent: "#eab308", // Star gold
      neutral: "#334155", // Space grey
    },
    typography: {
      base: 16,
      heading: "industrial",
      body: "neo-grotesque",
    },
  },

  {
    id: "cascade",
    name: "Cascade",
    description: "Layered design with flowing visual hierarchy",
    tags: ["modern", "tech", "clean", "professional", "minimal", "gradient", "flow"],

    colors: {
      primary: "#06b6d4", // Bright cyan
      secondary: "#0891b2", // Deep cyan
      // Light cyan
      accent: "#f0f9ff", // Pale blue
      neutral: "#475569", // Slate
    },
    typography: {
      base: 16,
      heading: "neo-grotesque",
      body: "geometric-humanist",
    },
    customFonts: [
      {
        name: "Decimal",
        src: "https://fonts.googleapis.com/css2?family=Decimal:wght@500&display=swap",
        weight: "500",
        display: "swap",
      },
    ],
  },
  {
    id: "retro-wave",
    name: "Retro Wave",
    description: "Modern retro-inspired design with bold contrasts",
    tags: ["retro", "bold", "vibrant", "creative", "neon", "vintage", "dynamic"],

    colors: {
      primary: "#4c1d95", // Deep purple
      secondary: "#7e22ce", // Bright purple
      // Electric blue
      accent: "#ec4899", // Neon pink
      neutral: "#1f2937", // Dark grey
    },
    typography: {
      base: 16,
      heading: "industrial",
      body: "monospace-code",
    },
  },
  {
    id: "origami",
    name: "Origami",
    description: "Precise geometric design with crisp folds and angles",
    tags: ["geometric", "minimal", "clean", "modern", "precise", "light", "structured"],

    colors: {
      primary: "#fafaf9", // Paper white
      secondary: "#f5f5f4", // Soft white
      // Light grey
      accent: "#ef4444", // Vibrant red
      neutral: "#78716c", // Warm grey
    },
    typography: {
      base: 16,
      heading: "geometric-humanist",
      body: "neo-grotesque",
    },
  },
  {
    id: "quantum",
    name: "Quantum",
    description: "Futuristic design with high-tech minimalism",
    tags: ["tech", "dark", "minimal", "futuristic", "modern", "sleek", "professional"],

    colors: {
      primary: "#18181b", // Deep black
      secondary: "#27272a", // Rich black
      // Dark grey
      accent: "#22d3ee", // Electric cyan
      neutral: "#52525b", // Neutral grey
    },
    typography: {
      base: 16,
      heading: "monospace-code",
      body: "neo-grotesque",
    },
  },
  {
    id: "luminous",
    name: "Luminous",
    description: "Light-inspired design with glowing accents",
    tags: ["light", "bright", "modern", "minimal", "clean", "fresh", "airy"],

    colors: {
      primary: "#fef9c3", // Soft yellow
      secondary: "#fef08a", // Light yellow
      // Bright yellow
      accent: "#1e293b", // Dark blue
      neutral: "#94a3b8", // Cool grey
    },
    typography: {
      base: 16,
      heading: "transitional",
      body: "humanist",
    },
  },
  {
    id: "breeze",
    name: "Breeze",
    description: "Light and airy design with gentle color transitions",
    tags: ["pastel", "light", "soft", "calm", "minimal", "clean", "gentle"],

    colors: {
      primary: "#bfdbfe", // Soft blue
      secondary: "#dbeafe", // Lighter blue
      // Pale blue
      accent: "#f472b6", // Soft pink
      neutral: "#cbd5e1", // Light slate
    },
    typography: {
      base: 16,
      heading: "geometric-humanist",
      body: "system-ui",
    },
    customFonts: [
      {
        name: "Satoshi",
        src: "https://fonts.googleapis.com/css2?family=Satoshi:wght@500&display=swap",
        weight: "500",
        display: "swap",
      },
    ],
  },
  {
    id: "cotton",
    name: "Cotton",
    description: "Soft, comfortable design with inviting presence",
    tags: ["pastel", "soft", "light", "gentle", "minimal", "calm", "delicate"],

    colors: {
      primary: "#fce7f3", // Cotton pink
      secondary: "#fbcfe8", // Soft pink
      // Light pink
      accent: "#7dd3fc", // Sky blue
      neutral: "#e5e7eb", // Light grey
    },
    typography: {
      base: 16,
      heading: "transitional",
      body: "humanist",
    },
  },
  {
    id: "bloom",
    name: "Bloom",
    description: "Fresh spring-inspired design with natural warmth",
    tags: ["pastel", "organic", "fresh", "light", "spring", "friendly", "natural"],

    colors: {
      primary: "#d9f99d", // Soft lime
      secondary: "#bef264", // Light green
      // Mint
      accent: "#fda4af", // Coral
      neutral: "#d4d4d8", // Zinc
    },
    typography: {
      base: 16,
      heading: "rounded-sans",
      body: "geometric-humanist",
    },
  },
  {
    id: "cloud",
    name: "Cloud",
    description: "Light and dreamy design with gentle gradients",
    tags: ["light", "soft", "minimal", "clean", "gentle", "airy", "calm"],

    colors: {
      primary: "#e0f2fe", // Sky blue
      secondary: "#f0f9ff", // Lighter blue
      // Soft blue
      accent: "#c084fc", // Soft purple
      neutral: "#f1f5f9", // Slate
    },
    typography: {
      base: 16,
      heading: "neo-grotesque",
      body: "system-ui",
    },
  },
  {
    id: "sorbet",
    name: "Sorbet",
    description: "Sweet, refreshing design with playful tones",
    tags: ["pastel", "playful", "sweet", "light", "fresh", "friendly", "cheerful"],

    colors: {
      primary: "#fef9c3", // Soft yellow
      secondary: "#fde047", // Light yellow
      // Peach
      accent: "#c084fc", // Lavender
      neutral: "#e5e7eb", // Light grey
    },
    typography: {
      base: 16,
      heading: "geometric-humanist",
      body: "humanist",
    },
  },
  {
    id: "powder",
    name: "Powder",
    description: "Delicate design with subtle color variations",
    tags: ["pastel", "soft", "gentle", "light", "calm", "minimal", "delicate"],

    colors: {
      primary: "#ddd6fe", // Soft violet
      secondary: "#ede9fe", // Lighter violet
      // Soft indigo
      accent: "#fb923c", // Soft orange
      neutral: "#e2e8f0", // Cool grey
    },
    typography: {
      base: 16,
      heading: "transitional",
      body: "system-ui",
    },
  },
  {
    id: "glacier",
    name: "Glacier",
    description: "Cool, composed design with icy undertones",
    tags: ["cool", "minimal", "clean", "modern", "fresh", "professional", "crisp"],

    colors: {
      primary: "#cffafe", // Ice blue
      secondary: "#a5f3fc", // Light cyan
      // Soft teal
      accent: "#f9a8d4", // Soft pink
      neutral: "#e2e8f0", // Cool grey
    },
    typography: {
      base: 16,
      heading: "neo-grotesque",
      body: "geometric-humanist",
    },
    customFonts: [
      {
        name: "General Sans",
        src: "https://fonts.googleapis.com/css2?family=General+Sans:wght@600&display=swap",
        weight: "600",
        display: "swap",
      },
    ],
  },
  {
    id: "sage",
    name: "Sage",
    description: "Organic design with calming natural tones",
    tags: ["organic", "natural", "calm", "wellness", "eco", "gentle", "balanced"],

    colors: {
      primary: "#d1fae5", // Sage green
      secondary: "#a7f3d0", // Mint
      // Light green
      accent: "#fda4af", // Soft coral
      neutral: "#d4d4d8", // Light grey
    },
    typography: {
      base: 16,
      heading: "humanist",
      body: "transitional",
    },
  },
  {
    id: "aurora-soft",
    name: "Aurora Soft",
    description: "Gentle multicolor design with ethereal feel",
    tags: ["pastel", "gentle", "ethereal", "modern", "soft", "gradient", "calm"],

    colors: {
      primary: "#ddd6fe", // Soft purple
      secondary: "#c7d2fe", // Soft indigo
      // Soft blue
      accent: "#93c5fd", // Sky blue
      neutral: "#e2e8f0", // Cool grey
    },
    typography: {
      base: 16,
      heading: "geometric-humanist",
      body: "system-ui",
    },
  },
  {
    id: "lily",
    name: "Lily",
    description: "Delicate floral-inspired design with soft edges",
    tags: ["pastel", "feminine", "soft", "gentle", "elegant", "delicate", "light"],

    colors: {
      primary: "#fce7f3", // Soft pink
      secondary: "#fbcfe8", // Light pink
      // Soft purple
      accent: "#a78bfa", // Light violet
      neutral: "#f1f5f9", // Slate
    },
    typography: {
      base: 16,
      heading: "transitional",
      body: "humanist",
    },
  },
  {
    id: "meringue",
    name: "Meringue",
    description: "Light and airy design with whimsical touches",
    tags: ["pastel", "light", "soft", "playful", "gentle", "friendly", "warm"],

    colors: {
      primary: "#fef3c7", // Soft yellow
      secondary: "#fde68a", // Light yellow
      // Soft orange
      accent: "#c084fc", // Soft purple
      neutral: "#f1f5f9", // Light slate
    },
    typography: {
      base: 16,
      heading: "rounded-sans",
      body: "geometric-humanist",
    },
  },
  {
    id: "opal",
    name: "Opal",
    description: "Iridescent-inspired design with gentle color shifts",
    tags: ["iridescent", "pastel", "modern", "gentle", "elegant", "dynamic", "subtle"],

    colors: {
      primary: "#a5f3fc", // Soft cyan
      secondary: "#99f6e4", // Soft teal
      // Soft green
      accent: "#f0abfc", // Soft magenta
      neutral: "#e2e8f0", // Cool grey
    },
    typography: {
      base: 16,
      heading: "neo-grotesque",
      body: "system-ui",
    },
  },
  {
    id: "marshmallow",
    name: "Marshmallow",
    description: "Ultra-soft design with gentle tonal shifts",
    tags: ["pastel", "soft", "gentle", "light", "minimal", "friendly", "warm"],

    colors: {
      primary: "#fdf2f8", // Cotton candy pink
      secondary: "#fce7f3", // Soft pink
      // Light pink
      accent: "#93c5fd", // Gentle blue
      neutral: "#f8fafc", // Cool white
    },
    typography: {
      base: 16,
      heading: "rounded-sans",
      body: "geometric-humanist",
    },
  },
  {
    id: "pistachio",
    name: "Pistachio",
    description: "Fresh pastel design with natural undertones",
    tags: ["pastel", "natural", "fresh", "organic", "light", "gentle", "eco"],

    colors: {
      primary: "#dcfce7", // Soft mint
      secondary: "#bbf7d0", // Light green
      // Pastel green
      accent: "#fda4af", // Soft coral
      neutral: "#f0fdf4", // Mint white
    },
    typography: {
      base: 16,
      heading: "humanist",
      body: "system-ui",
    },
    customFonts: [
      {
        name: "Outfit",
        src: "https://fonts.googleapis.com/css2?family=Outfit:wght@500&display=swap",
        weight: "500",
        display: "swap",
      },
    ],
  },
  {
    id: "bubble",
    name: "Bubble",
    description: "Playful pastel design with rounded elements",
    tags: ["pastel", "playful", "friendly", "soft", "rounded", "gentle", "approachable"],

    colors: {
      primary: "#dbeafe", // Bubble blue
      secondary: "#bfdbfe", // Light blue
      // Sky blue
      accent: "#fda4af", // Soft coral
      neutral: "#f1f5f9", // Gentle grey
    },
    typography: {
      base: 16,
      heading: "rounded-sans",
      body: "geometric-humanist",
    },
  },
  {
    id: "lavender-mist",
    name: "Lavender Mist",
    description: "Ethereal design with purple undertones",
    tags: ["pastel", "ethereal", "soft", "gentle", "calm", "elegant", "soothing"],

    colors: {
      primary: "#f5f3ff", // Lightest purple
      secondary: "#ede9fe", // Soft purple
      // Light purple
      accent: "#6ee7b7", // Mint green
      neutral: "#f8fafc", // Cool white
    },
    typography: {
      base: 16,
      heading: "transitional",
      body: "humanist",
    },
  },
  {
    id: "lemon-chiffon",
    name: "Lemon Chiffon",
    description: "Light and airy design with warm undertones",
    tags: ["pastel", "light", "warm", "fresh", "gentle", "friendly", "cheerful"],

    colors: {
      primary: "#fefce8", // Soft yellow
      secondary: "#fef9c3", // Light yellow
      // Pastel yellow
      accent: "#93c5fd", // Soft blue
      neutral: "#f8fafc", // Cool white
    },
    typography: {
      base: 16,
      heading: "geometric-humanist",
      body: "system-ui",
    },
  },
  {
    id: "cotton-candy",
    name: "Cotton Candy",
    description: "Sweet pastel design with playful tones",
    tags: ["pastel", "playful", "sweet", "soft", "friendly", "gentle", "fun"],

    colors: {
      primary: "#fae8ff", // Soft magenta
      secondary: "#f5d0fe", // Light magenta
      // Pastel magenta
      accent: "#7dd3fc", // Sky blue
      neutral: "#faf5ff", // Cool white
    },
    typography: {
      base: 16,
      heading: "rounded-sans",
      body: "geometric-humanist",
    },
  },
  {
    id: "seafoam",
    name: "Seafoam",
    description: "Ocean-inspired pastel design with calming tones",
    tags: ["pastel", "ocean", "calm", "fresh", "gentle", "natural", "serene"],

    colors: {
      primary: "#ecfeff", // Lightest cyan
      secondary: "#cffafe", // Soft cyan
      // Light cyan
      accent: "#f9a8d4", // Soft pink
      neutral: "#f0fdfa", // Cool white
    },
    typography: {
      base: 16,
      heading: "neo-grotesque",
      body: "system-ui",
    },
  },
  {
    id: "rose-quartz",
    name: "Rose Quartz",
    description: "Crystal-inspired design with soft pink hues",
    tags: ["pastel", "crystal", "gentle", "elegant", "soft", "minimal", "refined"],

    colors: {
      primary: "#fff1f2", // Lightest pink
      secondary: "#ffe4e6", // Soft pink
      // Light pink
      accent: "#a5f3fc", // Soft cyan
      neutral: "#fafafa", // Pure white
    },
    typography: {
      base: 16,
      heading: "transitional",
      body: "humanist",
    },
    customFonts: [
      {
        name: "Manrope",
        src: "https://fonts.googleapis.com/css2?family=Manrope:wght@600&display=swap",
        weight: "600",
        display: "swap",
      },
    ],
  },
  {
    id: "apricot",
    name: "Apricot",
    description: "Warm pastel design with peachy tones",
    tags: ["pastel", "warm", "soft", "friendly", "gentle", "natural", "welcoming"],

    colors: {
      primary: "#fff7ed", // Lightest peach
      secondary: "#ffedd5", // Soft peach
      // Light peach
      accent: "#a5b4fc", // Soft indigo
      neutral: "#f8fafc", // Cool white
    },
    typography: {
      base: 16,
      heading: "humanist",
      body: "geometric-humanist",
    },
  },
  {
    id: "mint-cream",
    name: "Mint Cream",
    description: "Fresh minty design with cool undertones",
    tags: ["pastel", "fresh", "clean", "cool", "minimal", "gentle", "crisp"],

    colors: {
      primary: "#f0fdfa", // Lightest mint
      secondary: "#ccfbf1", // Soft mint
      // Light mint
      accent: "#fda4af", // Soft coral
      neutral: "#f9fafb", // Cool white
    },
    typography: {
      base: 16,
      heading: "geometric-humanist",
      body: "system-ui",
    },
  },
  {
    id: "dreamscape",
    name: "Dreamscape",
    description: "Ethereal pastel design with multicolor harmony",
    tags: ["pastel", "ethereal", "gentle", "soft", "harmonious", "calm", "dreamy"],

    colors: {
      primary: "#f5f3ff", // Soft violet
      secondary: "#dbeafe", // Soft blue
      // Soft green
      accent: "#fda4af", // Soft coral
      neutral: "#f8fafc", // Cool white
    },
    typography: {
      base: 16,
      heading: "neo-grotesque",
      body: "humanist",
    },
  },
  {
    id: "enterprise-blue",
    name: "Enterprise Blue",
    description: "Classic corporate design with modern refinement",
    tags: ["corporate", "professional", "business", "serious", "classic", "reliable", "traditional"],

    colors: {
      primary: "#0f284e", // Deep corporate blue
      secondary: "#1e40af", // Rich blue
      // Bright blue
      accent: "#dc2626", // Action red
      neutral: "#475569", // Business grey
    },
    typography: {
      base: 16,
      heading: "classical-humanist",
      body: "transitional",
    },
    customFonts: [
      {
        name: "Ginto Nord",
        src: "https://fonts.googleapis.com/css2?family=Ginto+Nord:wght@600&display=swap",
        weight: "600",
        display: "swap",
      },
    ],
  },
  {
    id: "capital",
    name: "Capital",
    description: "Premium enterprise design with executive appeal",
    tags: ["corporate", "luxury", "professional", "premium", "business", "elegant", "executive"],

    colors: {
      primary: "#18181b", // Rich black
      secondary: "#27272a", // Charcoal
      // Dark grey
      accent: "#854d0e", // Gold
      neutral: "#52525b", // Professional grey
    },
    typography: {
      base: 16,
      heading: "transitional",
      body: "system-ui",
    },
  },
  {
    id: "counsel",
    name: "Counsel",
    description: "Trustworthy design for professional services",
    tags: ["professional", "corporate", "trustworthy", "business", "serious", "reliable", "classic"],

    colors: {
      primary: "#1e293b", // Deep slate
      secondary: "#334155", // Dark slate
      // Medium slate
      accent: "#0891b2", // Trust blue
      neutral: "#64748b", // Corporate grey
    },
    typography: {
      base: 16,
      heading: "classical-humanist",
      body: "transitional",
    },
  },
  {
    id: "diplomat",
    name: "Diplomat",
    description: "Sophisticated design for international business",
    tags: ["professional", "corporate", "elegant", "international", "sophisticated", "classic", "refined"],

    colors: {
      primary: "#0c4a6e", // Deep blue
      secondary: "#075985", // Ocean blue
      // Strong blue
      accent: "#b91c1c", // Power red
      neutral: "#4b5563", // Slate
    },
    typography: {
      base: 16,
      heading: "transitional",
      body: "system-ui",
    },
  },
  {
    id: "cornerstone",
    name: "Cornerstone",
    description: "Solid foundation design for established institutions",
    tags: [
      "corporate",
      "traditional",
      "professional",
      "solid",
      "established",
      "trustworthy",
      "institutional",
    ],

    colors: {
      primary: "#292524", // Deep brown
      secondary: "#44403c", // Rich brown
      // Warm grey
      accent: "#0284c7", // Trust blue
      neutral: "#78716c", // Stone
    },
    typography: {
      base: 16,
      heading: "classical-humanist",
      body: "transitional",
    },
  },
  {
    id: "summit",
    name: "Summit",
    description: "Elevated design for market leaders",
    tags: ["corporate", "professional", "premium", "leadership", "established", "modern", "elegant"],

    colors: {
      primary: "#0f172a", // Deep navy
      secondary: "#1e293b", // Dark blue
      // Navy grey
      accent: "#15803d", // Success green
      neutral: "#475569", // Professional grey
    },
    typography: {
      base: 16,
      heading: "transitional",
      body: "neo-grotesque",
    },
    customFonts: [
      {
        name: "Articulat CF",
        src: "https://fonts.googleapis.com/css2?family=Articulat+CF:wght@700&display=swap",
        weight: "700",
        display: "swap",
      },
    ],
  },
  {
    id: "guardian",
    name: "Guardian",
    description: "Secure and reliable design for financial services",
    tags: ["finance", "secure", "professional", "corporate", "trustworthy", "reliable", "serious"],

    colors: {
      primary: "#14532d", // Deep green
      secondary: "#166534", // Forest green
      // Rich green
      accent: "#1e40af", // Trust blue
      neutral: "#4b5563", // Slate
    },
    typography: {
      base: 16,
      heading: "classical-humanist",
      body: "transitional",
    },
  },
  {
    id: "insignia",
    name: "Insignia",
    description: "Distinguished design for premium services",
    tags: ["premium", "corporate", "professional", "elegant", "distinguished", "classic", "refined"],

    colors: {
      primary: "#312e81", // Deep indigo
      secondary: "#3730a3", // Rich indigo
      // Bright indigo
      accent: "#b91c1c", // Power red
      neutral: "#4b5563", // Business grey
    },
    typography: {
      base: 16,
      heading: "transitional",
      body: "system-ui",
    },
  },
  {
    id: "precedent",
    name: "Precedent",
    description: "Authoritative design for legal and consulting",
    tags: ["legal", "corporate", "professional", "authoritative", "serious", "traditional", "trustworthy"],

    colors: {
      primary: "#1e1b4b", // Deep violet
      secondary: "#312e81", // Rich indigo
      // Bright indigo
      accent: "#ca8a04", // Gold
      neutral: "#52525b", // Professional grey
    },
    typography: {
      base: 16,
      heading: "classical-humanist",
      body: "transitional",
    },
  },
  {
    id: "sterling",
    name: "Sterling",
    description: "Premium design for financial technology",
    tags: ["fintech", "premium", "professional", "modern", "tech", "refined", "corporate"],

    colors: {
      primary: "#27272a", // Rich black
      secondary: "#3f3f46", // Dark grey
      // Medium grey
      accent: "#0891b2", // Tech blue
      neutral: "#71717a", // Silver grey
    },
    typography: {
      base: 16,
      heading: "neo-grotesque",
      body: "system-ui",
    },
    customFonts: [
      {
        name: "Inter Tight",
        src: "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@600&display=swap",
        weight: "600",
        display: "swap",
      },
    ],
  },
  {
    id: "fortress",
    name: "Fortress",
    description: "Strong, secure design for enterprise solutions",
    tags: ["enterprise", "secure", "professional", "corporate", "strong", "reliable", "serious"],

    colors: {
      primary: "#0c4a6e", // Deep blue
      secondary: "#0369a1", // Strong blue
      // Bright blue
      accent: "#15803d", // Success green
      neutral: "#64748b", // Corporate grey
    },
    typography: {
      base: 16,
      heading: "transitional",
      body: "neo-grotesque",
    },
  },
  {
    id: "macaroon",
    name: "Macaroon",
    description: "Delicate pastel design with confectionery-inspired colors",
    tags: ["pastel", "sweet", "delicate", "soft", "playful", "gentle", "charming"],

    colors: {
      primary: "#fce7f3", // Soft pink
      secondary: "#fef3c7", // Soft yellow
      // Soft mint
      accent: "#c7d2fe", // Soft indigo
      neutral: "#fafaf9", // Warm white
    },
    typography: {
      base: 16,
      heading: "rounded-sans",
      body: "geometric-humanist",
    },
  },
  {
    id: "kinetic",
    name: "Kinetic",
    description: "Movement-focused design with dynamic elements",
    tags: ["dynamic", "modern", "bold", "energetic", "tech", "movement", "vibrant"],

    colors: {
      primary: "#6d28d9", // Deep purple
      secondary: "#4f46e5", // Electric indigo
      // Bright blue
      accent: "#10b981", // Emerald
      neutral: "#6b7280", // Cool grey
    },
    typography: {
      base: 16,
      heading: "industrial",
      body: "geometric-humanist",
    },
  },
  {
    id: "silk",
    name: "Silk",
    description: "Smooth, luxurious design with flowing elements",
    tags: ["luxury", "elegant", "soft", "refined", "premium", "smooth", "sophisticated"],

    colors: {
      primary: "#fdf2f8", // Pink white
      secondary: "#fce7f3", // Soft pink
      // Light pink
      accent: "#db2777", // Deep pink
      neutral: "#9ca3af", // Cool grey
    },
    typography: {
      base: 16,
      heading: "didone",
      body: "transitional",
    },
  },
  {
    id: "monolith",
    name: "Monolith",
    description: "Bold brutalist design with strong typography",
    tags: ["brutalist", "bold", "modern", "minimal", "strong", "dramatic", "stark"],

    colors: {
      primary: "#000000", // Pure black
      secondary: "#0a0a0a", // Near black
      // Dark grey
      accent: "#ffffff", // Pure white
      neutral: "#404040", // Medium grey
    },
    typography: {
      base: 18,
      heading: "industrial",
      body: "monospace-code",
    },
    customFonts: [
      {
        name: "Aeonik",
        src: "https://fonts.googleapis.com/css2?family=Aeonik:wght@700&display=swap",
        weight: "700",
        display: "swap",
      },
    ],
  },
  {
    id: "velvet",
    name: "Velvet",
    description: "Rich, textured design with depth and warmth",
    tags: ["luxury", "rich", "elegant", "premium", "sophisticated", "bold", "dramatic"],

    colors: {
      primary: "#701a75", // Deep magenta
      secondary: "#86198f", // Rich purple
      // Bright magenta
      accent: "#fbbf24", // Golden yellow
      neutral: "#525252", // Neutral grey
    },
    typography: {
      base: 16,
      heading: "transitional",
      body: "humanist",
    },
  },
  {
    id: "binary",
    name: "Binary",
    description: "Clean, technical design with precise spacing",
    tags: ["tech", "minimal", "clean", "precise", "modern", "structured", "systematic"],

    colors: {
      primary: "#e5e7eb", // Light grey
      secondary: "#d1d5db", // Medium grey
      // Grey
      accent: "#111827", // Near black
      neutral: "#6b7280", // Cool grey
    },
    typography: {
      base: 16,
      heading: "monospace-code",
      body: "monospace-code",
    },
  },
  {
    id: "oasis",
    name: "Oasis",
    description: "Calm, refreshing design with subtle gradients",
    tags: ["calm", "refreshing", "natural", "serene", "balanced", "gentle", "peaceful"],

    colors: {
      primary: "#0d9488", // Teal
      secondary: "#14b8a6", // Light teal
      // Bright teal
      accent: "#fbbf24", // Warm yellow
      neutral: "#64748b", // Slate
    },
    typography: {
      base: 16,
      heading: "humanist",
      body: "geometric-humanist",
    },
  },
  {
    id: "plasma",
    name: "Plasma",
    description: "Fluid, energetic design with vivid color transitions",
    tags: ["gradient", "dynamic", "modern", "energetic", "vibrant", "fluid", "bold"],

    colors: {
      primary: "#4f46e5", // Indigo
      secondary: "#7c3aed", // Purple
      // Bright purple
      accent: "#14b8a6", // Teal
      neutral: "#4b5563", // Grey
    },
    typography: {
      base: 16,
      heading: "neo-grotesque",
      body: "system-ui",
    },
  },
  {
    id: "echo",
    name: "Echo",
    description: "Ethereal design with subtle repetitive elements and depth",
    tags: ["subtle", "minimal", "modern", "clean", "structured", "balanced", "refined"],

    colors: {
      primary: "#e0f2fe", // Pale blue
      secondary: "#bae6fd", // Light blue
      // Sky blue
      accent: "#3b82f6", // Electric blue
      neutral: "#cbd5e1", // Cool grey
    },
    typography: {
      base: 16,
      heading: "classical-humanist",
      body: "geometric-humanist",
    },
  },
  {
    id: "nucleus",
    name: "Nucleus",
    description: "Cellular-inspired organic design with fluid forms",
    tags: ["organic", "modern", "scientific", "innovative", "fluid", "tech", "dynamic"],

    colors: {
      primary: "#faf5ff", // White purple
      secondary: "#f3e8ff", // Pale purple
      // Light purple
      accent: "#9333ea", // Deep purple
      neutral: "#a1a1aa", // Zinc
    },
    typography: {
      base: 16,
      heading: "rounded-sans",
      body: "humanist",
    },
  },
  {
    id: "analog",
    name: "Analog",
    description: "Neo-vintage design with modern precision",
    tags: ["vintage", "retro", "modern", "warm", "nostalgic", "classic", "refined"],

    colors: {
      primary: "#44403c", // Warm dark grey
      secondary: "#57534e", // Stone
      // Warm grey
      accent: "#f97316", // Bright orange
      neutral: "#a8a29e", // Light stone
    },
    typography: {
      base: 16,
      heading: "slab-serif",
      body: "monospace-code",
    },
    customFonts: [
      {
        name: "RecklessNeue",
        src: "https://fonts.googleapis.com/css2?family=RecklessNeue:wght@500&display=swap",
        weight: "500",
        display: "swap",
      },
    ],
  },
  {
    id: "cipher",
    name: "Cipher",
    description: "Cryptographic-inspired design with structured patterns",
    tags: ["tech", "cryptic", "modern", "structured", "systematic", "precise", "bold"],

    colors: {
      primary: "#0f172a", // Navy
      secondary: "#1e293b", // Dark blue
      // Slate
      accent: "#84cc16", // Lime
      neutral: "#475569", // Grey blue
    },
    typography: {
      base: 16,
      heading: "monospace-code",
      body: "monospace-slab-serif",
    },
  },
  {
    id: "helix",
    name: "Helix",
    description: "DNA-inspired design with interweaving elements",
    tags: ["scientific", "tech", "modern", "innovative", "dynamic", "precise", "professional"],

    colors: {
      primary: "#083344", // Dark cyan
      secondary: "#164e63", // Deep cyan
      // Rich cyan
      accent: "#fb7185", // Coral pink
      neutral: "#475569", // Slate
    },
    typography: {
      base: 16,
      heading: "neo-grotesque",
      body: "geometric-humanist",
    },
  },
  {
    id: "genesis",
    name: "Genesis",
    description: "Primordial design with raw, elemental aesthetics",
    tags: ["organic", "earthy", "natural", "raw", "bold", "elemental", "primitive"],

    colors: {
      primary: "#422006", // Deep brown
      secondary: "#854d0e", // Earth
      // Amber
      accent: "#16a34a", // Forest
      neutral: "#78716c", // Stone
    },
    typography: {
      base: 16,
      heading: "antique",
      body: "old-style",
    },
  },
  {
    id: "ionic",
    name: "Ionic",
    description: "Charged minimal design with electric accents",
    tags: ["minimal", "modern", "clean", "tech", "precise", "structured", "electric"],

    colors: {
      primary: "#fafafa", // White
      secondary: "#f5f5f5", // Light grey
      // Grey
      accent: "#2563eb", // Royal blue
      neutral: "#737373", // Neutral
    },
    typography: {
      base: 16,
      heading: "industrial",
      body: "neo-grotesque",
    },
    customFonts: [
      {
        name: "Author",
        src: "https://fonts.googleapis.com/css2?family=Author:wght@700&display=swap",
        weight: "700",
        display: "swap",
      },
    ],
  },
  {
    id: "meridian",
    name: "Meridian",
    description: "Geographical precision with cartographic inspiration",
    tags: ["precise", "technical", "structured", "professional", "modern", "systematic", "geometric"],

    colors: {
      primary: "#1c1917", // Almost black
      secondary: "#292524", // Dark brown
      // Brown grey
      accent: "#facc15", // Yellow
      neutral: "#57534e", // Warm grey
    },
    typography: {
      base: 16,
      heading: "transitional",
      body: "monospace-code",
    },
  },
  {
    id: "spectra",
    name: "Spectra",
    description: "Light-spectrum inspired with prismatic effects",
    tags: ["gradient", "vibrant", "modern", "creative", "dynamic", "colorful", "energetic"],

    colors: {
      primary: "#7c3aed", // Violet
      secondary: "#4f46e5", // Indigo
      // Blue
      accent: "#f472b6", // Pink
      neutral: "#6b7280", // Cool grey
    },
    typography: {
      base: 16,
      heading: "geometric-humanist",
      body: "system-ui",
    },
  },
  {
    id: "terra",
    name: "Terra",
    description: "Earth-tone minimalism with organic texture",
    tags: ["organic", "earthy", "natural", "minimal", "warm", "textured", "balanced"],

    colors: {
      primary: "#451a03", // Deep brown
      secondary: "#78350f", // Rich brown
      // Warm brown
      accent: "#65a30d", // Natural green
      neutral: "#57534e", // Stone
    },
    typography: {
      base: 16,
      heading: "slab-serif",
      body: "humanist",
    },
  },
  {
    id: "quartz",
    name: "Quartz",
    description: "Crystalline design with sharp angles and clarity",
    tags: ["minimal", "clean", "crystal", "modern", "sharp", "precise", "elegant"],

    colors: {
      primary: "#f8fafc", // Ice white
      secondary: "#f1f5f9", // Snow
      // Frost
      accent: "#6366f1", // Crystal blue
      neutral: "#94a3b8", // Cool grey
    },
    typography: {
      base: 16,
      heading: "industrial",
      body: "neo-grotesque",
    },
  },
  {
    id: "matrix",
    name: "Matrix",
    description: "Grid-based design with systematic layout",
    tags: ["tech", "systematic", "dark", "modern", "grid", "structured", "bold"],

    colors: {
      primary: "#020617", // Deep space
      secondary: "#0f172a", // Dark blue
      // Navy
      accent: "#4ade80", // Matrix green
      neutral: "#334155", // Slate
    },
    typography: {
      base: 16,
      heading: "monospace-code",
      body: "monospace-code",
    },
  },
];
