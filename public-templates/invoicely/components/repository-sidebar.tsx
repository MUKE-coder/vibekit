import { LinkIcon, Settings, Book, Shield, Activity, Star, Eye, GitFork, CheckCircle, Circle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export function RepositorySidebar() {
  return (
    <div className="space-y-4 mt-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-medium">About</h2>
          <div className="h-7 px-1.5 rounded-md bg-white border grid place-items-center">
            <Settings className="w-3.5 h-3.5 text-muted-foreground" />
          </div>
        </div>

        <p className="text-sm font-light text-muted-foreground">
          Invoicely is a simple and easy to use invoice generator where you can create beautiful and professional
          invoices in minutes. ~ Proudly OSS
        </p>

        <div className="flex items-center space-x-2 text-sm">
          <LinkIcon className="w-3.5 h-3.5 text-blue-600" />
          <a href="#" className="text-blue-600 hover:underline">
            invoicely.gg
          </a>
        </div>

        <div className="flex flex-wrap gap-1">
          <Badge variant="secondary" className="text-xs font-normal bg-blue-100 text-blue-800 hover:bg-blue-200">
            git
          </Badge>
          <Badge variant="secondary" className="text-xs font-normal bg-blue-100 text-blue-800 hover:bg-blue-200">
            cli
          </Badge>
          <Badge variant="secondary" className="text-xs font-normal bg-blue-100 text-blue-800 hover:bg-blue-200">
            javascript
          </Badge>
          <Badge variant="secondary" className="text-xs font-normal bg-blue-100 text-blue-800 hover:bg-blue-200">
            nextjs latest
          </Badge>
          <Badge variant="secondary" className="text-xs font-normal bg-blue-100 text-blue-800 hover:bg-blue-200">
            github-api-v4
          </Badge>
        </div>

        <div className="space-y-3 pt-2">
          <div className="flex items-center font-light space-x-2 text-xs">
            <Book className="w-3.5 h-3.5" />
            <span>Readme</span>
          </div>
          <div className="flex items-center space-x-2 font-light text-xs">
            <Shield className="w-3.5 h-3.5" />
            <span>Apache-2.0 license</span>
          </div>
          <div className="flex items-center space-x-2 font-light text-xs">
            <Shield className="w-3.5 h-3.5" />
            <span>Security policy</span>
          </div>
          <div className="flex items-center space-x-2 font-light text-xs">
            <Activity className="w-3.5 h-3.5" />
            <span>Activity — 152 commits</span>
          </div>
          <div className="flex items-center space-x-2 font-light text-xs">
            <Star className="w-3.5 h-3.5" />
            <span className="">33.9k</span>
            <span>stars</span>
          </div>
          <div className="flex items-center space-x-2 font-light text-xs">
            <Eye className="w-3.5 h-3.5" />
            <span className="">858</span>
            <span>watching</span>
          </div>
          <div className="flex items-center space-x-2 font-light text-xs">
            <GitFork className="w-3.5 h-3.5" />
            <span className="">5.7k</span>
            <span>forks</span>
          </div>
        </div>

        <Button variant="secondary" size="sm" className="w-full">
          Report repository
        </Button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <h2 className="text-base font-medium">Contributors</h2>
          <Badge variant="default" className="text-[10px] jetbrains font-light px-2 text-white">
            1
          </Badge>
        </div>

        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <img src="/legion-logo.png" alt="legions-developer" className="w-6 h-6 rounded-full" />
            <div className="flex items-center space-x-2">
              <span className="text-sm jetbrains tracking-tighter font-medium">legions-developer</span>
              <span className="text-xs jetbrains tracking-tight text-muted-foreground">Legion</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <h2 className="text-base font-medium">Deployments</h2>
          <Badge variant="default" className="text-[10px] jetbrains font-light px-2 text-white">
            252
          </Badge>
        </div>

        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Circle className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-sm font-medium">Preview</span>
            <span className="text-xs text-muted-foreground">1 day ago</span>
          </div>

          <div className="flex items-center space-x-2">
            <CheckCircle className="w-3.5 h-3.5 text-green-600" />
            <span className="text-sm font-medium">Production</span>
            <span className="text-xs text-muted-foreground">3 days ago</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-base font-medium">Languages</h2>

        <div className="space-y-3">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-500 h-2 rounded-full relative" style={{ width: "93.3%" }}>
              <div className="bg-orange-500 h-2 rounded-r-full absolute right-0" style={{ width: "5.7%" }}></div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-xs font-normal">TypeScript</span>
              <span className="text-xs text-muted-foreground">93.3%</span>
            </div>

            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              <span className="text-xs font-normal">MDX</span>
              <span className="text-xs text-muted-foreground">5.3%</span>
            </div>

            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-gray-400"></div>
              <span className="text-xs font-normal">Other</span>
              <span className="text-xs text-muted-foreground">1.4%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
