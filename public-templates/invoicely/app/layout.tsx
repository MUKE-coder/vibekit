import type React from "react"
import type { Metadata } from "next"
import { Geist, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { RepositoryHeader } from "@/components/repository-header"

const geist = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains-mono",
})

export const metadata: Metadata = {
  title: "v0 App",
  description: "Created with v0",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geist.className} ${jetbrainsMono.variable}`}>
      <body>
        <div className="min-h-screen bg-background">
          <div className="border-b border-border">
            <div className="mx-auto">
              <RepositoryHeader />
            </div>
          </div>
          {children}
        </div>
      </body>
    </html>
  )
}
