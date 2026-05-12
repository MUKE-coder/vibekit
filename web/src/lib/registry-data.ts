export type RegistryFileType =
  | "registry:component"
  | "registry:lib"
  | "registry:hook"
  | "registry:page"
  | "registry:block"
  | "registry:ui";

export type RegistryComponentType =
  | "registry:component"
  | "registry:lib"
  | "registry:hook"
  | "registry:page"
  | "registry:block"
  | "registry:ui";

export interface RegistryFile {
  path: string;
  type: RegistryFileType;
  content: string;
  target?: string;
}

export interface RegistryComponent {
  $schema?: string;
  name: string;
  type: RegistryComponentType;
  title?: string;
  description: string;
  dependencies?: string[];
  registryDependencies?: string[];
  files: RegistryFile[];
}

export interface RegistryIndexEntry {
  name: string;
  type: RegistryComponentType;
  description: string;
  files: string[];
}

const registryComponents: RegistryComponent[] = [
  {
    $schema: "https://ui.shadcn.com/schema/registry.json",
    name: "kanban-board",
    type: "registry:component",
    title: "Kanban Board",
    description:
      "Drag-and-drop Kanban board with column management, card creation, and swimlane support.",
    dependencies: ["@dnd-kit/core", "@dnd-kit/sortable", "@dnd-kit/utilities"],
    registryDependencies: ["button", "card", "badge", "input"],
    files: [
      {
        path: "kanban-board.tsx",
        type: "registry:component",
        content: `"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

// VibeKit Kanban Board — Component Registry Placeholder
// Full implementation will include @dnd-kit drag-and-drop,
// column management, card CRUD, and swimlane support.

export interface KanbanCard {
  id: string
  title: string
  description?: string
  label?: string
}

export interface KanbanColumn {
  id: string
  title: string
  cards: KanbanCard[]
}

interface KanbanBoardProps {
  columns: KanbanColumn[]
  onCardMove?: (cardId: string, fromColumn: string, toColumn: string) => void
}

export function KanbanBoard({ columns, onCardMove }: KanbanBoardProps) {
  return (
    <div className="grid auto-cols-[280px] grid-flow-col gap-4 overflow-x-auto pb-4">
      {columns.map((column) => (
        <div key={column.id} className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">{column.title}</h3>
            <Badge variant="secondary">{column.cards.length}</Badge>
          </div>
          <div className="flex flex-col gap-2 rounded-lg bg-muted/50 p-3 min-h-[200px]">
            {column.cards.map((card) => (
              <Card key={card.id} className="cursor-grab">
                <CardHeader className="p-3 pb-1">
                  <CardTitle className="text-sm">{card.title}</CardTitle>
                </CardHeader>
                {card.description && (
                  <CardContent className="p-3 pt-0">
                    <p className="text-xs text-muted-foreground">
                      {card.description}
                    </p>
                  </CardContent>
                )}
              </Card>
            ))}
            <Button variant="ghost" size="sm" className="mt-1">
              + Add Card
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
`,
        target: "components/kanban-board.tsx",
      },
    ],
  },
  {
    $schema: "https://ui.shadcn.com/schema/registry.json",
    name: "rich-text-editor",
    type: "registry:component",
    title: "Rich Text Editor",
    description:
      "Rich text editor with markdown support, image embeds, and formatting toolbar.",
    dependencies: ["@tiptap/react", "@tiptap/starter-kit", "@tiptap/extension-image"],
    registryDependencies: ["button", "tooltip"],
    files: [
      {
        path: "rich-text-editor.tsx",
        type: "registry:component",
        content: `"use client"

import * as React from "react"

// VibeKit Rich Text Editor — Component Registry Placeholder
// Full implementation will use Tiptap with starter-kit,
// image extension, link extension, and placeholder extension.

interface RichTextEditorProps {
  value?: string
  onChange?: (html: string) => void
  placeholder?: string
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  return (
    <div className="rounded-lg border p-4 min-h-[200px]">
      <p className="text-sm text-muted-foreground">
        Rich Text Editor — Coming Soon
      </p>
    </div>
  )
}
`,
        target: "components/rich-text-editor.tsx",
      },
    ],
  },
  {
    $schema: "https://ui.shadcn.com/schema/registry.json",
    name: "org-team-ui",
    type: "registry:component",
    title: "Organization & Team UI",
    description:
      "Organization management with team invites, role-based access, member directory, and billing.",
    dependencies: [],
    registryDependencies: ["avatar", "button", "card", "dialog", "select", "table", "tabs"],
    files: [
      {
        path: "org-team-ui.tsx",
        type: "registry:component",
        content: `"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

// VibeKit Organization & Team UI — Component Registry Placeholder
// Full implementation will include org creation, team invites,
// role management, member directory, and billing management.

export interface TeamMember {
  id: string
  name: string
  email: string
  role: "admin" | "member" | "viewer"
}

interface TeamListProps {
  members: TeamMember[]
}

export function TeamList({ members }: TeamListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Members</CardTitle>
        <CardDescription>Manage your team members and their roles.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {members.map((member) => (
          <div key={member.id} className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>{member.name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm font-medium">{member.name}</p>
              <p className="text-xs text-muted-foreground">{member.email}</p>
            </div>
            <Button variant="outline" size="sm">{member.role}</Button>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
`,
        target: "components/org-team-ui.tsx",
      },
    ],
  },
  {
    $schema: "https://ui.shadcn.com/schema/registry.json",
    name: "charts-grid",
    type: "registry:component",
    title: "Charts & Dashboard Grid",
    description:
      "Responsive dashboard grid with chart components including bar, line, pie, and area charts.",
    dependencies: ["recharts"],
    registryDependencies: ["card", "tabs", "skeleton"],
    files: [
      {
        path: "charts-grid.tsx",
        type: "registry:component",
        content: `"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// VibeKit Charts & Dashboard Grid — Component Registry Placeholder
// Full implementation will use Recharts with bar, line, pie,
// and area chart variants in a responsive CSS grid layout.

interface ChartCardProps {
  title: string
  description?: string
  children?: React.ReactNode
}

export function ChartCard({ title, description, children }: ChartCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        {children || (
          <div className="flex items-center justify-center h-[200px] text-sm text-muted-foreground">
            Chart — Coming Soon
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function DashboardGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {children}
    </div>
  )
}
`,
        target: "components/charts-grid.tsx",
      },
    ],
  },
  {
    $schema: "https://ui.shadcn.com/schema/registry.json",
    name: "multi-step-form",
    type: "registry:component",
    title: "Multi-Step Form / Onboarding Wizard",
    description:
      "Step-by-step form wizard with progress indicator, validation per step, and review screen.",
    dependencies: ["zod", "react-hook-form", "@hookform/resolvers"],
    registryDependencies: ["button", "card", "input", "label", "progress", "select"],
    files: [
      {
        path: "multi-step-form.tsx",
        type: "registry:component",
        content: `"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

// VibeKit Multi-Step Form / Onboarding Wizard — Registry Placeholder
// Full implementation will use react-hook-form + zod validation
// per step with progress indicator, navigation, and review screen.

interface Step {
  id: string
  title: string
  description?: string
}

interface WizardProps {
  steps: Step[]
  currentStep?: number
  children?: React.ReactNode
}

export function Wizard({ steps, currentStep = 0, children }: WizardProps) {
  const progress = ((currentStep + 1) / steps.length) * 100

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Progress value={progress} className="h-2" />
        <p className="text-sm text-muted-foreground text-right">
          Step {currentStep + 1} of {steps.length}
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep]?.title}</CardTitle>
          {steps[currentStep]?.description && (
            <CardDescription>{steps[currentStep].description}</CardDescription>
          )}
        </CardHeader>
        <CardContent>{children}</CardContent>
        <CardFooter className="justify-between">
          <Button variant="outline" disabled={currentStep === 0}>
            Back
          </Button>
          <Button disabled={currentStep === steps.length - 1}>
            Continue
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
`,
        target: "components/multi-step-form.tsx",
      },
    ],
  },
  {
    $schema: "https://ui.shadcn.com/schema/registry.json",
    name: "command-palette",
    type: "registry:component",
    title: "Command Palette",
    description:
      "⌘K-style command palette with keyboard shortcuts, fuzzy search, and action groups.",
    dependencies: ["cmdk"],
    registryDependencies: ["command", "dialog"],
    files: [
      {
        path: "command-palette.tsx",
        type: "registry:component",
        content: `"use client"

import * as React from "react"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

// VibeKit Command Palette — Component Registry Placeholder
// Full implementation will use cmdk with keyboard shortcut
// detection, fuzzy search, action groups, and custom commands.

interface CommandAction {
  id: string
  label: string
  shortcut?: string
  onSelect: () => void
}

interface CommandPaletteProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  actions?: CommandAction[]
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
      </CommandList>
    </CommandDialog>
  )
}
`,
        target: "components/command-palette.tsx",
      },
    ],
  },
  {
    $schema: "https://ui.shadcn.com/schema/registry.json",
    name: "notification-center",
    type: "registry:component",
    title: "Notification Center",
    description:
      "Bell dropdown with real-time notifications, read/unread state, and preference settings.",
    dependencies: [],
    registryDependencies: ["button", "card", "dropdown-menu", "scroll-area", "tabs"],
    files: [
      {
        path: "notification-center.tsx",
        type: "registry:component",
        content: `"use client"

import * as React from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// VibeKit Notification Center — Component Registry Placeholder
// Full implementation will include real-time notifications,
// read/unread state, grouping, and preference settings.

export interface Notification {
  id: string
  title: string
  description?: string
  read: boolean
  createdAt: Date
}

interface NotificationBellProps {
  count?: number
  notifications?: Notification[]
}

export function NotificationBell({ count = 0, notifications = [] }: NotificationBellProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {count > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
              {count}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <Card className="border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {notifications.length === 0 && (
              <p className="text-sm text-muted-foreground py-4 text-center">
                No notifications yet
              </p>
            )}
          </CardContent>
        </Card>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
`,
        target: "components/notification-center.tsx",
      },
    ],
  },
  {
    $schema: "https://ui.shadcn.com/schema/registry.json",
    name: "advanced-form-elements",
    type: "registry:component",
    title: "Advanced Form Elements",
    description:
      "Advanced form components: tags input, phone input, color picker, date range, autosave indicators.",
    dependencies: ["zod", "react-hook-form", "@hookform/resolvers"],
    registryDependencies: ["badge", "button", "input", "label", "popover"],
    files: [
      {
        path: "advanced-form-elements.tsx",
        type: "registry:component",
        content: `"use client"

import * as React from "react"
import { X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

// VibeKit Advanced Form Elements — Registry Placeholder
// Full implementation will include TagsInput, PhoneInput,
// ColorPicker, DateRangePicker, and AutosaveIndicator.

interface TagsInputProps {
  value?: string[]
  onChange?: (tags: string[]) => void
  placeholder?: string
}

export function TagsInput({ value = [], onChange, placeholder }: TagsInputProps) {
  const [inputValue, setInputValue] = React.useState("")

  function addTag() {
    if (inputValue.trim() && !value.includes(inputValue.trim())) {
      onChange?.([...value, inputValue.trim()])
      setInputValue("")
    }
  }

  function removeTag(tag: string) {
    onChange?.(value.filter((t) => t !== tag))
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1">
        {value.map((tag) => (
          <Badge key={tag} variant="secondary">
            {tag}
            <button onClick={() => removeTag(tag)} className="ml-1 hover:text-destructive">
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
      <Input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag() } }}
        placeholder={placeholder || "Type and press Enter to add..."}
      />
    </div>
  )
}
`,
        target: "components/advanced-form-elements.tsx",
      },
    ],
  },
  {
    $schema: "https://ui.shadcn.com/schema/registry.json",
    name: "file-manager",
    type: "registry:component",
    title: "File Manager / Media Library",
    description:
      "Media library with grid/list views, folder navigation, file preview, and upload progress.",
    dependencies: [],
    registryDependencies: ["button", "card", "dialog", "input", "table", "tabs"],
    files: [
      {
        path: "file-manager.tsx",
        type: "registry:component",
        content: `"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"

// VibeKit File Manager / Media Library — Registry Placeholder
// Full implementation will include grid/list toggle, folder
// navigation, file preview dialog, and upload progress tracking.

interface FileItem {
  id: string
  name: string
  type: string
  size: number
  url: string
}

interface FileManagerProps {
  files?: FileItem[]
}

export function FileManager({ files = [] }: FileManagerProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Media Library</h3>
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Upload
        </Button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {files.map((file) => (
          <Card key={file.id} className="overflow-hidden">
            <CardContent className="p-2">
              <div className="aspect-square rounded-md bg-muted flex items-center justify-center text-xs text-muted-foreground">
                {file.type.split("/")[1]?.toUpperCase()}
              </div>
              <p className="text-xs truncate mt-1">{file.name}</p>
            </CardContent>
          </Card>
        ))}
        {files.length === 0 && (
          <p className="text-sm text-muted-foreground col-span-full text-center py-8">
            No files yet
          </p>
        )}
      </div>
    </div>
  )
}
`,
        target: "components/file-manager.tsx",
      },
    ],
  },
  {
    $schema: "https://ui.shadcn.com/schema/registry.json",
    name: "printable-templates",
    type: "registry:component",
    title: "Printable Templates",
    description:
      "Printable invoice, receipt, and report templates with print-specific CSS and PDF export.",
    dependencies: [],
    registryDependencies: ["button", "card", "separator", "table"],
    files: [
      {
        path: "printable-templates.tsx",
        type: "registry:component",
        content: `"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Printer } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

// VibeKit Printable Templates — Component Registry Placeholder
// Full implementation will include invoice, receipt, and report
// layouts with print-specific CSS and export-to-PDF support.

interface InvoiceItem {
  description: string
  quantity: number
  rate: number
}

interface InvoiceProps {
  number?: string
  date?: string
  from?: { name: string; email: string }
  to?: { name: string; email: string }
  items?: InvoiceItem[]
}

export function InvoiceTemplate({
  number = "INV-001",
  date = new Date().toLocaleDateString(),
  from = { name: "Your Company", email: "billing@company.com" },
  to = { name: "Client Name", email: "client@example.com" },
  items = [{ description: "Service", quantity: 1, rate: 0 }],
}: InvoiceProps) {
  const total = items.reduce((sum, item) => sum + item.quantity * item.rate, 0)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Invoice</h2>
        <Button variant="outline" onClick={() => window.print()}>
          <Printer className="mr-2 h-4 w-4" />
          Print
        </Button>
      </div>
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex justify-between">
            <div>
              <p className="font-semibold">{from.name}</p>
              <p className="text-sm text-muted-foreground">{from.email}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold">{number}</p>
              <p className="text-sm text-muted-foreground">{date}</p>
            </div>
          </div>
          <Separator />
          <div>
            <p className="text-sm font-medium">Bill To:</p>
            <p className="font-semibold">{to.name}</p>
            <p className="text-sm text-muted-foreground">{to.email}</p>
          </div>
          <Separator />
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Description</th>
                <th className="text-right py-2">Qty</th>
                <th className="text-right py-2">Rate</th>
                <th className="text-right py-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={i} className="border-b">
                  <td className="py-2">{item.description}</td>
                  <td className="text-right py-2">{item.quantity}</td>
                  <td className="text-right py-2">\${item.rate.toFixed(2)}</td>
                  <td className="text-right py-2">\${(item.quantity * item.rate).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3} className="text-right font-semibold py-2">Total</td>
                <td className="text-right font-semibold py-2">\${total.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
`,
        target: "components/printable-templates.tsx",
      },
    ],
  },
];

export function getRegistryComponent(slug: string): RegistryComponent | undefined {
  return registryComponents.find((c) => c.name === slug);
}

export function getRegistryIndex(): RegistryIndexEntry[] {
  return registryComponents.map(({ name, type, description, files }) => ({
    name,
    type,
    description,
    files: files.map((f) => f.path),
  }));
}

export function getAllRegistrySlugs(): string[] {
  return registryComponents.map((c) => c.name);
}
