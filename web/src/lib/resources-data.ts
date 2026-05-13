export type ResourceCategory =
  | "registries"
  | "blocks"
  | "templates"
  | "themes"
  | "components"
  | "animation"
  | "forms"
  | "tables"
  | "ai"
  | "auth"
  | "tools"
  | "docs"
  | "icons"
  | "blog"
  | "platforms"
  | "showcase";

export type Resource = {
  slug: string;
  name: string;
  description: string;
  url: string;
  category: ResourceCategory;
  categoryLabel: string;
  tags: string[];
  author?: string;
};

export const resourceCategories: { value: ResourceCategory | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "registries", label: "Registries" },
  { value: "blocks", label: "Blocks" },
  { value: "templates", label: "Templates" },
  { value: "themes", label: "Themes" },
  { value: "components", label: "Components" },
  { value: "animation", label: "Animation" },
  { value: "forms", label: "Forms" },
  { value: "tables", label: "Tables" },
  { value: "ai", label: "AI" },
  { value: "auth", label: "Auth" },
  { value: "tools", label: "Tools" },
  { value: "docs", label: "Docs" },
  { value: "icons", label: "Icons" },
  { value: "blog", label: "Blog" },
  { value: "platforms", label: "Platforms" },
  { value: "showcase", label: "Showcase" },
];

/**
 * Curated from https://github.com/birobirobiro/awesome-shadcn-ui
 * (full list 424 resources) plus VibeKit-specific picks.
 */
