import { RepositorySidebar } from "@/components/repository-sidebar"
import { FileExplorer } from "@/components/file-explorer"
import { ReadmeSection } from "@/components/readme-section"

export default function CodePage() {
  return (
    <div className="bg-[#FAFAFA]">
      <div className="max-w-[1280px] mx-auto px-4 py-4">
        <div
          id="name-and-repo-options"
          className="py-4 border-b text-2xl font-medium flex flex-row items-center justify-between"
        >
          <span>Invoicely Repo</span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3">
            <FileExplorer />
            <ReadmeSection />
          </div>
          <div className="lg:col-span-1">
            <RepositorySidebar />
          </div>
        </div>
      </div>
    </div>
  )
}
