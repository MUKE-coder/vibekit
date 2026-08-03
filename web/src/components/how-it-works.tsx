"use client";

import {
  Boxes,
  ClipboardCopy,
  FileCheck,
  MessageSquare,
  PenLine,
  Rocket,
  ShieldCheck,
} from "lucide-react";
import RadialOrbitalTimeline, { type TimelineItem } from "@/components/ui/radial-orbital-timeline";
import { Section } from "./section";

const timelineData: TimelineItem[] = [
  {
    id: 1,
    title: "Copy prompt",
    date: "Step 01",
    content: "Copy CLAUDE_PROMPT.md from the VibeKit GitHub repo. It's a self-contained interview script.",
    category: "Plan",
    icon: ClipboardCopy,
    relatedIds: [2],
    status: "completed",
    energy: 100,
  },
  {
    id: 2,
    title: "Interview",
    date: "Step 02",
    content: "Open Claude (claude.ai), paste the prompt, append your app idea. Answer 6-10 targeted questions about features, data, integrations, and design.",
    category: "Plan",
    icon: MessageSquare,
    relatedIds: [1, 3],
    status: "completed",
    energy: 95,
  },
  {
    id: 3,
    title: "4 files",
    date: "Step 03",
    content: "Claude generates project-description.md, project-phases.md, design-style-guide.md, and prompt.md. These are agent-agnostic - drop them into any coding agent.",
    category: "Plan",
    icon: FileCheck,
    relatedIds: [2, 4],
    status: "in-progress",
    energy: 80,
  },
  {
    id: 4,
    title: "Framework files",
    date: "Step 04",
    content: "Copy master_prompt.md, jb-components.md, and pre-deploy-review.md from the repo into your project root. These are the coding constitution and tooling.",
    category: "Setup",
    icon: Boxes,
    relatedIds: [3, 5],
    status: "in-progress",
    energy: 70,
  },
  {
    id: 5,
    title: "Build with agent",
    date: "Step 05",
    content: "Open ANY coding agent that reads files - Claude Code, Cursor, Kiro Code, Antigravity, Windsurf, Cline, Aider. Paste prompt.md. The agent reads everything and starts Phase 1, stopping for confirmation between phases.",
    category: "Build",
    icon: PenLine,
    relatedIds: [4, 6],
    status: "pending",
    energy: 50,
  },
  {
    id: 6,
    title: "Pre-deploy review",
    date: "Step 06",
    content: "Before deploying, paste pre-deploy-review.md. The agent runs a senior-level audit covering performance, security, background tasks, and resource usage. Address every Critical issue.",
    category: "Audit",
    icon: ShieldCheck,
    relatedIds: [5, 7],
    status: "pending",
    energy: 25,
  },
  {
    id: 7,
    title: "Ship",
    date: "Step 07",
    content: "Deploy to Vercel, configure Cloudflare DNS + custom domain, verify Resend sending domain. Run the production checklist and go live.",
    category: "Deploy",
    icon: Rocket,
    relatedIds: [6],
    status: "pending",
    energy: 10,
  },
];

export function HowItWorks() {
  return (
    <Section
      id="how"
      title={<>Plan once. Build with <em className="not-italic gradient-text">any agent</em>.</>}
      description="VibeKit generates 4 universal files that work with every coding agent that reads files - Claude Code, Cursor, Kiro Code, Antigravity, Windsurf, Cline, Aider, or anything else with a CLAUDE.md / .rules / project context."
      containerClassName="max-w-6xl"
    >
      <RadialOrbitalTimeline timelineData={timelineData} />
      <p className="reveal mt-6 text-center font-mono text-[12px] uppercase tracking-wider text-[color:var(--text-tertiary)]">
        Click a node to expand · Click empty space to resume rotation
      </p>
    </Section>
  );
}
