"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function ReviewsPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace("/#reviews")
  }, [router])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground mb-2">Redirecting...</h1>
        <p className="text-muted-foreground">Reviews are now integrated into the home page.</p>
      </div>
    </div>
  )
}
