"use client"

import { motion } from "framer-motion"
import { HeroSection } from "@/components/hero-section"
import { WorkSection } from "@/components/work-section"
import { AboutSection } from "@/components/about-section"
import { ContactSection } from "@/components/contact-section"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { CustomCursor } from "@/components/custom-cursor"
import { SmoothScrollProvider, SectionTransition } from "@/components/smooth-scroll-provider"

export default function Home() {
  return (
    <SmoothScrollProvider>
      <motion.main
        className="min-h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1.0] }}
      >
        <CustomCursor />
        <Navbar />

        <section id="hero">
          <SectionTransition id="hero">
            <HeroSection />
          </SectionTransition>
        </section>

        <section id="work">
          <SectionTransition id="work">
            <WorkSection />
          </SectionTransition>
        </section>

        <section id="about">
          <SectionTransition id="about">
            <AboutSection />
          </SectionTransition>
        </section>

        <section id="across-the-web">
          <SectionTransition id="across-the-web">
            <ContactSection />
          </SectionTransition>
        </section>

        <Footer />
      </motion.main>
    </SmoothScrollProvider>
  )
}
