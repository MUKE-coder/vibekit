import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const SITE = {
  name: "VibeKit",
  fullName: "VibeKit Framework",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://vibekit.desishub.com",
  tagline: "Ship production apps with Claude Code",
  description:
    "VibeKit is a structured framework for vibe coders building production-grade Next.js apps with Claude Code or any agent - without burning tokens, shipping broken auth, or getting stuck.",
  twitter: "@jbwebdeveloper",
  github: "https://github.com/MUKE-coder/vibekit",
  community: "https://chat.whatsapp.com/LKQUiM0dExJ60EiBDgoqRq",
  author: "JB (Muke Johnbaptist) · Desishub Technologies",
  authorUrl: "https://jb.desishub.com",
} as const;
