"use client"

import { motion } from "framer-motion"
import { Copy, ExternalLink } from "lucide-react"
import { useState } from "react"

export function ContactSection() {
  const [emailCopied, setEmailCopied] = useState(false)

  const copyEmail = () => {
    navigator.clipboard.writeText("dosofisan7@gmail.com")
    setEmailCopied(true)
    setTimeout(() => setEmailCopied(false), 2000)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
        ease: [0.25, 0.1, 0.25, 1.0],
      },
    },
  }

  const titleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1.0],
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1.0],
      },
    },
  }

  return (
    <section id="across-the-web" className="section-spacing pb-40">
      <div className="container-xl">
        <motion.h2
          variants={titleVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="section-title mb-24"
        >
          Across the Web
        </motion.h2>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16"
        >
          <div className="space-y-8">
            <motion.div variants={itemVariants} className="border-b border-foreground/10 pb-4">
              <div className="flex items-center justify-between">
                <span className="contact-label text-foreground/60">Email</span>
                <div className="flex items-center gap-2">
                  <a
                    href="mailto:dosofisan7@gmail.com"
                    className="contact-text text-foreground hover:text-foreground/80 transition-colors duration-300"
                    onClick={(e) => {
                      if (window.innerWidth < 768) {
                        e.preventDefault()
                        copyEmail()
                      }
                    }}
                  >
                    dosofisan7@gmail.com
                  </a>
                  <button
                    onClick={copyEmail}
                    className="text-foreground/40 hover:text-foreground/80 transition-colors duration-300"
                    aria-label="Copy email address"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    <span className="sr-only">Copy</span>
                  </button>
                  {emailCopied && <span className="meta-text text-foreground/60 ml-1">Copied</span>}
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="border-b border-foreground/10 pb-4">
              <div className="flex items-center justify-between">
                <span className="contact-label text-foreground/60">LinkedIn</span>
                <a
                  href="https://linkedin.com/in/damilareoo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-text text-foreground hover:text-foreground/80 transition-colors duration-300 flex items-center gap-2"
                >
                  linkedin.com/in/damilareoo
                  <ExternalLink className="h-3.5 w-3.5 opacity-50" />
                </a>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="border-b border-foreground/10 pb-4">
              <div className="flex items-center justify-between">
                <span className="contact-label text-foreground/60">GitHub</span>
                <a
                  href="https://github.com/damilareoo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-text text-foreground hover:text-foreground/80 transition-colors duration-300 flex items-center gap-2"
                >
                  github.com/damilareoo
                  <ExternalLink className="h-3.5 w-3.5 opacity-50" />
                </a>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="border-b border-foreground/10 pb-4">
              <div className="flex items-center justify-between">
                <span className="contact-label text-foreground/60">v0</span>
                <a
                  href="https://v0.app/@damilareoo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-text text-foreground hover:text-foreground/80 transition-colors duration-300 flex items-center gap-2"
                >
                  v0.app/@damilareoo
                  <ExternalLink className="h-3.5 w-3.5 opacity-50" />
                </a>
              </div>
            </motion.div>
          </div>

          <div className="space-y-8">
            <motion.div variants={itemVariants} className="border-b border-foreground/10 pb-4">
              <div className="flex items-center justify-between">
                <span className="contact-label text-foreground/60">Layers</span>
                <a
                  href="https://layers.to/damilareoo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-text text-foreground hover:text-foreground/80 transition-colors duration-300 flex items-center gap-2"
                >
                  layers.to/damilareoo
                  <ExternalLink className="h-3.5 w-3.5 opacity-50" />
                </a>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="border-b border-foreground/10 pb-4">
              <div className="flex items-center justify-between">
                <span className="contact-label text-foreground/60">Pinterest</span>
                <a
                  href="https://pinterest.com/damilareoo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-text text-foreground hover:text-foreground/80 transition-colors duration-300 flex items-center gap-2"
                >
                  pinterest.com/damilareoo
                  <ExternalLink className="h-3.5 w-3.5 opacity-50" />
                </a>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="border-b border-foreground/10 pb-4">
              <div className="flex items-center justify-between">
                <span className="contact-label text-foreground/60">Contra</span>
                <a
                  href="https://contra.com/damilareoo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-text text-foreground hover:text-foreground/80 transition-colors duration-300 flex items-center gap-2"
                >
                  contra.com/damilareoo
                  <ExternalLink className="h-3.5 w-3.5 opacity-50" />
                </a>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="border-b border-foreground/10 pb-4">
              <div className="flex items-center justify-between">
                <span className="contact-label text-foreground/60">Cosmos</span>
                <a
                  href="https://cosmos.so/damilareoo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-text text-foreground hover:text-foreground/80 transition-colors duration-300 flex items-center gap-2"
                >
                  cosmos.so/damilareoo
                  <ExternalLink className="h-3.5 w-3.5 opacity-50" />
                </a>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
