"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Tag, GitPullRequest, X, ChevronDown, MessageSquare, GitMerge, Clock, Filter } from "lucide-react"

const pullRequests = [
  {
    id: 44,
    title: "Feat/make-invoice-end-date-optional",
    author: "legions-developer",
    avatar: "/legion-logo.png",
    status: "merged",
    mergedAt: "3 weeks ago",
    comments: 1,
    labels: ["enhancement"],
  },
  {
    id: 43,
    title: "feat: add sentry",
    author: "legions-developer",
    avatar: "/legion-logo.png",
    status: "merged",
    mergedAt: "3 weeks ago",
    comments: 1,
    labels: ["feature"],
  },
  {
    id: 41,
    title: "feat: migrate to vercel",
    author: "legions-developer",
    avatar: "/legion-logo.png",
    status: "merged",
    mergedAt: "last month",
    comments: 0,
    labels: ["deployment"],
  },
  {
    id: 42,
    title: "feat: Templating and Vercel theme invoice",
    author: "legions-developer",
    avatar: "/legion-logo.png",
    status: "merged",
    mergedAt: "last month",
    updatedAt: "last month",
    comments: 0,
    labels: ["feature", "ui"],
  },
  {
    id: 40,
    title: "feat: add sponsership page",
    author: "legions-developer",
    avatar: "/legion-logo.png",
    status: "merged",
    mergedAt: "Jul 5",
    comments: 1,
    labels: ["feature"],
  },
  {
    id: 39,
    title: "feat: new landing page",
    author: "legions-developer",
    avatar: "/legion-logo.png",
    status: "merged",
    mergedAt: "Jul 4",
    comments: 0,
    labels: ["ui", "enhancement"],
  },
  {
    id: 38,
    title: "fix: responsive design improvements",
    author: "legions-developer",
    avatar: "/legion-logo.png",
    status: "merged",
    mergedAt: "Jun 28",
    comments: 2,
    labels: ["bug", "ui"],
  },
  {
    id: 37,
    title: "feat: add dark mode toggle",
    author: "legions-developer",
    avatar: "/legion-logo.png",
    status: "merged",
    mergedAt: "Jun 25",
    comments: 3,
    labels: ["feature", "ui"],
  },
]

export default function PullRequestsPage() {
  const [searchQuery, setSearchQuery] = useState("sort:updated-desc is:pr is:closed")

  return (
    <div className="bg-[#FAFAFA] min-h-screen">
      <div className="max-w-[1280px] mx-auto px-4 py-6">
        <div className="bg-gray-900 text-white rounded-lg p-4 mb-6 flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-base font-medium mb-1">Label issues and pull requests for new contributors</h3>
            <p className="text-sm text-gray-300">
              Now, GitHub will help potential first-time contributors{" "}
              <a href="#" className="text-blue-400 hover:underline">
                discover issues
              </a>{" "}
              labeled with{" "}
              <Badge variant="secondary" className="bg-blue-600 text-white text-xs">
                good first issue
              </Badge>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-4 flex-wrap">
          <Button variant="ghost" size="sm" className="text-foreground hover:bg-accent font-normal gap-2">
            Filters <ChevronDown className="w-3 h-3 size-3.5" />
          </Button>

          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 size-3.5 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white border-gray-300 min-w-40"
              placeholder="Search pull requests..."
            />
          </div>

          <Button variant="ghost" size="sm" className="text-foreground hover:bg-accent font-normal gap-2">
            <Tag className="w-3 h-3 size-3.5" />
            Labels 
          </Button> 

          <Button className="bg-green-600 hover:bg-green-700 text-white gap-2">New pull request</Button>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <X className="w-4 h-4 size-3.5 text-gray-500" />
          <span className="text-sm text-gray-600">Clear current search query, filters, and sorts</span>
        </div>

        <div className="bg-white rounded-lg border border-gray-200">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded border-gray-300" />
                <span className="text-sm font-medium">0 Open</span>
              </label>

              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-purple-600 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <span className="text-sm font-medium">40 Closed</span>
              </div>
            </div>

            <div className="hidden lg:flex items-center gap-2 text-sm">
              <Button variant="ghost" size="sm" className="text-foreground hover:bg-accent font-normal">
                Open all
              </Button>
              <Button variant="ghost" size="sm" className="text-foreground hover:bg-accent font-normal gap-1">
                Author <ChevronDown className="w-3 h-3 size-3.5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-foreground hover:bg-accent font-normal gap-1">
                Label <ChevronDown className="w-3 h-3 size-3.5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-foreground hover:bg-accent font-normal gap-1">
                Projects <ChevronDown className="w-3 h-3 size-3.5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-foreground hover:bg-accent font-normal gap-1">
                Milestones <ChevronDown className="w-3 h-3 size-3.5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-foreground hover:bg-accent font-normal gap-1">
                Reviews <ChevronDown className="w-3 h-3 size-3.5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-foreground hover:bg-accent font-normal gap-1">
                Assignee <ChevronDown className="w-3 h-3 size-3.5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-foreground hover:bg-accent font-normal gap-1">
                Sort <ChevronDown className="w-3 h-3 size-3.5" />
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
                  <DropdownMenuItem>Label</DropdownMenuItem>
                  <DropdownMenuItem>Projects</DropdownMenuItem>
                  <DropdownMenuItem>Milestones</DropdownMenuItem>
                  <DropdownMenuItem>Reviews</DropdownMenuItem>
                  <DropdownMenuItem>Assignee</DropdownMenuItem>
                  <DropdownMenuItem>Sort</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {pullRequests.map((pr) => (
              <div key={pr.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-3">
                  <input type="checkbox" className="mt-1 rounded border-gray-300" />

                  <div className="flex-1">
                    <div className="flex items-start gap-2">
                      <GitMerge className="w-4 h-4 size-3.5 text-purple-600 mt-0.5 flex-shrink-0" />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-sm font-medium text-gray-900 hover:text-blue-600 cursor-pointer">
                            {pr.title}
                          </h3>
                          {pr.labels.map((label) => (
                            <Badge key={label} variant="secondary" className="text-xs">
                              {label}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <span>#{pr.id}</span>
                          <span>by</span>
                          <img src={pr.avatar || "/placeholder.svg"} alt={pr.author} className="w-4 h-4 rounded-full" />
                          <span className="text-orange-600 font-medium hidden sm:flex">{pr.author}</span>
                          <span>was merged {pr.mergedAt}</span>
                          {pr.updatedAt && (
                            <>
                              <Clock className="w-3 h-3 size-3.5" />
                              <span>updated {pr.updatedAt}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {pr.comments > 0 && (
                    <div className="flex items-center gap-1 text-gray-600">
                      <MessageSquare className="w-4 h-4 size-3.5" />
                      <span className="text-sm">{pr.comments}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
