import { FileText, Maximize2, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function ReadmeSection() {
  return (
    <Card className="!pt-0 relative">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 px-4 pr-2 !py-2 border-b">
        <div className="flex items-center space-x-2">
          <FileText className="w-4 h-4" />
          <span className="text-sm">README.md</span>
        </div>
        <div className="flex items-center space-x-1">
          <Button variant="outline" size="sm" className="h-8 w-8 p-0 border-b bg-transparent">
            <Edit className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold mb-2">Invoicely Open Source</h1>
            <p className="text-sm text-muted-foreground">
              A modern, responsive website template built with{" "}
              <span className="font-medium">HTML, CSS, and JavaScript</span>.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-6 px-1 bg-orange-500 rounded flex items-center justify-center text-white text-xs">
              Html
            </div>
            <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center text-white text-xs">TS</div>
            <div className="w-6 h-6 bg-yellow-500 rounded flex items-center justify-center text-white text-xs">JS</div>
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-semibold mb-4">Invoicely - (Contributions Accepted)</h1>
          <p className="text-sm text-muted-foreground mb-6">
            Modern, open-source invoice generator platform built with Next.js, PDF, and TypeScript.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-3 flex items-center">
            <span className="text-lg mr-2">🚀</span>
            Quick Start
          </h2>

          <div className="space-y-4">
            <div>
              <h3 className="text-base font-medium mb-2">Prerequisites</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                <li>
                  <span className="font-medium">Node.js</span> - 18 or higher
                </li>
                <li>
                  <span className="font-medium">React 18</span> - UI library
                </li>
                <li>
                  <span className="font-medium">PostgreSQL</span> - Database for storing application data
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-base font-medium mb-2">Installation</h3>

              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium mb-2">1. Clone the repository</p>
                  <div className="bg-muted rounded-lg p-3 font-mono text-sm relative">
                    <code>git clone https://github.com/legions-developer/invoicely.git</code>
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute top-1 right-1 h-6 w-6 p-0 border-b bg-transparent"
                    >
                      <Maximize2 className="size-3" />
                    </Button>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">2. Install dependencies</p>
                  <div className="bg-muted rounded-lg p-3 font-mono text-sm relative">
                    <code>npm install</code>
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute top-1 right-1 h-6 w-6 p-0 border-b bg-transparent"
                    >
                      <Maximize2 className="size-3" />
                    </Button>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">3. Set up environment variables</p>
                  <div className="bg-muted rounded-lg p-3 font-mono text-sm relative">
                    <div># Create .env.local file in root directory</div>
                    <div># Add required environment variables below</div>
                    <div>NEXT_PUBLIC_APP_URL=http://localhost:3000</div>
                    <div>DATABASE_URL=your_database_url</div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute top-1 right-1 h-6 w-6 p-0 border-b bg-transparent"
                    >
                      <Maximize2 className="size-3" />
                    </Button>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">4. Set up the database</p>
                  <div className="bg-muted rounded-lg p-3 font-mono text-sm relative">
                    <div># Generate database schema</div>
                    <div>npm run db:generate</div>
                    <div># Run migrations</div>
                    <div>npm run db:migrate</div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute top-1 right-1 h-6 w-6 p-0 border-b bg-transparent"
                    >
                      <Maximize2 className="size-3" />
                    </Button>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">5. Start development server</p>
                  <div className="bg-muted rounded-lg p-3 font-mono text-sm relative">
                    <code>npm dev</code>
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute top-1 right-1 h-6 w-6 p-0 border-b bg-transparent"
                    >
                      <Maximize2 className="size-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-3 flex items-center">
            <span className="text-lg mr-2">🛠️</span>
            Tech Stack
          </h2>

          <div className="space-y-4">
            <div>
              <h3 className="text-base font-medium mb-2">Core Framework</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                <li>
                  <span className="font-medium">Next.js 15.1</span> - React framework with App Router
                </li>
                <li>
                  <span className="font-medium">React 18</span> - UI library
                </li>
                <li>
                  <span className="font-medium">TypeScript 5.6.3</span> - Type-safe JavaScript
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-base font-medium mb-2">API & State Management</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                <li>
                  <span className="font-medium">tRPC 11.1.2</span> - End-to-end type APIs
                </li>
                <li>
                  <span className="font-medium">TanStack Query 5.76.1</span> - Server state management
                </li>
                <li>
                  <span className="font-medium">Zod 3.24.1</span> - Schema validation
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-base font-medium mb-2">UI & Styling</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                <li>
                  <span className="font-medium">Tailwind CSS 4</span> - Utility CSS framework
                </li>
                <li>
                  <span className="font-medium">Radix UI</span> - Headless UI components
                </li>
                <li>
                  <span className="font-medium">Lucide React</span> - Icon library
                </li>
                <li>
                  <span className="font-medium">Next Themes</span> - Theme management
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-base font-medium mb-2">Database & Authentication</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                <li>
                  <span className="font-medium">Drizzle ORM 0.38.1</span> - Type-safe database ORM
                </li>
                <li>
                  <span className="font-medium">Neon Database</span> - Serverless PostgreSQL
                </li>
                <li>
                  <span className="font-medium">Google OAuth</span> - Social authentication
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-base font-medium mb-2">File Storage & PDF</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                <li>
                  <span className="font-medium">Cloudflare R2</span> - Object storage
                </li>
                <li>
                  <span className="font-medium">React PDF 8.2.1</span> - PDF generation
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-base font-medium mb-2">Development Tools</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                <li>
                  <span className="font-medium">Turbo 2.3.3</span> - JavaScript build system
                </li>
                <li>
                  <span className="font-medium">Prettier 3.4.2</span> - Code formatting
                </li>
                <li>
                  <span className="font-medium">Husky 9.1.7</span> - Git hooks
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-base font-medium mb-2">Analytics & Monitoring</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                <li>
                  <span className="font-medium">PostHog</span> - Product analytics
                </li>
                <li>
                  <span className="font-medium">OpenPanel</span> - Privacy-focused analytics
                </li>
                <li>
                  <span className="font-medium">React Scan</span> - Performance debugging
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-base font-medium mb-2">Utilities</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                <li>
                  <span className="font-medium">Date-fns 4.1.0</span> - Date manipulation
                </li>
                <li>
                  <span className="font-medium">Decimal.js 10.4.3</span> - Arbitrary precision arithmetic
                </li>
                <li>
                  <span className="font-medium">UUID 11.0.3</span> - Unique identifier generation
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t pt-6">
          <h2 className="text-lg font-semibold mb-3">📁 Project Structure</h2>
          <div className="bg-muted rounded-lg p-4 font-mono text-sm">
            <pre className="space-y-1 jetbrains">
              <div>invoicely/</div>
              <div>├── app/</div>
              <div>│ ├── api/</div>
              <div>│ ├── dashboard/</div>
              <div>│ └── globals.css</div>
              <div>├── components/</div>
              <div>├── lib/</div>
              <div>├── public/</div>
              <div>└── README.md</div>
            </pre>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
