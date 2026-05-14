import { File, Folder, GitBranch, Tag, Code, FolderOpen, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const files = [
  { name: "docs", type: "folder", message: "Update API reference docs", time: "2 days ago" },
  { name: "images", type: "folder", message: "Add project logo and demo screenshots", time: "2 days ago" },
  { name: "invoicely", type: "folder", message: "Implement upgrade and fix client service", time: "3 months ago" },
  { name: "Procfile", type: "file", message: "Procfile: heroku config files", time: "3 months ago" },
  { name: "invoicely.sql", type: "file", message: "Implement upgrade and fix client service", time: "3 months ago" },
  { name: "requirements.txt", type: "file", message: "Implement upgrade and fix client service", time: "3 months ago" },
  { name: "run.py", type: "file", message: "Implement upgrade and fix client service", time: "3 months ago" },
  { name: "settings", type: "folder", message: "Create settings for the admin", time: "3 months ago" },
  { name: "migrations", type: "folder", message: "Implement upgrade and fix client service", time: "3 months ago" },
  { name: "app.py", type: "file", message: "Bug fix: users not for signing", time: "3 days ago" },
  { name: "admin.py", type: "file", message: "Implement upgrade and fix client service", time: "3 months ago" },
  { name: "apps.py", type: "file", message: "Implement upgrade and fix client service", time: "3 months ago" },
  { name: "forms.py", type: "file", message: "Implement upgrade and fix client service", time: "3 months ago" },
  { name: "models.py", type: "file", message: "Implement upgrade and fix client service", time: "3 months ago" },
  { name: "admin", type: "folder", message: "Implement admin create page", time: "3 months ago" },
  {
    name: "authentication",
    type: "folder",
    message: "Implement authentication and creation page with...",
    time: "3 months ago",
  },
  { name: "LICENSE", type: "file", message: "Initial commit", time: "3 months ago" },
  { name: "GLCODE.md", type: "file", message: "By adding", time: "just now" },
  { name: "env-sample", type: "file", message: "Implement upgrade and fix client service", time: "3 months ago" },
  { name: "build.json", type: "file", message: "for initial repo and setup", time: "2 weeks ago" },
  { name: "manage.json", type: "file", message: "for initial repo and setup", time: "2 weeks ago" },
]

export function FileExplorer() {
  return (
    <div>
      <div className="flex sm:flex-row flex-col gap-4 sm:items-center justify-between py-4">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-1 bg-white border rounded-md px-2">
            <GitBranch className="size-3.5 text-black" />
            <div variant="ghost" size="sm" className="text-sm px-2 py-1 h-auto">
              main
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <GitBranch className="size-3.5 text-zinc-600" />
            <span className="text-sm text-zinc-600 font-light">1 branch</span>
          </div>
          <div className="flex items-center space-x-2">
            <Tag className="size-3.5 text-zinc-600" />
            <span className="text-sm text-zinc-600 font-light">0 tags</span>
          </div>
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-fit justify-end">
          <Button variant="outline" size="sm" className="border-gray-300 bg-transparent">
            <FolderOpen className="size-3.5" />
            Go to file
          </Button>
          <Button variant="outline" size="sm" className="border-gray-300 bg-transparent">
            <Plus className="size-3.5" />
            Add file
          </Button>
          <Button variant="default" size="sm" className="bg-green-600 hover:bg-green-700">
            <Code className="size-3.5" />
            Code
          </Button>
        </div>
      </div>
      <div className="border border-gray-200 rounded-lg mb-6 overflow-hidden">
        <div className="px-3 py-3 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Avatar className="w-5 h-5">
                <AvatarImage src="/legion-logo.png" />
                <AvatarFallback className="text-xs bg-gray-200">HD</AvatarFallback>
              </Avatar>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-normal jetbrains tracking-tighter text-zinc-900">heyrico design</span>
                <span className="text-xs text-zinc-500 jetbrains hidden sm:flex">Initial Commit</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-xs text-zinc-500 jetbrains">00aef13n</span>
              <div className="flex items-center space-x-2 px-2 py-1 border rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-zinc-500">3 commits</span>
              </div>
            </div>
          </div>
        </div>

        <div className="divide-y divide-border">
          {files.map((file, index) => (
            <div key={index} className="flex items-center p-2 hover:bg-muted/50 bg-white">
              <div className="flex items-center space-x-3 flex-1">
                <div className="w-4 h-4 flex items-center justify-center">
                  {file.type === "folder" ? (
                    <Folder className="w-4 h-4 text-zinc-600" />
                  ) : (
                    <File className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
                <span className="text-[13px] font-normal text-zinc-600 hover:underline cursor-pointer">
                  {file.name}
                </span>
              </div>
              <div className="flex-1 px-4">
                <span className="text-[13px] font-light text-muted-foreground">{file.message}</span>
              </div>
              <div className="text-xs font-normal jetbrains tracking-tight text-muted-foreground min-w-[100px] text-right">
                {file.time}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
