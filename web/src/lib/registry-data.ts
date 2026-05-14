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
      "Rich text editor with formatting toolbar, placeholder support, and controlled HTML output.",
    dependencies: ["@tiptap/react", "@tiptap/starter-kit", "@tiptap/extension-image", "@tiptap/extension-link", "@tiptap/extension-placeholder"],
    registryDependencies: ["button", "toggle", "separator"],
    files: [
      {
        path: "rich-text-editor.tsx",
        type: "registry:component",
        content: `"use client"

import * as React from "react"
import { useEditor, EditorContent, type Editor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import ImageExt from "@tiptap/extension-image"
import LinkExt from "@tiptap/extension-link"
import PlaceholderExt from "@tiptap/extension-placeholder"
import { Toggle } from "@/components/ui/toggle"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Quote,
  Minus,
  Undo,
  Redo,
  Pilcrow,
} from "lucide-react"

export interface RichTextEditorRef {
  editor: Editor | null
  focus: () => void
  getHTML: () => string
  getText: () => string
}

export interface RichTextEditorProps {
  value?: string
  onChange?: (html: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

interface ToolbarBtnProps {
  active: boolean
  onClick: () => void
  children: React.ReactNode
  title: string
}

function ToolbarBtn({ active, onClick, children, title }: ToolbarBtnProps) {
  return (
    <Toggle
      pressed={active}
      onPressedChange={onClick}
      title={title}
      aria-label={title}
      size="sm"
      className="h-8 w-8 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground"
    >
      {children}
    </Toggle>
  )
}

const editorStyling = [
  "focus:outline-none min-h-[200px] px-3 py-2",
  "[&_h1]:text-2xl [&_h1]:font-bold [&_h1]:tracking-tight",
  "[&_h2]:text-xl [&_h2]:font-semibold [&_h2]:tracking-tight",
  "[&_ul]:list-disc [&_ul]:pl-6",
  "[&_ol]:list-decimal [&_ol]:pl-6",
  "[&_li]:mb-1",
  "[&_blockquote]:border-l-4 [&_blockquote]:border-muted-foreground/30 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted-foreground",
  "[&_code]:rounded [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-sm [&_code]:font-mono",
  "[&_pre]:rounded-lg [&_pre]:bg-muted [&_pre]:p-4 [&_pre]:overflow-x-auto",
  "[&_hr]:border-border [&_hr]:my-4",
  "[&_a]:text-accent [&_a]:underline [&_a]:underline-offset-2",
  "[&_p]:leading-7",
].join(" ")

export const RichTextEditor = React.forwardRef<RichTextEditorRef, RichTextEditorProps>(
  ({ value = "", onChange, placeholder = "Start writing...", className, disabled }, ref) => {
    const [mounted, setMounted] = React.useState(false)

    const editor = useEditor({
      extensions: [
        StarterKit.configure({ heading: { levels: [1, 2] } }),
        ImageExt.configure({ inline: true, allowBase64: true }),
        LinkExt.configure({
          openOnClick: false,
          HTMLAttributes: { class: "text-accent underline underline-offset-2" },
        }),
        PlaceholderExt.configure({
          placeholder,
          emptyEditorClass: "is-editor-empty",
        }),
      ],
      content: value || "",
      editable: !disabled,
      onUpdate: ({ editor }) => {
        const html = editor.getHTML()
        onChange?.(html === "<p></p>" ? "" : html)
      },
      editorProps: {
        attributes: { class: editorStyling },
      },
    })

    React.useImperativeHandle(
      ref,
      () => ({
        editor: editor ?? null,
        focus: () => editor?.commands.focus(),
        getHTML: () => editor?.getHTML() ?? "",
        getText: () => editor?.getText() ?? "",
      }),
      [editor]
    )

    React.useEffect(() => {
      if (editor && !mounted) setMounted(true)
    }, [editor, mounted])

    React.useEffect(() => {
      if (editor && mounted && value !== editor.getHTML()) {
        const normalized = value === "" ? "<p></p>" : value
        if (editor.getHTML() !== normalized) {
          editor.commands.setContent(value || "", false)
        }
      }
    }, [value, editor, mounted])

    if (!editor) {
      return (
        <div className={cn("rounded-lg border bg-background", className)}>
          <div className="flex items-center justify-center min-h-[200px] text-sm text-muted-foreground">
            Loading editor...
          </div>
        </div>
      )
    }

    return (
      <div
        className={cn(
          "vibekit-rte rounded-lg border bg-background overflow-hidden focus-within:ring-1 focus-within:ring-accent/50 transition-all",
          disabled && "opacity-50 pointer-events-none",
          className
        )}
      >
        <style>
          {".vibekit-rte .ProseMirror p.is-editor-empty:first-child::before{color:hsl(var(--muted-foreground));opacity:.6;content:attr(data-placeholder);float:left;height:0;pointer-events:none;}"}
        </style>

        <div className="flex flex-wrap items-center gap-0.5 border-b bg-muted/50 px-2 py-1.5">
          <ToolbarBtn
            active={editor.isActive("bold")}
            onClick={() => editor.chain().focus().toggleBold().run()}
            title="Bold"
          >
            <Bold className="h-4 w-4" />
          </ToolbarBtn>
          <ToolbarBtn
            active={editor.isActive("italic")}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            title="Italic"
          >
            <Italic className="h-4 w-4" />
          </ToolbarBtn>
          <ToolbarBtn
            active={editor.isActive("strike")}
            onClick={() => editor.chain().focus().toggleStrike().run()}
            title="Strikethrough"
          >
            <Strikethrough className="h-4 w-4" />
          </ToolbarBtn>
          <ToolbarBtn
            active={editor.isActive("code")}
            onClick={() => editor.chain().focus().toggleCode().run()}
            title="Inline Code"
          >
            <Code className="h-4 w-4" />
          </ToolbarBtn>

          <Separator orientation="vertical" className="mx-1 h-6" />

          <ToolbarBtn
            active={editor.isActive("heading", { level: 1 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            title="Heading 1"
          >
            <Heading1 className="h-4 w-4" />
          </ToolbarBtn>
          <ToolbarBtn
            active={editor.isActive("heading", { level: 2 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            title="Heading 2"
          >
            <Heading2 className="h-4 w-4" />
          </ToolbarBtn>

          <Separator orientation="vertical" className="mx-1 h-6" />

          <ToolbarBtn
            active={editor.isActive("bulletList")}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            title="Bullet List"
          >
            <List className="h-4 w-4" />
          </ToolbarBtn>
          <ToolbarBtn
            active={editor.isActive("orderedList")}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            title="Ordered List"
          >
            <ListOrdered className="h-4 w-4" />
          </ToolbarBtn>
          <ToolbarBtn
            active={editor.isActive("blockquote")}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            title="Blockquote"
          >
            <Quote className="h-4 w-4" />
          </ToolbarBtn>
          <ToolbarBtn
            active={false}
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            title="Horizontal Rule"
          >
            <Minus className="h-4 w-4" />
          </ToolbarBtn>

          <Separator orientation="vertical" className="mx-1 h-6" />

          <ToolbarBtn
            active={false}
            onClick={() => editor.chain().focus().undo().run()}
            title="Undo"
          >
            <Undo className="h-4 w-4" />
          </ToolbarBtn>
          <ToolbarBtn
            active={false}
            onClick={() => editor.chain().focus().redo().run()}
            title="Redo"
          >
            <Redo className="h-4 w-4" />
          </ToolbarBtn>
        </div>

        <EditorContent editor={editor} />

        {!editor.getText().trim() && (
          <div className="flex flex-col items-center justify-center py-10 text-center pointer-events-none select-none border-t">
            <div className="rounded-full bg-muted p-3 mb-3">
              <Pilcrow className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">{placeholder}</p>
          </div>
        )}
      </div>
    )
  }
)
RichTextEditor.displayName = "RichTextEditor"`,
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
      "Organization management with team invites, role-based access, member directory, and organization settings.",
    dependencies: [],
    registryDependencies: [
      "avatar",
      "button",
      "card",
      "dialog",
      "select",
      "table",
      "tabs",
      "badge",
      "input",
      "label",
      "dropdown-menu",
      "separator",
    ],
    files: [
      {
        path: "org-team-ui.tsx",
        type: "registry:component",
        content: `
"use client"

import * as React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import {
  Building2,
  Mail,
  MoreHorizontal,
  Search,
  Settings,
  Shield,
  UserPlus,
  Users,
  X,
} from "lucide-react"

export interface TeamMember {
  id: string
  name: string
  email: string
  role: "admin" | "member" | "viewer"
  avatar?: string
}

export interface Organization {
  id: string
  name: string
  slug: string
  members: TeamMember[]
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

function getRoleBadgeVariant(role: TeamMember["role"]): "default" | "secondary" | "outline" | "destructive" {
  switch (role) {
    case "admin": return "default"
    case "member": return "secondary"
    case "viewer": return "outline"
  }
}

export interface TeamListProps {
  members: TeamMember[]
  onRemove?: (memberId: string) => void
  onRoleChange?: (memberId: string, role: TeamMember["role"]) => void
  className?: string
}

export function TeamList({ members, onRemove, onRoleChange, className }: TeamListProps) {
  if (members.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <Users className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-sm font-medium">No members yet</h3>
        <p className="mt-1 text-sm text-muted-foreground">Get started by inviting team members.</p>
      </div>
    )
  }

  const roles = ["admin", "member", "viewer"] as const

  return (
    <div className={cn("space-y-4", className)}>
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="w-[80px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      {member.avatar && <AvatarImage src={member.avatar} alt={member.name} />}
                      <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{member.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{member.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getRoleBadgeVariant(member.role)}>
                    {member.role === "admin" && <Shield className="mr-1 h-3 w-3 inline-block" />}
                    {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>
                  {(onRemove || onRoleChange) && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {onRoleChange && roles.filter((r) => r !== member.role).map((role) => (
                          <DropdownMenuItem key={role} onClick={() => onRoleChange(member.id, role)}>
                            Make {role.charAt(0).toUpperCase() + role.slice(1)}
                          </DropdownMenuItem>
                        ))}
                        {onRemove && onRoleChange && <DropdownMenuSeparator />}
                        {onRemove && (
                          <DropdownMenuItem onClick={() => onRemove(member.id)} className="text-destructive">
                            <X className="mr-2 h-4 w-4" />
                            Remove
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="space-y-3 md:hidden">
        {members.map((member) => (
          <Card key={member.id}>
            <CardContent className="flex items-center justify-between gap-3 p-4">
              <div className="flex items-center gap-3 min-w-0">
                <Avatar className="h-10 w-10 shrink-0">
                  {member.avatar && <AvatarImage src={member.avatar} alt={member.name} />}
                  <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{member.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{member.email}</p>
                  <Badge variant={getRoleBadgeVariant(member.role)} className="mt-2">
                    {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export interface InviteDialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onInvite?: (email: string, role: TeamMember["role"]) => void
}

export function InviteDialog({ open, onOpenChange, onInvite }: InviteDialogProps) {
  const [email, setEmail] = React.useState("")
  const [role, setRole] = React.useState<TeamMember["role"]>("member")
  const [error, setError] = React.useState<string | null>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim() || !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) {
      setError("Valid email required")
      return
    }
    onInvite?.(email.trim(), role)
    setEmail("")
    setRole("member")
    setError(null)
    onOpenChange?.(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Invite team member</DialogTitle>
            <DialogDescription>Send an invitation to join your organization.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="invite-email">Email address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="invite-email" placeholder="colleague@company.com" type="email" value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(null) }} className="pl-10" autoFocus />
              </div>
              {error && <p className="text-xs text-destructive">{error}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="invite-role">Role</Label>
              <Select value={role} onValueChange={(v) => setRole(v as TeamMember["role"])}>
                <SelectTrigger id="invite-role"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="member">Member</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange?.(false)}>Cancel</Button>
            <Button type="submit" disabled={!email.trim()}>Send invite</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export interface MemberDirectoryProps {
  members: TeamMember[]
  className?: string
}

export function MemberDirectory({ members, className }: MemberDirectoryProps) {
  const [query, setQuery] = React.useState("")
  const filtered = query.trim()
    ? members.filter((m) => m.name.toLowerCase().includes(query.toLowerCase()) || m.email.toLowerCase().includes(query.toLowerCase()))
    : members

  if (filtered.length === 0) {
    return (
      <div className={cn("flex flex-col items-center justify-center py-8 text-center", className)}>
        <Users className="h-8 w-8 text-muted-foreground/50 mb-2" />
        <p className="text-sm font-medium">{query ? "No results found" : "No members yet"}</p>
      </div>
    )
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search members..." value={query} onChange={(e) => setQuery(e.target.value)} className="pl-10" />
      </div>
      {filtered.map((member) => (
        <div key={member.id} className="flex items-center gap-3 rounded-lg border p-3">
          <Avatar className="h-9 w-9 shrink-0">
            {member.avatar && <AvatarImage src={member.avatar} alt={member.name} />}
            <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{member.name}</p>
            <p className="text-xs text-muted-foreground truncate">{member.email}</p>
          </div>
          <Badge variant={getRoleBadgeVariant(member.role)} className="shrink-0">
            {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
          </Badge>
        </div>
      ))}
    </div>
  )
}

export interface OrgTeamUIProps {
  organization: Organization
  onInvite?: (email: string, role: TeamMember["role"]) => void
  onRemove?: (memberId: string) => void
  onRoleChange?: (memberId: string, role: TeamMember["role"]) => void
  className?: string
}

export function OrgTeamUI({ organization, onInvite, onRemove, onRoleChange, className }: OrgTeamUIProps) {
  const [inviteOpen, setInviteOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")
  const filtered = searchQuery.trim()
    ? organization.members.filter((m) => m.name.toLowerCase().includes(searchQuery.toLowerCase()) || m.email.toLowerCase().includes(searchQuery.toLowerCase()))
    : organization.members

  return (
    <div className={cn("w-full", className)}>
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <Building2 className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">{organization.name}</h2>
          <p className="text-sm text-muted-foreground">{organization.members.length} member{organization.members.length !== 1 ? "s" : ""}</p>
        </div>
      </div>
      <Separator className="mb-6" />
      <Tabs defaultValue="members">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="members"><Users className="mr-2 h-4 w-4" /> Members</TabsTrigger>
          <TabsTrigger value="invite"><UserPlus className="mr-2 h-4 w-4" /> Invite</TabsTrigger>
          <TabsTrigger value="settings"><Settings className="mr-2 h-4 w-4" /> Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="members" className="mt-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search members..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
            </div>
            <Button size="sm" onClick={() => setInviteOpen(true)}><UserPlus className="mr-2 h-4 w-4" /> Invite member</Button>
          </div>
          <TeamList members={filtered} onRemove={onRemove} onRoleChange={onRoleChange} />
          <InviteDialog open={inviteOpen} onOpenChange={setInviteOpen} onInvite={onInvite} />
        </TabsContent>
        <TabsContent value="invite" className="mt-6">
          <Card><CardHeader><CardTitle>Invite team member</CardTitle><CardDescription>Send an invitation.</CardDescription></CardHeader>
            <CardContent>
              <InviteDialog open={false} onInvite={onInvite} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="settings" className="mt-6">
          <Card><CardHeader><CardTitle>Organization settings</CardTitle><CardDescription>Manage your organization.</CardDescription></CardHeader>
            <CardContent><p className="text-sm text-muted-foreground">Settings panel coming in next update.</p></CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
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
    description: "Responsive dashboard grid with bar, line, pie, and area chart components built with Recharts.",
    dependencies: ["recharts"],
    registryDependencies: ["card", "tabs", "skeleton", "button", "badge"],
    files: [
      {
        path: "charts-grid.tsx",
        type: "registry:component",
        content: `"use client"

import * as React from "react"
import {
  BarChart as RechartsBarChart,
  LineChart as RechartsLineChart,
  PieChart as RechartsPieChart,
  AreaChart as RechartsAreaChart,
  Bar,
  Line,
  Pie,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  ResponsiveContainer,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { BarChart3, LineChart as LineChartIcon, Maximize2, Minimize2 } from "lucide-react"
import { cn } from "@/lib/utils"

export interface ChartDataPoint { name: string; value: number; [key: string]: string | number }
export interface ChartCardProps { title: string; description?: string; className?: string; children: React.ReactNode; fullscreen?: boolean; onFullscreenToggle?: () => void; icon?: React.ReactNode }
export interface BarChartProps { data: ChartDataPoint[]; xKey?: string; bars?: { key: string; color?: string; name?: string }[]; loading?: boolean; height?: number; className?: string }
export interface LineChartProps { data: ChartDataPoint[]; xKey?: string; lines?: { key: string; color?: string; name?: string }[]; loading?: boolean; height?: number; className?: string }
export interface PieChartProps { data: { name: string; value: number; color?: string }[]; loading?: boolean; height?: number; className?: string; innerRadius?: number; outerRadius?: number }
export interface AreaChartProps { data: ChartDataPoint[]; xKey?: string; areas?: { key: string; color?: string; name?: string }[]; loading?: boolean; height?: number; className?: string }

function getNumericKeys(data: ChartDataPoint[], exclude: string): string[] {
  if (!data.length) return []
  const first = data[0]
  return Object.keys(first).filter((k) => k !== exclude && typeof first[k] === "number")
}

const CHART_COLORS = ["hsl(var(--accent))", "hsl(var(--chart-2, var(--accent)))", "hsl(var(--chart-3, var(--muted-foreground)))", "hsl(var(--chart-4, var(--primary)))", "hsl(var(--chart-5, var(--secondary)))"]

export function ChartSkeleton({ className }: { className?: string }) {
  return <div className={cn("space-y-3 p-4", className)}><Skeleton className="h-4 w-1/2" /><Skeleton className="h-4 w-1/3" /><Skeleton className="h-[200px] w-full rounded-lg" /></div>
}

export function ChartCard({ title, description, children, className, fullscreen, onFullscreenToggle, icon }: ChartCardProps) {
  return (
    <Card className={cn("relative transition-all", fullscreen && "fixed inset-4 z-50 overflow-auto", className)}>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          {icon && <span className="text-muted-foreground">{icon}</span>}
          <div><CardTitle className="text-sm font-medium">{title}</CardTitle>{description && <CardDescription>{description}</CardDescription>}</div>
        </div>
        {onFullscreenToggle && <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={onFullscreenToggle}>
          {fullscreen ? <Minimize2 className="h-3 w-3" /> : <Maximize2 className="h-3 w-3" />}
        </Button>}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

export interface DashboardGridProps { children: React.ReactNode; className?: string; cols?: 1 | 2 | 3 | 4 }
const gridCols: Record<number, string> = { 1: "grid-cols-1", 2: "sm:grid-cols-2", 3: "sm:grid-cols-2 lg:grid-cols-3", 4: "sm:grid-cols-2 lg:grid-cols-4" }

export function DashboardGrid({ children, className, cols = 3 }: DashboardGridProps) {
  return <div className={cn("grid gap-4", gridCols[cols], className)}>{children}</div>
}

export function BarChart({ data, xKey = "name", bars, loading, height = 300, className }: BarChartProps) {
  if (loading) return <ChartSkeleton className={className} />
  if (!data?.length) return <div className={cn("flex h-[200px] flex-col items-center justify-center text-muted-foreground", className)}><BarChart3 className="mb-2 h-8 w-8 opacity-40" /><p className="text-sm">No data available</p></div>
  const resolved = bars ?? getNumericKeys(data, xKey).map((key) => ({ key }))
  return (
    <div className={cn("w-full", className)}>
      <ResponsiveContainer width="100%" height={height}>
        <RechartsBarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey={xKey} tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
          <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
          <Tooltip contentStyle={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))", borderRadius: "8px", color: "hsl(var(--foreground))" }} />
          <Legend />
          {resolved.map((bar, i) => <Bar key={bar.key} dataKey={bar.key} fill={bar.color || CHART_COLORS[i % CHART_COLORS.length]} name={bar.name || bar.key} radius={[4, 4, 0, 0]} maxBarSize={40} />)}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function LineChart({ data, xKey = "name", lines, loading, height = 300, className }: LineChartProps) {
  if (loading) return <ChartSkeleton className={className} />
  if (!data?.length) return <div className={cn("flex h-[200px] flex-col items-center justify-center text-muted-foreground", className)}><LineChartIcon className="mb-2 h-8 w-8 opacity-40" /><p className="text-sm">No data available</p></div>
  const resolved = lines ?? getNumericKeys(data, xKey).map((key) => ({ key }))
  return (
    <div className={cn("w-full", className)}>
      <ResponsiveContainer width="100%" height={height}>
        <RechartsLineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey={xKey} tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
          <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
          <Tooltip contentStyle={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
          <Legend />
          {resolved.map((line, i) => <Line key={line.key} type="monotone" dataKey={line.key} stroke={line.color || CHART_COLORS[i % CHART_COLORS.length]} name={line.name || line.key} strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />)}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  )
}

const PIE_COLORS = ["hsl(var(--accent))", "hsl(var(--chart-2, 215 80% 55%))", "hsl(var(--chart-3, 142 70% 45%))", "hsl(var(--chart-4, 30 95% 55%))", "hsl(var(--chart-5, 0 70% 55%))"]

export function PieChart({ data, loading, height = 300, className, innerRadius = 0, outerRadius = 80 }: PieChartProps) {
  if (loading) return <ChartSkeleton className={className} />
  if (!data?.length) return <div className={cn("flex h-[200px] flex-col items-center justify-center text-muted-foreground", className)}><BarChart3 className="mb-2 h-8 w-8 opacity-40" /><p className="text-sm">No data available</p></div>
  return (
    <div className={cn("w-full", className)}>
      <ResponsiveContainer width="100%" height={height}>
        <RechartsPieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={innerRadius} outerRadius={outerRadius} paddingAngle={2} dataKey="value" label={({ name, percent }) => name + " " + (percent * 100).toFixed(0) + "%"}>
            {data.map((entry, i) => <Cell key={i} fill={entry.color || PIE_COLORS[i % PIE_COLORS.length]} />)}
          </Pie>
          <Tooltip contentStyle={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
          <Legend />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  )
}

export function AreaChart({ data, xKey = "name", areas, loading, height = 300, className }: AreaChartProps) {
  if (loading) return <ChartSkeleton className={className} />
  if (!data?.length) return <div className={cn("flex h-[200px] flex-col items-center justify-center text-muted-foreground", className)}><LineChartIcon className="mb-2 h-8 w-8 opacity-40" /><p className="text-sm">No data available</p></div>
  const resolved = areas ?? getNumericKeys(data, xKey).map((key) => ({ key }))
  return (
    <div className={cn("w-full", className)}>
      <ResponsiveContainer width="100%" height={height}>
        <RechartsAreaChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
          <defs>{resolved.map((area, i) => { const c = area.color || CHART_COLORS[i % CHART_COLORS.length]; return <linearGradient key={area.key} id={"areaGrad-" + area.key} x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={c} stopOpacity={0.3} /><stop offset="95%" stopColor={c} stopOpacity={0} /></linearGradient> })}</defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey={xKey} tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
          <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
          <Tooltip contentStyle={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
          <Legend />
          {resolved.map((area, i) => { const c = area.color || CHART_COLORS[i % CHART_COLORS.length]; return <Area key={area.key} type="monotone" dataKey={area.key} stroke={c} fill={"url(#areaGrad-" + area.key + ")"} name={area.name || area.key} strokeWidth={2} /> })}
        </RechartsAreaChart>
      </ResponsiveContainer>
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
      "Step-by-step form wizard with progress indicator, step navigation, numbered badges, and back/continue controls.",
    dependencies: ["zod", "react-hook-form", "@hookform/resolvers"],
    registryDependencies: ["button", "card", "input", "label", "progress", "select", "textarea", "badge"],
    files: [
      {
        path: "multi-step-form.tsx",
        type: "registry:component",
        content: `"use client"

import * as React from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

// ─── Types ────────────────────────────────────────────

export interface WizardContextValue {
  currentStep: number
  totalSteps: number
  next: () => void
  back: () => void
  goTo: (step: number) => void
  isFirst: boolean
  isLast: boolean
  progress: number
}

// ─── Context ───────────────────────────────────────────

const WizardContext = React.createContext<WizardContextValue | null>(null)

// ─── useWizard ─────────────────────────────────────────

export function useWizard(): WizardContextValue {
  const ctx = React.useContext(WizardContext)
  if (!ctx) throw new Error("useWizard must be used within a <Wizard>")
  return ctx
}

// ─── WizardStep ────────────────────────────────────────

export interface WizardStepProps {
  children: React.ReactNode
  className?: string
}

export function WizardStep({ children, className }: WizardStepProps) {
  return <div className={cn("space-y-6", className)}>{children}</div>
}

// ─── Wizard ────────────────────────────────────────────

export interface WizardProps {
  children: React.ReactNode
  className?: string
  /** 0-indexed starting step */
  defaultStep?: number
  onStepChange?: (step: number) => void
  onComplete?: () => void
}

export function Wizard({
  children,
  className,
  defaultStep = 0,
  onStepChange,
  onComplete,
}: WizardProps) {
  const steps = React.Children.toArray(children).filter(
    (child): child is React.ReactElement<WizardStepProps> =>
      React.isValidElement(child) && child.type === WizardStep
  )

  const totalSteps = steps.length
  const initial = Math.min(defaultStep, Math.max(0, totalSteps - 1))
  const [currentStep, setCurrentStep] = React.useState(initial)

  const next = React.useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1))
  }, [totalSteps])

  const back = React.useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }, [])

  const goTo = React.useCallback(
    (step: number) => {
      if (step >= 0 && step < totalSteps) setCurrentStep(step)
    },
    [totalSteps]
  )

  React.useEffect(() => {
    onStepChange?.(currentStep)
  }, [currentStep, onStepChange])

  React.useEffect(() => {
    if (currentStep >= totalSteps) {
      setCurrentStep(Math.max(0, totalSteps - 1))
    }
  }, [totalSteps, currentStep])

  const isFirst = currentStep === 0
  const isLast = currentStep === totalSteps - 1
  const progress = totalSteps > 1 ? ((currentStep + 1) / totalSteps) * 100 : 100

  const ctx: WizardContextValue = React.useMemo(
    () => ({ currentStep, totalSteps, next, back, goTo, isFirst, isLast, progress }),
    [currentStep, totalSteps, next, back, goTo, isFirst, isLast, progress]
  )

  if (totalSteps === 0) {
    return (
      <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">
        No steps defined. Add one or more WizardStep children.
      </div>
    )
  }

  return (
    <WizardContext.Provider value={ctx}>
      <div className={cn("space-y-6", className)}>
        {/* Step indicator badges */}
        <div className="flex items-center justify-center gap-1.5 sm:gap-3">
          {Array.from({ length: totalSteps }, (_, i) => (
            <React.Fragment key={i}>
              <button
                type="button"
                onClick={() => goTo(i)}
                className={cn(
                  "flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-full text-[11px] sm:text-sm font-medium transition-all duration-150",
                  i === currentStep
                    ? "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2 ring-offset-background"
                    : i < currentStep
                    ? "bg-primary/10 text-primary border border-primary"
                    : "bg-muted text-muted-foreground border border-input hover:border-primary/50"
                )}
              >
                {i < currentStep ? (
                  <Check className="h-3 w-3 sm:h-4 sm:w-4" />
                ) : (
                  i + 1
                )}
              </button>
              {i < totalSteps - 1 && (
                <div
                  className={cn(
                    "h-[2px] flex-1 max-w-8 sm:max-w-12 rounded-full transition-colors duration-150",
                    i < currentStep ? "bg-primary" : "bg-border"
                  )}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Progress bar */}
        <Progress value={progress} className="h-2" />

        {/* Step content */}
        <Card className="overflow-hidden">
          <CardContent className="p-4 sm:p-6">{steps[currentStep]}</CardContent>
          <CardFooter className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 border-t px-4 sm:px-6 py-4">
            <Button
              type="button"
              variant="outline"
              onClick={back}
              disabled={isFirst}
              className="w-full sm:w-auto"
            >
              Back
            </Button>
            <span className="text-xs sm:text-sm text-muted-foreground tabular-nums">
              Step {currentStep + 1} of {totalSteps}
            </span>
            <Button
              type="button"
              onClick={() => {
                if (isLast) {
                  onComplete?.()
                } else {
                  next()
                }
              }}
              className="w-full sm:w-auto"
            >
              {isLast ? "Complete" : "Continue"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </WizardContext.Provider>
  )
}`,
        target: "components/multi-step-form.tsx",
      },
    ],
  },
  {
    $schema: "https://ui.shadcn.com/schema/registry.json",
    name: "command-palette",
    type: "registry:component",
    title: "Command Palette",
    description: "⌘K-style command palette with keyboard shortcuts, fuzzy search, and action groups.",
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
  CommandSeparator,
} from "@/components/ui/command"
import { Search, Command } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export interface CommandAction {
  id: string
  label: string
  shortcut?: string
  icon?: React.ReactNode
  onSelect: () => void
}

export interface ActionGroup {
  id: string
  label: string
  actions: CommandAction[]
}

export function useCommandPalette() {
  const [open, setOpen] = React.useState(false)
  const toggle = React.useCallback(() => setOpen((prev) => !prev), [])
  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); setOpen((prev) => !prev) }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])
  return { open, setOpen, toggle }
}

export function CommandPaletteTrigger({ onClick, className }: { onClick?: () => void; className?: string }) {
  return (
    <Button variant="outline" className={cn("relative h-9 w-full justify-start rounded-lg text-sm text-muted-foreground shadow-none sm:pr-12 md:w-40 lg:w-64", className)} onClick={onClick}>
      <Search className="mr-2 h-4 w-4" />
      <span>Search...</span>
      <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium sm:flex">
        <Command className="h-3 w-3" /><span className="text-xs">K</span>
      </kbd>
    </Button>
  )
}

export function CommandPalette({ open, onOpenChange, groups }: { open?: boolean; onOpenChange?: (open: boolean) => void; groups: ActionGroup[] }) {
  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {groups.map((group, index) => (
          <React.Fragment key={group.id}>
            {index > 0 && <CommandSeparator />}
            <CommandGroup heading={group.label}>
              {group.actions.map((action) => (
                <CommandItem key={action.id} onSelect={action.onSelect}>
                  {action.icon && <span className="mr-2 flex h-4 w-4 items-center justify-center">{action.icon}</span>}
                  <span>{action.label}</span>
                  {action.shortcut && <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium">{action.shortcut}</kbd>}
                </CommandItem>
              ))}
            </CommandGroup>
          </React.Fragment>
        ))}
        {groups.length === 0 && <div className="py-6 text-center text-sm text-muted-foreground">No commands available.</div>}
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
    description: "Bell dropdown with real-time notifications, read/unread state, tabs, and clear-all.",
    dependencies: [],
    registryDependencies: ["button", "card", "dropdown-menu", "scroll-area", "tabs", "avatar", "badge"],
    files: [
      {
        path: "notification-center.tsx",
        type: "registry:component",
        content: `"use client"

import * as React from "react"
import { Bell, CheckCheck, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export interface Notification {
  id: string
  title: string
  description?: string
  read: boolean
  createdAt: Date | string
  type?: string
  avatar?: string
}

interface NotificationContextValue {
  notifications: Notification[]
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  clearAll: () => void
  unreadCount: number
}

const NotificationContext = React.createContext<NotificationContextValue | null>(null)

export function NotificationProvider({ children, notifications: initial = [] }: { children: React.ReactNode; notifications?: Notification[] }) {
  const [notifications, setNotifications] = React.useState<Notification[]>(initial)
  const markAsRead = React.useCallback((id: string) => setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n)), [])
  const markAllAsRead = React.useCallback(() => setNotifications((prev) => prev.map((n) => ({ ...n, read: true }))), [])
  const clearAll = React.useCallback(() => setNotifications([]), [])
  const unreadCount = notifications.filter((n) => !n.read).length
  return <NotificationContext.Provider value={{ notifications, markAsRead, markAllAsRead, clearAll, unreadCount }}>{children}</NotificationContext.Provider>
}

function useNotifications(): NotificationContextValue {
  const ctx = React.useContext(NotificationContext)
  if (!ctx) throw new Error("useNotifications must be used within a <NotificationProvider>")
  return ctx
}

function timeAgo(date: Date | string): string {
  const diffMs = Date.now() - new Date(date).getTime()
  const diffSec = Math.floor(diffMs / 1000)
  if (diffSec < 10) return "just now"
  if (diffSec < 60) return diffSec + "s ago"
  const diffMin = Math.floor(diffSec / 60)
  if (diffMin < 60) return diffMin + "m ago"
  const diffHr = Math.floor(diffMin / 60)
  if (diffHr < 24) return diffHr + "h ago"
  const diffDay = Math.floor(diffHr / 24)
  if (diffDay < 7) return diffDay + "d ago"
  return new Date(date).toLocaleDateString(undefined, { month: "short", day: "numeric" })
}

function NotificationItem({ notification, onMarkAsRead }: { notification: Notification; onMarkAsRead: (id: string) => void }) {
  return (
    <button type="button" onClick={() => { if (!notification.read) onMarkAsRead(notification.id) }}
      className={cn("flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-muted/50", !notification.read && "bg-muted/30")}>
      {notification.avatar ? (
        <Avatar className="h-8 w-8 shrink-0"><AvatarFallback className="text-[10px]">{notification.avatar.slice(0, 2).toUpperCase()}</AvatarFallback></Avatar>
      ) : (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10"><Bell className="h-4 w-4 text-primary" /></div>
      )}
      <div className="flex-1 space-y-0.5 overflow-hidden">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-sm font-medium">{notification.title}</p>
          <span className="shrink-0 text-[10px] text-muted-foreground">{timeAgo(notification.createdAt)}</span>
        </div>
        {notification.description && <p className="line-clamp-2 text-xs text-muted-foreground">{notification.description}</p>}
      </div>
      {!notification.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />}
    </button>
  )
}

export function NotificationList({ className }: { className?: string }) {
  const { notifications, markAsRead, markAllAsRead, clearAll } = useNotifications()
  const [tab, setTab] = React.useState("all")
  const filtered = tab === "unread" ? notifications.filter((n) => !n.read) : notifications
  const unreadCount = notifications.filter((n) => !n.read).length
  return (
    <Card className={cn("border-0 shadow-none", className)}>
      <CardHeader className="pb-2 pt-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold">Notifications</CardTitle>
          <div className="flex items-center gap-1">
            {unreadCount > 0 && <Button variant="ghost" size="icon" className="h-7 w-7" onClick={markAllAsRead} title="Mark all as read"><CheckCheck className="h-4 w-4" /></Button>}
            {notifications.length > 0 && <Button variant="ghost" size="icon" className="h-7 w-7" onClick={clearAll} title="Clear all"><ChevronRight className="h-4 w-4" /></Button>}
          </div>
        </div>
      </CardHeader>
      <Tabs value={tab} onValueChange={setTab}>
        <div className="px-3"><TabsList className="w-full">
          <TabsTrigger value="all" className="flex-1 text-xs">All</TabsTrigger>
          <TabsTrigger value="unread" className="flex-1 text-xs">Unread{unreadCount > 0 && <Badge variant="secondary" className="ml-1.5 px-1 py-0 text-[10px]">{unreadCount}</Badge>}</TabsTrigger>
        </TabsList></div>
        <TabsContent value="all" className="mt-0">
          <ScrollArea className="h-[320px]">
            <CardContent className="p-2">
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center"><Bell className="mb-2 h-8 w-8 text-muted-foreground/50" /><p className="text-sm text-muted-foreground">No notifications yet</p></div>
              ) : (
                <div className="space-y-1">{filtered.map((n) => <NotificationItem key={n.id} notification={n} onMarkAsRead={markAsRead} />)}</div>
              )}
            </CardContent>
          </ScrollArea>
        </TabsContent>
        <TabsContent value="unread" className="mt-0">
          <ScrollArea className="h-[320px]">
            <CardContent className="p-2">
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center"><Bell className="mb-2 h-8 w-8 text-muted-foreground/50" /><p className="text-sm text-muted-foreground">No unread notifications</p></div>
              ) : (
                <div className="space-y-1">{filtered.map((n) => <NotificationItem key={n.id} notification={n} onMarkAsRead={markAsRead} />)}</div>
              )}
            </CardContent>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </Card>
  )
}

export function NotificationBell() {
  const { unreadCount } = useNotifications()
  const [open, setOpen] = React.useState(false)
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label={\`Notifications \${unreadCount > 0 ? \`(\${unreadCount} unread)\` : ""}\`}>
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && <span className="absolute -right-1 -top-1 flex h-4 w-4 min-w-[16px] items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-medium text-destructive-foreground">{unreadCount > 9 ? "9+" : unreadCount}</span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={8} className="w-[380px] p-0">
        <NotificationList />
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
    description: "Advanced form components: tags input with badges and phone input with formatting.",
    dependencies: [],
    registryDependencies: ["badge", "button", "input", "label", "popover", "calendar", "command"],
    files: [
      {
        path: "advanced-form-elements.tsx",
        type: "registry:component",
        content: `"use client"

import * as React from "react"
import { X, Phone } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export interface TagsInputProps {
  value?: string[]
  onChange?: (tags: string[]) => void
  placeholder?: string
  maxTags?: number
  label?: string
  error?: string
  helperText?: string
  disabled?: boolean
  id?: string
}

export function TagsInput({ value = [], onChange, placeholder = "Type and press Enter...", maxTags, label, error, helperText, disabled, id }: TagsInputProps) {
  const [inputValue, setInputValue] = React.useState("")
  const inputRef = React.useRef<HTMLInputElement>(null)
  const generatedId = React.useId()
  const inputId = id || generatedId

  function addTag() {
    const trimmed = inputValue.trim()
    if (!trimmed || value.includes(trimmed)) return
    if (maxTags && value.length >= maxTags) return
    onChange?.([...value, trimmed])
    setInputValue("")
  }

  function removeTag(tag: string) { onChange?.(value.filter((t) => t !== tag)) }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") { e.preventDefault(); addTag(); return }
    if (e.key === "Backspace" && !inputValue && value.length > 0) removeTag(value[value.length - 1])
  }

  return (
    <div className="space-y-2">
      {label && <Label htmlFor={inputId} className={cn(error && "text-destructive")}>{label}</Label>}
      <div className={cn("flex min-h-[40px] flex-wrap items-center gap-1.5 rounded-lg border bg-background px-3 py-2 text-sm ring-offset-background transition-colors focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2", error && "border-destructive", disabled && "cursor-not-allowed opacity-50")}
        onClick={() => { if (!disabled) inputRef.current?.focus() }}>
        {value.map((tag) => (
          <Badge key={tag} variant="secondary" className="gap-1 text-xs">
            {tag}
            <button type="button" disabled={disabled} onClick={(e) => { e.stopPropagation(); removeTag(tag) }} className="rounded-full p-0.5 transition-colors hover:bg-muted-foreground/20"><X className="h-3 w-3" /><span className="sr-only">Remove {tag}</span></button>
          </Badge>
        ))}
        {(!maxTags || value.length < maxTags) && (
          <input ref={inputRef} id={inputId} type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={handleKeyDown}
            placeholder={value.length === 0 ? placeholder : ""} disabled={disabled}
            className="min-w-[100px] flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
        )}
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
      {!error && helperText && <p className="text-xs text-muted-foreground">{helperText}</p>}
    </div>
  )
}

function formatPhone(digits: string): string {
  if (digits.length <= 3) return digits
  if (digits.length <= 6) return "(" + digits.slice(0, 3) + ") " + digits.slice(3)
  if (digits.length <= 10) return "(" + digits.slice(0, 3) + ") " + digits.slice(3, 6) + "-" + digits.slice(6)
  return "(" + digits.slice(0, 3) + ") " + digits.slice(3, 6) + "-" + digits.slice(6, 10)
}

export interface PhoneInputProps {
  value?: string; onChange?: (value: string) => void; placeholder?: string; label?: string; error?: string; helperText?: string; disabled?: boolean; id?: string
}

export function PhoneInput({ value = "", onChange, placeholder = "(555) 123-4567", label, error, helperText, disabled, id }: PhoneInputProps) {
  const generatedId = React.useId()
  const inputId = id || generatedId
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) { onChange?.(e.target.value.replace(/\\D/g, "")) }
  const displayValue = formatPhone(value)
  const showHint = value.length > 0 && value.length < 10

  return (
    <div className="space-y-2">
      {label && <Label htmlFor={inputId} className={cn(error && "text-destructive")}>{label}</Label>}
      <div className={cn("flex rounded-lg border bg-background ring-offset-background transition-colors focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2", error && "border-destructive", showHint && "border-amber-500/50", disabled && "cursor-not-allowed opacity-50")}>
        <div className="flex items-center gap-1.5 border-r px-3 py-2 text-sm text-muted-foreground"><Phone className="h-4 w-4" /><span className="font-medium">+1</span></div>
        <input id={inputId} type="text" inputMode="numeric" value={displayValue} onChange={handleChange} placeholder={placeholder} disabled={disabled}
          className="flex-1 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground" autoComplete="tel-national" />
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
      {!error && helperText && <p className="text-xs text-muted-foreground">{helperText}</p>}
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
    description: "Media library with grid/list views, file preview dialog, upload button, and search.",
    dependencies: [],
    registryDependencies: ["button", "card", "dialog", "input", "badge"],
    files: [
      {
        path: "file-manager.tsx",
        type: "registry:component",
        content: `"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import {
  Upload,
  Search,
  FileText,
  Image,
  File,
  Trash2,
  Grid3X3,
  List,
} from "lucide-react"

export interface FileItem {
  id: string
  name: string
  type: string
  size: number
  url: string
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B"
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
  return (bytes / (1024 * 1024)).toFixed(1) + " MB"
}

function getFileIcon(type: string) {
  if (type.startsWith("image/")) return <Image className="h-5 w-5" />
  if (type.startsWith("text/") || type.includes("pdf")) return <FileText className="h-5 w-5" />
  return <File className="h-5 w-5" />
}

function getFileTypeLabel(type: string): string {
  if (type.startsWith("image/")) return type.split("/")[1].toUpperCase()
  if (type.includes("pdf")) return "PDF"
  return type.split("/").pop()?.toUpperCase() || "FILE"
}

interface FileManagerProps {
  files?: FileItem[]
  onUpload?: () => void
  onDelete?: (id: string) => void
}

export function FileManager({ files = [], onUpload, onDelete }: FileManagerProps) {
  const [view, setView] = React.useState<"grid" | "list">("grid")
  const [query, setQuery] = React.useState("")
  const [preview, setPreview] = React.useState<FileItem | null>(null)

  const filtered = query.trim()
    ? files.filter((f) => f.name.toLowerCase().includes(query.toLowerCase()))
    : files

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h3 className="text-lg font-semibold">Media Library</h3>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setView("grid")}>
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setView("list")}>
            <List className="h-4 w-4" />
          </Button>
          <Button size="sm" onClick={onUpload}>
            <Upload className="mr-1 h-4 w-4" /> Upload
          </Button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search files..." value={query} onChange={(e) => setQuery(e.target.value)} className="pl-10" />
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <File className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-sm font-medium">{query ? "No results found" : "No files yet"}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{query ? "Try a different search term." : "Upload your first file to get started."}</p>
        </div>
      ) : view === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {filtered.map((file) => (
            <Card key={file.id} className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow" onClick={() => setPreview(file)}>
              <CardContent className="p-0">
                <div className="aspect-square rounded-t-lg bg-muted flex items-center justify-center text-muted-foreground">
                  {getFileIcon(file.type)}
                </div>
                <div className="p-2 space-y-1">
                  <p className="text-xs font-medium truncate">{file.name}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-[10px]">{getFileTypeLabel(file.type)}</Badge>
                    <span className="text-[10px] text-muted-foreground">{formatSize(file.size)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-1">
          {filtered.map((file) => (
            <div key={file.id} className="flex items-center gap-3 rounded-lg border p-3 hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => setPreview(file)}>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">{getFileIcon(file.type)}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{file.name}</p>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-[10px]">{getFileTypeLabel(file.type)}</Badge>
                  <span className="text-[10px] text-muted-foreground">{formatSize(file.size)}</span>
                </div>
              </div>
              {onDelete && (
                <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={(e) => { e.stopPropagation(); onDelete(file.id) }}>
                  <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive transition-colors" />
                </Button>
              )}
            </div>
          ))}
        </div>
      )}

      <Dialog open={!!preview} onOpenChange={(open) => { if (!open) setPreview(null) }}>
        {preview && (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{preview.name}</DialogTitle>
              <DialogDescription>{formatSize(preview.size)} — {preview.type}</DialogDescription>
            </DialogHeader>
            <div className="flex items-center justify-center rounded-lg bg-muted p-8 min-h-[200px]">
              {preview.type.startsWith("image/") ? (
                <img src={preview.url} alt={preview.name} className="max-h-[300px] rounded-lg object-contain" />
              ) : (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  {getFileIcon(preview.type)}
                  <p className="text-sm">Preview not available</p>
                </div>
              )}
            </div>
          </DialogContent>
        )}
      </Dialog>
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
import { Printer, Receipt } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

// ─── Types ───────────────────────────────────

export interface InvoiceItem {
  description: string
  quantity: number
  rate: number
}

export interface InvoiceProps {
  number?: string
  date?: string
  dueDate?: string
  from?: { name: string; email: string; address?: string }
  to?: { name: string; email: string; address?: string }
  items?: InvoiceItem[]
  taxRate?: number
  notes?: string
}

export interface ReceiptItem {
  description: string
  amount: number
}

export interface ReceiptProps {
  number?: string
  date?: string
  merchant?: { name: string; email: string }
  customer?: { name: string; email: string }
  items?: ReceiptItem[]
  paymentMethod?: string
  total?: number
}

export interface ReportSection {
  title: string
  content: string
}

export interface ReportProps {
  title?: string
  date?: string
  author?: string
  sections?: ReportSection[]
}

// ─── Helpers ─────────────────────────────────

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}

function calcSubtotal(items: InvoiceItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity * item.rate, 0)
}

// ─── Print Styles ────────────────────────────

const printStyles = [
  "@media print{",
  "body{-webkit-print-color-adjust:exact;print-color-adjust:exact}",
  ".no-print{display:none!important}",
  ".print-only{display:block!important}",
  "@page{margin:0.5in}",
  "}",
  "@media screen{.print-only{display:none!important}}",
].join("")

// ─── InvoiceTemplate ─────────────────────────

export function InvoiceTemplate({
  number = "INV-001",
  date = new Date().toLocaleDateString(),
  dueDate,
  from = { name: "Your Company", email: "billing@company.com", address: "123 Main St, City, State" },
  to = { name: "Client Name", email: "client@example.com", address: "456 Oak Ave, City, State" },
  items = [{ description: "Service", quantity: 1, rate: 0 }],
  taxRate = 0,
  notes,
}: InvoiceProps) {
  const subtotal = calcSubtotal(items)
  const tax = subtotal * taxRate
  const total = subtotal + tax

  return (
    <>
      <style>{printStyles}</style>
      <div className="space-y-4">
        <div className="no-print flex items-center justify-between">
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
                <p className="text-lg font-bold">{from.name}</p>
                <p className="text-sm text-muted-foreground">{from.email}</p>
                {from.address && <p className="text-sm text-muted-foreground">{from.address}</p>}
              </div>
              <div className="text-right">
                <p className="text-lg font-bold">{number}</p>
                <p className="text-sm text-muted-foreground">Date: {date}</p>
                {dueDate && <p className="text-sm text-muted-foreground">Due: {dueDate}</p>}
              </div>
            </div>
            <Separator />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Bill To:</p>
              <p className="font-semibold">{to.name}</p>
              <p className="text-sm text-muted-foreground">{to.email}</p>
              {to.address && <p className="text-sm text-muted-foreground">{to.address}</p>}
            </div>
            <Separator />
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 font-medium">Description</th>
                  <th className="text-right py-2 font-medium">Qty</th>
                  <th className="text-right py-2 font-medium">Rate</th>
                  <th className="text-right py-2 font-medium">Amount</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, i) => (
                  <tr key={i} className="border-b last:border-0">
                    <td className="py-2">{item.description}</td>
                    <td className="text-right py-2">{item.quantity}</td>
                    <td className="text-right py-2">{formatCurrency(item.rate)}</td>
                    <td className="text-right py-2">{formatCurrency(item.quantity * item.rate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Separator />
            <div className="flex justify-end">
              <div className="w-60 space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                {taxRate > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax ({(taxRate * 100).toFixed(0)}%)</span>
                    <span>{formatCurrency(tax)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-bold text-base">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>
            </div>
            {notes && (
              <>
                <Separator />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Notes</p>
                  <p className="text-sm">{notes}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}

// ─── ReceiptTemplate ─────────────────────────

export function ReceiptTemplate({
  number = "RCPT-001",
  date = new Date().toLocaleDateString(),
  merchant = { name: "Store Name", email: "store@example.com" },
  customer = { name: "Customer Name", email: "customer@example.com" },
  items = [{ description: "Item", amount: 0 }],
  paymentMethod = "Credit Card",
  total,
}: ReceiptProps) {
  const computedTotal = total ?? items.reduce((sum, item) => sum + item.amount, 0)

  return (
    <>
      <style>{printStyles}</style>
      <div className="space-y-4">
        <div className="no-print flex items-center justify-between">
          <h2 className="text-2xl font-bold">Receipt</h2>
          <Button variant="outline" onClick={() => window.print()}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
        </div>
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="text-center">
              <Receipt className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-lg font-bold">{merchant.name}</p>
              <p className="text-sm text-muted-foreground">{merchant.email}</p>
            </div>
            <Separator />
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Receipt #{number}</span>
              <span className="text-muted-foreground">{date}</span>
            </div>
            <Separator />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Customer</p>
              <p className="font-semibold">{customer.name}</p>
              <p className="text-sm text-muted-foreground">{customer.email}</p>
            </div>
            <Separator />
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 font-medium">Item</th>
                  <th className="text-right py-2 font-medium">Amount</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, i) => (
                  <tr key={i} className="border-b last:border-0">
                    <td className="py-2">{item.description}</td>
                    <td className="text-right py-2">{formatCurrency(item.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Separator />
            <div className="flex justify-end">
              <div className="w-48 space-y-1 text-sm">
                <div className="flex justify-between font-bold text-base">
                  <span>Total</span>
                  <span>{formatCurrency(computedTotal)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Paid via</span>
                  <span>{paymentMethod}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

// ─── ReportTemplate ──────────────────────────

export function ReportTemplate({
  title = "Report",
  date = new Date().toLocaleDateString(),
  author,
  sections = [],
}: ReportProps) {
  return (
    <>
      <style>{printStyles}</style>
      <div className="space-y-4">
        <div className="no-print flex items-center justify-between">
          <h2 className="text-2xl font-bold">{title}</h2>
          <Button variant="outline" onClick={() => window.print()}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>{title}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {date}
              {author && <span> &middot; {author}</span>}
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {sections.length === 0 ? (
              <p className="text-sm text-muted-foreground">No sections defined.</p>
            ) : (
              sections.map((section, i) => (
                <div key={i}>
                  <h3 className="text-sm font-semibold mb-2">{section.title}</h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{section.content}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}`,
        target: "components/printable-templates.tsx",
      },
    ],
  },
  {
    $schema: "https://ui.shadcn.com/schema/registry.json",
    name: "ecommerce-ui",
    type: "registry:component",
    title: "Ecommerce UI Primitives",
    description: "Rating stars, quantity selector, and price display with currency and discount support.",
    dependencies: [],
    registryDependencies: ["button", "badge", "label"],
    files: [
      {
        path: "ecommerce-ui.tsx",
        type: "registry:component",
        content: `"use client"

import * as React from "react"
import { Star, Minus, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"

// ─── Rating ────────────────────────────────

export interface RatingProps {
  value: number
  onChange?: (value: number) => void
  max?: number
  size?: "sm" | "md" | "lg"
  showValue?: boolean
  disabled?: boolean
  className?: string
}

const starSizes = { sm: "h-3 w-3", md: "h-4 w-4", lg: "h-5 w-5" }

export function Rating({
  value,
  onChange,
  max = 5,
  size = "md",
  showValue = false,
  disabled = false,
  className,
}: RatingProps) {
  const [hovered, setHovered] = React.useState<number | null>(null)
  const display = hovered ?? value
  const isInteractive = !!onChange && !disabled

  function handleKeyDown(e: React.KeyboardEvent, i: number) {
    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault()
      if (value < max) onChange?.(value + 1)
    }
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault()
      if (value > 0) onChange?.(value - 1)
    }
  }

  return (
    <div className={cn("flex items-center gap-0.5", className)} role={isInteractive ? "radiogroup" : "img"} aria-label={\`\${value} out of \${max} stars\`}>
      {Array.from({ length: max }, (_, i) => {
        const filled = i < Math.floor(display)
        const half = !filled && i < display
        return (
          <button
            key={i}
            type="button"
            disabled={!isInteractive}
            role={isInteractive ? "radio" : undefined}
            aria-checked={isInteractive ? i + 1 === value : undefined}
            aria-label={\`\${i + 1} star\`}
            tabIndex={isInteractive ? (i + 1 === value ? 0 : -1) : -1}
            onClick={() => onChange?.(i + 1)}
            onMouseEnter={() => setHovered(i + 1)}
            onMouseLeave={() => setHovered(null)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            className={cn(
              "rounded-sm transition-all",
              isInteractive ? "cursor-pointer hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" : "cursor-default"
            )}
          >
            <Star
              className={cn(
                starSizes[size],
                "transition-all duration-150",
                half
                  ? "fill-amber-400/50 text-amber-400"
                  : filled
                  ? "fill-amber-400 text-amber-400"
                  : "fill-transparent text-muted-foreground/30",
                isInteractive && "hover:drop-shadow-sm"
              )}
            />
          </button>
        )
      })}
      {showValue && <span className="ml-1.5 text-sm tabular-nums text-muted-foreground">{value.toFixed(1)}</span>}
    </div>
  )
}

// ─── QuantitySelector ───────────────────────

export interface QuantitySelectorProps {
  value?: number
  onChange?: (value: number) => void
  min?: number
  max?: number
  disabled?: boolean
  label?: string
}

export function QuantitySelector({
  value = 1,
  onChange,
  min = 1,
  max = 99,
  disabled = false,
  label,
}: QuantitySelectorProps) {
  function decrement() { if (value > min) onChange?.(value - 1) }
  function increment() { if (value < max) onChange?.(value + 1) }

  return (
    <div className="space-y-1.5">
      {label && <Label className="text-sm font-medium">{label}</Label>}
      <div className="flex items-center gap-0">
        <Button type="button" variant="outline" size="icon" className="h-9 w-9 rounded-r-none border-r-0" disabled={disabled || value <= min} onClick={decrement} aria-label="Decrease quantity">
          <Minus className="h-3 w-3" />
        </Button>
        <div className="flex h-9 w-12 items-center justify-center border-y text-sm tabular-nums font-medium" aria-live="polite">
          {value}
        </div>
        <Button type="button" variant="outline" size="icon" className="h-9 w-9 rounded-l-none border-l-0" disabled={disabled || value >= max} onClick={increment} aria-label="Increase quantity">
          <Plus className="h-3 w-3" />
        </Button>
      </div>
    </div>
  )
}

// ─── PriceDisplay ───────────────────────────

export interface PriceDisplayProps {
  value: number
  compareAt?: number
  currency?: string
  size?: "sm" | "md" | "lg"
  showDiscount?: boolean
  className?: string
}

export function PriceDisplay({
  value,
  compareAt,
  currency = "USD",
  size = "md",
  showDiscount = true,
  className,
}: PriceDisplayProps) {
  const fmt = (amount: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency, currencyDisplay: "narrowSymbol" }).format(amount)

  const discount = compareAt && compareAt > value ? Math.round((1 - value / compareAt) * 100) : 0

  return (
    <div className={cn("flex items-baseline gap-2", className)}>
      <span className={cn(
        "font-semibold tabular-nums",
        size === "sm" && "text-sm",
        size === "md" && "text-base",
        size === "lg" && "text-2xl",
      )}>
        {fmt(value)}
      </span>
      {compareAt && compareAt > value && (
        <>
          <span className="text-sm text-muted-foreground line-through tabular-nums">{fmt(compareAt)}</span>
          {showDiscount && <Badge variant="secondary" className="text-[10px] px-1.5">-{discount}%</Badge>}
        </>
      )}
    </div>
  )
}`,
        target: "components/ecommerce-ui.tsx",
      },
    ],
  },
  {
    $schema: "https://ui.shadcn.com/schema/registry.json",
    name: "ecommerce-product",
    type: "registry:component",
    title: "Product Card & Grid",
    description: "Product card with image, price, rating, badge overlay, add-to-cart, and responsive grid with search and sort.",
    dependencies: [],
    registryDependencies: ["button", "card", "badge", "input", "skeleton"],
    files: [
      {
        path: "ecommerce-product.tsx",
        type: "registry:component",
        content: `"use client"

import * as React from "react"
import { ShoppingCart, Search, Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"

// ─── Types ───────────────────────────────────

export interface Product {
  id: string
  name: string
  price: number
  compareAt?: number
  image?: string
  rating?: number
  reviewCount?: number
  badge?: string
  currency?: string
}

// ─── ProductCard ─────────────────────────────

export interface ProductCardProps {
  product: Product
  onAddToCart?: (product: Product) => void
  className?: string
}

export function ProductCard({ product, onAddToCart, className }: ProductCardProps) {
  const hasDiscount = product.compareAt && product.compareAt > product.price
  const discount = hasDiscount ? Math.round((1 - product.price / product.compareAt!) * 100) : 0

  const fmtPrice = (amount: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: product.currency || "USD", currencyDisplay: "narrowSymbol" }).format(amount)

  return (
    <Card
      className={cn(
        "group/card flex flex-col overflow-hidden border-border transition-all duration-200",
        "hover:shadow-md hover:border-border/80",
        className
      )}
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 ease-out will-change-transform group-hover/card:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <ShoppingCart className="h-10 w-10 text-muted-foreground/40" />
          </div>
        )}
        {/* Badges */}
        <div className="pointer-events-none absolute left-3 top-3 flex flex-col gap-1.5">
          {product.badge && (
            <Badge className="bg-background/90 text-foreground backdrop-blur-sm shadow-xs text-[11px] font-medium border-0">
              {product.badge}
            </Badge>
          )}
        </div>
        {hasDiscount && (
          <Badge
            variant="destructive"
            className="pointer-events-none absolute right-3 top-3 text-[11px] font-semibold px-2 shadow-xs border-0"
          >
            -{discount}%
          </Badge>
        )}
        {/* Quick add overlay */}
        {onAddToCart && (
          <div className="absolute inset-x-0 bottom-0 translate-y-full p-3 transition-transform duration-200 ease-out group-hover/card:translate-y-0">
            <Button
              size="sm"
              className="w-full shadow-md backdrop-blur-sm"
              onClick={(e) => { e.stopPropagation(); onAddToCart(product) }}
            >
              <ShoppingCart className="mr-1.5 h-3.5 w-3.5" />
              Add to Cart
            </Button>
          </div>
        )}
      </div>

      {/* Info */}
      <CardContent className="flex flex-1 flex-col gap-1.5 p-4">
        <h3 className="truncate text-sm font-medium text-foreground">{product.name}</h3>

        <div className="flex items-baseline gap-1.5">
          <span className="text-base font-semibold tabular-nums text-foreground">{fmtPrice(product.price)}</span>
          {hasDiscount && (
            <span className="text-xs text-muted-foreground line-through tabular-nums">{fmtPrice(product.compareAt!)}</span>
          )}
        </div>

        {product.rating != null && (
          <div className="mt-auto flex items-center gap-1.5 pt-2">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-3 w-3",
                    i < Math.floor(product.rating!)
                      ? "fill-amber-400 text-amber-400"
                      : "fill-transparent text-border"
                  )}
                />
              ))}
            </div>
            {product.reviewCount != null && (
              <span className="text-[11px] text-muted-foreground tabular-nums">({product.reviewCount})</span>
            )}
          </div>
        )}

        {/* Mobile: always visible add-to-cart */}
        {onAddToCart && (
          <Button size="sm" variant="outline" className="mt-2 w-full sm:hidden" onClick={() => onAddToCart(product)}>
            <ShoppingCart className="mr-1.5 h-3.5 w-3.5" />
            Add to Cart
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

// ─── ProductGrid ─────────────────────────────

export interface ProductGridProps {
  products: Product[]
  onAddToCart?: (product: Product) => void
  sortOptions?: { label: string; value: string }[]
  onSortChange?: (value: string) => void
  searchQuery?: string
  onSearchChange?: (value: string) => void
  loading?: boolean
  className?: string
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }, (_, i) => (
        <Card key={i} className="overflow-hidden border-border">
          <Skeleton className="aspect-square rounded-none" />
          <CardContent className="space-y-2 p-4">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-3 w-1/3" />
            <Skeleton className="h-8 w-full rounded-md" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function ProductGrid({
  products,
  onAddToCart,
  sortOptions,
  onSortChange,
  searchQuery = "",
  onSearchChange,
  loading = false,
  className,
}: ProductGridProps) {
  if (loading) return <ProductGridSkeleton />

  return (
    <div className={cn("space-y-6", className)}>
      {/* Toolbar */}
      {(onSearchChange || onSortChange) && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {onSearchChange && (
            <div className="relative flex-1 max-w-xs">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="h-9 pl-10 text-sm"
              />
            </div>
          )}
          {onSortChange && sortOptions && (
            <select
              onChange={(e) => onSortChange(e.target.value)}
              className="h-9 rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              aria-label="Sort products"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          )}
        </div>
      )}

      {/* Empty state */}
      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
            <Search className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="mt-5 text-base font-semibold text-foreground">No products found</h3>
          <p className="mt-1.5 text-sm text-muted-foreground max-w-xs">
            Try adjusting your search or filters to find what you're looking for.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
          ))}
        </div>
      )}
    </div>
  )
}`,
        target: "components/ecommerce-product.tsx",
      },
    ],
  },
  {
    $schema: "https://ui.shadcn.com/schema/registry.json",
    name: "saas-subscription",
    type: "registry:component",
    title: "Subscription Status & Usage Meter",
    description: "Current subscription plan card with status, renewal, and upgrade actions, plus usage progress bars for API, storage, or seats.",
    dependencies: [],
    registryDependencies: ["button", "card", "badge", "progress", "separator"],
    files: [
      {
        path: "saas-subscription.tsx",
        type: "registry:component",
        content: `"use client"

import * as React from "react"
import { Check, AlertTriangle, CreditCard, Calendar, ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"

// ─── SubscriptionStatus ─────────────────────

export interface SubscriptionStatusProps {
  plan: string
  status: "active" | "past_due" | "canceled" | "trialing" | "incomplete"
  price: number
  currency?: string
  renewalDate?: string
  trialEndsAt?: string
  interval?: string
  onManage?: () => void
  onUpgrade?: () => void
  className?: string
}

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline"; icon: React.ReactNode }> = {
  active: { label: "Active", variant: "default", icon: <Check className="h-3 w-3" /> },
  trialing: { label: "Trial", variant: "secondary", icon: <Calendar className="h-3 w-3" /> },
  past_due: { label: "Past Due", variant: "destructive", icon: <AlertTriangle className="h-3 w-3" /> },
  canceled: { label: "Canceled", variant: "outline", icon: null as unknown as React.ReactNode },
  incomplete: { label: "Incomplete", variant: "outline", icon: null as unknown as React.ReactNode },
}

export function SubscriptionStatus({
  plan,
  status,
  price,
  currency = "USD",
  renewalDate,
  trialEndsAt,
  interval = "/month",
  onManage,
  onUpgrade,
  className,
}: SubscriptionStatusProps) {
  const cfg = statusConfig[status] ?? { label: status, variant: "outline" as const, icon: null }

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
        <div className="space-y-1">
          <CardTitle className="text-lg">{plan}</CardTitle>
          <CardDescription>Current subscription</CardDescription>
        </div>
        <Badge variant={cfg.variant} className="gap-1 text-[11px]">
          {cfg.icon}
          {cfg.label}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold tabular-nums tracking-tight text-foreground">
            {new Intl.NumberFormat("en-US", { style: "currency", currency, currencyDisplay: "narrowSymbol" }).format(price)}
          </span>
          <span className="text-sm text-muted-foreground">{interval}</span>
        </div>

        <Separator />

        <div className="space-y-2.5 text-sm">
          {renewalDate && status === "active" && (
            <div className="flex items-center gap-2.5 text-muted-foreground">
              <Calendar className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span>Renews on <span className="font-medium text-foreground">{renewalDate}</span></span>
            </div>
          )}
          {trialEndsAt && (
            <div className="flex items-center gap-2.5 text-muted-foreground">
              <Calendar className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span>Trial ends on <span className="font-medium text-foreground">{trialEndsAt}</span></span>
            </div>
          )}
          {status === "active" && (
            <div className="flex items-center gap-2.5 text-emerald-600">
              <Check className="h-4 w-4 shrink-0" />
              <span>Payments are up to date</span>
            </div>
          )}
          {status === "past_due" && (
            <div className="flex items-center gap-2.5 text-destructive">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>Payment is past due — update your payment method to avoid service interruption.</span>
            </div>
          )}
          {status === "trialing" && !trialEndsAt && (
            <div className="flex items-center gap-2.5 text-muted-foreground">
              <Check className="h-4 w-4 shrink-0 text-emerald-600" />
              <span>No payment method required yet</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex gap-3 border-t bg-muted/50 px-6 py-4">
        {onManage && (
          <Button variant="outline" className="flex-1" onClick={onManage}>
            <CreditCard className="mr-2 h-4 w-4" />
            Manage
          </Button>
        )}
        {onUpgrade && status !== "canceled" && (
          <Button className="flex-1" onClick={onUpgrade}>
            Upgrade plan
            <ArrowUpRight className="ml-1.5 h-3.5 w-3.5" />
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

// ─── UsageMeter ─────────────────────────────

export interface UsageMetric {
  label: string
  used: number
  total: number
  unit?: string
  color?: "default" | "warning" | "danger"
}

export interface UsageMeterProps {
  metrics: UsageMetric[]
  className?: string
}

export function UsageMeter({ metrics, className }: UsageMeterProps) {
  if (metrics.length === 0) {
    return (
      <div className={cn("flex flex-col items-center justify-center py-10 text-center", className)}>
          <p className="text-sm text-muted-foreground">No usage metrics available.</p>
      </div>
    )
  }

  return (
    <div className={cn("space-y-5", className)}>
      {metrics.map((metric) => {
        const pct = Math.min(Math.round((metric.used / metric.total) * 100), 100)
        const isWarning = metric.color === "warning" || (!metric.color && pct >= 75 && pct < 90)
        const isDanger = metric.color === "danger" || (!metric.color && pct >= 90)

        return (
          <div key={metric.label} className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">{metric.label}</span>
              <span className="text-sm text-muted-foreground tabular-nums">
                <span className="font-medium text-foreground">{metric.used.toLocaleString()}</span>
                {metric.unit ?? ""}
                <span className="text-neutral-400"> / {metric.total.toLocaleString()}{metric.unit ?? ""}</span>
              </span>
            </div>
            <Progress
              value={pct}
              className={cn(
                "h-2.5",
                isDanger && "[&>div]:bg-destructive",
                isWarning && !isDanger && "[&>div]:bg-amber-500"
              )}
            />
            <p className={cn(
              "text-xs",
              isDanger ? "text-destructive font-medium" : isWarning ? "text-amber-600" : "text-neutral-500"
            )}>
              {pct}% used
              {isDanger && " — limit reached"}
              {isWarning && !isDanger && " — approaching limit"}
            </p>
          </div>
        )
      })}
    </div>
  )
}`,
        target: "components/saas-subscription.tsx",
      },
    ],
  },
  {
    $schema: "https://ui.shadcn.com/schema/registry.json",
    name: "saas-billing",
    type: "registry:component",
    title: "SaaS Billing: Pricing, Comparison & History",
    description: "Pricing tier cards with feature lists, side-by-side plan comparison table, and billing/invoice history list.",
    dependencies: [],
    registryDependencies: ["button", "card", "badge", "separator"],
    files: [
      {
        path: "saas-billing.tsx",
        type: "registry:component",
        content: `"use client"

import * as React from "react"
import { Check, X as XIcon, Download, ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

// ─── PricingCard ────────────────────────────

export interface PricingFeature {
  text: string
  included: boolean
}

export interface PricingCardProps {
  name: string
  price: number
  description?: string
  features: PricingFeature[]
  ctaText?: string
  onCtaClick?: () => void
  popular?: boolean
  currency?: string
  interval?: string
  className?: string
}

export function PricingCard({
  name,
  price,
  description,
  features,
  ctaText = "Get started",
  onCtaClick,
  popular = false,
  currency = "USD",
  interval = "/month",
  className,
}: PricingCardProps) {
  return (
      <Card
        className={cn(
          "relative flex flex-col transition-all duration-200 will-change-transform",
          popular
            ? "border-primary shadow-md ring-1 ring-primary"
            : "border-border hover:shadow-md hover:border-border/80",
          className
        )}
      >
      {popular && (
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 text-[11px] font-medium shadow-sm border-0">
          Popular
        </Badge>
      )}

      <CardHeader className={cn("pb-4 text-center", popular && "pt-8")}>
        <CardTitle className="text-xl font-semibold text-foreground">{name}</CardTitle>
        {description && (
          <CardDescription className="text-sm text-muted-foreground leading-relaxed">{description}</CardDescription>
        )}
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-6">
        {/* Price */}
        <div className="text-center">
          <span className="text-4xl font-bold tabular-nums tracking-tight text-foreground">
            {new Intl.NumberFormat("en-US", { style: "currency", currency, currencyDisplay: "narrowSymbol" }).format(price)}
          </span>
          {interval && (
            <span className="ml-1 text-sm text-muted-foreground">{interval}</span>
          )}
          {price === 0 && interval && (
            <span className="block text-sm text-muted-foreground mt-1">Free forever — no credit card required</span>
          )}
        </div>

        <Separator />

        {/* Features */}
        <ul className="space-y-3" role="list">
          {features.map((feature, i) => (
            <li key={i} className="flex items-start gap-3 text-sm">
              {feature.included ? (
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-50">
                  <Check className="h-3 w-3 text-emerald-600" />
                </span>
              ) : (
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center">
                  <XIcon className="h-3.5 w-3.5 text-neutral-300" />
                </span>
              )}
              <span className={cn(
                "leading-relaxed",
                feature.included ? "text-foreground" : "text-muted-foreground/60"
              )}>
                {feature.text}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter className="pt-2">
        <Button
          className="w-full"
          variant={popular ? "default" : "outline"}
          size="lg"
          onClick={onCtaClick}
        >
          {ctaText}
          {popular && <ArrowUpRight className="ml-1.5 h-4 w-4" />}
        </Button>
      </CardFooter>
    </Card>
  )
}

// ─── FeatureComparison ──────────────────────

export interface ComparisonFeature {
  name: string
  values: (string | boolean)[]
  category?: string
  info?: string
}

export interface FeatureComparisonProps {
  plans: string[]
  features: ComparisonFeature[]
  className?: string
}

export function FeatureComparison({ plans, features, className }: FeatureComparisonProps) {
  if (plans.length === 0 || features.length === 0) {
    return (
      <div className={cn("flex items-center justify-center py-12 text-sm text-muted-foreground", className)}>
        No comparison data available.
      </div>
    )
  }

  return (
    <div className={cn("overflow-x-auto rounded-lg border border-border", className)}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted">
            <th className="sticky left-0 bg-muted px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground shadow-[2px_0_8px_-4px_rgba(0,0,0,0.08)] z-10">
              Feature
            </th>
            {plans.map((plan) => (
              <th key={plan} className="px-5 py-3.5 text-center text-sm font-semibold text-foreground">
                {plan}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {features.map((feature, i) => (
            <React.Fragment key={i}>
              {feature.category && (i === 0 || features[i - 1]?.category !== feature.category) && (
                <tr className="border-b border-border">
                  <td
                    colSpan={plans.length + 1}
                    className="bg-muted/80 px-5 py-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"
                  >
                    {feature.category}
                  </td>
                </tr>
              )}
              <tr className="border-b border-border last:border-0 transition-colors hover:bg-muted/50">
                <td className="sticky left-0 bg-background px-5 py-3.5 text-sm font-medium text-foreground shadow-[2px_0_8px_-4px_rgba(0,0,0,0.08)]">
                  <div className="flex items-center gap-1.5">
                    {feature.name}
                    {feature.info && (
                      <span className="text-neutral-400 cursor-help" title={feature.info}>
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </span>
                    )}
                  </div>
                </td>
                {feature.values.map((val, j) => (
                  <td key={j} className="px-5 py-3.5 text-center">
                    {typeof val === "boolean" ? (
                      val ? (
                        <Check className="mx-auto h-4 w-4 text-emerald-600" />
                      ) : (
                        <XIcon className="mx-auto h-4 w-4 text-neutral-300" />
                      )
                    ) : (
                      <span className="text-sm text-foreground font-medium">{val}</span>
                    )}
                  </td>
                ))}
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ─── BillingHistory ─────────────────────────

export interface Invoice {
  id: string
  number: string
  date: string
  amount: number
  status: "paid" | "pending" | "overdue" | "cancelled" | "refunded"
  currency?: string
  pdfUrl?: string
}

export interface BillingHistoryProps {
  invoices: Invoice[]
  className?: string
}

const statusConfig: Record<string, { label: string; classes: string }> = {
  paid: { label: "Paid", classes: "bg-emerald-50 text-emerald-700 border-emerald-200/50" },
  pending: { label: "Pending", classes: "bg-amber-50 text-amber-700 border-amber-200/50" },
  overdue: { label: "Overdue", classes: "bg-red-50 text-red-700 border-red-200/50" },
  cancelled: { label: "Cancelled", classes: "bg-muted text-muted-foreground border-border" },
  refunded: { label: "Refunded", classes: "bg-blue-50 text-blue-700 border-blue-200/50" },
}

export function BillingHistory({ invoices, className }: BillingHistoryProps) {
  if (invoices.length === 0) {
    return (
      <div className={cn("flex flex-col items-center justify-center py-16 text-center", className)}>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <Download className="h-6 w-6 text-neutral-400" />
        </div>
        <h3 className="mt-4 text-sm font-semibold text-foreground">No invoices yet</h3>
        <p className="mt-1 text-sm text-muted-foreground max-w-xs">
          Invoices will appear here after your first successful payment.
        </p>
      </div>
    )
  }

  return (
    <div className={cn("space-y-2", className)}>
      {invoices.map((inv) => {
        const sc = statusConfig[inv.status] ?? { label: inv.status, classes: "bg-muted text-muted-foreground" }
        return (
          <div
            key={inv.id}
            className="flex items-center justify-between rounded-lg border border-border bg-background px-5 py-3.5 transition-colors hover:bg-muted/80"
          >
            <div className="space-y-0.5 min-w-0">
              <p className="text-sm font-medium text-foreground">{inv.number}</p>
              <p className="text-xs text-neutral-500">{inv.date}</p>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <span className="text-sm font-semibold tabular-nums text-foreground">
                {new Intl.NumberFormat("en-US", { style: "currency", currency: inv.currency || "USD" }).format(inv.amount)}
              </span>
              <span className={cn(
                "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium",
                sc.classes
              )}>
                {sc.label}
              </span>
              {inv.pdfUrl && (
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" asChild>
                  <a href={inv.pdfUrl} target="_blank" rel="noopener noreferrer" aria-label={\`Download \${inv.number}\`}>
                    <Download className="h-4 w-4" />
                  </a>
                </Button>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}`,
        target: "components/saas-billing.tsx",
      },
    ],
  },
  {
    $schema: "https://ui.shadcn.com/schema/registry.json",
    name: "saas-management",
    type: "registry:component",
    title: "SaaS Management: API Tokens",
    description: "API token manager with create dialog, scope selection, copy to clipboard, and revoke actions.",
    dependencies: [],
    registryDependencies: ["button", "card", "dialog", "input", "label", "badge", "separator"],
    files: [
      {
        path: "saas-management.tsx",
        type: "registry:component",
        content: `"use client"

import * as React from "react"
import { Key, Copy, Trash2, Plus, Check, Clipboard } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

// ─── Types ───────────────────────────────────

export interface ApiToken {
  id: string
  name: string
  prefix: string
  createdAt: string
  lastUsed?: string
  scopes: string[]
}

export interface ApiTokenManagerProps {
  tokens: ApiToken[]
  onCreate?: (data: { name: string; scopes: string[] }) => void
  onRevoke?: (id: string) => void
  className?: string
}

const AVAILABLE_SCOPES = [
  { id: "read:products", label: "Read products", description: "View product catalog" },
  { id: "write:products", label: "Write products", description: "Create and update products" },
  { id: "read:orders", label: "Read orders", description: "View order history" },
  { id: "write:orders", label: "Write orders", description: "Create and update orders" },
  { id: "read:customers", label: "Read customers", description: "View customer data" },
  { id: "admin", label: "Admin", description: "Full access to all resources" },
] as const

// ─── ApiTokenManager ─────────────────────────

export function ApiTokenManager({ tokens, onCreate, onRevoke, className }: ApiTokenManagerProps) {
  const [open, setOpen] = React.useState(false)
  const [revealedId, setRevealedId] = React.useState<string | null>(null)
  const [copiedId, setCopiedId] = React.useState<string | null>(null)
  const [newlyCreated, setNewlyCreated] = React.useState<{ id: string; token: string } | null>(null)

  function handleCopy(token: ApiToken) {
    const fullToken = token.prefix + token.id
    navigator.clipboard.writeText(fullToken)
    setCopiedId(token.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className={cn("space-y-5", className)}>
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-foreground">API Tokens</h3>
          <p className="text-sm text-muted-foreground">Tokens authenticate API requests. Treat them like passwords.</p>
        </div>
        {onCreate && (
          <Button size="sm" onClick={() => { setOpen(true); setNewlyCreated(null) }} className="shrink-0">
            <Plus className="mr-1.5 h-4 w-4" />
            Create token
          </Button>
        )}
      </div>

      <Separator />

      {/* Newly created token banner */}
      {newlyCreated && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 transition-all duration-200">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <p className="text-sm font-medium text-emerald-800">Token created</p>
              <p className="text-xs text-emerald-700">
                Copy this token now. You won't be able to see it again.
              </p>
              <code className="mt-1.5 block rounded bg-emerald-100/80 px-3 py-1.5 text-xs font-mono text-emerald-900 break-all select-all">
                {newlyCreated.token}
              </code>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="shrink-0 bg-background"
              onClick={() => {
                navigator.clipboard.writeText(newlyCreated.token)
                setCopiedId("new")
                setTimeout(() => setCopiedId(null), 2000)
              }}
            >
              {copiedId === "new" ? (
                <><Check className="mr-1.5 h-3.5 w-3.5 text-emerald-600" /> Copied</>
              ) : (
                <><Clipboard className="mr-1.5 h-3.5 w-3.5" /> Copy</>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Empty state */}
      {tokens.length === 0 && !newlyCreated ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
            <Key className="h-7 w-7 text-neutral-400" />
          </div>
          <h3 className="mt-5 text-base font-semibold text-foreground">No API tokens</h3>
          <p className="mt-1.5 text-sm text-muted-foreground max-w-sm">
            Create a token to authenticate your API requests. Each token has its own set of permissions.
          </p>
          {onCreate && (
            <Button className="mt-6" size="sm" onClick={() => setOpen(true)}>
              <Plus className="mr-1.5 h-4 w-4" />
              Create your first token
            </Button>
          )}
        </div>
      ) : (
        /* Token list */
        <div className="space-y-2">
          {tokens.map((token) => (
            <div
              key={token.id}
              className="flex flex-col gap-3 rounded-lg border border-border bg-background px-5 py-4 sm:flex-row sm:items-center sm:justify-between transition-colors hover:bg-muted/60"
            >
              <div className="space-y-2 min-w-0 flex-1">
                <div className="flex items-center gap-2.5">
                  <p className="text-sm font-medium text-foreground truncate">{token.name}</p>
                  <Badge variant="secondary" className="text-[10px] font-mono font-normal tracking-wider shrink-0">
                    {token.prefix}...{token.id.slice(-4)}
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-500">
                  <span>Created {token.createdAt}</span>
                  {token.lastUsed && (
                    <span className="flex items-center gap-1">
                      <span className="hidden sm:inline">&middot;</span> Last used {token.lastUsed}
                    </span>
                  )}
                </div>
                {token.scopes.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {token.scopes.map((scope) => (
                      <Badge key={scope} variant="outline" className="text-[10px] font-normal border-border text-muted-foreground">
                        {scope}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                  onClick={() => handleCopy(token)}
                >
                  {copiedId === token.id ? (
                    <><Check className="h-3.5 w-3.5 text-emerald-600" /> Copied</>
                  ) : (
                    <><Copy className="h-3.5 w-3.5" /> Copy</>
                  )}
                </Button>
                {onRevoke && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 gap-1.5 text-xs text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={() => onRevoke(token.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Revoke
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create token dialog */}
      <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setNewlyCreated(null) }}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Create API token</DialogTitle>
            <DialogDescription>
              Give your token a name and select the permissions it needs.
            </DialogDescription>
          </DialogHeader>
          <CreateTokenForm
            onCreated={(data) => {
              const generatedToken = "vibekit_" + Array.from({ length: 40 }, () =>
                "abcdefghijklmnopqrstuvwxyz0123456789"[Math.floor(Math.random() * 36)]
              ).join("")
              const newToken: ApiToken = {
                id: generatedToken,
                name: data.name,
                prefix: generatedToken.slice(0, 8),
                createdAt: new Date().toLocaleDateString(),
                scopes: data.scopes,
              }
              onCreate?.(data)
              setNewlyCreated({ id: newToken.id, token: generatedToken })
              setOpen(false)
            }}
            onCancel={() => setOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ─── CreateTokenForm ─────────────────────────

interface CreateTokenFormProps {
  onCreated: (data: { name: string; scopes: string[] }) => void
  onCancel: () => void
}

function CreateTokenForm({ onCreated, onCancel }: CreateTokenFormProps) {
  const [name, setName] = React.useState("")
  const [selectedScopes, setSelectedScopes] = React.useState<string[]>([])

  function toggleScope(scopeId: string) {
    if (scopeId === "admin") {
      setSelectedScopes((prev) =>
        prev.includes("admin") ? [] : ["admin"]
      )
      return
    }
    setSelectedScopes((prev) => {
      const next = prev.includes(scopeId)
        ? prev.filter((s) => s !== scopeId)
        : [...prev, scopeId]
      return next.filter((s) => s !== "admin")
    })
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    onCreated({ name: name.trim(), scopes: selectedScopes })
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-5 py-2">
        <div className="space-y-2">
          <Label htmlFor="token-name">Token name</Label>
          <Input
            id="token-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Production API, CI/CD pipeline"
            autoFocus
            autoComplete="off"
          />
        </div>

        <div className="space-y-2.5">
          <Label>Scopes</Label>
          <p className="text-xs text-neutral-500 -mt-1">
            Select the permissions this token should have. {selectedScopes.includes("admin") && "Admin grants full access."}
          </p>
          <div className="space-y-1.5">
            {AVAILABLE_SCOPES.map((scope) => {
              const isSelected = selectedScopes.includes(scope.id) || (scope.id === "admin" && selectedScopes.includes("admin"))
              const isDisabled = selectedScopes.includes("admin") && scope.id !== "admin"
              return (
                <button
                  key={scope.id}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => toggleScope(scope.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg border px-3.5 py-2.5 text-left transition-all text-sm",
                    isSelected
                      ? "border-primary/30 bg-primary-50/60 text-foreground"
                      : "border-border bg-background text-muted-foreground hover:border-border/80 hover:bg-muted",
                    isDisabled && "opacity-40 cursor-not-allowed"
                  )}
                >
                  <span className={cn(
                    "flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] border transition-colors",
                    isSelected
                      ? "border-primary bg-primary text-white"
                      : "border-border bg-background"
                  )}>
                    {isSelected && <Check className="h-3 w-3" />}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{scope.label}</p>
                    <p className="text-xs text-neutral-500">{scope.description}</p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>
      <DialogFooter className="mt-6">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={!name.trim() || selectedScopes.length === 0}>
          Create token
        </Button>
      </DialogFooter>
    </form>
  )
}`,
        target: "components/saas-management.tsx",
      },
    ],
  },
  /* ──────────────────────────────────────────────
   * Marketing primitives extracted from VibeKit public templates
   * ────────────────────────────────────────────── */
  {
    $schema: "https://ui.shadcn.com/schema/registry.json",
    name: "animated-counter",
    type: "registry:component",
    title: "Animated Counter",
    description:
      "Number stat that counts up from 0 to a target value when scrolled into view. Useful for stat bands on marketing pages.",
    dependencies: ["framer-motion"],
    registryDependencies: [],
    files: [
      {
        path: "animated-counter.tsx",
        type: "registry:component",
        content: `"use client";

import { useEffect, useRef } from "react";
import { useInView, animate } from "framer-motion";

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}

export function AnimatedCounter({
  value,
  suffix = "",
  prefix = "",
  duration = 2.5,
  className,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;
    const node = ref.current;
    if (!node) return;

    const controls = animate(0, value, {
      duration,
      ease: "easeOut",
      onUpdate(latest) {
        node.textContent = \`\${prefix}\${Math.floor(latest).toLocaleString()}\${suffix}\`;
      },
    });

    return () => controls.stop();
  }, [isInView, value, suffix, prefix, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}0{suffix}
    </span>
  );
}
`,
        target: "components/animated-counter.tsx",
      },
    ],
  },
  {
    $schema: "https://ui.shadcn.com/schema/registry.json",
    name: "logo-marquee",
    type: "registry:component",
    title: "Logo Marquee",
    description:
      "Auto-scrolling \"trusted by\" / \"works with\" brand strip with pause-on-hover and edge fade-out.",
    dependencies: [],
    registryDependencies: [],
    files: [
      {
        path: "logo-marquee.tsx",
        type: "registry:component",
        content: `"use client";

import { cn } from "@/lib/utils";

export interface LogoMarqueeItem {
  name: string;
  /** Either a src URL/path for the underlying img tag or an inline SVG/React node. */
  src?: string;
  svg?: React.ReactNode;
}

interface LogoMarqueeProps {
  logos: LogoMarqueeItem[];
  /** Direction the marquee scrolls. Default: left. */
  direction?: "left" | "right";
  /** Seconds for one full loop. Default: 30. */
  speed?: number;
  /** Pause on hover (default: true). */
  pauseOnHover?: boolean;
  /** Fade out the marquee edges with a mask. Default: true. */
  fade?: boolean;
  className?: string;
  itemClassName?: string;
}

export function LogoMarquee({
  logos,
  direction = "left",
  speed = 30,
  pauseOnHover = true,
  fade = true,
  className,
  itemClassName,
}: LogoMarqueeProps) {
  const items = [...logos, ...logos];

  return (
    <div
      className={cn(
        "group/marquee relative w-full overflow-hidden",
        fade && "[mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]",
        className,
      )}
    >
      <div
        className={cn(
          "flex w-max items-center gap-12",
          direction === "left" ? "animate-marquee-left" : "animate-marquee-right",
          pauseOnHover && "group-hover/marquee:[animation-play-state:paused]",
        )}
        style={{ animationDuration: \`\${speed}s\` }}
      >
        {items.map((item, i) => (
          <div
            key={\`\${item.name}-\${i}\`}
            className={cn(
              "flex h-12 shrink-0 items-center justify-center text-muted-foreground",
              "transition-colors hover:text-foreground",
              itemClassName,
            )}
          >
            {item.svg ? (
              item.svg
            ) : item.src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={item.src} alt={item.name} className="h-8 w-auto opacity-70 hover:opacity-100" />
            ) : (
              <span className="text-lg font-medium">{item.name}</span>
            )}
          </div>
        ))}
      </div>

      <style jsx global>{\`
        @keyframes marquee-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .animate-marquee-left { animation: marquee-left linear infinite; }
        .animate-marquee-right { animation: marquee-right linear infinite; }
      \`}</style>
    </div>
  );
}
`,
        target: "components/logo-marquee.tsx",
      },
    ],
  },
  {
    $schema: "https://ui.shadcn.com/schema/registry.json",
    name: "alternating-timeline",
    type: "registry:component",
    title: "Alternating Timeline",
    description:
      "Vertical timeline with left/right alternating entries and scroll-driven opacity/scale. Reusable for about / history / roadmap pages.",
    dependencies: ["framer-motion"],
    registryDependencies: [],
    files: [
      {
        path: "alternating-timeline.tsx",
        type: "registry:component",
        content: `"use client";

import { useRef } from "react";
import { useScroll, useTransform, motion, type MotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

export interface TimelineEntry {
  id: string | number;
  title: string;
  description: string;
  /** Optional image URL. */
  image?: string;
  /** Optional sub-line (date, role, location). */
  meta?: string;
  /** Forces left/right; otherwise alternates automatically. */
  layout?: "left" | "right";
}

interface AlternatingTimelineProps {
  entries: TimelineEntry[];
  className?: string;
}

export function AlternatingTimeline({ entries, className }: AlternatingTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className={cn("relative py-12", className)}>
      <div className="absolute left-1/2 top-0 bottom-0 hidden w-px -translate-x-1/2 bg-border md:block" />

      {entries.map((entry, index) => (
        <TimelineItem
          key={entry.id}
          entry={entry}
          isLeft={(entry.layout ?? (index % 2 === 0 ? "left" : "right")) === "left"}
        />
      ))}
    </div>
  );
}

function TimelineItem({ entry, isLeft }: { entry: TimelineEntry; isLeft: boolean }) {
  const itemRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: itemRef,
    offset: ["start center", "end center"],
  });

  const opacity: MotionValue<number> = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.35, 1, 1, 0.35]);
  const scale: MotionValue<number> = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.9, 1, 1, 0.9]);

  return (
    <motion.div ref={itemRef} style={{ opacity, scale }} className="relative mb-16 md:mb-28">
      <div className="absolute left-1/2 top-1/2 hidden h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground md:block" />

      <div className="container mx-auto px-6">
        <div
          className={cn("grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-16", {
            "md:text-right": isLeft,
          })}
        >
          <div className={cn("relative", isLeft ? "md:order-2" : "md:order-1")}>
            {entry.image ? (
              <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={entry.image}
                  alt={entry.title}
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
            ) : (
              <div className="aspect-[3/4] rounded-2xl bg-muted" aria-hidden />
            )}
          </div>

          <div className={cn("relative", isLeft ? "md:order-1" : "md:order-2")}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              {entry.meta ? (
                <div className="text-sm font-mono uppercase tracking-wider text-muted-foreground">
                  {entry.meta}
                </div>
              ) : null}
              <h3 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">{entry.title}</h3>
              <p className="max-w-lg text-base leading-relaxed text-muted-foreground md:text-lg">
                {entry.description}
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
`,
        target: "components/alternating-timeline.tsx",
      },
    ],
  },
  {
    $schema: "https://ui.shadcn.com/schema/registry.json",
    name: "text-gradient-scroll",
    type: "registry:component",
    title: "Text Gradient Scroll",
    description:
      "Scroll-driven text reveal — paragraph fades word-by-word or letter-by-letter as the user scrolls. On-trend hero/section accent.",
    dependencies: ["framer-motion"],
    registryDependencies: [],
    files: [
      {
        path: "text-gradient-scroll.tsx",
        type: "registry:component",
        content: `"use client";

import { useRef } from "react";
import { useScroll, useTransform, motion, type MotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

type TextOpacity = "none" | "soft" | "medium";
type ViewType = "word" | "letter";

interface TextGradientScrollProps {
  text: string;
  /** Reveal granularity. "letter" is more dramatic, "word" is calmer. Default: letter. */
  type?: ViewType;
  /** How visible the un-revealed text is. Default: soft. */
  textOpacity?: TextOpacity;
  className?: string;
}

export function TextGradientScroll({
  text,
  className,
  type = "letter",
  textOpacity = "soft",
}: TextGradientScrollProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "end center"],
  });

  const words = text.split(" ");

  return (
    <p ref={ref} className={cn("relative m-0 flex flex-wrap", className)}>
      {words.map((word, i) => {
        const start = i / words.length;
        const end = start + 1 / words.length;
        return type === "word" ? (
          <Word key={i} progress={scrollYProgress} range={[start, end]} opacity={textOpacity}>
            {word}
          </Word>
        ) : (
          <Letter key={i} progress={scrollYProgress} range={[start, end]} opacity={textOpacity}>
            {word}
          </Letter>
        );
      })}
    </p>
  );
}

function Word({
  children,
  progress,
  range,
  opacity,
}: {
  children: string;
  progress: MotionValue<number>;
  range: number[];
  opacity: TextOpacity;
}) {
  const revealOpacity = useTransform(progress, range, [0, 1]);
  const baseOpacityClass = opacityClassFor(opacity);

  return (
    <span className="relative me-2 mt-2">
      <span className={cn("absolute", baseOpacityClass)}>{children}</span>
      <motion.span style={{ opacity: revealOpacity, transition: "all 0.5s" }}>{children}</motion.span>
    </span>
  );
}

function Letter({
  children,
  progress,
  range,
  opacity,
}: {
  children: string;
  progress: MotionValue<number>;
  range: number[];
  opacity: TextOpacity;
}) {
  const amount = range[1] - range[0];
  const step = amount / children.length;

  return (
    <span className="relative me-2 mt-2">
      {children.split("").map((char, i) => {
        const start = range[0] + i * step;
        const end = range[0] + (i + 1) * step;
        return (
          <Char key={\`c_\${i}\`} progress={progress} range={[start, end]} opacity={opacity}>
            {char}
          </Char>
        );
      })}
    </span>
  );
}

function Char({
  children,
  progress,
  range,
  opacity,
}: {
  children: string;
  progress: MotionValue<number>;
  range: number[];
  opacity: TextOpacity;
}) {
  const revealOpacity = useTransform(progress, range, [0, 1]);
  const baseOpacityClass = opacityClassFor(opacity);

  return (
    <span>
      <span className={cn("absolute", baseOpacityClass)}>{children}</span>
      <motion.span style={{ opacity: revealOpacity, transition: "all 0.5s" }}>{children}</motion.span>
    </span>
  );
}

function opacityClassFor(value: TextOpacity): string {
  if (value === "none") return "opacity-0";
  if (value === "medium") return "opacity-30";
  return "opacity-10";
}
`,
        target: "components/text-gradient-scroll.tsx",
      },
    ],
  },
  {
    $schema: "https://ui.shadcn.com/schema/registry.json",
    name: "blurred-orb",
    type: "registry:component",
    title: "Blurred Orb",
    description:
      "Gradient-blurred backdrop element. Drop behind a hero or section for a soft glow accent — alternative to busy hero imagery.",
    dependencies: [],
    registryDependencies: [],
    files: [
      {
        path: "blurred-orb.tsx",
        type: "registry:component",
        content: `import { cn } from "@/lib/utils";

interface BlurredOrbProps {
  className?: string;
  style?: React.CSSProperties;
  /**
   * Use Tailwind tokens by default. Override via \`style\` for a custom radial gradient,
   * e.g. \`background: "radial-gradient(circle at center, var(--brand-start), transparent)"\`.
   */
  variant?: "primary" | "accent" | "muted";
}

export function BlurredOrb({ className, style, variant = "primary" }: BlurredOrbProps) {
  const variantClass = {
    primary: "from-primary/60 to-primary/0",
    accent: "from-accent/60 to-accent/0",
    muted: "from-muted-foreground/40 to-muted-foreground/0",
  }[variant];

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute rounded-full blur-3xl",
        "bg-gradient-to-br",
        variantClass,
        "h-64 w-64",
        className,
      )}
      style={style}
    />
  );
}
`,
        target: "components/blurred-orb.tsx",
      },
    ],
  },
  {
    $schema: "https://ui.shadcn.com/schema/registry.json",
    name: "custom-cursor",
    type: "registry:component",
    title: "Custom Cursor",
    description:
      "Pointer-following animated cursor with dot + outline, hover-grow on links/buttons, click squeeze. Auto-hides on mobile.",
    dependencies: ["framer-motion"],
    registryDependencies: [],
    files: [
      {
        path: "custom-cursor.tsx",
        type: "registry:component",
        content: `"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CustomCursorProps {
  dotClassName?: string;
  outlineClassName?: string;
  /** Selector for elements that should make the cursor grow on hover. */
  hoverSelector?: string;
  hideOnMobile?: boolean;
}

export function CustomCursor({
  dotClassName,
  outlineClassName,
  hoverSelector = "a, button, input, textarea, [data-cursor-hover]",
  hideOnMobile = true,
}: CustomCursorProps = {}) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [clicked, setClicked] = useState(false);
  const [linkHovered, setLinkHovered] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth < 768);
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    const onMouseMove = (e: MouseEvent) => setPosition({ x: e.clientX, y: e.clientY });
    const onEnter = () => setHidden(false);
    const onLeave = () => setHidden(true);
    const onDown = () => setClicked(true);
    const onUp = () => setClicked(false);

    if (!isMobile) {
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseenter", onEnter);
      document.addEventListener("mouseleave", onLeave);
      document.addEventListener("mousedown", onDown);
      document.addEventListener("mouseup", onUp);

      const hoverables = document.querySelectorAll(hoverSelector);
      const hoverIn = () => setLinkHovered(true);
      const hoverOut = () => setLinkHovered(false);
      hoverables.forEach((el) => {
        el.addEventListener("mouseenter", hoverIn);
        el.addEventListener("mouseleave", hoverOut);
      });

      return () => {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseenter", onEnter);
        document.removeEventListener("mouseleave", onLeave);
        document.removeEventListener("mousedown", onDown);
        document.removeEventListener("mouseup", onUp);
        hoverables.forEach((el) => {
          el.removeEventListener("mouseenter", hoverIn);
          el.removeEventListener("mouseleave", hoverOut);
        });
        window.removeEventListener("resize", checkIfMobile);
      };
    }

    return () => window.removeEventListener("resize", checkIfMobile);
  }, [isMobile, hoverSelector]);

  if (hideOnMobile && isMobile) return null;

  return (
    <>
      <motion.div
        aria-hidden
        className={cn(
          "pointer-events-none fixed left-0 top-0 z-50 h-3 w-3 rounded-full bg-foreground mix-blend-difference",
          dotClassName,
        )}
        animate={{
          x: position.x - 6,
          y: position.y - 6,
          scale: clicked ? 0.5 : linkHovered ? 2 : 1,
          opacity: hidden ? 0 : 1,
        }}
        transition={{ type: "spring", mass: 0.2, stiffness: 800, damping: 30 }}
      />
      <motion.div
        aria-hidden
        className={cn(
          "pointer-events-none fixed left-0 top-0 z-50 h-8 w-8 rounded-full border border-foreground mix-blend-difference",
          outlineClassName,
        )}
        animate={{
          x: position.x - 16,
          y: position.y - 16,
          scale: clicked ? 0.5 : linkHovered ? 1.5 : 1,
          opacity: hidden ? 0 : 1,
        }}
        transition={{ type: "spring", mass: 0.5, stiffness: 200, damping: 30 }}
      />
    </>
  );
}
`,
        target: "components/custom-cursor.tsx",
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
