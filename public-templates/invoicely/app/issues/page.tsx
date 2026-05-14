import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Tag, Milestone, Plus, CircleDot, MessageSquare, ChevronDown, Filter } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const mockIssues = [
  {
    id: 47,
    title: "default template to prefill details/ duplicate existing invoices",
    author: "yashash-pugalia",
    avatar: "/legion-logo.png",
    timeAgo: "last week",
    comments: 1,
    labels: ["enhancement", "feature-request"],
  },
  {
    id: 46,
    title: "Optional tag light mode styles",
    author: "PickleNik",
    avatar: "/developer-avatar.png",
    timeAgo: "2 weeks ago",
    comments: 1,
    labels: ["ui", "styling"],
  },
  {
    id: 45,
    title: "UX Improvements",
    author: "Rutwik187",
    avatar: "/developer-with-glasses.png",
    timeAgo: "3 weeks ago",
    comments: 1,
    labels: ["ux", "enhancement"],
  },
  {
    id: 44,
    title: "Add dark mode support for invoice templates",
    author: "legions-developer",
    avatar: "/legion-logo.png",
    timeAgo: "1 month ago",
    comments: 3,
    labels: ["dark-mode", "feature"],
  },
  {
    id: 43,
    title: "Export invoice as PDF functionality broken",
    author: "dev-sarah",
    avatar: "/developer-avatar.png",
    timeAgo: "1 month ago",
    comments: 5,
    labels: ["bug", "pdf", "high-priority"],
  },
  {
    id: 42,
    title: "Add multi-currency support",
    author: "finance-guru",
    avatar: "/developer-with-glasses.png",
    timeAgo: "2 months ago",
    comments: 8,
    labels: ["enhancement", "currency", "feature-request"],
  },
  {
    id: 41,
    title: "Invoice numbering sequence reset issue",
    author: "accounting-pro",
    avatar: "/legion-logo.png",
    timeAgo: "2 months ago",
    comments: 2,
    labels: ["bug", "numbering"],
  },
  {
    id: 40,
    title: "Add email templates for invoice notifications",
    author: "email-master",
    avatar: "/developer-avatar.png",
    timeAgo: "3 months ago",
    comments: 4,
    labels: ["email", "templates", "enhancement"],
  },
  {
    id: 39,
    title: "Performance optimization for large invoice lists",
    author: "perf-optimizer",
    avatar: "/developer-with-glasses.png",
    timeAgo: "3 months ago",
    comments: 6,
    labels: ["performance", "optimization"],
  },
  {
    id: 38,
    title: "Add invoice status tracking and history",
    author: "status-tracker",
    avatar: "/legion-logo.png",
    timeAgo: "4 months ago",
    comments: 7,
    labels: ["tracking", "history", "feature"],
  },
]

export default function IssuesPage() {
  return (
    <div className="bg-[#FAFAFA] text-foreground min-h-screen">
      <div className="max-w-[1280px] mx-auto px-4 py-4">
        {/* Issues Header */}
        <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-card border rounded-md font-light px-3 py-1.5 text-sm">
              <span className="text-muted-foreground">is:</span>
              <span className="text-blue-600">issue</span>
              <span className="text-muted-foreground">state:</span>
              <span className="text-green-600">open</span>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button variant="outline" size="sm" className="bg-background border-border">
              <Search className="w-3.5 h-3.5" />
              Search
            </Button>
            <Button variant="outline" size="sm" className="bg-background border-border">
              <Tag className="w-3.5 h-3.5" />
              Labels
            </Button>
            <Button variant="outline" size="sm" className="bg-background border-border">
              <Milestone className="w-3.5 h-3.5" />
              Milestones
            </Button>
            <Button variant="default" size="sm" className="bg-green-600 hover:bg-green-700">
              <Plus className="w-3.5 h-3.5" />
              New issue
            </Button>
          </div>
        </div>

        {/* Issues Filter Bar */}
        <div className="bg-card border border-border rounded-lg">
          <div className="flex items-center justify-between p-2 pl-3 border-b border-border">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <Button variant="ghost" size="sm" className="text-foreground hover:bg-accent font-normal">
                  <CircleDot className="w-3.5 h-3.5 mr-2" />
                  Open
                  <Badge variant="secondary" className="ml-2 bg-muted text-muted-foreground">
                    10
                  </Badge>
                </Button>
                <Button variant="ghost" size="sm" className="text-foreground hover:bg-accent font-normal">
                  Closed
                  <Badge variant="secondary" className="ml-2 bg-muted text-muted-foreground">
                    4
                  </Badge>
                </Button>
              </div>
            </div>
            <div className="hidden lg:flex items-center gap-2">
              <Button variant="ghost" size="sm" className="text-foreground hover:bg-accent font-normal">
                Open all
              </Button>
              <Button variant="ghost" size="sm" className="text-foreground hover:bg-accent font-normal">
                Author <ChevronDown className="w-3 h-3 ml-1" />
              </Button>
              <Button variant="ghost" size="sm" className="text-foreground hover:bg-accent font-normal">
                Labels <ChevronDown className="w-3 h-3 ml-1" />
              </Button>
              <Button variant="ghost" size="sm" className="text-foreground hover:bg-accent font-normal">
                Projects <ChevronDown className="w-3 h-3 ml-1" />
              </Button>
              <Button variant="ghost" size="sm" className="text-foreground hover:bg-accent font-normal">
                Milestones <ChevronDown className="w-3 h-3 ml-1" />
              </Button>
              <Button variant="ghost" size="sm" className="text-foreground hover:bg-accent font-normal">
                Assignees <ChevronDown className="w-3 h-3 ml-1" />
              </Button>
              <Button variant="ghost" size="sm" className="text-foreground hover:bg-accent font-normal">
                Newest <ChevronDown className="w-3 h-3 ml-1" />
              </Button>
            </div>

            <div className="lg:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-foreground hover:bg-accent font-normal">
                    <Filter className="w-3.5 h-3.5 mr-2" />
                    Filters
                    <ChevronDown className="w-3 h-3 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem>Open all</DropdownMenuItem>
                  <DropdownMenuItem>Author</DropdownMenuItem>
                  <DropdownMenuItem>Labels</DropdownMenuItem>
                  <DropdownMenuItem>Projects</DropdownMenuItem>
                  <DropdownMenuItem>Milestones</DropdownMenuItem>
                  <DropdownMenuItem>Assignees</DropdownMenuItem>
                  <DropdownMenuItem>Newest</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="divide-y divide-border">
            {mockIssues.map((issue) => (
              <div key={issue.id} className="p-3 hover:bg-accent/50">
                <div className="flex items-start gap-3">
                  <input type="checkbox" className="mt-1 rounded" />
                  <CircleDot className="w-3.5 h-3.5 mt-1 text-green-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-foreground text-sm hover:text-blue-600 cursor-pointer">{issue.title}</h3>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span className="text-sm">{issue.comments}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                      <span>#{issue.id}</span>
                      <img
                        src={issue.avatar || "/placeholder.svg"}
                        alt={issue.author}
                        className="w-3.5 h-3.5 rounded-full"
                      />
                      <span>
                        {issue.author} opened {issue.timeAgo}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
