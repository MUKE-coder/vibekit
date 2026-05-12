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
    dependencies: ["@dnd-kit/core", "@dnd-kit/sortable", "@dnd-kit/utilities", "class-variance-authority"],
    registryDependencies: ["button", "card", "badge", "input", "dialog", "textarea", "label"],
    files: [
      {
        path: "kanban-board.tsx",
        type: "registry:component",
        content: `
"use client"

import * as React from "react"
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core"
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { GripVertical, Plus, X } from "lucide-react"
import { cn } from "@/lib/utils"

export interface KanbanCardData {
  id: string
  title: string
  description?: string
  label?: string
}

export interface KanbanColumnData {
  id: string
  title: string
  cards: KanbanCardData[]
}

interface KanbanBoardProps {
  columns: KanbanColumnData[]
  onColumnsChange?: (columns: KanbanColumnData[]) => void
  onAddColumn?: (title: string) => void
}

function SortableCard({ card, isDragOverlay = false }: { card: KanbanCardData; isDragOverlay?: boolean }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
    data: { type: "card", card },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "group rounded-lg border bg-card p-3 text-card-foreground shadow-sm transition-shadow hover:shadow-md",
        isDragging && "opacity-50",
        isDragOverlay && "shadow-lg rotate-2",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium">{card.title}</p>
        <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      {card.description && (
        <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{card.description}</p>
      )}
      {card.label && (
        <Badge variant="secondary" className="mt-2 text-[10px] leading-none">
          {card.label}
        </Badge>
      )}
    </div>
  )
}

function Column({
  column,
  cards,
  onAddCard,
  onDeleteColumn,
  isOver,
}: {
  column: KanbanColumnData
  cards: KanbanCardData[]
  onAddCard: (columnId: string) => void
  onDeleteColumn: (columnId: string) => void
  isOver: boolean
}) {
  const cardsIds = cards.map((c) => c.id)

  return (
    <div
      className={cn(
        "flex w-[280px] shrink-0 flex-col rounded-xl border transition-colors",
        isOver && "border-accent bg-accent/5",
      )}
    >
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-sm">{column.title}</h3>
          <Badge variant="secondary" className="text-[10px]">
            {cards.length}
          </Badge>
        </div>
        <button
          onClick={() => onDeleteColumn(column.id)}
          className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <X className="h-3 w-3" />
        </button>
      </div>
      <div className={cn("flex flex-col gap-2 px-3 pb-3 min-h-[80px] flex-1")}>
        <SortableContext items={cardsIds} strategy={verticalListSortingStrategy}>
          {cards.map((card) => (
            <SortableCard key={card.id} card={card} />
          ))}
        </SortableContext>
        {cards.length === 0 && (
          <div className="flex flex-1 items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/20 p-4">
            <p className="text-xs text-muted-foreground">Drop cards here</p>
          </div>
        )}
      </div>
      <div className="px-3 pb-3">
        <Button variant="ghost" size="sm" className="w-full" onClick={() => onAddCard(column.id)}>
          <Plus className="mr-1 h-3 w-3" />
          Add Card
        </Button>
      </div>
    </div>
  )
}

function AddCardDialog({
  open,
  onOpenChange,
  onAdd,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (data: { title: string; description?: string; label?: string }) => void
}) {
  const [title, setTitle] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [label, setLabel] = React.useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    onAdd({
      title: title.trim(),
      description: description.trim() || undefined,
      label: label.trim() || undefined,
    })
    setTitle("")
    setDescription("")
    setLabel("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Card</DialogTitle>
            <DialogDescription>Create a new card in this column.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Card title"
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a description..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="label">Label</Label>
              <Input
                id="label"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="e.g. Bug, Feature, Design"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!title.trim()}>
              Add Card
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function findColumnByCardId(columns: KanbanColumnData[], cardId: string): string | null {
  for (const col of columns) {
    if (col.cards.some((c) => c.id === cardId)) return col.id
  }
  return null
}

export function KanbanBoard({ columns, onColumnsChange, onAddColumn }: KanbanBoardProps) {
  const [activeCard, setActiveCard] = React.useState<KanbanCardData | null>(null)
  const [overColumnId, setOverColumnId] = React.useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [dialogColumnId, setDialogColumnId] = React.useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor),
  )

  function handleDragStart(event: DragStartEvent) {
    const { active } = event
    const card = columns.flatMap((c) => c.cards).find((c) => c.id === active.id)
    if (card) setActiveCard(card)
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    setActiveCard(null)
    setOverColumnId(null)

    if (!over || !columns) return

    const activeColId = findColumnByCardId(columns, active.id as string)
    if (!activeColId) return

    let targetColId: string | null = null

    const overCard = columns.flatMap((c) => c.cards).find((c) => c.id === over.id)
    if (overCard) {
      targetColId = findColumnByCardId(columns, over.id as string)
    } else {
      const colExists = columns.some((c) => c.id === over.id)
      if (colExists) targetColId = over.id as string
    }

    if (!targetColId || activeColId === targetColId) return

    const updated = columns.map((col) => {
      if (col.id === activeColId) {
        return { ...col, cards: col.cards.filter((c) => c.id !== active.id) }
      }
      if (col.id === targetColId) {
        const movedCard = columns.flatMap((c) => c.cards).find((c) => c.id === active.id)
        if (!movedCard) return col
        return { ...col, cards: [...col.cards, movedCard] }
      }
      return col
    })

    onColumnsChange?.(updated)
  }

  function handleDragOver(event: { active: UniqueIdentifier; over?: UniqueIdentifier | null }) {
    const { active, over } = event
    if (!over) {
      setOverColumnId(null)
      return
    }

    const overCard = columns.flatMap((c) => c.cards).find((c) => c.id === over)
    if (overCard) {
      const colId = findColumnByCardId(columns, over)
      setOverColumnId(colId)
    } else {
      const colExists = columns.some((c) => c.id === over)
      setOverColumnId(colExists ? (over as string) : null)
    }
  }

  function handleAddCard(data: { title: string; description?: string; label?: string }) {
    if (!dialogColumnId) return
    const newCard: KanbanCardData = {
      id: \`card-\${Date.now()}-\${Math.random().toString(36).slice(2, 7)}\`,
      ...data,
    }
    const updated = columns.map((col) => {
      if (col.id === dialogColumnId) {
        return { ...col, cards: [...col.cards, newCard] }
      }
      return col
    })
    onColumnsChange?.(updated)
  }

  function handleDeleteColumn(columnId: string) {
    const updated = columns.filter((col) => col.id !== columnId)
    onColumnsChange?.(updated)
  }

  function handleAddColumnClick() {
    if (!onAddColumn) return
    const title = window.prompt("Column name")
    if (title?.trim()) onAddColumn(title.trim())
  }

  const allCardIds = columns.flatMap((c) => c.cards.map((card) => card.id))

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div />
        <div className="flex items-center gap-2">
          {onAddColumn && (
            <Button variant="outline" size="sm" onClick={handleAddColumnClick}>
              <Plus className="mr-1 h-3 w-3" />
              Add Column
            </Button>
          )}
        </div>
      </div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
      >
        <div className="flex gap-4 overflow-x-auto pb-4">
          {columns.map((column) => (
            <div key={column.id} className="flex">
              <Column
                column={column}
                cards={column.cards}
                onAddCard={(colId) => {
                  setDialogColumnId(colId)
                  setDialogOpen(true)
                }}
                onDeleteColumn={handleDeleteColumn}
                isOver={overColumnId === column.id}
              />
            </div>
          ))}
        </div>
        <DragOverlay>
          {activeCard ? <SortableCard card={activeCard} isDragOverlay /> : null}
        </DragOverlay>
      </DndContext>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AddCardDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onAdd={handleAddCard}
        />
      </Dialog>
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
