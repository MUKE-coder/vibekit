"use client"

import { StaggerTestimonials } from "@/components/ui/stagger-testimonials"
import { motion } from "framer-motion"

export default function TestimonialsSection() {
  return (
    <section className="relative py-20 bg-white">
      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-grid-subtle opacity-30 pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-black tracking-wider text-gray-900 mb-6">
            See what our{" "}
            <span className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">RUNNERS</span>{" "}
            say.
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-12">
            Real stories from real runners who found their stride with Wadada Run Club.
          </p>
        </motion.div>

        <StaggerTestimonials />
      </div>
    </section>
  )
}
