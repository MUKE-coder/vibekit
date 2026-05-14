import { Construction } from "lucide-react"

export default function WikiPage() {
  return (
    <div className="bg-[#FAFAFA] min-h-screen">
      <div className="max-w-[1280px] mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center h-96 text-center">
          <Construction className="w-16 h-16 text-gray-400 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Wiki</h2>
          <p className="text-gray-500">This page is currently under development.</p>
        </div>
      </div>
    </div>
  )
}