export const resources: Resource[] = [
  {
    "slug": "chanhdai-blocks",
    "name": "chanhdai blocks",
    "description": "Modern blocks and components by chanhdai — Apple-style hello effects, sliders, hero sections, and more.",
    "url": "https://chanhdai.com/blocks",
    "category": "blocks",
    "categoryLabel": "Blocks",
    "tags": [
      "blocks",
      "apple",
      "premium"
    ],
    "author": "chanhdai"
  },
  {
    "slug": "shadcn-space",
    "name": "shadcn space",
    "description": "A registry of shadcn/ui components and blocks crafted for SaaS and startup websites.",
    "url": "https://shadcnspace.com/",
    "category": "registries",
    "categoryLabel": "Registry",
    "tags": [
      "registry",
      "saas",
      "blocks"
    ],
    "author": "shadcn-space"
  },
  {
    "slug": "jb-component-registry-desishub",
    "name": "JB Component Registry (Desishub)",
    "description": "JB's curated registry — Better Auth UI, Stripe UI, File Storage UI, Data Table, MDX Blog, DGateway Shop, and more. Battle-tested in client work.",
    "url": "https://jb.desishub.com/",
    "category": "registries",
    "categoryLabel": "Registry",
    "tags": [
      "jb",
      "vibekit",
      "auth",
      "stripe",
      "files"
    ],
    "author": "JB · Desishub"
  },
  {
    "slug": "21st-dev",
    "name": "21st.dev",
    "description": "Open source npm for shadcn/ui components. Also: Dribble for design engineers. Install UI components via shadcn CLI, or publish your own.",
    "url": "https://21st.dev/",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "components"
    ]
  },
  {
    "slug": "21st-dev-agent-elements",
    "name": "21st.dev-agent-elements",
    "description": "Open-source registry of agent UI primitives — chat shell, tool-call cards (Bash, Edit, Search, Todo, Plan), clarifying questions, input bar, streaming markdown. Built on React 19, Tailwind v4, and the Vercel AI SDK.",
    "url": "https://agent-elements.21st.dev",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "react",
      "ai",
      "chat",
      "markdown",
      "components"
    ]
  },
  {
    "slug": "8bitcn-com",
    "name": "8bitcn.com",
    "description": "A set of retro-designed, accessible components and a code distribution platform. Open Source. Open Code.",
    "url": "https://www.8bitcn.com/",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "form",
      "components"
    ]
  },
  {
    "slug": "aceternity-ui",
    "name": "aceternity-ui",
    "description": "Copy paste the most trending react components without having to worry about styling and animations.",
    "url": "https://ui.aceternity.com/",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "react",
      "animations",
      "components"
    ]
  },
  {
    "slug": "agents-ui",
    "name": "agents-ui",
    "description": "Agents UI is LiveKit's open source component library built with React and shadcn for designing voice agent interfaces. Start with production-ready defaults, then customize every detail to match your brand.",
    "url": "https://livekit.io/ui",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "react",
      "ai",
      "components"
    ]
  },
  {
    "slug": "animated-header",
    "name": "animated-header",
    "description": "Vercel-like animated header.",
    "url": "https://github.com/mehrdadrafiee/animated-header",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "components"
    ]
  },
  {
    "slug": "animated-tabs",
    "name": "animated-tabs",
    "description": "Vercel-like animated tabs.",
    "url": "https://github.com/mehrdadrafiee/animated-tabs",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "components"
    ]
  },
  {
    "slug": "assistant-ui",
    "name": "assistant-ui",
    "description": "React Components for AI Chat.",
    "url": "https://github.com/Yonom/assistant-ui",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "react",
      "ai",
      "chat",
      "components"
    ]
  },
  {
    "slug": "audio-ui",
    "name": "audio/ui",
    "description": "A set of accessible and composable Audio UI components. Built on top of shadcn/ui, it's designed for you to copy, paste, and own.",
    "url": "https://github.com/ouestlabs/audio-ui",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "components"
    ]
  },
  {
    "slug": "autocomplete-select-shadcn-ui",
    "name": "autocomplete-select-shadcn-ui",
    "description": "Autocomplete component built with shadcn/ui and Fancy Multi Select by Maximilian Kaske.",
    "url": "https://www.armand-salle.fr/post/autocomplete-select-shadcn-ui",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "components"
    ]
  },
  {
    "slug": "auto-form",
    "name": "auto-form",
    "description": "A React component that automatically creates a shadcn/ui form based on a zod schema.",
    "url": "https://github.com/vantezzen/auto-form",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "react",
      "form",
      "components"
    ]
  },
  {
    "slug": "async-select",
    "name": "async-select",
    "description": "Async Select component built with shadcn/ui with debounce search.",
    "url": "https://async.rdsx.dev",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "components"
    ]
  },
  {
    "slug": "berlix",
    "name": "berlix",
    "description": "Animated components library built using Tailwind CSS and Motion",
    "url": "https://berlix.vercel.app",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "ai",
      "motion",
      "components"
    ]
  },
  {
    "slug": "big-calendar",
    "name": "big-calendar",
    "description": "A modern, feature-rich calendar application with multiple viewing options built using Next.js, TypeScript, and Tailwind CSS.",
    "url": "https://github.com/lramos33/big-calendar",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "next.js",
      "ai",
      "components"
    ]
  },
  {
    "slug": "billingsdk",
    "name": "billingsdk",
    "description": "Modern, type-safe billing and subscription management components for React, built with TypeScript and Tailwind CSS. Designed to work seamlessly alongside shadcn/ui by Dodo Payments.",
    "url": "https://billingsdk.com/",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "react",
      "ai",
      "payments",
      "components"
    ]
  },
  {
    "slug": "billui",
    "name": "billui",
    "description": "Open source billing components for React built with Shadcn. Pricing cards, payment methods, invoice history and more.",
    "url": "https://github.com/commet-labs/billui",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "react",
      "payments",
      "components"
    ]
  },
  {
    "slug": "blocks-so",
    "name": "blocks.so",
    "description": "A set of clean, modern building blocks to copy and paste into your apps. Works with all React frameworks.",
    "url": "https://github.com/ephraimduncan/blocks",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "react",
      "blocks",
      "components"
    ]
  },
  {
    "slug": "buouui",
    "name": "buouui",
    "description": "A UI component library and template suite based on shadcn/ui with stunning landing pages, templates, and rich animations.",
    "url": "https://buouui.com",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "landing",
      "animations",
      "template",
      "components"
    ]
  },
  {
    "slug": "bundui",
    "name": "bundui",
    "description": "A collection of reusable animated components built with Tailwind CSS and Framer Motion.",
    "url": "https://bundui.io",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "ai",
      "motion",
      "framer-motion",
      "components"
    ]
  },
  {
    "slug": "calendar",
    "name": "calendar",
    "description": "React/shadcn full calendar like Google Calendar",
    "url": "https://github.com/charlietlamb/calendar",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "react",
      "components"
    ]
  },
  {
    "slug": "calendar-schedular",
    "name": "calendar-schedular",
    "description": "A multi-purpose calendar component built on top of date-fn and shadcn-ui",
    "url": "https://github.com/gluer-space/calendar",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "components"
    ]
  },
  {
    "slug": "calendar-cn",
    "name": "calendar-cn",
    "description": "A beautifully crafted calendar component built with shadcn/ui and Tailwind CSS, inspired by Notion Calendar. Week view, dark mode, and more.",
    "url": "https://github.com/vmnog/calendarcn",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "ai",
      "components"
    ]
  },
  {
    "slug": "capture-photo",
    "name": "capture-photo",
    "description": "Browser-based React component for camera functionalities in web applications.",
    "url": "https://github.com/UretzkyZvi/capture-photo",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "react",
      "components"
    ]
  },
  {
    "slug": "carouselcn",
    "name": "carouselcn",
    "description": "Copy-paste carousel components and examples for your react apps",
    "url": "https://github.com/mnove/carouselcn",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "react",
      "components"
    ]
  },
  {
    "slug": "cascader-shadcn",
    "name": "cascader-shadcn",
    "description": "A cascading dropdown menu component for selecting hierarchical data like locations, categories, or organizational structures.",
    "url": "https://github.com/Ademking/cascader-shadcn",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "components"
    ]
  },
  {
    "slug": "chanhdai-components",
    "name": "chanhdai-components",
    "description": "A collection of reusable components. Trusted registry for shadcn/ui.",
    "url": "https://chanhdai.com/components",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "ai",
      "components"
    ]
  },
  {
    "slug": "clerk-elements",
    "name": "clerk-elements",
    "description": "Composable components for building custom UIs on top of Clerk's APIs.",
    "url": "https://clerk.com/docs/elements/examples/shadcn-ui",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "components"
    ]
  },
  {
    "slug": "clerk-shadcn-theme",
    "name": "clerk-shadcn-theme",
    "description": "Synchronize Clerk SignIn/SignUp components with shadcn/ui styles.",
    "url": "https://github.com/stormynight9/clerk-shadcn-theme",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "theme",
      "components"
    ]
  },
  {
    "slug": "commerce-ui",
    "name": "commerce-ui",
    "description": "Components, blocks and examples to build e-commerce storefronts and apps.",
    "url": "https://github.com/stackzero-labs/ui",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "blocks",
      "ecommerce",
      "components"
    ]
  },
  {
    "slug": "confirm-dialog",
    "name": "confirm-dialog",
    "description": "A confirm dialog component built with shadcn/ui.",
    "url": "https://github.com/Aslam97/react-confirm-dialog",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "components"
    ]
  },
  {
    "slug": "country-state-dropdown",
    "name": "country-state-dropdown",
    "description": "Component built with Nextjs, Tailwindcss, shadcn/ui & Zustand.",
    "url": "https://github.com/Jayprecode/country-state-dropdown",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "next.js",
      "ai",
      "components"
    ]
  },
  {
    "slug": "creatorem-ui",
    "name": "creatorem/ui",
    "description": "Missing awesome shadcn components (like Tour, Stepper, QRCode Motion Dialog -> to imitate native behaviour ...) built on top of radix primitives and motion.",
    "url": "https://github.com/creatorem/ui",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "motion",
      "native",
      "components"
    ]
  },
  {
    "slug": "credenza",
    "name": "credenza",
    "description": "Ready-made responsive modal component for shadcn/ui.",
    "url": "https://github.com/redpangilinan/credenza",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "components"
    ]
  },
  {
    "slug": "crypto-charts",
    "name": "crypto-charts",
    "description": "Crypto charts made for shadcn/ui using PythNetwork.",
    "url": "https://github.com/jstnw10/crypto-charts",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "chart",
      "components"
    ]
  },
  {
    "slug": "cult-ui",
    "name": "cult-ui",
    "description": "Curated set of animated shadcn-style React components.",
    "url": "https://www.cult-ui.com/",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "react",
      "components"
    ]
  },
  {
    "slug": "custom-admin-dashboard",
    "name": "custom-admin-dashboard",
    "description": "A minimal, open-source ecommerce admin dashboard template built with shadcn/ui and Next.js. Includes products, products creation and details page, order, customer, and settings pages.",
    "url": "https://github.com/S5SAJID/custom-ecom",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "next.js",
      "dashboard",
      "admin",
      "ai",
      "template"
    ]
  },
  {
    "slug": "data-command",
    "name": "data-command",
    "description": "Component for building dynamic command palettes with API-powered data.",
    "url": "https://shadcn.davidsling.in/components/data-command",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "components"
    ]
  },
  {
    "slug": "date-range-picker-for-shadcn",
    "name": "date-range-picker-for-shadcn",
    "description": "Multi-month views, text entry, preset ranges, responsive design, and date range comparisons.",
    "url": "https://github.com/johnpolacek/date-range-picker-for-shadcn",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "components"
    ]
  },
  {
    "slug": "date-time-picker-shadcn",
    "name": "date-time-picker-shadcn",
    "description": "Datetime Picker for shadNext Project.",
    "url": "https://shadcn-datetime-picker.vercel.app",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "components"
    ]
  },
  {
    "slug": "date-time-range-picker-shadcn",
    "name": "date-time-range-picker-shadcn",
    "description": "Fully featured date-time range picker with multi-month views, timezone support, preset ranges, and modular components for date and time selection.",
    "url": "https://date-time-range-picker.vercel.app/",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "components"
    ]
  },
  {
    "slug": "datetime-picker",
    "name": "datetime-picker",
    "description": "Datetime picker with timezone support, min/max dates, and month/year selection.",
    "url": "https://shadcn-datetime-picker-xi.vercel.app",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "components"
    ]
  },
  {
    "slug": "diffs",
    "name": "diffs",
    "description": "@pierre/diffs is an open source diff and code rendering library. It's built on Shiki for syntax highlighting and theming, is super customizable, and comes packed with features. Made with love by The Pierre Computer Company.",
    "url": "https://diffs.com/",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "components"
    ]
  },
  {
    "slug": "dnd-dashboard",
    "name": "dnd-dashboard",
    "description": "Dashboard with drop-to-swap layouts using Next.js, shadcn/ui, and swapy.",
    "url": "https://github.com/olliethedev/dnd-dashboard",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "next.js",
      "dashboard",
      "components"
    ]
  },
  {
    "slug": "downshift-shadcn-combobox",
    "name": "downshift-shadcn-combobox",
    "description": "Combobox/autocomplete component built with shadcn/ui and Downshift.",
    "url": "https://github.com/TheOmer77/downshift-shadcn-combobox",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "components"
    ]
  },
  {
    "slug": "drag-to-resize-sidebar",
    "name": "drag-to-resize-sidebar",
    "description": "Extended shadcn/ui sidebar component with persisted state drag-to-resize functionality.",
    "url": "https://github.com/lumpinif/drag-to-resize-sidebar",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "components"
    ]
  },
  {
    "slug": "drop-drawer",
    "name": "drop-drawer",
    "description": "A dropdown menu on desktop and a drawer on mobile devices.",
    "url": "https://github.com/jiaweing/DropDrawer",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "mobile",
      "components"
    ]
  },
  {
    "slug": "dy-comps",
    "name": "dy-comps",
    "description": "shacn/ui & Framer Motion React components — flexible, responsive & easy to drop into any project.",
    "url": "https://dycomps.oimmi.com/",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "react",
      "motion",
      "framer-motion",
      "components"
    ]
  },
  {
    "slug": "eldora-ui",
    "name": "eldora-ui",
    "description": "free and open-source animated components built with React, Typescript, Tailwind CSS, and Framer Motion.",
    "url": "https://eldoraui.site/",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "react",
      "ai",
      "motion",
      "framer-motion",
      "components"
    ]
  },
  {
    "slug": "emblor",
    "name": "emblor",
    "description": "Customizable, accessible tag input component with shadcn/ui.",
    "url": "https://github.com/JaleelB/emblor",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "components"
    ]
  },
  {
    "slug": "enhanced-button",
    "name": "enhanced-button",
    "description": "Enhanced version of the default shadcn-button component.",
    "url": "https://github.com/jakobhoeg/enhanced-button",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "components"
    ]
  },
  {
    "slug": "envin",
    "name": "envin",
    "description": "Framework-agnostic, type-safe tool to validate and preview your environment variables - powered by your favorite schema validator.",
    "url": "https://envin.turbostarter.dev",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "components"
    ]
  },
  {
    "slug": "eo-n-ui",
    "name": "eo-n/ui",
    "description": "Enhanced UI components built on shadcn's robust foundation, integrated with Base UI and Tailwind CSS for a modern and customizable design system.",
    "url": "https://github.com/aeonzz/eo-n",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "ai",
      "components"
    ]
  },
  {
    "slug": "extend-ui",
    "name": "extend-ui",
    "description": "Reusable components built on shadcn/ui for web applications.",
    "url": "https://www.extend-ui.com/",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "components"
    ]
  },
  {
    "slug": "fancy-area",
    "name": "fancy-area",
    "description": "Textarea with @mention support inspired by GitHub's PR comment section.",
    "url": "https://craft.mxkaske.dev/post/fancy-area",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "components"
    ]
  },
  {
    "slug": "fancy-box",
    "name": "fancy-box",
    "description": "GitHub PR label selector-inspired Combobox with radix-ui components.",
    "url": "https://craft.mxkaske.dev/post/fancy-box",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "components"
    ]
  },
  {
    "slug": "fancy-multi-select",
    "name": "fancy-multi-select",
    "description": "Multi Select Component inspired by campsite.design and cal.com.",
    "url": "https://craft.mxkaske.dev/post/fancy-multi-select",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "components"
    ]
  },
  {
    "slug": "fancy-switch",
    "name": "fancy-switch",
    "description": "Fancy switch component built with shadcn/ui.",
    "url": "https://github.com/Aslam97/react-fancy-switch",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "components"
    ]
  },
  {
    "slug": "file-uploader",
    "name": "file-uploader",
    "description": "File uploader with shadcn/ui and react-dropzone.",
    "url": "https://github.com/sadmann7/file-uploader",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "react",
      "components"
    ]
  },
  {
    "slug": "file-vault",
    "name": "file-vault",
    "description": "File upload component for React.",
    "url": "https://github.com/ManishBisht777/file-vault",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "react",
      "components"
    ]
  },
  {
    "slug": "flightcn",
    "name": "flightcn",
    "description": "flightcn is a flight route visualization component set built for the mapcn ecosystem",
    "url": "https://flightcn.yencheng.dev/",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "components"
    ]
  },
  {
    "slug": "floating-dragable-card",
    "name": "floating-dragable-card",
    "description": "Dragable and resizable card using shadcn/ui elements.",
    "url": "https://github.com/nishansanjuka/react-drag-card",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "components"
    ]
  },
  {
    "slug": "fluid-functionalism",
    "name": "fluid-functionalism",
    "description": "Refined shadcn/ui-compatible components with spring physics, proximity hover, and font weight transitions. Every animation serves a functional purpose.",
    "url": "https://fluid-functionalism.vercel.app",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "animations",
      "components"
    ]
  },
  {
    "slug": "fusion-ui",
    "name": "fusion-ui",
    "description": "Library combining shadcn/ui and MagicUI.",
    "url": "https://github.com/nyxb-ui/ui",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "components"
    ]
  },
  {
    "slug": "glasscn-ui",
    "name": "glasscn-ui",
    "description": "shadcn/ui component library with glassmorphism variants, and many additional components.",
    "url": "https://github.com/itsjavi/glasscn-ui",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "components"
    ]
  },
  {
    "slug": "glitchcn-ui",
    "name": "glitchcn-ui",
    "description": "A terminal-styled cyberpunk component library for Next.js with scanline effects, glowing borders, and monospace typography.",
    "url": "https://glitchcn-ui.vercel.app/",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "next.js",
      "components"
    ]
  },
  {
    "slug": "gluestack-ui",
    "name": "gluestack-ui",
    "description": "React & React Native Components with Tailwind CSS.",
    "url": "https://gluestack.io",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "react",
      "ai",
      "native",
      "components"
    ]
  },
  {
    "slug": "goey-toast",
    "name": "goey-toast",
    "description": "Morphing toast notifications for React. Organic blob animations, promise tracking, and full customization out of the box",
    "url": "https://goey-toast.vercel.app/",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "react",
      "animations",
      "components"
    ]
  },
  {
    "slug": "heroicons-animated",
    "name": "heroicons-animated",
    "description": "An open-source collection of 316 beautifully animated heroicons for your projects.",
    "url": "https://heroicons-animated.vercel.app/",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "icons",
      "components"
    ]
  },
  {
    "slug": "hexta-ui",
    "name": "hexta-ui",
    "description": "Build stunning websites effortlessly. Modern, responsive, and customizable UI components for Next.js. Copy, adapt, and personalize them.",
    "url": "https://hextaui.com",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "next.js",
      "components"
    ]
  },
  {
    "slug": "ibelick-background-snippet",
    "name": "ibelick/background-snippet",
    "description": "Ready to use collection of modern background snippets.",
    "url": "https://bg.ibelick.com/",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "components"
    ]
  },
  {
    "slug": "image-crop-field",
    "name": "image-crop-field",
    "description": "Image crop field with shadcn/ui. This component is a wrapper around the react-easy-crop component.",
    "url": "https://github.com/JsCodeDevlopment/upload-crop-image",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "react",
      "components"
    ]
  },
  {
    "slug": "image-upload-shadcn",
    "name": "image-upload-shadcn",
    "description": "Image upload component.",
    "url": "https://github.com/kushagrasarathe/image-upload-shadcn",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "components"
    ]
  },
  {
    "slug": "indie-ui",
    "name": "indie-ui",
    "description": "UI components with variants.",
    "url": "https://github.com/Ali-Hussein-dev/indie-ui",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "components"
    ]
  },
  {
    "slug": "inspira-ui",
    "name": "inspira-ui",
    "description": "UI components for animated interfaces in Vue/NuxtJS.",
    "url": "https://inspira-ui.com/",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "vue",
      "components"
    ]
  },
  {
    "slug": "jolyui",
    "name": "jolyui",
    "description": "JolyUI is a modern React component library built with TypeScript, Tailwind CSS and Motion. It offers a wide range of customizable and accessible UI components to help you build stunning web applications quickly and efficiently.",
    "url": "https://github.com/Johuniq/jolyui",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "react",
      "ai",
      "motion",
      "components"
    ]
  },
  {
    "slug": "jalco-ui",
    "name": "jalco-ui",
    "description": "Polished, composable React components distributed via a shadcn-compatible registry. Install with one command or copy the source directly.",
    "url": "https://ui.justinlevine.me",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "react",
      "components"
    ]
  },
  {
    "slug": "junwen-k-ui-x",
    "name": "junwen-k/ui-x",
    "description": "Additional beautifully designed components that you can copy and paste into your apps. Accessible. Customizable. Open Source.",
    "url": "https://ui-x.junwen-k.dev/",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "components"
    ]
  },
  {
    "slug": "kanban-board",
    "name": "kanban-board",
    "description": "A production-ready Kanban board built on shadcn/ui with React & Tailwind CSS: zero dependencies, drag-and-drop, keyboard accessibility and seamless theming.",
    "url": "https://shadcn-kanban-board.com/",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "react",
      "ai",
      "components"
    ]
  },
  {
    "slug": "kibo-ui",
    "name": "kibo-ui",
    "description": "Kibo UI is designed to be a more comprehensive library of components that can be used to build more complex applications.",
    "url": "https://www.kibo-ui.com/overview",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "components"
    ]
  },
  {
    "slug": "kokonut-ui",
    "name": "kokonut-ui",
    "description": "Free Modern and Customizable components for Next.js.",
    "url": "https://kokonutui.com/",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "next.js",
      "components"
    ]
  },
  {
    "slug": "ktui",
    "name": "ktui",
    "description": "Open-source collection of customizable UI components for Tailwind CSS and vanilla JavaScript",
    "url": "https://github.com/keenthemes/ktui",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "ai",
      "components"
    ]
  },
  {
    "slug": "launch-ui",
    "name": "launch-ui",
    "description": "Landing page components with React, Shadcn/ui and Tailwind.",
    "url": "https://www.launchuicomponents.com/",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "react",
      "landing",
      "ai",
      "components"
    ]
  },
  {
    "slug": "lingua-time",
    "name": "lingua-time",
    "description": "Smart datetime picker with natural language input.",
    "url": "https://github.com/nainglinnkhant/lingua-time",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "components"
    ]
  },
  {
    "slug": "linked-chart",
    "name": "linked-chart",
    "description": "Chart component linked with data-table.",
    "url": "https://github.com/ardasisbot/linked-chart",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "table",
      "chart",
      "components"
    ]
  },
  {
    "slug": "loading-ui",
    "name": "loading-ui",
    "description": "Curated, copy-friendly spinners, loaders, and loading-state animations for the web—free and open source.",
    "url": "https://loading-ui.com/",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "animations",
      "components"
    ]
  },
  {
    "slug": "lukacho-ui",
    "name": "lukacho-ui",
    "description": "Next Generation UI Components.",
    "url": "https://ui.lukacho.com/components",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "components"
    ]
  },
  {
    "slug": "magicui",
    "name": "magicui",
    "description": "React components for landing pages with tailwindcss + framer motion.",
    "url": "https://magicui.design",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "react",
      "landing",
      "ai",
      "motion",
      "framer-motion"
    ]
  },
  {
    "slug": "maily-to",
    "name": "maily.to",
    "description": "Notion-like powerful email editor.",
    "url": "https://github.com/arikchakma/maily.to",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "ai",
      "editor",
      "components"
    ]
  },
  {
    "slug": "manfromexistence-ui",
    "name": "manfromexistence-ui",
    "description": "Components to build beautiful designs.",
    "url": "https://github.com/manfromexistence/ui",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "components"
    ]
  },
  {
    "slug": "manifest-ui",
    "name": "manifest-ui",
    "description": "Components for ChatGPT Apps and MCP Apps.",
    "url": "https://ui.manifest.build",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "chat",
      "components"
    ]
  },
  {
    "slug": "matsu-theme",
    "name": "matsu-theme",
    "description": "Ghibli Studio inspired theme for shadcn/ui made by Matt Wierzbicki",
    "url": "https://matsu-theme.vercel.app/",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "theme",
      "components"
    ]
  },
  {
    "slug": "mindmapcn",
    "name": "mindmapcn",
    "description": "Beautiful mind maps, works seamlessly with shadcn/ui.",
    "url": "https://github.com/SSShooter/mindmapcn",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "components"
    ]
  },
  {
    "slug": "minimal-tiptap",
    "name": "minimal-tiptap",
    "description": "Minimal WYSIWYG editor with shadcn/ui and tiptap.",
    "url": "https://github.com/Aslam97/shadcn-minimal-tiptap",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "editor",
      "components"
    ]
  },
  {
    "slug": "mixcnui",
    "name": "mixcnui",
    "description": "Collection of animated components for Nextjs.",
    "url": "https://github.com/taqui-786/mixcnui",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "next.js",
      "components"
    ]
  },
  {
    "slug": "modal-control-query",
    "name": "modal-control-query",
    "description": "A hook to control shadcn modal components using query params",
    "url": "https://shadcn.davidsling.in/hooks/use-modal-control-query",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "components"
    ]
  },
  {
    "slug": "moleculeui",
    "name": "moleculeui",
    "description": "A modern React component library focused on intuitive interactions and seamless user experiences.",
    "url": "https://www.moleculeui.design/",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "react",
      "components"
    ]
  },
  {
    "slug": "multi-selection",
    "name": "multi-selection",
    "description": "Managing multi-selection functionality with highlighter.",
    "url": "https://github.com/sherifawad/multi-selection-with-add-remove",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "components"
    ]
  },
  {
    "slug": "mvpblocks",
    "name": "mvpblocks",
    "description": "Copy-paste beautiful, responsive components without worrying about styling or animations. Build faster, launch sooner.",
    "url": "https://blocks.mvp-subha.me",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "animations",
      "blocks",
      "components"
    ]
  },
  {
    "slug": "mynaui",
    "name": "mynaui",
    "description": "TailwindCSS and shadcn/ui UI Kit for Figma and React.",
    "url": "https://mynaui.com/",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "react",
      "ai",
      "components"
    ]
  },
  {
    "slug": "neobrutalism-components",
    "name": "neobrutalism-components",
    "description": "Neobrutalism-styled Tailwind React and shadcn/ui components.",
    "url": "https://github.com/ekmas/neobrutalism-components",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "react",
      "ai",
      "components"
    ]
  },
  {
    "slug": "nextjs-components",
    "name": "nextjs-components",
    "description": "Next.js components with TypeScript and shadcn/ui.",
    "url": "https://components.bridger.to/",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "next.js",
      "components"
    ]
  },
  {
    "slug": "nextjs-dnd",
    "name": "nextjs-dnd",
    "description": "Sortable Drag and Drop with Next.js and dnd-kit.",
    "url": "https://github.com/sujjeee/nextjs-dnd",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "next.js",
      "table",
      "components"
    ]
  },
  {
    "slug": "nextjs-link-pagination",
    "name": "nextjs-link-pagination",
    "description": "Pagination using Nextjs Links and search params.",
    "url": "https://shadcn-next-link-pagination.vercel.app",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "next.js",
      "components"
    ]
  },
  {
    "slug": "nextjs-multi-image-upload",
    "name": "nextjs-multi-image-upload",
    "description": "Compact, responsive file uploader with shadcn/ui, React Hook Form, and cloud support (S3/R2).",
    "url": "https://github.com/jacksonkasi0/nextjs-multi-image-upload",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "next.js",
      "react",
      "form",
      "components"
    ]
  },
  {
    "slug": "next-stepper",
    "name": "next-stepper",
    "description": "Dynamic multi-step form with Next.js and zustand.",
    "url": "https://github.com/ebulku/next-stepper",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "next.js",
      "form",
      "components"
    ]
  },
  {
    "slug": "nexus-ui",
    "name": "nexus-ui",
    "description": "Open-source component library of composable, copy-paste primitives for building AI interfaces (chat, voice, agents)",
    "url": "https://nexus-ui.dev/",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "ai",
      "chat",
      "components"
    ]
  },
  {
    "slug": "novel",
    "name": "novel",
    "description": "Notion-style WYSIWYG editor with AI-powered autocompletion.",
    "url": "https://github.com/steven-tey/novel",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "ai",
      "editor",
      "components"
    ]
  },
  {
    "slug": "number-flow",
    "name": "number-flow",
    "description": "React component for number transitions and formatting.",
    "url": "https://number-flow.barvian.me/",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "react",
      "form",
      "components"
    ]
  },
  {
    "slug": "origin-ui",
    "name": "origin-ui",
    "description": "Beautiful UI components with Tailwind CSS and Next.js.",
    "url": "https://originui.com/",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "next.js",
      "ai",
      "components"
    ]
  },
  {
    "slug": "password-input",
    "name": "password-input",
    "description": "shadcn/ui custom password input.",
    "url": "https://gist.github.com/mjbalcueva/b21f39a8787e558d4c536bf68e267398",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "components"
    ]
  },
  {
    "slug": "payment-gateways",
    "name": "payment-gateways",
    "description": "Integration of payment gateways with Next.js 14.",
    "url": "https://github.com/PremPrakashCodes/payment-gateways",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "next.js",
      "payments",
      "components"
    ]
  },
  {
    "slug": "pdfx",
    "name": "pdfx",
    "description": "shadcn/ui-style PDF component library for React. Copy-paste components built on @react-pdf/renderer run pdfx add invoice and own the code.",
    "url": "https://github.com/akii09/pdfx",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "react",
      "components"
    ]
  },
  {
    "slug": "phone-input-shadcn-ui",
    "name": "phone-input-shadcn-ui",
    "description": "Custom phone number component with shadcn/ui.",
    "url": "https://www.armand-salle.fr/post/phone-input-shadcn-ui",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "components"
    ]
  },
  {
    "slug": "pittaya-ui",
    "name": "pittaya-ui",
    "description": "A fully open-source UI library for React, powered by TypeScript and Tailwind CSS. Fast, composable, and ready for production.",
    "url": "https://github.com/pittaya-ui/ui-kit",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "react",
      "ai",
      "components"
    ]
  },
  {
    "slug": "planner",
    "name": "planner",
    "description": "Adaptable scheduling component for React.",
    "url": "https://github.com/UretzkyZvi/planner",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "react",
      "table",
      "components"
    ]
  },
  {
    "slug": "plate",
    "name": "plate",
    "description": "AI-powered rich-text editor.",
    "url": "https://github.com/udecode/plate",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "ai",
      "editor",
      "components"
    ]
  },
  {
    "slug": "plate-select-editor",
    "name": "plate-select-editor",
    "description": "Rich multi-select editor.",
    "url": "https://platejs.org/docs/multi-select",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "editor",
      "components"
    ]
  },
  {
    "slug": "pqoqubbw",
    "name": "pqoqubbw",
    "description": "Open-source animated icons collection.",
    "url": "https://icons.pqoqubbw.dev/",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "icons",
      "components"
    ]
  },
  {
    "slug": "pricing-page-shadcn",
    "name": "pricing-page-shadcn",
    "description": "Customizable pricing page with Next.js 14.",
    "url": "https://github.com/m4nute/pricing-page-shadcn",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "next.js",
      "components"
    ]
  },
  {
    "slug": "progress-button",
    "name": "progress-button",
    "description": "Extended button component with progress UX.",
    "url": "https://github.com/tomredman/ProgressButton",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "components"
    ]
  },
  {
    "slug": "re-ui",
    "name": "re-ui",
    "description": "Open-source collection of UI components and animated effects built with React, Typescript, Tailwind CSS, and Motion. Pairs beautifully with shadcn/ui",
    "url": "https://reui.io/",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "react",
      "ai",
      "motion",
      "components"
    ]
  },
  {
    "slug": "react-dnd-kit-tailwind-shadcn-ui",
    "name": "react-dnd-kit-tailwind-shadcn-ui",
    "description": "Accessible kanban board with dnd-kit.",
    "url": "https://github.com/Georgegriff/react-dnd-kit-tailwind-shadcn-ui",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "react",
      "ai",
      "components"
    ]
  },
  {
    "slug": "react-highlight-popover",
    "name": "react-highlight-popover",
    "description": "Headless component for text selection popovers.",
    "url": "https://react-highlight-popover.omsimos.com",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "react",
      "components"
    ]
  },
  {
    "slug": "react-pdf-flipbook-viewer",
    "name": "react-pdf-flipbook-viewer",
    "description": "PDF flipbook viewer with zoom and fullscreen.",
    "url": "https://github.com/mohitkumawat310/react-pdf-flipbook-viewer",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "react",
      "components"
    ]
  },
  {
    "slug": "react-select",
    "name": "react-select",
    "description": "React-select library with shadcn styling.",
    "url": "https://gist.github.com/ilkou/7bf2dbd42a7faf70053b43034fc4b5a4",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "react",
      "components"
    ]
  },
  {
    "slug": "react-wheel-picker",
    "name": "react-wheel-picker",
    "description": "iOS-like wheel picker for React with smooth inertia scrolling and infinite loop support.",
    "url": "https://react-wheel-picker.chanhdai.com",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "react",
      "components"
    ]
  },
  {
    "slug": "recursive-dnd-kanban-board",
    "name": "recursive-dnd-kanban-board",
    "description": "Recursive drag and drop kanban board.",
    "url": "https://github.com/mehrdadrafiee/recursive-dnd-kanban-board",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "components"
    ]
  },
  {
    "slug": "remocn",
    "name": "remocn",
    "description": "Build product demos, changelogs, and launch videos in React. Open source and delightfully easy",
    "url": "https://www.remocn.dev/",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "react",
      "components"
    ]
  },
  {
    "slug": "retro-ui",
    "name": "retro-ui",
    "description": "An open source component library, inspred by neo brutalism design system",
    "url": "https://retroui.dev",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "components"
    ]
  },
  {
    "slug": "roadmap-ui",
    "name": "roadmap-ui",
    "description": "Components for interactive roadmaps.",
    "url": "https://github.com/haydenbleasel/roadmap-ui",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "components"
    ]
  },
  {
    "slug": "ruixen-ui",
    "name": "ruixen-ui",
    "description": "Ruixen UI: Lightweight & Customizable React Library",
    "url": "https://github.com/ruixenui/ruixen.com",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "react",
      "components"
    ]
  },
  {
    "slug": "scificn-ui",
    "name": "scificn-ui",
    "description": "A retro sci-fi UI design system inspired by classic starship consoles and alien computer terminals, featuring modular HUD components, neon data grids, tactical panels, and cinematic interface elements that blend 70s–80s futurism with modern usability.",
    "url": "https://github.com/baxy5/scificn-ui",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "components"
    ]
  },
  {
    "slug": "search-address",
    "name": "search-address",
    "description": "Interactive address search using OpenStreetMap.",
    "url": "https://github.com/UretzkyZvi/search-address",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "components"
    ]
  },
  {
    "slug": "shadboard",
    "name": "shadboard",
    "description": "An admin dashboard template built with Next.js 15, React 19, Tailwind CSS v4, and Shadcn/UI components, featuring starter and full kits for scalable, user-friendly web apps.",
    "url": "https://github.com/Qualiora/shadboard",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "next.js",
      "react",
      "dashboard",
      "admin",
      "ai"
    ]
  },
  {
    "slug": "shadcn-address-autocomplete",
    "name": "shadcn-address-autocomplete",
    "description": "Address autocomplete with Google Places API.",
    "url": "https://github.com/NiazMorshed2007/shadcn-address-autocomplete",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "components"
    ]
  },
  {
    "slug": "shadcn-admin",
    "name": "shadcn-admin",
    "description": "Admin Dashboard UI with shadcn/ui and Vite.",
    "url": "https://github.com/satnaing/shadcn-admin",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "dashboard",
      "admin",
      "components"
    ]
  },
  {
    "slug": "shadcn-admin-kit",
    "name": "shadcn-admin-kit",
    "description": "Powerful open-source shadcn components to build beautiful internal tools, admin panels, and dashboards with React",
    "url": "https://github.com/marmelab/shadcn-admin-kit",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "react",
      "dashboard",
      "admin",
      "components"
    ]
  },
  {
    "slug": "shadcn-blocks",
    "name": "shadcn-blocks",
    "description": "Official pre-made customizable components.",
    "url": "https://ui.shadcn.com/blocks",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "blocks",
      "components"
    ]
  },
  {
    "slug": "shadcn-blocks-com",
    "name": "shadcn-blocks-com",
    "description": "Premium shadcn/ui registry with 1429 blocks, 1189 component variants, 14 templates, Figma kit, themes, and admin dashboard resources.",
    "url": "https://www.shadcnblocks.com",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "dashboard",
      "admin",
      "theme",
      "blocks",
      "template"
    ]
  },
  {
    "slug": "shadcn-builder",
    "name": "shadcn-builder",
    "description": "Create beautiful, responsive forms with the easy-to-use form builder and generate React code using shadcn/ui components.",
    "url": "https://www.shadcn-builder.com/?utm_source=github&utm_content=awesome-shadcn-ui",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "react",
      "form",
      "components"
    ]
  },
  {
    "slug": "shadcn-cal",
    "name": "shadcn-cal",
    "description": "Cal.com monthly calendar replica with shadcn/ui.",
    "url": "https://shadcn-cal-com.vercel.app/?date=2024-04-29",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "components"
    ]
  },
  {
    "slug": "shadcn-calendar-heatmap",
    "name": "shadcn-calendar-heatmap",
    "description": "Modern calendar heatmap alternative.",
    "url": "https://shadcn-calendar-heatmap.vercel.app/",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "native",
      "components"
    ]
  },
  {
    "slug": "shadcn-calendar-component",
    "name": "shadcn-calendar-component",
    "description": "Calendar date picker component.",
    "url": "https://github.com/sersavan/shadcn-calendar-component",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "components"
    ]
  },
  {
    "slug": "shadcn-chat",
    "name": "shadcn-chat",
    "description": "Customizable chat component.",
    "url": "https://github.com/jakobhoeg/shadcn-chat",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "chat",
      "components"
    ]
  },
  {
    "slug": "shadcn-carousel-testimonials",
    "name": "shadcn-carousel-testimonials",
    "description": "Carousel Testimonials component.",
    "url": "https://github.com/johanguse/shadcn-carousel-testimonials",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "components"
    ]
  },
  {
    "slug": "shadcn-chatbot-kit",
    "name": "shadcn-chatbot-kit",
    "description": "Customizable chatbot components.",
    "url": "https://shadcn-chatbot-kit.vercel.app/",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "chat",
      "components"
    ]
  },
  {
    "slug": "shadcn-color-picker",
    "name": "shadcn-color-picker",
    "description": "Color picker with react-color.",
    "url": "https://shadcn-color-picker.vercel.app/",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "react",
      "color",
      "components"
    ]
  },
  {
    "slug": "shadcn-cookies",
    "name": "shadcn-cookies",
    "description": "Sleek and flexible cookie consent component, designed with shadcn/ui",
    "url": "https://shadcn-cookies.vercel.app/",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "components"
    ]
  },
  {
    "slug": "shadcn-cookie-consent",
    "name": "shadcn-cookie-consent",
    "description": "Customizable cookie consent component.",
    "url": "https://github.com/r2hu1/shadcn-cookie-consent",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "components"
    ]
  },
  {
    "slug": "shadcn-components-blocks",
    "name": "shadcn-components-blocks",
    "description": "The ultimate blocks and components for Shadcn UI & Tailwind CSS.",
    "url": "https://shadcncomponents.dev/",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "ai",
      "blocks",
      "components"
    ]
  },
  {
    "slug": "shadcn-country-dropdown",
    "name": "shadcn-country-dropdown",
    "description": "ISO 3166 country selector dropdown.",
    "url": "https://shadcn-country-dropdown.vercel.app/",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "components"
    ]
  },
  {
    "slug": "shadcn-data-table-advanced-col-opions",
    "name": "shadcn-data-table-advanced-col-opions",
    "description": "DataTable with column resizing.",
    "url": "https://github.com/danielagg/shadcn-data-table-advanced-col-opions",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "table",
      "components"
    ]
  },
  {
    "slug": "shadcn-date-picker",
    "name": "shadcn-date-picker",
    "description": "Advanced date picker with various features.",
    "url": "https://date-picker.luca-felix.com",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "components"
    ]
  },
  {
    "slug": "shadcn-drag-and-drop-sort",
    "name": "shadcn-drag-and-drop-sort",
    "description": "Drag-and-drop sortable list of pills of different widths using dnd-kit.",
    "url": "https://github.com/crystaltai/shadcn-drag-and-drop",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "table",
      "components"
    ]
  },
  {
    "slug": "shadcn-drag-table",
    "name": "shadcn-drag-table",
    "description": "Drag-and-drop table component.",
    "url": "https://github.com/zenoncao/shadcn-drag-table",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "table",
      "components"
    ]
  },
  {
    "slug": "shadcn-dropzone",
    "name": "shadcn-dropzone",
    "description": "File upload component using React-Dropzone, built with accessibility in mind.",
    "url": "https://github.com/janglad/shadcn-dropzone",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "react",
      "components"
    ]
  },
  {
    "slug": "shadcn-editor",
    "name": "shadcn-editor",
    "description": "Lexical editor with shadcn theme.",
    "url": "https://github.com/htmujahid/shadcn-editor",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "editor",
      "theme",
      "components"
    ]
  },
  {
    "slug": "shadcn-examples",
    "name": "shadcn-examples",
    "description": "Dozens of advanced shadcn/ui examples. Easily integrate sample applications and components into your project.",
    "url": "https://shadcnexamples.com",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "components"
    ]
  },
  {
    "slug": "shadcn-extends",
    "name": "shadcn-extends",
    "description": "Collection of shadcn/ui components.",
    "url": "https://github.com/lucioew28/extends",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "components"
    ]
  },
  {
    "slug": "shadcn-extension",
    "name": "shadcn-extension",
    "description": "Open-source component collection.",
    "url": "https://github.com/BelkacemYerfa/shadcn-extension",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "components"
    ]
  },
  {
    "slug": "shadcn-fintech",
    "name": "shadcn-fintech",
    "description": "Premium fintech dashboard with 10 pages — drag-and-drop layout, 3D credit cards, live investment ticker, spending heatmap, actionable notifications, and dark mode. Built with Next.js 16, shadcn/ui, and Tailwind CSS v4.",
    "url": "https://github.com/abderrahimghazali/shadcn-fintech",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "next.js",
      "dashboard",
      "ai",
      "components"
    ]
  },
  {
    "slug": "shadcn-font-picker",
    "name": "shadcn-font-picker",
    "description": "Font picker using shadcn/ui components and google font API.",
    "url": "https://shadcn-font-picker.vercel.app",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "components"
    ]
  },
  {
    "slug": "shadcn-full-calendar",
    "name": "shadcn-full-calendar",
    "description": "A feature-rich calendar application built with React, TypeScript, and ShadCN UI components. This project provides a customizable and interactive calendar experience with multiple views, event management, and a modern UI.",
    "url": "https://github.com/yassir-jeraidi/full-calendar",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "react",
      "components"
    ]
  },
  {
    "slug": "shadcn-iconpicker",
    "name": "shadcn-iconpicker",
    "description": "React/shadcn simple icon picker using lucide icons.",
    "url": "https://icon-picker.alan-courtois.fr/",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "react",
      "icons",
      "components"
    ]
  },
  {
    "slug": "shadcn-image-cropper",
    "name": "shadcn-image-cropper",
    "description": "Image cropper with react-image-crop.",
    "url": "https://github.com/sujjeee/shadcn-image-cropper",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "react",
      "components"
    ]
  },
  {
    "slug": "shadcn-io",
    "name": "shadcn-io",
    "description": "Advanced Shadcn/UI components.",
    "url": "https://shadcn.io",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "components"
    ]
  },
  {
    "slug": "shadcn-linear-combobox",
    "name": "shadcn-linear-combobox",
    "description": "Linear-style task priority combobox.",
    "url": "https://github.com/damianricobelli/shadcn-linear-combobox",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "components"
    ]
  },
  {
    "slug": "shadcn-location-picker",
    "name": "shadcn-location-picker",
    "description": "Simple google maps location picker.",
    "url": "https://github.com/brielov/shadcn-location-picker",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "components"
    ]
  },
  {
    "slug": "shadcn-map",
    "name": "shadcn-map",
    "description": "A map component built for shadcn/ui using Leaflet and React Leaflet.",
    "url": "https://shadcn-map.vercel.app/",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "react",
      "components"
    ]
  },
  {
    "slug": "shadcn-multi-select-component",
    "name": "shadcn-multi-select-component",
    "description": "Multi-select component.",
    "url": "https://github.com/sersavan/shadcn-multi-select-component",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "components"
    ]
  },
  {
    "slug": "shadcn-number-scrubber",
    "name": "shadcn-number-scrubber",
    "description": "Draggable numeric input component.",
    "url": "https://github.com/camwebby/shadcn-react-number-scrubber",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "components"
    ]
  },
  {
    "slug": "shadcn-packaged",
    "name": "shadcn-packaged",
    "description": "This is an npm package that exports all shadcn/ui components without the need for a CLI, designed for ease of use.",
    "url": "https://github.com/anuoua/shadcn-packaged",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "components"
    ]
  },
  {
    "slug": "shadcn-phone-input-2",
    "name": "shadcn-phone-input-2",
    "description": "Phone input with libphonenumber-js.",
    "url": "https://github.com/damianricobelli/shadcn-phone-input",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "components"
    ]
  },
  {
    "slug": "shadcn-phone-input",
    "name": "shadcn-phone-input",
    "description": "Phone input with country validation.",
    "url": "https://github.com/omeralpi/shadcn-phone-input",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "components"
    ]
  },
  {
    "slug": "shadcn-portable-text-editor",
    "name": "shadcn-portable-text-editor",
    "description": "A headless rich text editor built upon Sanity's Portable Text Editor with opinionated starting styles",
    "url": "",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "table",
      "editor",
      "components"
    ]
  },
  {
    "slug": "shadcn-pricing-page",
    "name": "shadcn-pricing-page",
    "description": "Responsive pricing component with toggles.",
    "url": "https://github.com/aymanch-03/shadcn-pricing-page",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "components"
    ]
  },
  {
    "slug": "shadcn-space-2",
    "name": "shadcn-space",
    "description": "Open-source shadcn/ui blocks, components, and templates built with React, Tailwind, and Base UI.",
    "url": "https://github.com/shadcnspace/shadcnspace",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "react",
      "ai",
      "blocks",
      "template",
      "components"
    ]
  },
  {
    "slug": "shadcn-spinner",
    "name": "shadcn-spinner",
    "description": "Spinner component.",
    "url": "https://github.com/allipiopereira/shadcn-spinner",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "components"
    ]
  },
  {
    "slug": "shadcn-stepper",
    "name": "shadcn-stepper",
    "description": "Complete stepper component.",
    "url": "https://github.com/damianricobelli/stepperize",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "components"
    ]
  },
  {
    "slug": "shadcn-studio",
    "name": "shadcn-studio",
    "description": "Open Source Registry of Shadcn components and blocks.",
    "url": "https://shadcnstudio.com/",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "blocks",
      "components"
    ]
  },
  {
    "slug": "shadcn-table-maker",
    "name": "shadcn-table-maker",
    "description": "Tool for creating dynamic tables.",
    "url": "https://shadcn-table-maker.vercel.app/",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "table",
      "components"
    ]
  },
  {
    "slug": "shadcn-table-v2",
    "name": "shadcn-table-v2",
    "description": "Table with server-side features.",
    "url": "https://github.com/sadmann7/shadcn-table",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "table",
      "components"
    ]
  },
  {
    "slug": "shadcn-tanstack-form",
    "name": "shadcn-tanstack-form",
    "description": "Seamless shadcn TanStack Form component set. Fully featured with validation support and type-safety.",
    "url": "https://shadcn-tanstack-form.felipestanzani.com/",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "form",
      "components"
    ]
  },
  {
    "slug": "shadcn-timeline",
    "name": "shadcn-timeline",
    "description": "Customizable timeline component.",
    "url": "https://github.com/timDeHof/shadcn-timeline",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "components"
    ]
  },
  {
    "slug": "shadcn-tiptap",
    "name": "shadcn-tiptap",
    "description": "Custom Tiptap editor extensions.",
    "url": "https://github.com/NiazMorshed2007/shadcn-tiptap",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "editor",
      "components"
    ]
  },
  {
    "slug": "shadcn-tree-view",
    "name": "shadcn-tree-view",
    "description": "Hierarchical data component.",
    "url": "https://github.com/mrlightful/shadcn-tree-view",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "components"
    ]
  },
  {
    "slug": "shadcn-ui-blocks",
    "name": "shadcn-ui-blocks",
    "description": "Collection of responsive UI blocks.",
    "url": "https://shadcn-ui-blocks.vercel.app/",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "blocks",
      "components"
    ]
  },
  {
    "slug": "shadcn-ui-expansions",
    "name": "shadcn-ui-expansions",
    "description": "Additional useful components.",
    "url": "https://github.com/hsuanyi-chou/shadcn-ui-expansions",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "components"
    ]
  },
  {
    "slug": "shadcn-ui-sidebar",
    "name": "shadcn-ui-sidebar",
    "description": "Retractable responsive sidebar.",
    "url": "https://github.com/salimi-my/shadcn-ui-sidebar",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "table",
      "components"
    ]
  },
  {
    "slug": "shadcn-ui-templates",
    "name": "shadcn-ui-templates",
    "description": "Free & Premium templates collection.",
    "url": "https://shadcnui-templates.com",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "template",
      "components"
    ]
  },
  {
    "slug": "shadcnship",
    "name": "shadcnship",
    "description": "Production-ready shadcn/ui component registry for building modern SaaS applications with Next.js, TypeScript, and Tailwind CSS.",
    "url": "https://github.com/arnaudvolp/shadcnship",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "next.js",
      "saas",
      "ai",
      "components"
    ]
  },
  {
    "slug": "shadcn-event-calendar",
    "name": "shadcn-event-calendar",
    "description": "A beautiful and flexible event calendar component inspired by Google Calendar and Notion, built with Shadcn UI, TailwindCSS, and Framer Motion.",
    "url": "https://shadcn-event-calendar.vercel.app",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "ai",
      "motion",
      "framer-motion",
      "components"
    ]
  },
  {
    "slug": "shieldcn",
    "name": "shieldcn",
    "description": "Shields.io alternative that renders GitHub badges as shadcn/ui Button components via Satori. Supports npm, GitHub, Discord, Reddit badges with dark/light mode, 6 variants, and 40k+ icons.",
    "url": "https://shieldcn.dev",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "icons",
      "native",
      "components"
    ]
  },
  {
    "slug": "shsfui",
    "name": "shsfui",
    "description": "Motion-first React components built with Tailwind CSS + Framer Motion.",
    "url": "https://www.shsfui.com",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "react",
      "ai",
      "motion",
      "framer-motion",
      "components"
    ]
  },
  {
    "slug": "shuip",
    "name": "shuip",
    "description": "Provides ready-to-use, business-focused components that help you ship faster.",
    "url": "https://shuip.plvo.dev/docs",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "components"
    ]
  },
  {
    "slug": "siddz-ui",
    "name": "siddz-ui",
    "description": "A curated collection of modern, reusable React components. Built with performance and accessibility in mind. Copy, paste, and customize.",
    "url": "https://siddz.com/components",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "react",
      "form",
      "components"
    ]
  },
  {
    "slug": "simple-ai",
    "name": "simple-ai",
    "description": "Components and blocks to easily build AI apps",
    "url": "https://simple-ai.dev",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "ai",
      "blocks",
      "components"
    ]
  },
  {
    "slug": "simple-image-uploader",
    "name": "simple-image-uploader",
    "description": "Image uploader with dnd, validation and previews",
    "url": "https://simple-image-uploader-bice.vercel.app/",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "components"
    ]
  },
  {
    "slug": "simplekit",
    "name": "simplekit",
    "description": "Wallet and account component for Wagmi.",
    "url": "https://github.com/vaunblu/SimpleKit",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "components"
    ]
  },
  {
    "slug": "skiper-ui",
    "name": "skiper-ui",
    "description": "Stand out from others with this crazzy ui library built with shad-cn cli",
    "url": "https://skiper-ui.com/",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "components"
    ]
  },
  {
    "slug": "solanauth",
    "name": "solanauth",
    "description": "Solana wallet authentication modal.",
    "url": "https://solanauth.vercel.app/",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "auth",
      "components"
    ]
  },
  {
    "slug": "sortable",
    "name": "sortable",
    "description": "Sortable component with dnd-kit.",
    "url": "https://github.com/sadmann7/sortable",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "table",
      "components"
    ]
  },
  {
    "slug": "spectrum-ui",
    "name": "spectrum-ui",
    "description": "Collection using Aceternity UI Magic UI.",
    "url": "https://github.com/arihantcodes/spectrum-ui",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "components"
    ]
  },
  {
    "slug": "stateful-button",
    "name": "stateful-button",
    "description": "A shadcn/ui button component that provides clear visual feedback with full accessibility support for loading/progress, success, and error states during asynchronous operations.",
    "url": "https://github.com/nanyx95/Stateful-Button-React",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "components"
    ]
  },
  {
    "slug": "stocks",
    "name": "stocks",
    "description": "Stock Picker with Next.js charts.",
    "url": "https://github.com/aryanvichare/stocks",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "next.js",
      "chart",
      "components"
    ]
  },
  {
    "slug": "styleseed",
    "name": "styleseed",
    "description": "Design engine with 48 shadcn-style components and swappable brand skins.",
    "url": "https://github.com/bitjaru/styleseed",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "components"
    ]
  },
  {
    "slug": "supabase-shadcn-database-example",
    "name": "supabase-shadcn-database-example",
    "description": "supabase + shadcn/ui datatable",
    "url": "https://github.com/thisisfel1x/supabase-shadcn-database-example",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "table",
      "components"
    ]
  },
  {
    "slug": "supercharged-shadcn-components",
    "name": "supercharged-shadcn-components",
    "description": "Type-safe form components collection.",
    "url": "https://github.com/slickwit/supercharged-shadcn-components",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "form",
      "components"
    ]
  },
  {
    "slug": "svelte-image-uploader",
    "name": "svelte-image-uploader",
    "description": "Svelte image uploader with dnd, validation and previews.",
    "url": "https://svelte-image-uploader.vercel.app/",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "svelte",
      "components"
    ]
  },
  {
    "slug": "termcn",
    "name": "termcn",
    "description": "Beautiful terminal UIs, made simple. Ready to use, customizable terminal UI components for React.",
    "url": "https://termcn.vercel.app/",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "react",
      "components"
    ]
  },
  {
    "slug": "trable-craft",
    "name": "trable-craft",
    "description": "Drizzle ORM-powered table engine that auto-generates tables from your schema. Built on TanStack Table with server-side filtering, sorting, pagination, search, export, and URL state sync.",
    "url": "https://github.com/jacksonkasi1/TableCraft",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "table",
      "components"
    ]
  },
  {
    "slug": "tanstack-ui-table",
    "name": "tanstack-ui-table",
    "description": "Customizable table with @tanstack/table and shadcn/ui",
    "url": "https://github.com/drefahl/tanstack-ui-table",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "table",
      "components"
    ]
  },
  {
    "slug": "the-gridcn",
    "name": "the-gridcn",
    "description": "Tron inspired shadcn/ui theme",
    "url": "https://thegridcn.com/",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "theme",
      "components"
    ]
  },
  {
    "slug": "time-picker",
    "name": "time-picker",
    "description": "Simple TimePicker component.",
    "url": "https://github.com/openstatusHQ/time-picker",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "components"
    ]
  },
  {
    "slug": "tnks-data-table",
    "name": "tnks-data-table",
    "description": "Advanced data table component built with shadcn/ui and TanStack Table featuring server-side operations, row selection, filtering, column customization, and export functionality. Fully TypeScript compatible with comprehensive documentation.",
    "url": "https://github.com/jacksonkasi1/tnks-data-table",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "table",
      "docs",
      "components"
    ]
  },
  {
    "slug": "tool-ui",
    "name": "tool-ui",
    "description": "Beautiful, ready-to-use UI components for AI tool calls and MCP UI.",
    "url": "https://www.tool-ui.com/",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "ai",
      "components"
    ]
  },
  {
    "slug": "tour",
    "name": "tour",
    "description": "A component for building onboarding tours. Designed to integrate with shadcn/ui.",
    "url": "https://onboarding-tour.vercel.app",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "components"
    ]
  },
  {
    "slug": "trees",
    "name": "trees",
    "description": "@pierre/trees is an open source file tree rendering library. It's built for performance and flexibility, is super customizable, and comes packed with features. Made with love by The Pierre Computer Company.",
    "url": "https://trees.software/",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "form",
      "components"
    ]
  },
  {
    "slug": "tremor",
    "name": "tremor",
    "description": "Components for charts and dashboards.",
    "url": "https://github.com/tremorlabs/tremor",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "chart",
      "dashboard",
      "components"
    ]
  },
  {
    "slug": "twblocks",
    "name": "twblocks",
    "description": "Website blocks based on shadcn & Radix.",
    "url": "https://github.com/tommyjepsen/twblocks",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "blocks",
      "components"
    ]
  },
  {
    "slug": "tweet-to-code",
    "name": "tweet-to-code",
    "description": "Twitter design recreations as code.",
    "url": "https://tweet-to-code.vercel.app/",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "components"
    ]
  },
  {
    "slug": "ui-beats",
    "name": "ui-beats",
    "description": "Animated React Components collection.",
    "url": "https://uibeats.com",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "react",
      "components"
    ]
  },
  {
    "slug": "ui-flexnative",
    "name": "ui-flexnative",
    "description": "A collection of customizable UI blocks with interactive live previews",
    "url": "https://ui.flexnative.com",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "blocks",
      "native",
      "components"
    ]
  },
  {
    "slug": "ui-layouts",
    "name": "ui-layouts",
    "description": "UI Layouts isn't just a library. It's a complete toolkit with components, effects, design tools, and ready-to-use blocks, everything you need to build modern interfaces, faster.",
    "url": "https://www.ui-layouts.com/",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "blocks",
      "components"
    ]
  },
  {
    "slug": "ui-nference-sh",
    "name": "ui-nference-sh",
    "description": "a shadcn registry of react ui components for building ai-powered applications, chatbots, and ai agent interfaces.",
    "url": "https://ui.inference.sh/",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "react",
      "ai",
      "chat",
      "components"
    ]
  },
  {
    "slug": "uixmat-onborda",
    "name": "uixmat-onborda",
    "description": "Product tour for Next.js applications.",
    "url": "https://github.com/uixmat/onborda",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "next.js",
      "components"
    ]
  },
  {
    "slug": "uselayouts",
    "name": "uselayouts",
    "description": "Free premium animated React components and micro-interactions built with Framer Motion and Tailwind CSS. Modern, ready-to-use motion components for high-converting websites.",
    "url": "https://uselayouts.com",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "react",
      "ai",
      "motion",
      "framer-motion",
      "components"
    ]
  },
  {
    "slug": "vaul",
    "name": "vaul",
    "description": "Drawer component for React.",
    "url": "https://vaul.emilkowal.ski/",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "react",
      "components"
    ]
  },
  {
    "slug": "vengence-ui",
    "name": "vengence-ui",
    "description": "A modern, animated UI component library designed to help developers build beautiful landing pages and interfaces faster.",
    "url": "https://www.vengenceui.com/",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "landing",
      "components"
    ]
  },
  {
    "slug": "vyoma-ui",
    "name": "vyoma-ui",
    "description": "Beautiful Components Made on top of Shadcn/ui with Spatial Wisdom Inside. Truly Beyond UI.",
    "url": "https://vyomaui.design/",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "components"
    ]
  },
  {
    "slug": "w3-kit",
    "name": "w3-kit",
    "description": "A comprehensive library of accessible React components for building high-quality Web3 applications and dApps",
    "url": "https://github.com/w3-kit/ui",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "react",
      "components"
    ]
  },
  {
    "slug": "warcraftcn",
    "name": "warcraftcn",
    "description": "A set of components inspired by classic Warcraft III RTS UI aesthetics",
    "url": "https://www.warcraftcn.com/",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "components"
    ]
  },
  {
    "slug": "wds-registry",
    "name": "wds registry",
    "description": "A collection of components that you can use to build your own component library.",
    "url": "https://wds-shadcn-registry.netlify.app",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "components"
    ]
  },
  {
    "slug": "zoom-charts",
    "name": "zoom-charts",
    "description": "Zoomable Charts with shadcn/ui.",
    "url": "https://github.com/shelwinsunga/zoom-chart-demo",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "chart",
      "components"
    ]
  },
  {
    "slug": "efferd",
    "name": "efferd",
    "description": "ready-to-use shadcn blocks that just work — modern, responsive, and built for speed.",
    "url": "http://efferd.com/",
    "category": "registries",
    "categoryLabel": "Registry",
    "tags": [
      "blocks",
      "registries"
    ]
  },
  {
    "slug": "more-shadcn",
    "name": "more-shadcn",
    "description": "A collection of high-quality, copy-paste components for Svelte 5, built on top of shadcn-svelte.",
    "url": "https://more-shadcn.noair.fun/",
    "category": "registries",
    "categoryLabel": "Registry",
    "tags": [
      "svelte",
      "registries"
    ]
  },
  {
    "slug": "neobrutalism-vue",
    "name": "neobrutalism-vue",
    "description": "A vue-based registry of neobrutalism-styled Tailwind components.",
    "url": "https://github.com/michaelsieminski/neobrutalism-vue",
    "category": "registries",
    "categoryLabel": "Registry",
    "tags": [
      "vue",
      "ai",
      "registries"
    ]
  },
  {
    "slug": "registry-directory",
    "name": "registry.directory",
    "description": "A curated directory to discover, preview, and copy shadcn/ui registries.",
    "url": "https://github.com/rbadillap/registry.directory",
    "category": "registries",
    "categoryLabel": "Registry",
    "tags": [
      "registries"
    ]
  },
  {
    "slug": "tailark",
    "name": "tailark",
    "description": "Shadcn blocks for building modern marketing websites",
    "url": "https://tailark.com",
    "category": "registries",
    "categoryLabel": "Registry",
    "tags": [
      "marketing",
      "ai",
      "blocks",
      "registries"
    ]
  },
  {
    "slug": "undraw-cn",
    "name": "undraw-cn",
    "description": "Beautiful, customizable React components for unDraw illustrations.",
    "url": "https://undraw-cn.vaatun.com",
    "category": "registries",
    "categoryLabel": "Registry",
    "tags": [
      "react",
      "registries"
    ]
  },
  {
    "slug": "chat-with-youtube",
    "name": "chat-with-youtube",
    "description": "A chrome extension is designed to give you the ability to efficiently summarize videos, easily search for specific parts, and enjoy additional useful features.",
    "url": "https://chat-with-youtube.vercel.app/",
    "category": "tools",
    "categoryLabel": "Tool",
    "tags": [
      "chat",
      "tools"
    ]
  },
  {
    "slug": "designgui",
    "name": "designgui",
    "description": "A Chrome Browser Extension for managing colors in CSS Variables.",
    "url": "https://www.designgui.io/",
    "category": "tools",
    "categoryLabel": "Tool",
    "tags": [
      "color",
      "tools"
    ]
  },
  {
    "slug": "imprompt",
    "name": "imprompt",
    "description": "A Chrome extension that enhances prompts on AI websites directly, making your AI prompts more effective and productive.",
    "url": "https://github.com/avalynndev/imprompt",
    "category": "tools",
    "categoryLabel": "Tool",
    "tags": [
      "ai",
      "tools"
    ]
  },
  {
    "slug": "raycast-shadcn",
    "name": "raycast-shadcn",
    "description": "Raycast extension to Browse shadcn/ui documentation, components, and examples.",
    "url": "https://www.raycast.com/luisFilipePT/shadcn-ui",
    "category": "tools",
    "categoryLabel": "Tool",
    "tags": [
      "docs",
      "tools"
    ]
  },
  {
    "slug": "shadcn-hsl-preview",
    "name": "shadcn-hsl-preview",
    "description": "shadcn HSL Preview extension for Visual Studio Code.",
    "url": "https://marketplace.visualstudio.com/items?itemName=dexxiez.shadcn-color-preview",
    "category": "tools",
    "categoryLabel": "Tool",
    "tags": [
      "tools"
    ]
  },
  {
    "slug": "shadcn-ui",
    "name": "shadcn-ui",
    "description": "Add components from shadcn/ui directly from VS Code.",
    "url": "https://marketplace.visualstudio.com/items?itemName=SuhelMakkad.shadcn-ui",
    "category": "tools",
    "categoryLabel": "Tool",
    "tags": [
      "tools"
    ]
  },
  {
    "slug": "shadcn-ui-components-manager",
    "name": "shadcn/ui Components Manager",
    "description": "A plugin for Jetbrain products. It allows you to manage your shadcn/ui components across Svelte, React, Vue, and Solid frameworks with this plugin. Simplify tasks like adding, removing, and updating components.",
    "url": "https://plugins.jetbrains.com/plugin/23479-shadcn-ui-components-manager",
    "category": "tools",
    "categoryLabel": "Tool",
    "tags": [
      "react",
      "vue",
      "svelte",
      "solid",
      "ai"
    ]
  },
  {
    "slug": "vscode-shadcn-svelte",
    "name": "vscode-shadcn-svelte",
    "description": "VS Code extension for shadcn/ui components in Svelte projects.",
    "url": "https://marketplace.visualstudio.com/items?itemName=Selemondev.vscode-shadcn-svelte&ssr=false#overview",
    "category": "tools",
    "categoryLabel": "Tool",
    "tags": [
      "svelte",
      "tools"
    ]
  },
  {
    "slug": "vscode-shadcn-ui-snippets",
    "name": "vscode-shadcn-ui-snippets",
    "description": "Easily import and use shadcn-ui components with ease using snippets within VSCode. Just type cn or shadcn in your jsx/tsx file and you will get a list of all the components to choose from.",
    "url": "https://marketplace.visualstudio.com/items?itemName=VeroXyle.shadcn-ui-snippets",
    "category": "tools",
    "categoryLabel": "Tool",
    "tags": [
      "tools"
    ]
  },
  {
    "slug": "vscode-shadcn-vue",
    "name": "vscode-shadcn-vue",
    "description": "Extension for integrating shadcn/ui components into Vue.js projects.",
    "url": "https://marketplace.visualstudio.com/items?itemName=Selemondev.shadcn-vue",
    "category": "tools",
    "categoryLabel": "Tool",
    "tags": [
      "vue",
      "tools"
    ]
  },
  {
    "slug": "10000-themes-for-shadcn-ui",
    "name": "10000+Themes for shadcn/ui",
    "description": "10000+ Themes for shadcn/ui.",
    "url": "https://ui.jln.dev/",
    "category": "themes",
    "categoryLabel": "Themes",
    "tags": [
      "theme",
      "themes"
    ]
  },
  {
    "slug": "dizzy",
    "name": "dizzy",
    "description": "Bootstrap a new Next or Vite project with shadcn/ui. Customize font, icons, colors, spacing, radii, and shadows.",
    "url": "https://dizzy.systems",
    "category": "themes",
    "categoryLabel": "Themes",
    "tags": [
      "icons",
      "color",
      "themes"
    ]
  },
  {
    "slug": "ewgenius-ui",
    "name": "ewgenius/ui",
    "description": "Create custom themes for shadcn/ui effortlessly using vibrant palettes from Radix Colors.",
    "url": "https://ui.ewgenius.me/shadcn-radix-colors",
    "category": "themes",
    "categoryLabel": "Themes",
    "tags": [
      "theme",
      "color",
      "themes"
    ]
  },
  {
    "slug": "gradient-picker",
    "name": "gradient-picker",
    "description": "Fancy Gradient Picker built with shadcn/ui, Radix UI, and Tailwind CSS.",
    "url": "https://github.com/Illyism/gradient-picker",
    "category": "themes",
    "categoryLabel": "Themes",
    "tags": [
      "ai",
      "themes"
    ]
  },
  {
    "slug": "navnote-rangeen",
    "name": "navnote/rangeen",
    "description": "Tool that helps you to create a colour palette for your website.",
    "url": "https://github.com/navnote/rangeen",
    "category": "themes",
    "categoryLabel": "Themes",
    "tags": [
      "themes"
    ]
  },
  {
    "slug": "shadesigner-com",
    "name": "shadesigner.com",
    "description": "A shadcn/ui Palette Generator & Theme Designer with a beautiful interface.",
    "url": "https://shadesigner.com",
    "category": "themes",
    "categoryLabel": "Themes",
    "tags": [
      "theme",
      "themes"
    ]
  },
  {
    "slug": "shadcn-ui-customizer",
    "name": "shadcn-ui-customizer",
    "description": "POC - shadcn/ui themes with color pickers.",
    "url": "https://github.com/Railly/shadcn-ui-customizer",
    "category": "themes",
    "categoryLabel": "Themes",
    "tags": [
      "theme",
      "color",
      "themes"
    ]
  },
  {
    "slug": "shadcn-theme-editor",
    "name": "shadcn theme editor",
    "description": "Shadcn Theme Editor is a user-friendly component designed to simplify the process of managing and customizing theme colors in Shadcn-based projects.",
    "url": "https://github.com/programming-with-ia/shadcn-theme-editor/",
    "category": "themes",
    "categoryLabel": "Themes",
    "tags": [
      "editor",
      "theme",
      "color",
      "themes"
    ]
  },
  {
    "slug": "smui",
    "name": "smui",
    "description": "Nord-inspired terminal theme for shadcn/ui with monospace typography, zero border radius, and frost-blue accents.",
    "url": "https://smui.statico.io",
    "category": "themes",
    "categoryLabel": "Themes",
    "tags": [
      "theme",
      "themes"
    ]
  },
  {
    "slug": "tweakcn",
    "name": "tweakcn",
    "description": "powerful theme editor for shadcn/ui components, offering beautifully designed themes and seamless Tailwind CSS V4 integration",
    "url": "https://tweakcn.com/",
    "category": "themes",
    "categoryLabel": "Themes",
    "tags": [
      "ai",
      "editor",
      "theme",
      "themes"
    ]
  },
  {
    "slug": "zippy-starter-s-shadcn-ui-theme-generator",
    "name": "zippy starter's shadcn/ui theme generator",
    "description": "Easily create custom themes from a single colour that you can copy and paste into your apps.",
    "url": "https://zippystarter.com/tools/shadcn-ui-theme-generator",
    "category": "themes",
    "categoryLabel": "Themes",
    "tags": [
      "theme",
      "starter",
      "themes"
    ]
  },
  {
    "slug": "animata",
    "name": "animata",
    "description": "Hand-crafted interaction animations and effects from around the internet to copy and paste into your project.",
    "url": "https://animata.design",
    "category": "animation",
    "categoryLabel": "Animation",
    "tags": [
      "animations",
      "animation"
    ]
  },
  {
    "slug": "animate-ui",
    "name": "animate-ui",
    "description": "A fully animated, open-source React component distribution. Browse a list of animated primitives, components and icons you can install and use in your projects.",
    "url": "https://animate-ui.com/",
    "category": "animation",
    "categoryLabel": "Animation",
    "tags": [
      "react",
      "icons",
      "animation"
    ]
  },
  {
    "slug": "motionvariants",
    "name": "motionvariants",
    "description": "Beautiful Framer Motion Animations.",
    "url": "https://github.com/chrisabdo/motionvariants",
    "category": "animation",
    "categoryLabel": "Animation",
    "tags": [
      "animations",
      "motion",
      "framer-motion",
      "animation"
    ]
  },
  {
    "slug": "smooth-ui",
    "name": "smooth-ui",
    "description": "Highly customizable, production-ready UI blocks for building beautiful websites and apps that look and feel the way you mean it.",
    "url": "https://smoothui.dev/",
    "category": "animation",
    "categoryLabel": "Animation",
    "tags": [
      "blocks",
      "animation"
    ]
  },
  {
    "slug": "tailwindcss-motion",
    "name": "tailwindcss-motion",
    "description": "A new simple syntax animation library. Batteries included. Infinitely configurable.",
    "url": "https://rombo.co/tailwind/",
    "category": "animation",
    "categoryLabel": "Animation",
    "tags": [
      "ai",
      "animations",
      "motion",
      "animation"
    ]
  },
  {
    "slug": "5devs",
    "name": "5devs",
    "description": "A website to get fake Brazilian data for testing purposes.",
    "url": "https://www.5devs.com.br/",
    "category": "tools",
    "categoryLabel": "Tool",
    "tags": [
      "tools"
    ]
  },
  {
    "slug": "bento-hub",
    "name": "bento-hub",
    "description": "BentoHub is an application where you can create a bento grid for your GitHub profile readme.",
    "url": "https://github.com/amittam104/BentoHub",
    "category": "tools",
    "categoryLabel": "Tool",
    "tags": [
      "tools"
    ]
  },
  {
    "slug": "cheatsheet",
    "name": "cheatsheet",
    "description": "A comprehensive, interactive reference for shadcn/ui components with live previews, code examples, and instant copy functionality.",
    "url": "https://shadcnstore.com/cheatsheet/",
    "category": "tools",
    "categoryLabel": "Tool",
    "tags": [
      "tools"
    ]
  },
  {
    "slug": "cut-it",
    "name": "cut-it",
    "description": "Link shortener built using Next.js App Router, Server Actions, Drizzle ORM, Turso, and styled with shadcn/ui.",
    "url": "https://github.com/mehrabmp/cut-it",
    "category": "tools",
    "categoryLabel": "Tool",
    "tags": [
      "next.js",
      "tools"
    ]
  },
  {
    "slug": "country-data-in-charts",
    "name": "country-data-in-charts",
    "description": "Globe Graph is a web app that visualizes countries' data like GDP, GDP per capita, and population in different years using many charts.",
    "url": "https://globe-graph.vercel.app/",
    "category": "tools",
    "categoryLabel": "Tool",
    "tags": [
      "chart",
      "tools"
    ]
  },
  {
    "slug": "devtools",
    "name": "devtools",
    "description": "28 free browser-based developer utilities built with Next.js and shadcn/ui — JSON formatter, regex tester, JWT decoder, hash generator, UUID generator, diff checker, and more. 100% client-side, no signup.",
    "url": "https://devtools.davrapps.dev",
    "category": "tools",
    "categoryLabel": "Tool",
    "tags": [
      "next.js",
      "form",
      "tools"
    ]
  },
  {
    "slug": "cv-forge",
    "name": "cv-forge",
    "description": "Resume builder built with @shadcn/ui, react-hook-form, and react-pdf.",
    "url": "https://cvforge.app",
    "category": "tools",
    "categoryLabel": "Tool",
    "tags": [
      "react",
      "form",
      "tools"
    ]
  },
  {
    "slug": "dialectcn",
    "name": "dialectcn",
    "description": "A living catalog of shadcn presets — brand-inspired, community-submitted, and occasionally random. Pick one, copy the code, ship the UI.",
    "url": "https://dialectcn.xyz/",
    "category": "tools",
    "categoryLabel": "Tool",
    "tags": [
      "tools"
    ]
  },
  {
    "slug": "focus-brew",
    "name": "focus-brew",
    "description": "A free productivity toolkit that combines essential tools to help you stay focused, organized, and efficient throughout your workday.",
    "url": "https://focusbrew.vercel.app",
    "category": "tools",
    "categoryLabel": "Tool",
    "tags": [
      "tools"
    ]
  },
  {
    "slug": "form-builder",
    "name": "form-builder",
    "description": "UI-based codegen tool to easily create beautiful and type-safe @shadcn/ui forms.",
    "url": "https://github.com/AlandSleman/FormBuilder",
    "category": "tools",
    "categoryLabel": "Tool",
    "tags": [
      "form",
      "tools"
    ]
  },
  {
    "slug": "form-builder-fast",
    "name": "form-builder-fast",
    "description": "Shadcn Form Builder - Build forms in minutes for free.",
    "url": "https://ui.indie-starter.dev/form-builder",
    "category": "tools",
    "categoryLabel": "Tool",
    "tags": [
      "form",
      "tools"
    ]
  },
  {
    "slug": "graphitup",
    "name": "graphitup",
    "description": "Create free downloadable Shadcn-themed chart images. Supports PNG, JPEG, WEBP, and even WEBM videos. Upload your own data for more realistic designs.",
    "url": "https://graphitup.com/tools",
    "category": "tools",
    "categoryLabel": "Tool",
    "tags": [
      "chart",
      "theme",
      "tools"
    ]
  },
  {
    "slug": "hook-again",
    "name": "hook-again",
    "description": "A collection of shadcn/ui installable React Hooks.",
    "url": "https://github.com/ilyichv/hookagain",
    "category": "tools",
    "categoryLabel": "Tool",
    "tags": [
      "react",
      "ai",
      "tools"
    ]
  },
  {
    "slug": "img2m3",
    "name": "Img2m3",
    "description": "A developer tool that automates the process of creating cohesive, accessible design systems. It bridges the gap between Google's Material Design 3 algorithms and the modern Tailwind CSS v4 ecosystem.",
    "url": "https://img2m3.vercel.app/studio",
    "category": "tools",
    "categoryLabel": "Tool",
    "tags": [
      "ai",
      "tools"
    ]
  },
  {
    "slug": "imgsrc",
    "name": "imgsrc",
    "description": "Generate beautiful Open Graph images with zero effort.",
    "url": "https://imgsrc.io/",
    "category": "tools",
    "categoryLabel": "Tool",
    "tags": [
      "tools"
    ]
  },
  {
    "slug": "invoify",
    "name": "invoify",
    "description": "An invoice generator app built using Next.js, TypeScript, and shadcn/ui.",
    "url": "https://github.com/aliabb01/invoify",
    "category": "tools",
    "categoryLabel": "Tool",
    "tags": [
      "next.js",
      "tools"
    ]
  },
  {
    "slug": "jobsync",
    "name": "jobsync",
    "description": "JobSync is a job seekers' assistant to manage job search efficiently.",
    "url": "https://github.com/Gsync/jobsync",
    "category": "tools",
    "categoryLabel": "Tool",
    "tags": [
      "ai",
      "tools"
    ]
  },
  {
    "slug": "keyzen",
    "name": "keyzen",
    "description": "KeyZen is a small side project: a clean, browser-based typing speed test built for practice and fun. It is open source and free to use or fork.",
    "url": "https://keyzen.theshiva.xyz/",
    "category": "tools",
    "categoryLabel": "Tool",
    "tags": [
      "tools"
    ]
  },
  {
    "slug": "memfree",
    "name": "memfree",
    "description": "Open-source hybrid AI search engine, instantly get accurate answers from the internet, bookmarks, notes, and docs. Built using Next.js and shadcn/ui.",
    "url": "https://github.com/memfreeme/memfree",
    "category": "tools",
    "categoryLabel": "Tool",
    "tags": [
      "next.js",
      "ai",
      "docs",
      "tools"
    ]
  },
  {
    "slug": "memoire",
    "name": "memoire",
    "description": "MCP server and CLI for shadcn-native Design CI: diagnose UI debt, extract Tailwind tokens, export shadcn registries, and plan safe UI fixes.",
    "url": "https://github.com/sarveshsea/m-moire",
    "category": "tools",
    "categoryLabel": "Tool",
    "tags": [
      "ai",
      "native",
      "tools"
    ]
  },
  {
    "slug": "opensearch-ai",
    "name": "opensearch-ai",
    "description": "SearchGPT/Perplexity clone but personalized for you.",
    "url": "https://github.com/supermemoryai/opensearch-ai",
    "category": "tools",
    "categoryLabel": "Tool",
    "tags": [
      "ai",
      "tools"
    ]
  },
  {
    "slug": "open-ui",
    "name": "open-ui",
    "description": "The Open Standard for Generative UI",
    "url": "https://www.openui.com/",
    "category": "tools",
    "categoryLabel": "Tool",
    "tags": [
      "tools"
    ]
  },
  {
    "slug": "pagegen-ai",
    "name": "pagegen.ai",
    "description": "An AI Page Generator with Claude AI, React, and shadcn/ui. Generate web pages from text, screenshots, and templates with one click.",
    "url": "https://pagegen.ai",
    "category": "tools",
    "categoryLabel": "Tool",
    "tags": [
      "react",
      "ai",
      "template",
      "tools"
    ]
  },
  {
    "slug": "pastecode",
    "name": "pastecode",
    "description": "Pastebin alternative built with TypeScript, Next.js, Drizzle, shadcn/ui, and RSC.",
    "url": "https://github.com/Quorin/PasteCode.app",
    "category": "tools",
    "categoryLabel": "Tool",
    "tags": [
      "next.js",
      "native",
      "tools"
    ]
  },
  {
    "slug": "pictera",
    "name": "pictera",
    "description": "Generate Open Graph images without design skills.",
    "url": "https://pictera.co",
    "category": "tools",
    "categoryLabel": "Tool",
    "tags": [
      "tools"
    ]
  },
  {
    "slug": "proxmox-helper-scripts",
    "name": "proxmox-helper-scripts",
    "description": "A catalog of scripts for your Proxmox VE homelab, built with the Next.js App Router and styled with shadcn/ui.",
    "url": "https://github.com/BramSuurdje/proxmox-helper-scripts",
    "category": "tools",
    "categoryLabel": "Tool",
    "tags": [
      "next.js",
      "tools"
    ]
  },
  {
    "slug": "quack-db",
    "name": "quack-db",
    "description": "Open-source in-browser DuckDB SQL editor.",
    "url": "https://github.com/mattf96s/QuackDB",
    "category": "tools",
    "categoryLabel": "Tool",
    "tags": [
      "editor",
      "tools"
    ]
  },
  {
    "slug": "shadcn-easy-install",
    "name": "shadcn-easy-install",
    "description": "Install all shadcn components easily. One-click to install all selected components.",
    "url": "https://shadcn-easy-install.vercel.app/",
    "category": "tools",
    "categoryLabel": "Tool",
    "tags": [
      "tools"
    ]
  },
  {
    "slug": "shadcn-hooks",
    "name": "shadcn-hooks",
    "description": "A comprehensive React Hooks Collection built with Shadcn.",
    "url": "https://shadcn-hooks.com/",
    "category": "tools",
    "categoryLabel": "Tool",
    "tags": [
      "react",
      "tools"
    ]
  },
  {
    "slug": "shadcn-play",
    "name": "shadcn-play",
    "description": "A playground for building and previewing shadcn/ui components with a live editor.",
    "url": "https://github.com/ephraimduncan/shadcn-play",
    "category": "tools",
    "categoryLabel": "Tool",
    "tags": [
      "editor",
      "tools"
    ]
  },
  {
    "slug": "shadcn-pricing-page-generator",
    "name": "shadcn-pricing-page-generator",
    "description": "The easiest way to get a React pricing page with shadcn/ui, Radix UI, and/or Tailwind CSS.",
    "url": "https://shipixen.com/shadcn-pricing-page",
    "category": "tools",
    "categoryLabel": "Tool",
    "tags": [
      "react",
      "ai",
      "tools"
    ]
  },
  {
    "slug": "shadcn-theme-editor-2",
    "name": "shadcn-theme-editor",
    "description": "Shadcn Theme Editor is a user-friendly component designed to simplify the process of managing and customizing theme colors in Shadcn-based projects.",
    "url": "https://shadcnthemeeditor.vercel.app",
    "category": "tools",
    "categoryLabel": "Tool",
    "tags": [
      "editor",
      "theme",
      "color",
      "tools"
    ]
  },
  {
    "slug": "shadcn-zod-form",
    "name": "shadcn-zod-form",
    "description": "CLI tool to generate shadcn/ui forms from Zod schemas.",
    "url": "https://github.com/ilyichv/shadcn-zod-form",
    "category": "tools",
    "categoryLabel": "Tool",
    "tags": [
      "form",
      "tools"
    ]
  },
  {
    "slug": "sharable-form-builder",
    "name": "sharable-form-builder",
    "description": "A sharable form builder for creating forms and sharing your form link, based on shadcn/ui and Next.js.",
    "url": "https://github.com/ayoubben18/sharable-form-builder",
    "category": "tools",
    "categoryLabel": "Tool",
    "tags": [
      "next.js",
      "form",
      "tools"
    ]
  },
  {
    "slug": "shoogle",
    "name": "shoogle",
    "description": "A shadcn search engine",
    "url": "https://shoogle.dev/",
    "category": "tools",
    "categoryLabel": "Tool",
    "tags": [
      "tools"
    ]
  },
  {
    "slug": "slidytabs",
    "name": "slidytabs",
    "description": "A tool that adds a sliding indicator animation to shadcn `<Tabs />` without changing how you use or customize the component",
    "url": "https://slidytabs.dev",
    "category": "tools",
    "categoryLabel": "Tool",
    "tags": [
      "animations",
      "tools"
    ]
  },
  {
    "slug": "someday",
    "name": "someday",
    "description": "Free to host and open-source Cal.com/Calendly alternative built on Google Apps Script for Gmail users.",
    "url": "https://github.com/rbbydotdev/someday",
    "category": "tools",
    "categoryLabel": "Tool",
    "tags": [
      "ai",
      "native",
      "tools"
    ]
  },
  {
    "slug": "sweep",
    "name": "sweep",
    "description": "Sweep is a modern, open-source gradient generator built for designers and developers. Create beautiful linear and radial gradients with real-time preview, noise/blur effects, and export to CSS, Tailwind, SVG, or JPG. Free forever. No sign-up required.",
    "url": "https://github.com/Johuniq/sweep",
    "category": "tools",
    "categoryLabel": "Tool",
    "tags": [
      "ai",
      "tools"
    ]
  },
  {
    "slug": "tancn",
    "name": "tancn",
    "description": "Build powerful forms and tables with ease using TanStack technologies",
    "url": "https://tancn.dev/",
    "category": "tools",
    "categoryLabel": "Tool",
    "tags": [
      "form",
      "table",
      "tools"
    ]
  },
  {
    "slug": "tinte",
    "name": "tinte",
    "description": "An opinionated VS Code Theme Generator.",
    "url": "https://tinte.railly.dev/",
    "category": "tools",
    "categoryLabel": "Tool",
    "tags": [
      "theme",
      "tools"
    ]
  },
  {
    "slug": "translate-app",
    "name": "translate-app",
    "description": "Translate App using TypeScript, Tailwind CSS, NextJS, Bun, shadcn/ui, AI SDK/OpenAI, and Zod.",
    "url": "https://github.com/developaul/translate-app",
    "category": "tools",
    "categoryLabel": "Tool",
    "tags": [
      "next.js",
      "ai",
      "tools"
    ]
  },
  {
    "slug": "typelabs",
    "name": "typelabs",
    "description": "MonkeyType-inspired typing test app built with React, shadcn, and Zustand at its core.",
    "url": "https://github.com/imsandeshpandey/typelabs",
    "category": "tools",
    "categoryLabel": "Tool",
    "tags": [
      "react",
      "tools"
    ]
  },
  {
    "slug": "ui-builder",
    "name": "ui-builder",
    "description": "A React component editor that provides a no-code, visual way to create UIs, fully compatible with shadcn/ui and custom components.",
    "url": "https://github.com/olliethedev/ui-builder",
    "category": "tools",
    "categoryLabel": "Tool",
    "tags": [
      "react",
      "editor",
      "tools"
    ]
  },
  {
    "slug": "ui-fonts",
    "name": "ui-fonts",
    "description": "Test and preview fonts in real-time for all your design needs. Choose the perfect typeface with ease.",
    "url": "https://www.uifonts.app/",
    "category": "tools",
    "categoryLabel": "Tool",
    "tags": [
      "tools"
    ]
  },
  {
    "slug": "v0",
    "name": "v0",
    "description": "Vercel's generative UI system, built on shadcn/ui and TailwindCSS, allows effortless UI generation from text prompts and/or images.",
    "url": "https://v0.dev/",
    "category": "tools",
    "categoryLabel": "Tool",
    "tags": [
      "ai",
      "tools"
    ]
  },
  {
    "slug": "vercel-status-tracker",
    "name": "vercel-status-tracker",
    "description": "Track the status of all of your projects deployed via Vercel. Built with shadcn/ui and TailwindCSS.",
    "url": "https://vercel-status-tracker.vercel.app",
    "category": "tools",
    "categoryLabel": "Tool",
    "tags": [
      "ai",
      "tools"
    ]
  },
  {
    "slug": "wallhaven-desktop",
    "name": "wallhaven-desktop",
    "description": "Wallhaven Wallpaper software desktop. Create a Wallhaven API-based client, a true wallpaper software.",
    "url": "https://github.com/ErKeLost/wallhaven-desktop",
    "category": "tools",
    "categoryLabel": "Tool",
    "tags": [
      "tools"
    ]
  },
  {
    "slug": "andrewsam-xyz",
    "name": "andrewsam.xyz",
    "description": "A revamped version of the popular tailwind-nextjs-starter-blog using shadcn/ui, along with a resume section and experience timeline component.",
    "url": "https://www.andrewsam.xyz/",
    "category": "showcase",
    "categoryLabel": "Showcase",
    "tags": [
      "next.js",
      "ai",
      "starter",
      "blog",
      "showcase"
    ]
  },
  {
    "slug": "anishshobithps-com",
    "name": "anishshobithps.com",
    "description": "Personal portfolio of a software developer, grid-styled design.",
    "url": "https://anishshobithps.com/",
    "category": "showcase",
    "categoryLabel": "Showcase",
    "tags": [
      "portfolio",
      "showcase"
    ]
  },
  {
    "slug": "birobirobiro-dev",
    "name": "birobirobiro.dev",
    "description": "A personal developer portfolio.",
    "url": "https://birobirobiro.dev/",
    "category": "showcase",
    "categoryLabel": "Showcase",
    "tags": [
      "portfolio",
      "showcase"
    ]
  },
  {
    "slug": "bucharitesh-in",
    "name": "bucharitesh.in",
    "description": "A minimal portfolio with awesome craft's registry.",
    "url": "https://bucharitesh.in",
    "category": "showcase",
    "categoryLabel": "Showcase",
    "tags": [
      "portfolio",
      "showcase"
    ]
  },
  {
    "slug": "chanhdai-com",
    "name": "chanhdai.com",
    "description": "A minimal portfolio, component registry, and blog.",
    "url": "https://chanhdai.com",
    "category": "showcase",
    "categoryLabel": "Showcase",
    "tags": [
      "ai",
      "portfolio",
      "blog",
      "showcase"
    ]
  },
  {
    "slug": "devfolios",
    "name": "devfolios",
    "description": "Find best portfolio inspiration from all over the internet",
    "url": "https://devfolios-one.vercel.app/",
    "category": "showcase",
    "categoryLabel": "Showcase",
    "tags": [
      "portfolio",
      "showcase"
    ]
  },
  {
    "slug": "godly",
    "name": "godly",
    "description": "Astronomically good web design inspiration. Only the best of the best.",
    "url": "https://godly.website/",
    "category": "showcase",
    "categoryLabel": "Showcase",
    "tags": [
      "showcase"
    ]
  },
  {
    "slug": "hritu-art",
    "name": "hritu.art",
    "description": "A clean, modern designer portfolio blending minimal aesthetics with functional UI and built-in email support via React Email.",
    "url": "https://github.com/suraj-xd/design-portfolio",
    "category": "showcase",
    "categoryLabel": "Showcase",
    "tags": [
      "react",
      "ai",
      "portfolio",
      "showcase"
    ]
  },
  {
    "slug": "list-swajp-me",
    "name": "list.swajp.me",
    "description": "It has never been easier to find the right projects or designs by inspiring successful people.",
    "url": "https://list.swajp.me",
    "category": "showcase",
    "categoryLabel": "Showcase",
    "tags": [
      "showcase"
    ]
  },
  {
    "slug": "nathans-ai",
    "name": "nathans-ai",
    "description": "An AI Chatbot acting as a portfolio, built with shadcn/ui components.",
    "url": "https://chat.brodin.dev",
    "category": "showcase",
    "categoryLabel": "Showcase",
    "tags": [
      "ai",
      "chat",
      "portfolio",
      "showcase"
    ]
  },
  {
    "slug": "ifte-13",
    "name": "ifte-13",
    "description": "Portfolio made with Next.js, shadcn/ui (with magic ui ) and Email.js",
    "url": "https://ifte-13.vercel.app/",
    "category": "showcase",
    "categoryLabel": "Showcase",
    "tags": [
      "next.js",
      "ai",
      "portfolio",
      "showcase"
    ]
  },
  {
    "slug": "shubhporwal-me",
    "name": "shubhporwal.me",
    "description": "An eye-catching developer portfolio, built on NextJS, GSAP, Tailwind, and React.",
    "url": "https://www.shubhporwal.me/",
    "category": "showcase",
    "categoryLabel": "Showcase",
    "tags": [
      "next.js",
      "react",
      "ai",
      "portfolio",
      "showcase"
    ]
  },
  {
    "slug": "swajp-me",
    "name": "swajp.me",
    "description": "A visually appealing portfolio and resource hub.",
    "url": "https://swajp.me",
    "category": "showcase",
    "categoryLabel": "Showcase",
    "tags": [
      "portfolio",
      "showcase"
    ]
  },
  {
    "slug": "windows-11-clone",
    "name": "windows-11-clone",
    "description": "A sleek Windows 11 clone built with React, Next.js, Tailwind CSS, ShadCN, and Framer-Motion, featuring smooth animations, draggable windows, and a modern design system.",
    "url": "https://win11.oimmi.com/",
    "category": "showcase",
    "categoryLabel": "Showcase",
    "tags": [
      "next.js",
      "react",
      "ai",
      "animations",
      "motion"
    ]
  },
  {
    "slug": "anonypost",
    "name": "anonypost",
    "description": "Share your thoughts and experiences anonymously by posting on the platform. Crafted using t3-stack.",
    "url": "https://github.com/avalynndev/anonypost",
    "category": "platforms",
    "categoryLabel": "Platform",
    "tags": [
      "form",
      "platforms"
    ]
  },
  {
    "slug": "auditzap",
    "name": "auditzap",
    "description": "AI-powered website audit tool that runs 24 checks across SEO, performance, and site health, then generates code-level fix instructions ranked by revenue impact. Built with Next.js 16, shadcn/ui, Tailwind CSS 4, and Drizzle ORM.",
    "url": "https://auditzap.io",
    "category": "platforms",
    "categoryLabel": "Platform",
    "tags": [
      "next.js",
      "form",
      "ai",
      "platforms"
    ]
  },
  {
    "slug": "citeme",
    "name": "citeme",
    "description": "AI-powered academic citation generator. Searches 11+ databases and formats in 40+ styles (APA, ABNT, MLA, etc.). Web app, Chrome extension, Google Docs add-on, and Word add-in.",
    "url": "https://citeme.app",
    "category": "platforms",
    "categoryLabel": "Platform",
    "tags": [
      "form",
      "ai",
      "docs",
      "platforms"
    ]
  },
  {
    "slug": "grade-calculator",
    "name": "grade-calculator",
    "description": "A grade calculator/dashboard for students, aiming to provide a better overview of academic performance.",
    "url": "https://grades.nstr.dev/",
    "category": "platforms",
    "categoryLabel": "Platform",
    "tags": [
      "form",
      "dashboard",
      "ai",
      "platforms"
    ]
  },
  {
    "slug": "infinitunes",
    "name": "infinitunes",
    "description": "A simple music player web app built using Next.js, shadcn/ui, Tailwind CSS, Drizzle ORM, and more.",
    "url": "https://github.com/rajput-hemant/infinitunes",
    "category": "platforms",
    "categoryLabel": "Platform",
    "tags": [
      "next.js",
      "ai",
      "platforms"
    ]
  },
  {
    "slug": "kd",
    "name": "kd",
    "description": "Ad-free Kdrama streaming app. Built with Next.js, Drizzle ORM, NeonDB, and shadcn/ui.",
    "url": "https://github.com/gneiru/kd",
    "category": "platforms",
    "categoryLabel": "Platform",
    "tags": [
      "next.js",
      "platforms"
    ]
  },
  {
    "slug": "memergez",
    "name": "memergez",
    "description": "Quickly generate memes by entering text or an avatar URL, with support for many meme commands.",
    "url": "https://github.com/avalynndev/memergez",
    "category": "platforms",
    "categoryLabel": "Platform",
    "tags": [
      "platforms"
    ]
  },
  {
    "slug": "multiboard",
    "name": "multiboard",
    "description": "Minimal Kanban platform. Built with Better-Auth, Next.js, ZenStack, Prisma, and shadcn/ui.",
    "url": "https://github.com/olliethedev/multiboard",
    "category": "platforms",
    "categoryLabel": "Platform",
    "tags": [
      "next.js",
      "form",
      "auth",
      "platforms"
    ]
  },
  {
    "slug": "openhive",
    "name": "openhive",
    "description": "Open-source, self-hosted Slack alternative with channels, DMs, threads, reactions, file uploads, and video/audio calls. Built with Next.js, Supabase, Zustand, and shadcn/ui.",
    "url": "https://github.com/arseneHuot/openhive",
    "category": "platforms",
    "categoryLabel": "Platform",
    "tags": [
      "next.js",
      "react",
      "native",
      "platforms"
    ]
  },
  {
    "slug": "plotwist",
    "name": "plotwist",
    "description": "Easy management and reviews of your movies, series, and animes using Next.js, Tailwind CSS, Supabase, and shadcn/ui.",
    "url": "https://plotwist.app/en-US",
    "category": "platforms",
    "categoryLabel": "Platform",
    "tags": [
      "next.js",
      "ai",
      "platforms"
    ]
  },
  {
    "slug": "s5arc-ecommerce-platform",
    "name": "s5arc-ecommerce-platform",
    "description": "S5ARC is an open-source, multi-tenant e-commerce SaaS platform designed to help non-technical founders launch online stores quickly built with shadcn & nextjs etc.",
    "url": "https://github.com/S5SAJID/next-dashcommerce",
    "category": "platforms",
    "categoryLabel": "Platform",
    "tags": [
      "next.js",
      "form",
      "saas",
      "ecommerce",
      "platforms"
    ]
  },
  {
    "slug": "veritas-kanban",
    "name": "veritas-kanban",
    "description": "Self-hosted Kanban board with AI agent integration, time tracking, and 1,255 tests. Built with React 19, Vite 6, TanStack Query, dnd-kit, and shadcn/ui.",
    "url": "https://github.com/BradGroux/veritas-kanban",
    "category": "platforms",
    "categoryLabel": "Platform",
    "tags": [
      "react",
      "ai",
      "platforms"
    ]
  },
  {
    "slug": "xeramail",
    "name": "xeramail",
    "description": "Temporary email address service built with Next.js and shadcn/ui, offering fast inbox access, modern UI, and better control over disposable emails.",
    "url": "https://xeramail.com",
    "category": "platforms",
    "categoryLabel": "Platform",
    "tags": [
      "next.js",
      "ai",
      "platforms"
    ]
  },
  {
    "slug": "xquik",
    "name": "xquik",
    "description": "All-in-one X automation platform with 40+ tools, REST API, MCP server, and HMAC webhooks. Built with Next.js, shadcn/ui, and Tailwind CSS.",
    "url": "https://xquik.com",
    "category": "platforms",
    "categoryLabel": "Platform",
    "tags": [
      "next.js",
      "form",
      "ai",
      "platforms"
    ]
  },
  {
    "slug": "youropinion-is",
    "name": "youropinion.is",
    "description": "Free survey platform which supports importing your exisitng shadcn/ui theme",
    "url": "https://youropinion.is/news/202505-match-my-style",
    "category": "platforms",
    "categoryLabel": "Platform",
    "tags": [
      "form",
      "theme",
      "platforms"
    ]
  },
  {
    "slug": "angular",
    "name": "Angular",
    "description": "Angular port of shadcn/ui.",
    "url": "https://github.com/goetzrobin/spartan",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "components"
    ]
  },
  {
    "slug": "basecoat",
    "name": "Basecoat",
    "description": "Vanilla HTML, CSS and JS port of shadcn/ui.",
    "url": "https://basecoatui.com",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "components"
    ]
  },
  {
    "slug": "flutter",
    "name": "Flutter",
    "description": "Flutter port of shadcn/ui.",
    "url": "https://github.com/nank1ro/shadcn-ui",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "components"
    ]
  },
  {
    "slug": "franken-ui",
    "name": "Franken UI",
    "description": "HTML-first, framework-agnostic, beautifully designed components that you can truly copy and paste into your site. Accessible. Customizable. Open Source.",
    "url": "https://www.franken-ui.dev/",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "components"
    ]
  },
  {
    "slug": "jollyui",
    "name": "JollyUI",
    "description": "shadcn/ui compatible react aria components.",
    "url": "https://github.com/jolbol1/jolly-ui",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "react",
      "components"
    ]
  },
  {
    "slug": "kotlin",
    "name": "Kotlin",
    "description": "Kotlin port of shadcn/ui.",
    "url": "https://github.com/dead8309/shadcn-kotlin",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "components"
    ]
  },
  {
    "slug": "mkdocs-shadcn",
    "name": "mkdocs-shadcn",
    "description": "MkDocs port of shadcn/ui.",
    "url": "https://github.com/asiffer/mkdocs-shadcn",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "docs",
      "components"
    ]
  },
  {
    "slug": "net-shadui",
    "name": ".NET (ShadUI)",
    "description": "Avalonia port of shadcn/ui. Based on SukiUI",
    "url": "https://github.com/accntech/shad-ui/",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "components"
    ]
  },
  {
    "slug": "phoenix-liveview",
    "name": "Phoenix Liveview",
    "description": "Phoenix Liveview port of shadcn/ui.",
    "url": "https://github.com/bluzky/salad_ui",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "components"
    ]
  },
  {
    "slug": "react-native",
    "name": "React Native",
    "description": "React Native port of shadcn/ui.",
    "url": "https://github.com/Mobilecn-UI/nativecn-ui",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "react",
      "native",
      "components"
    ]
  },
  {
    "slug": "react-native-recommended",
    "name": "React Native (recommended)",
    "description": "React Native port of shadcn/ui (recommended).",
    "url": "https://github.com/mrzachnugent/react-native-reusables",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "react",
      "native",
      "components"
    ]
  },
  {
    "slug": "ruby",
    "name": "Ruby",
    "description": "Ruby port of shadcn/ui.",
    "url": "https://github.com/aviflombaum/shadcn-rails",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "components"
    ]
  },
  {
    "slug": "solid",
    "name": "Solid",
    "description": "Solid port of shadcn/ui.",
    "url": "https://github.com/hngngn/shadcn-solid",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "solid",
      "components"
    ]
  },
  {
    "slug": "svelte",
    "name": "Svelte",
    "description": "Svelte port of shadcn/ui.",
    "url": "https://github.com/huntabyte/shadcn-svelte",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "svelte",
      "components"
    ]
  },
  {
    "slug": "swift",
    "name": "Swift",
    "description": "Swift port of shadcn/ui.",
    "url": "https://github.com/Mobilecn-UI/swiftcn-ui",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "components"
    ]
  },
  {
    "slug": "sysinfocus-simple-ui",
    "name": "Sysinfocus simple/ui",
    "description": "Razor component library for Blazor, inspired by shadcn/ui.",
    "url": "https://sysinfocus.github.io/shadcn-inspired/",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "components"
    ]
  },
  {
    "slug": "vue",
    "name": "Vue",
    "description": "Vue port of shadcn/ui.",
    "url": "https://github.com/radix-vue/shadcn-vue",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "vue",
      "components"
    ]
  },
  {
    "slug": "shadcn-storybook-registry",
    "name": "shadcn-storybook-registry",
    "description": "Registry of stories for the shadcn components. Quickly get the atomic level components documented in Storybook.",
    "url": "https://registry.lloydrichards.dev/",
    "category": "themes",
    "categoryLabel": "Themes",
    "tags": [
      "themes"
    ]
  },
  {
    "slug": "obra-shadcn-ui",
    "name": "obra-shadcn-ui",
    "description": "This file replicates all 51 shadcn/ui v4 components in a composable way as a reusable Figma library.",
    "url": "https://www.figma.com/community/file/1514746685758799870/obra-shadcn-ui",
    "category": "themes",
    "categoryLabel": "Themes",
    "tags": [
      "themes"
    ]
  },
  {
    "slug": "shadcn-ui-components",
    "name": "shadcn-ui-components",
    "description": "Every component recreated in Figma.",
    "url": "https://www.figma.com/community/file/1342715840824755935/shadcn-ui-components",
    "category": "themes",
    "categoryLabel": "Themes",
    "tags": [
      "themes"
    ]
  },
  {
    "slug": "shadcn-ui-storybook-jheanantunes",
    "name": "shadcn-ui-storybook (JheanAntunes)",
    "description": "All shadcn/ui components registered in the storybook by JheanAntunes.",
    "url": "https://65711ecf32bae758b457ae34-uryqbzvojc.chromatic.com/",
    "category": "themes",
    "categoryLabel": "Themes",
    "tags": [
      "themes"
    ]
  },
  {
    "slug": "shadcn-ui-storybook-fellipeutaka",
    "name": "shadcn-ui-storybook (fellipeutaka)",
    "description": "All shadcn/ui components registered in the storybook by fellipeutaka.",
    "url": "https://fellipeutaka-ui.vercel.app/?path=/docs/components-accordion--docs",
    "category": "themes",
    "categoryLabel": "Themes",
    "tags": [
      "themes"
    ]
  },
  {
    "slug": "a11y-starter-kit",
    "name": "a11y-starter-kit",
    "description": "Free WCAG 2.1 AA starter kit with accessible components, custom a11y hooks, and dark mode. Built with Next.js 16, Tailwind CSS v4, and shadcn/ui.",
    "url": "https://github.com/thefrontkit/a11y-starter-kit-code",
    "category": "templates",
    "categoryLabel": "Template",
    "tags": [
      "next.js",
      "ai",
      "starter",
      "templates"
    ]
  },
  {
    "slug": "agentic-react-nextjs-shadcn",
    "name": "agentic-react-nextjs-shadcn",
    "description": "Agent-testable SaaS starter built with Next.js 16, shadcn/ui, and Tailwind CSS. Includes accessibility-first components, semantic HTML for AI agent testing, and production-ready patterns.",
    "url": "https://github.com/iscale-llc/agentic-react-nextjs-shadcn",
    "category": "templates",
    "categoryLabel": "Template",
    "tags": [
      "next.js",
      "react",
      "table",
      "saas",
      "ai"
    ]
  },
  {
    "slug": "astro-erudite",
    "name": "astro-erudite",
    "description": "An opinionated, unstyled static blogging template—built with Astro, Tailwind, and shadcn/ui.",
    "url": "https://github.com/jktrn/astro-erudite",
    "category": "templates",
    "categoryLabel": "Template",
    "tags": [
      "ai",
      "template",
      "blog",
      "templates"
    ]
  },
  {
    "slug": "atomic-crm",
    "name": "atomic-crm",
    "description": "Open-source React CRM built on top of Supabase.",
    "url": "https://github.com/marmelab/atomic-crm",
    "category": "templates",
    "categoryLabel": "Template",
    "tags": [
      "react",
      "templates"
    ]
  },
  {
    "slug": "autoflow",
    "name": "autoflow",
    "description": "An open source GraphRAG (Knowledge Graph) built on top of TiDB Vector, LlamaIndex, and DSPy.",
    "url": "https://github.com/pingcap/autoflow",
    "category": "templates",
    "categoryLabel": "Template",
    "tags": [
      "ai",
      "templates"
    ]
  },
  {
    "slug": "browser-extension-starter-plasmo-shadcn-trpc",
    "name": "browser-extension-starter-plasmo-shadcn-trpc",
    "description": "Browser extension starter kit featuring Plasmo, React, Shadcn, and tRPC.",
    "url": "https://github.com/poweroutlet2/browser-extension-starter-plasmo-shadcn-trpc",
    "category": "templates",
    "categoryLabel": "Template",
    "tags": [
      "react",
      "starter",
      "templates"
    ]
  },
  {
    "slug": "chadnext",
    "name": "chadnext",
    "description": "Quick Starter Template includes Next.js 14 App Router, shadcn/ui, LuciaAuth, Prisma, Server Actions, Stripe, Internationalization, and more.",
    "url": "https://github.com/moinulmoin/chadnext",
    "category": "templates",
    "categoryLabel": "Template",
    "tags": [
      "next.js",
      "auth",
      "stripe",
      "template",
      "starter"
    ]
  },
  {
    "slug": "cloudflare-saas-stack",
    "name": "cloudflare-saas-stack",
    "description": "An opinionated, batteries-included starter kit for quickly building and deploying SaaS products on Cloudflare.",
    "url": "https://github.com/Dhravya/cloudflare-saas-stack",
    "category": "templates",
    "categoryLabel": "Template",
    "tags": [
      "saas",
      "starter",
      "templates"
    ]
  },
  {
    "slug": "create-next-shadcn-kit",
    "name": "create-next-shadcn-kit",
    "description": "CLI to scaffold a production-ready Next.js app with shadcn/ui, Tailwind CSS, optional state management (Redux Toolkit/Zustand), and preconfigured tooling like Husky.",
    "url": "https://github.com/NikunjSonigara/create-next-shadcn-kit",
    "category": "templates",
    "categoryLabel": "Template",
    "tags": [
      "next.js",
      "ai",
      "templates"
    ]
  },
  {
    "slug": "create-react-shadcn-kit",
    "name": "create-react-shadcn-kit",
    "description": "CLI to scaffold a production-ready React (Vite) app with shadcn/ui, Tailwind CSS v4, optional Redux Toolkit/Zustand, and preconfigured tooling like Husky and TypeScript.",
    "url": "https://github.com/NikunjSonigara/create-react-shadcn-kit",
    "category": "templates",
    "categoryLabel": "Template",
    "tags": [
      "react",
      "ai",
      "templates"
    ]
  },
  {
    "slug": "create-tauri-core",
    "name": "create-tauri-core",
    "description": "A project template for creating a Tauri app with Vite, React, and Tailwind CSS.",
    "url": "https://github.com/mrlightful/create-tauri-core",
    "category": "templates",
    "categoryLabel": "Template",
    "tags": [
      "react",
      "ai",
      "template",
      "templates"
    ]
  },
  {
    "slug": "create-tauri-ui",
    "name": "create-tauri-ui",
    "description": "Create modern Tauri desktop apps with shadcn/ui, desktop-first defaults, and optional batteries.",
    "url": "https://github.com/agmmnn/tauri-ui",
    "category": "templates",
    "categoryLabel": "Template",
    "tags": [
      "templates"
    ]
  },
  {
    "slug": "design-system-template",
    "name": "design-system-template",
    "description": "Turborepo + TailwindCSS + Storybook + shadcn/ui.",
    "url": "https://github.com/arevalolance/design-system-template",
    "category": "templates",
    "categoryLabel": "Template",
    "tags": [
      "ai",
      "template",
      "templates"
    ]
  },
  {
    "slug": "deska-dashboard-template",
    "name": "deska-dashboard-template",
    "description": "A dashboard template built with Nuxt, Tailwind and Shadcn.",
    "url": "https://github.com/yaminncco/deska-dashboard-template",
    "category": "templates",
    "categoryLabel": "Template",
    "tags": [
      "dashboard",
      "ai",
      "template",
      "templates"
    ]
  },
  {
    "slug": "devstarter",
    "name": "devstarter",
    "description": "Devstarter is a bold, one-page developer portfolio template with a distinctive cyberpunk aesthetic. Built with Next.js, shadcn/ui, and Tailwind CSS, it's designed to help developers showcase their work, skills, and personality in a way that stands out.",
    "url": "https://github.com/zippystarter/template-devstarter",
    "category": "templates",
    "categoryLabel": "Template",
    "tags": [
      "next.js",
      "ai",
      "template",
      "starter",
      "portfolio"
    ]
  },
  {
    "slug": "easy-ui",
    "name": "easy-ui",
    "description": "50+ High Quality Open Source Website Templates built using NextJS + shadcn/ui + Tailwind CSS + Framer Motion and more.",
    "url": "https://github.com/DarkInventor/easy-ui",
    "category": "templates",
    "categoryLabel": "Template",
    "tags": [
      "next.js",
      "ai",
      "motion",
      "framer-motion",
      "template"
    ]
  },
  {
    "slug": "ecommerce-kit",
    "name": "ecommerce-kit",
    "description": "Next.js starter kit with the tools you need to quickly launch your e-commerce site.",
    "url": "https://ecommercekit.dev",
    "category": "templates",
    "categoryLabel": "Template",
    "tags": [
      "next.js",
      "starter",
      "ecommerce",
      "templates"
    ]
  },
  {
    "slug": "electron-shadcn",
    "name": "electron-shadcn",
    "description": "Electron app template with shadcn/ui and a bunch of other libs and tools ready to use.",
    "url": "https://github.com/LuanRoger/electron-shadcn",
    "category": "templates",
    "categoryLabel": "Template",
    "tags": [
      "template",
      "templates"
    ]
  },
  {
    "slug": "forjnot",
    "name": "forjnot",
    "description": "Modern Project Starter Kit | Launch your next project faster with Forjnot - A professional, customizable and clean starting point featuring modern tech stack and best practices",
    "url": "",
    "category": "templates",
    "categoryLabel": "Template",
    "tags": [
      "starter",
      "templates"
    ]
  },
  {
    "slug": "full-stack-monorepo-starter",
    "name": "full-stack-monorepo-starter",
    "description": "Full stack monorepo template built using shadcn/ui + Fastify + graphql + vitejs + Docker and more.",
    "url": "https://github.com/mnove/monorepo-starter-graphql",
    "category": "templates",
    "categoryLabel": "Template",
    "tags": [
      "template",
      "starter",
      "templates"
    ]
  },
  {
    "slug": "fumadocs-starter",
    "name": "fumadocs-starter",
    "description": "A fully-fledged Fumadocs starter template with built-in plugins, AI features, and everything you need to build your next docs site.",
    "url": "https://github.com/techwithanirudh/fumadocs-starter",
    "category": "templates",
    "categoryLabel": "Template",
    "tags": [
      "ai",
      "template",
      "starter",
      "docs",
      "templates"
    ]
  },
  {
    "slug": "horizon-ai-nextjs-shadcn-boilerplate",
    "name": "horizon-ai-nextjs-shadcn-boilerplate",
    "description": "Premium AI NextJS & shadcn/ui Boilerplate + Stripe + Supabase + OAuth.",
    "url": "https://horizon-ui.com/boilerplate-shadcn",
    "category": "templates",
    "categoryLabel": "Template",
    "tags": [
      "next.js",
      "ai",
      "auth",
      "stripe",
      "boilerplate"
    ]
  },
  {
    "slug": "kirimase",
    "name": "kirimase",
    "description": "A template and boilerplate for quickly starting your next project with shadcn/ui, Tailwind CSS, and Next.js.",
    "url": "https://kirimase.dev/",
    "category": "templates",
    "categoryLabel": "Template",
    "tags": [
      "next.js",
      "ai",
      "template",
      "boilerplate",
      "templates"
    ]
  },
  {
    "slug": "login-auth",
    "name": "login-auth",
    "description": "A login authentication web app built with Vite + React, Tailwind CSS, and Shadcn UI. It uses Firebase for Google sign-in, email sign-up, and password reset.",
    "url": "https://shadcn-login-auth.vercel.app/",
    "category": "templates",
    "categoryLabel": "Template",
    "tags": [
      "react",
      "ai",
      "auth",
      "templates"
    ]
  },
  {
    "slug": "magicui-startup-templates",
    "name": "magicui-startup-templates",
    "description": "Magic UI Startup template built using shadcn/ui + TailwindCSS + Framer Motion.",
    "url": "https://magicui.design/docs/templates/startup",
    "category": "templates",
    "categoryLabel": "Template",
    "tags": [
      "ai",
      "motion",
      "framer-motion",
      "template",
      "templates"
    ]
  },
  {
    "slug": "next-shadcn-admin-dashboard",
    "name": "next-shadcn-admin-dashboard",
    "description": "Modern Admin Dashboard Template built with Shadcn UI and Next.js 15",
    "url": "https://github.com/arhamkhnz/next-shadcn-admin-dashboard",
    "category": "templates",
    "categoryLabel": "Template",
    "tags": [
      "next.js",
      "dashboard",
      "admin",
      "template",
      "templates"
    ]
  },
  {
    "slug": "nextmotion",
    "name": "nextMotion",
    "description": "Webdev portfolio template with Nodemailer integrated for easy contact form setup. Uses shadcn/ui + TailwindCSS + Framer Motion.",
    "url": "https://github.com/yoyocharlie/nextMotion",
    "category": "templates",
    "categoryLabel": "Template",
    "tags": [
      "form",
      "ai",
      "motion",
      "framer-motion",
      "template"
    ]
  },
  {
    "slug": "next-js-boilerplate",
    "name": "next-js-boilerplate",
    "description": "Quickly set up a Next.js project with TypeScript, NextAuth.js, PostgreSQL (Prisma), Sentry, Tailwind CSS v4, shadcn/ui, Zod, Zustand, nuqs, ESLint, Husky, and Prettier.",
    "url": "https://github.com/AbhishekSharma55/next-js-boilerplate",
    "category": "templates",
    "categoryLabel": "Template",
    "tags": [
      "next.js",
      "ai",
      "auth",
      "boilerplate",
      "templates"
    ]
  },
  {
    "slug": "next-shadcn-dashboard-starter",
    "name": "next-shadcn-dashboard-starter",
    "description": "Admin Dashboard Starter with Nextjs 14 and shadcn/ui.",
    "url": "https://github.com/Kiranism/next-shadcn-dashboard-starter",
    "category": "templates",
    "categoryLabel": "Template",
    "tags": [
      "next.js",
      "dashboard",
      "admin",
      "starter",
      "templates"
    ]
  },
  {
    "slug": "next-starter",
    "name": "next-starter",
    "description": "A Next.js starter template packed with features like TypeScript, TailwindCSS, Next-auth, Eslint, Stripe, testing tools, and more. Jumpstart your project with efficiency and style.",
    "url": "https://github.com/Skolaczk/next-starter",
    "category": "templates",
    "categoryLabel": "Template",
    "tags": [
      "next.js",
      "ai",
      "auth",
      "stripe",
      "template"
    ]
  },
  {
    "slug": "nextjs-mdx-blog",
    "name": "nextjs-mdx-blog",
    "description": "Starter template built with Contentlayer, MDX, shadcn/ui, and Tailwind CSS.",
    "url": "https://github.com/ChangoMan/nextjs-mdx-blog",
    "category": "templates",
    "categoryLabel": "Template",
    "tags": [
      "next.js",
      "ai",
      "mdx",
      "template",
      "starter"
    ]
  },
  {
    "slug": "next-js-views-template",
    "name": "next-js-views-template",
    "description": "An open-source collection of reusable view components like Calendar, Table, etc., built with Next.js and ShadCN. Easily copy and paste these pre-built UI elements into your project for fast, responsive, and customizable layouts.",
    "url": "https://next-js-views-template.vercel.app",
    "category": "templates",
    "categoryLabel": "Template",
    "tags": [
      "next.js",
      "table",
      "template",
      "templates"
    ]
  },
  {
    "slug": "next-wp",
    "name": "next-wp",
    "description": "Headless Wordpress Starter built with the NextJS App Router and React Server Components.",
    "url": "https://github.com/9d8dev/next-wp",
    "category": "templates",
    "categoryLabel": "Template",
    "tags": [
      "next.js",
      "react",
      "starter",
      "templates"
    ]
  },
  {
    "slug": "onyx",
    "name": "onyx",
    "description": "Full stack, batteries-included MVP Template with NextJS 14, Supabase SSR Auth & Postgres DB with CRUD operations, RBAC, Tanstack React Query, Zod Validation, MDX components, Resend, and more.",
    "url": "https://github.com/rmourey26/onyx",
    "category": "templates",
    "categoryLabel": "Template",
    "tags": [
      "next.js",
      "react",
      "auth",
      "mdx",
      "template"
    ]
  },
  {
    "slug": "openui-shadcn-chat",
    "name": "openui-shadcn-chat",
    "description": "Full-stack generative UI chatbot template using OpenUI Lang with shadcn/ui component library, SSE streaming, and tool calling.",
    "url": "https://github.com/thesysdev/openui/tree/main/examples/shadcn-chat",
    "category": "templates",
    "categoryLabel": "Template",
    "tags": [
      "chat",
      "template",
      "templates"
    ]
  },
  {
    "slug": "react-starter-kit",
    "name": "react-starter-kit",
    "description": "An opinionated, full-stack boilerplate for building modern web apps on the edge. Features Bun, React 19, tRPC, Drizzle ORM, and Cloudflare Workers.",
    "url": "https://github.com/kriamost/react-starter-kit",
    "category": "templates",
    "categoryLabel": "Template",
    "tags": [
      "react",
      "starter",
      "boilerplate",
      "templates"
    ]
  },
  {
    "slug": "react-vite-starter",
    "name": "react-vite-starter",
    "description": "React starter powered with Vite + Redux Toolkit + RTKQuery + React Router + shadcn UI and many more.",
    "url": "https://github.com/tejachundru/react-vite-starter",
    "category": "templates",
    "categoryLabel": "Template",
    "tags": [
      "react",
      "starter",
      "templates"
    ]
  },
  {
    "slug": "shadcn-landing-page",
    "name": "shadcn-landing-page",
    "description": "Landing page template using shadcn/ui, React, TypeScript, and Tailwind CSS.",
    "url": "https://github.com/leoMirandaa/shadcn-landing-page",
    "category": "templates",
    "categoryLabel": "Template",
    "tags": [
      "react",
      "landing",
      "ai",
      "template",
      "templates"
    ]
  },
  {
    "slug": "shadcn-landing-page-vue",
    "name": "shadcn-landing-page (Vue)",
    "description": "Project conversion shadcn-vue-landing-page to Next.js - Landing page template using Nestjs, shadcn/ui, TypeScript, and Tailwind CSS.",
    "url": "https://github.com/nobruf/shadcn-landing-page",
    "category": "templates",
    "categoryLabel": "Template",
    "tags": [
      "next.js",
      "vue",
      "landing",
      "ai",
      "template"
    ]
  },
  {
    "slug": "shadcn-nextjs-free-boilerplate",
    "name": "shadcn-nextjs-free-boilerplate",
    "description": "Free & Open-source NextJS Boilerplate + ChatGPT API Dashboard Template.",
    "url": "https://github.com/horizon-ui/shadcn-nextjs-boilerplate",
    "category": "templates",
    "categoryLabel": "Template",
    "tags": [
      "next.js",
      "dashboard",
      "chat",
      "template",
      "boilerplate"
    ]
  },
  {
    "slug": "shadcn-nextjs-dashboard",
    "name": "shadcn-nextjs-dashboard",
    "description": "Admin Dashboard UI built with Shadcn and NextJS. Free and Open-source.",
    "url": "https://github.com/NaveenDA/shadcn-nextjs-dashboard",
    "category": "templates",
    "categoryLabel": "Template",
    "tags": [
      "next.js",
      "dashboard",
      "admin",
      "templates"
    ]
  },
  {
    "slug": "shadcn-portfolio",
    "name": "shadcn-portfolio",
    "description": "A portfolio template, which uses shadcn-ui and Next.JS.",
    "url": "https://github.com/techwithanirudh/shadcn-portfolio",
    "category": "templates",
    "categoryLabel": "Template",
    "tags": [
      "next.js",
      "template",
      "portfolio",
      "templates"
    ]
  },
  {
    "slug": "shadcn-registry-template",
    "name": "shadcn-registry-template",
    "description": "Template repository for building a custom component registry for shadcn/ui.",
    "url": "https://github.com/vantezzen/shadcn-registry-template",
    "category": "templates",
    "categoryLabel": "Template",
    "tags": [
      "template",
      "templates"
    ]
  },
  {
    "slug": "shadcn-saas-landing",
    "name": "shadcn-saas-landing",
    "description": "A full-fledged SaaS Landing template built using Next.JS, shadcn/ui, and fumadocs.",
    "url": "https://github.com/techwithanirudh/shadcn-saas-landing",
    "category": "templates",
    "categoryLabel": "Template",
    "tags": [
      "next.js",
      "saas",
      "landing",
      "template",
      "docs"
    ]
  },
  {
    "slug": "saas-blocks-kit",
    "name": "saas-blocks-kit",
    "description": "10 production-ready SaaS landing page sections built with Next.js 15, shadcn/ui, Tailwind CSS v4 and TypeScript. Dark mode by default.",
    "url": "https://github.com/SekmenAhmet/saas-blocks-kit",
    "category": "templates",
    "categoryLabel": "Template",
    "tags": [
      "next.js",
      "saas",
      "landing",
      "ai",
      "blocks"
    ]
  },
  {
    "slug": "shadcn-ui-dashboard",
    "name": "shadcn-ui-dashboard",
    "description": "Multipurpose and powerful admin dashboard template compatible with shadcn/ui.",
    "url": "https://shadcnuidashboard.com",
    "category": "templates",
    "categoryLabel": "Template",
    "tags": [
      "dashboard",
      "admin",
      "template",
      "templates"
    ]
  },
  {
    "slug": "shadcn-vue-landing-page",
    "name": "shadcn-vue-landing-page",
    "description": "Landing page template using Vue, shadcn-vue, TypeScript, and Tailwind CSS.",
    "url": "https://github.com/leoMirandaa/shadcn-vue-landing-page",
    "category": "templates",
    "categoryLabel": "Template",
    "tags": [
      "vue",
      "landing",
      "ai",
      "template",
      "templates"
    ]
  },
  {
    "slug": "shadcn-admin-template",
    "name": "shadcn-admin-template",
    "description": "A admin dashboard template for Next.js, React, Vite and Vue.js, built with Tailwind CSS.",
    "url": "https://shadcnadmin.com",
    "category": "templates",
    "categoryLabel": "Template",
    "tags": [
      "next.js",
      "react",
      "vue",
      "dashboard",
      "admin"
    ]
  },
  {
    "slug": "shadcn-next-workflows",
    "name": "shadcn-next-workflows",
    "description": "Interactive workflow builder using React Flows, Next.js, and Shadcn/ui. Create, connect, and validate custom nodes easily.",
    "url": "https://github.com/nobruf/shadcn-next-workflows",
    "category": "templates",
    "categoryLabel": "Template",
    "tags": [
      "next.js",
      "react",
      "templates"
    ]
  },
  {
    "slug": "supa-next-shad-auth",
    "name": "supa-next-shad-auth",
    "description": "A fully responsive, fully type-safe, secure server actions, user-friendly customizable UI with best practices. Tech used: NextJS + Supabase + TypeScript + Server Actions + Zod + shadcn/ui.",
    "url": "https://github.com/Sahil-Sharma-23/supa-next-shad-auth",
    "category": "templates",
    "categoryLabel": "Template",
    "tags": [
      "next.js",
      "auth",
      "templates"
    ]
  },
  {
    "slug": "sveltekit-shadcn-starter-kit",
    "name": "sveltekit-shadcn-starter-kit",
    "description": "Production ready open-source generic app template featuring database abstraction (Drizzle & Postgres), server utilities, tests, authentication (better-auth), i18n + RTL/LTR support, mdsvex, predefined pages and content (policies, legal, etc.), App Shell component, base and custom components built with shadcn/ui, Cookies management (compliance), SEO managemnt support, CLI tooling and more.",
    "url": "https://github.com/GantonL/templates/tree/main/sveltekit-shadcn-v5",
    "category": "templates",
    "categoryLabel": "Template",
    "tags": [
      "svelte",
      "auth",
      "template",
      "starter",
      "templates"
    ]
  },
  {
    "slug": "t3-app-template",
    "name": "t3-app-template",
    "description": "Admin template for T3 Stack and shadcn/ui.",
    "url": "https://github.com/gaofubin/t3-app-template",
    "category": "templates",
    "categoryLabel": "Template",
    "tags": [
      "admin",
      "template",
      "templates"
    ]
  },
  {
    "slug": "tailwind-admin",
    "name": "tailwind-admin",
    "description": "Open Source Shadcn Dashboard Template Built On React and Tailwind CSS",
    "url": "https://github.com/Tailwind-Admin/free-tailwind-admin-dashboard-template",
    "category": "templates",
    "categoryLabel": "Template",
    "tags": [
      "react",
      "dashboard",
      "admin",
      "ai",
      "template"
    ]
  },
  {
    "slug": "taxonomy",
    "name": "taxonomy",
    "description": "An open-source application built using the new router, server components, and everything new in Next.js.",
    "url": "https://github.com/shadcn/taxonomy",
    "category": "templates",
    "categoryLabel": "Template",
    "tags": [
      "next.js",
      "templates"
    ]
  },
  {
    "slug": "template-next",
    "name": "template-next",
    "description": "A clean Next.js template with TypeScript, TailwindCSS, Shadcn/ui, and Prettier.",
    "url": "https://template-next-official.vercel.app/",
    "category": "templates",
    "categoryLabel": "Template",
    "tags": [
      "next.js",
      "ai",
      "template",
      "templates"
    ]
  },
  {
    "slug": "turborepo-nextjs-wxt-shadcn-boilerplate",
    "name": "turborepo-nextjs-wxt-shadcn-boilerplate",
    "description": "Turborepo boilerplate featuring web and web-extension apps with shadcn/ui for shared ui components and unified Typescript, ESLint, Tailwind CSS, and Prettier configs.",
    "url": "https://github.com/Aniket-508/turborepo-nextjs-wxt-shadcn-boilerplate",
    "category": "templates",
    "categoryLabel": "Template",
    "tags": [
      "next.js",
      "ai",
      "boilerplate",
      "templates"
    ]
  },
  {
    "slug": "turborepo-shadcn-ui-tailwindcss",
    "name": "turborepo-shadcn-ui-tailwindcss",
    "description": "Turborepo starter with shadcn/ui & TailwindCSS pre-configured for shared UI components.",
    "url": "https://github.com/henriqpohl/turborepo-shadcn-ui-tailwindcss",
    "category": "templates",
    "categoryLabel": "Template",
    "tags": [
      "ai",
      "starter",
      "templates"
    ]
  },
  {
    "slug": "turborepo-launchpad",
    "name": "turborepo-launchpad",
    "description": "A comprehensive monorepo boilerplate for shadcn projects using Turbo. It features a highly scalable setup ideal for developing complex applications with shared components and utilities.",
    "url": "https://github.com/JadRizk/turborepo-launchpad",
    "category": "templates",
    "categoryLabel": "Template",
    "tags": [
      "boilerplate",
      "templates"
    ]
  },
  {
    "slug": "waitly",
    "name": "waitly",
    "description": "A simple and useful waitlist Next.js and Shadcn UI template.",
    "url": "https://shadcnuikit.com/template/waitly-free-waitlist-template",
    "category": "templates",
    "categoryLabel": "Template",
    "tags": [
      "next.js",
      "ai",
      "template",
      "templates"
    ]
  },
  {
    "slug": "wordpress-plugin-boilerplate",
    "name": "wordpress-plugin-boilerplate",
    "description": "WordPress Plugin Boilerplate utilizing modern web technologies and tools such as React, TypeScript, SASS, TailwindCSS, Shadcn UI, Vite, Grunt.js, Storybook, HMR, and more.",
    "url": "https://github.com/prappo/wordpress-plugin-boilerplate",
    "category": "templates",
    "categoryLabel": "Template",
    "tags": [
      "react",
      "ai",
      "boilerplate",
      "templates"
    ]
  },
  {
    "slug": "metal-jakub-antalik",
    "name": "Metal",
    "description": "Animated liquid-metal shader effect by Jakub Antalik — drop-in WebGL backdrop for hero sections that want a premium, fluid-chrome look.",
    "url": "https://metal.jakubantalik.com/",
    "category": "animation",
    "categoryLabel": "Animation",
    "tags": [
      "shader",
      "webgl",
      "hero",
      "background"
    ],
    "author": "Jakub Antalik"
  },
  {
    "slug": "styleui-fabrika",
    "name": "StyleUI",
    "description": "Handmade UI templates and layouts by Ras Mic + the Fabrika team — production-ready starters like Notio and Axis for marketing sites and SaaS landing pages.",
    "url": "https://styleui.dev/",
    "category": "templates",
    "categoryLabel": "Template",
    "tags": [
      "templates",
      "saas",
      "landing",
      "marketing"
    ],
    "author": "Fabrika / Ras Mic"
  },
  {
    "slug": "ali-imam-components",
    "name": "Ali Imam Components",
    "description": "Personal component library and showcase by Ali Imam — copy-paste shadcn-style primitives and motion bits used across his portfolio work.",
    "url": "https://aliimam.in/docs/components",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "components",
      "shadcn",
      "personal"
    ],
    "author": "Ali Imam"
  },
  {
    "slug": "watermelon-ui",
    "name": "Watermelon UI",
    "description": "Watermelon UI — a fresh shadcn-style component registry with copy-paste blocks and primitives for modern Next.js apps.",
    "url": "https://ui.watermelon.sh/",
    "category": "components",
    "categoryLabel": "Components",
    "tags": [
      "shadcn",
      "components",
      "blocks"
    ],
    "author": "Watermelon"
  },
  {
    "slug": "dotmatrix-loaders",
    "name": "Dot Matrix",
    "description": "55+ free, open-source animated loaders (Neon Drift, Pulse Ladder, Helix Glow, etc.) built with React, TypeScript, Tailwind, and shadcn — drop-in loading states with personality.",
    "url": "https://dotmatrix.zzzzshawn.cloud/",
    "category": "animation",
    "categoryLabel": "Animation",
    "tags": [
      "loaders",
      "spinners",
      "shadcn",
      "react"
    ],
    "author": "zzzzshawn"
  },
  {
    "slug": "componentry-harshjdhv",
    "name": "Componentry",
    "description": "Growing collection of animated React primitives by Harsh Jain — text animations, interactive components, hero backgrounds, and visual effects for modern motion-heavy UIs.",
    "url": "https://www.componentry.fun/docs",
    "category": "animation",
    "categoryLabel": "Animation",
    "tags": [
      "animation",
      "react",
      "primitives",
      "hero"
    ],
    "author": "Harsh Jain (harshjdhv)"
  },
  {
    "slug": "balloons-js",
    "name": "balloons-js",
    "description": "Tiny JS library by Artur Bień that fires balloon and text-balloon animations across the page — instant celebration effect for sign-ups, purchases, and milestones.",
    "url": "https://arturbien.github.io/balloons-js/",
    "category": "animation",
    "categoryLabel": "Animation",
    "tags": [
      "animation",
      "celebration",
      "confetti-alt",
      "vanilla-js"
    ],
    "author": "Artur Bień"
  }
];
