"use client"

import {
  Menu,
  Code,
  CircleDot,
  GitPullRequest,
  Search,
  Plus,
  Settings,
  Mail,
  RefreshCw,
  FolderKanban,
  Play,
  BookOpen,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { usePathname, useRouter } from "next/navigation"

export function RepositoryHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const tabs = [
    { name: "Code", icon: Code, path: "/code", shortName: "Code" },
    { name: "Issues", icon: CircleDot, path: "/issues", shortName: "Issues", count: 3 },
    { name: "Pull requests", icon: GitPullRequest, path: "/pull-requests", shortName: "Pulls" },
    { name: "Actions", icon: Play, path: "/actions", shortName: "Actions" },
    { name: "Projects", icon: FolderKanban, path: "/projects", shortName: "Projects" },
    { name: "Wiki", icon: BookOpen, path: "/wiki", shortName: "Wiki" },
  ]

  const getActiveTab = () => {
    const currentTab = tabs.find((tab) => pathname === tab.path)
    return currentTab ? currentTab.name : "Code"
  }

  const [activeTab, setActiveTab] = useState(getActiveTab())
  const [indicatorStyle, setIndicatorStyle] = useState({ width: 0, left: 0, opacity: 0 })
  const tabRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({})

  useEffect(() => {
    setActiveTab(getActiveTab())
  }, [pathname])

  useEffect(() => {
    const updateIndicator = () => {
      const activeTabElement = tabRefs.current[activeTab]
      if (activeTabElement) {
        const { offsetLeft, offsetWidth } = activeTabElement
        setIndicatorStyle({ left: offsetLeft, width: offsetWidth, opacity: 1 })
      }
    }

    requestAnimationFrame(updateIndicator)
  }, [activeTab])

  const handleTabClick = (tab: (typeof tabs)[0]) => {
    setActiveTab(tab.name)
    router.push(tab.path)
  }

  return (
    <div className="w-full">
      {/* Desktop header */}
      <div className="hidden md:block">
        <div id="name-and-repo-options" className="flex px-4 items-center justify-between py-3 bg-white w-full">
          <div className="flex items-center">
            <Button
              variant="outline"
              size="sm"
              className="!p-1.5 h-7 mr-3 bg-transparent text-foreground hover:bg-accent font-normal"
            >
              <Menu className="size-3.5" />
            </Button>

            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 mr-3 fill-current"
            >
              <path d="M12 2.247a10 10 0 0 0-3.162 19.487c.5.088.687-.212.687-.475 0-.237-.012-1.025-.012-1.862-2.513.462-3.163-.613-3.363-1.175a3.64 3.64 0 0 0-1.025-1.413c-.35-.187-.85-.65-.013-.662a2 2 0 0 1 1.538 1.025 2.137 2.137 0 0 0 2.912.825 2.1 2.1 0 0 1 .638-1.338c-2.225-.25-4.55-1.112-4.55-4.937a3.9 3.9 0 0 1 1.025-2.688 3.6 3.6 0 0 1 .1-2.65s.837-.262 2.75 1.025a9.43 9.43 0 0 1 5 0c1.912-1.3 2.75-1.025 2.75-1.025a3.6 3.6 0 0 1 .1 2.65 3.87 3.87 0 0 1 1.025 2.688c0 3.837-2.338 4.687-4.562 4.937a2.37 2.37 0 0 1 .674 1.85c0 1.338-.012 2.413-.012 2.75 0 .263.187.575.687.475A10.005 10.005 0 0 0 12 2.247" />
            </svg>

            <span className="text-gray-400 mr-3">/</span>

            <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center mr-2">
              <svg
                width="9"
                height="9"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                className="mb-0.5 fill-white"
              >
                <path d="M24 22.525H0l12-21.05z" />
              </svg>
            </div>

            <span className="text-sm mr-2">invoicely</span>

            <Badge className="bg-purple-100 font-normal text-purple-800 text-xs h-4.5 px-2">Private</Badge>
          </div>

          <div className="flex items-center space-x-2">
            {/* Desktop CoPilot Pro section and action buttons - hidden on mobile */}
            <div className="hidden md:flex items-center space-x-2">
              <div className="flex items-center space-x-2 bg-gray-50 rounded-lg px-2 py-1 border">
                <div className="w-4 h-4 bg-blue-500 rounded flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-sm"></div>
                </div>
                <span className="text-xs font-medium">CoPilot Pro</span>
              </div>

              <div className="flex items-center space-x-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-foreground hover:bg-accent font-normal h-8 w-8 p-0 bg-transparent"
                >
                  <Search className="size-3.5" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-foreground hover:bg-accent font-normal h-8 w-8 p-0 bg-transparent"
                >
                  <Plus className="size-3.5" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-foreground hover:bg-accent font-normal h-8 w-8 p-0 bg-transparent"
                >
                  <Settings className="size-3.5" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-foreground hover:bg-accent font-normal h-8 w-8 p-0 bg-transparent"
                >
                  <Mail className="size-3.5" />
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  className="text-foreground hover:bg-accent font-normal h-7 w-7 p-0 bg-black rounded-full text-white hover:bg-gray-800"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    className="fill-current"
                  >
                    <path d="M12 2.247a10 10 0 0 0-3.162 19.487c.5.088.687-.212.687-.475 0-.237-.012-1.025-.012-1.862-2.513.462-3.163-.613-3.363-1.175a3.64 3.64 0 0 0-1.025-1.413c-.35-.187-.85-.65-.013-.662a2 2 0 0 1 1.538 1.025 2.137 2.137 0 0 0 2.912.825 2.1 2.1 0 0 1 .638-1.338c-2.225-.25-4.55-1.112-4.55-4.937a3.9 3.9 0 0 1 1.025-2.688 3.6 3.6 0 0 1 .1-2.65s.837-.262 2.75 1.025a9.43 9.43 0 0 1 5 0c1.912-1.3 2.75-1.025 2.75-1.025a3.6 3.6 0 0 1 .1 2.65 3.87 3.87 0 0 1 1.025 2.688c0 3.837-2.338 4.687-4.562 4.937a2.37 2.37 0 0 1 .674 1.85c0 1.338-.012 2.413-.012 2.75 0 .263.187.575.687.475A10.005 10.005 0 0 0 12 2.247" />
                  </svg>
                </Button>
              </div>
            </div>

            {/* Mobile menu button - only visible on mobile */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="md:hidden text-foreground hover:bg-accent font-normal h-8 w-8 p-0 bg-transparent"
                >
                  <Menu className="size-3.5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <SheetHeader>
                  <SheetTitle className="text-left">Options</SheetTitle>
                </SheetHeader>

                <div className="mt-6 space-y-4">
                  {/* CoPilot Pro section in mobile */}
                  <div className="flex items-center space-x-2 bg-gray-50 rounded-lg px-3 py-2 border">
                    <div className="w-4 h-4 bg-blue-500 rounded flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-sm"></div>
                    </div>
                    <span className="text-sm font-medium">CoPilot Pro</span>
                  </div>

                  {/* Action buttons in mobile */}
                  <div className="space-y-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-foreground hover:bg-accent font-normal"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Search className="size-3.5 mr-3" />
                      Search
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-foreground hover:bg-accent font-normal"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Plus className="size-3.5 mr-3" />
                      Create
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-foreground hover:bg-accent font-normal"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Settings className="size-3.5 mr-3" />
                      Settings
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-foreground hover:bg-accent font-normal"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Mail className="size-3.5 mr-3" />
                      Messages
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-foreground hover:bg-accent font-normal"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        className="fill-current mr-3"
                      >
                        <path d="M12 2.247a10 10 0 0 0-3.162 19.487c.5.088.687-.212.687-.475 0-.237-.012-1.025-.012-1.862-2.513.462-3.163-.613-3.363-1.175a3.64 3.64 0 0 0-1.025-1.413c-.35-.187-.85-.65-.013-.662a2 2 0 0 1 1.538 1.025 2.137 2.137 0 0 0 2.912.825 2.1 2.1 0 0 1 .638-1.338c-2.225-.25-4.55-1.112-4.55-4.937a3.9 3.9 0 0 1 1.025-2.688 3.6 3.6 0 0 1 .1-2.65s.837-.262 2.75 1.025a9.43 9.43 0 0 1 5 0c1.912-1.3 2.75-1.025 2.75-1.025a3.6 3.6 0 0 1 .1 2.65 3.87 3.87 0 0 1 1.025 2.688c0 3.837-2.338 4.687-4.562 4.937a2.37 2.37 0 0 1 .674 1.85c0 1.338-.012 2.413-.012 2.75 0 .263.187.575.687.475A10.005 10.005 0 0 0 12 2.247" />
                      </svg>
                      GitHub Profile
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="flex flex-row items-center justify-between">
          <div className="relative flex-1 overflow-hidden">
            <nav className="relative flex items-center px-4 bg-white overflow-x-auto scrollbar-hide">
              <div className="flex items-center min-w-max">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  const isActive = activeTab === tab.name

                  return (
                    <button
                      key={tab.name}
                      ref={(el) => (tabRefs.current[tab.name] = el)}
                      onClick={() => handleTabClick(tab)}
                      className={`flex items-center px-4 py-3 cursor-pointer text-sm transition-colors whitespace-nowrap ${
                        isActive ? "text-black" : "text-zinc-500 hover:text-gray-900"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 mr-2" />
                      {tab.name}
                    </button>
                  )
                })}
              </div>

              <motion.div
                className="absolute bottom-0 h-0.5 bg-black"
                animate={{
                  left: indicatorStyle.left,
                  width: indicatorStyle.width,
                  opacity: indicatorStyle.opacity,
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                }}
              />
            </nav>
          </div>

          <div className="hidden md:flex items-center bg-gray-50 rounded-full px-1 pl-2.5 border ml-4 flex-shrink-0">
            <span className="text-xs text-gray-500">vercel.com/</span>
            <span className="text-xs whitespace-nowrap">invoicely.gg</span>
            <Button variant="ghost" size="sm" className="ml-auto h-6 w-6 p-0 bg-transparent">
              <RefreshCw className="size-3" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile header */}
      <div className="md:hidden">
        <div id="name-and-repo-options" className="flex items-center justify-between py-3 px-4 bg-white w-full">
          <div className="flex items-center">
            <Button
              variant="outline"
              size="sm"
              className="!p-1.5 h-7 mr-3 bg-transparent text-foreground hover:bg-accent font-normal"
            >
              <Menu className="size-3.5" />
            </Button>

            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 mr-3 fill-current"
            >
              <path d="M12 2.247a10 10 0 0 0-3.162 19.487c.5.088.687-.212.687-.475 0-.237-.012-1.025-.012-1.862-2.513.462-3.163-.613-3.363-1.175a3.64 3.64 0 0 0-1.025-1.413c-.35-.187-.85-.65-.013-.662a2 2 0 0 1 1.538 1.025 2.137 2.137 0 0 0 2.912.825 2.1 2.1 0 0 1 .638-1.338c-2.225-.25-4.55-1.112-4.55-4.937a3.9 3.9 0 0 1 1.025-2.688 3.6 3.6 0 0 1 .1-2.65s.837-.262 2.75 1.025a9.43 9.43 0 0 1 5 0c1.912-1.3 2.75-1.025 2.75-1.025a3.6 3.6 0 0 1 .1 2.65 3.87 3.87 0 0 1 1.025 2.688c0 3.837-2.338 4.687-4.562 4.937a2.37 2.37 0 0 1 .674 1.85c0 1.338-.012 2.413-.012 2.75 0 .263.187.575.687.475A10.005 10.005 0 0 0 12 2.247" />
            </svg>

            <span className="text-gray-400 mr-3">/</span>

            <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center mr-2">
              <svg
                width="9"
                height="9"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                className="mb-0.5 fill-white"
              >
                <path d="M24 22.525H0l12-21.05z" />
              </svg>
            </div>

            <span className="text-sm mr-2">invoicely</span>

            <Badge className="bg-purple-100 font-normal text-purple-800 text-xs h-4.5 px-2">Private</Badge>
          </div>

          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="text-foreground hover:bg-accent font-normal h-8 w-8 p-0 bg-transparent"
              >
                <Menu className="size-3.5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetHeader>
                <SheetTitle className="text-left">Options</SheetTitle>
              </SheetHeader>

              <div className="mt-6 space-y-4">
                <div className="flex items-center space-x-2 bg-gray-50 rounded-lg px-3 py-2 border">
                  <div className="w-4 h-4 bg-blue-500 rounded flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-sm"></div>
                  </div>
                  <span className="text-sm font-medium">CoPilot Pro</span>
                </div>

                <div className="space-y-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-foreground hover:bg-accent font-normal"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Search className="size-3.5 mr-3" />
                    Search
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-foreground hover:bg-accent font-normal"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Plus className="size-3.5 mr-3" />
                    Create
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-foreground hover:bg-accent font-normal"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Settings className="size-3.5 mr-3" />
                    Settings
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-foreground hover:bg-accent font-normal"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Mail className="size-3.5 mr-3" />
                    Messages
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-foreground hover:bg-accent font-normal"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      className="fill-current mr-3"
                    >
                      <path d="M12 2.247a10 10 0 0 0-3.162 19.487c.5.088.687-.212.687-.475 0-.237-.012-1.025-.012-1.862-2.513.462-3.163-.613-3.363-1.175a3.64 3.64 0 0 0-1.025-1.413c-.35-.187-.85-.65-.013-.662a2 2 0 0 1 1.538 1.025 2.137 2.137 0 0 0 2.912.825 2.1 2.1 0 0 1 .638-1.338c-2.225-.25-4.55-1.112-4.55-4.937a3.9 3.9 0 0 1 1.025-2.688 3.6 3.6 0 0 1 .1-2.65s.837-.262 2.75 1.025a9.43 9.43 0 0 1 5 0c1.912-1.3 2.75-1.025 2.75-1.025a3.6 3.6 0 0 1 .1 2.65 3.87 3.87 0 0 1 1.025 2.688c0 3.837-2.338 4.687-4.562 4.937a2.37 2.37 0 0 1 .674 1.85c0 1.338-.012 2.413-.012 2.75 0 .263.187.575.687.475A10.005 10.005 0 0 0 12 2.247" />
                    </svg>
                    GitHub Profile
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Mobile tab bar */}
        <div className="bg-white text-gray-900 border-t">
          <div className="flex items-center justify-around px-2 py-2">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.name

              return (
                <button
                  key={tab.name}
                  onClick={() => handleTabClick(tab)}
                  className={`flex flex-col items-center justify-center px-2 py-1 min-w-0 flex-1 transition-colors ${
                    isActive ? "text-black" : "text-gray-500"
                  }`}
                >
                  <div className="relative">
                    <Icon className="w-4 h-4 mb-1" />
                    {tab.count && (
                      <span className="absolute -top-1 -right-1 bg-gray-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
                        {tab.count}
                      </span>
                    )}
                  </div>
                  <span className="text-xs truncate w-full text-center">{tab.shortName}</span>
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black mx-auto" style={{ width: "60%" }} />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
