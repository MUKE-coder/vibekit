"use client"

import HeroSection from "../hero-section"
import { TextGradientScroll } from "@/components/ui/text-gradient-scroll"
import { Timeline } from "@/components/ui/timeline"
import "./globals.css"
import { StaggerTestimonials } from "@/components/ui/stagger-testimonials"
import { motion } from "framer-motion"
import SmoothScrollHero from "@/components/ui/smooth-scroll-hero"
import Chatbot from "../components/chatbot"

export default function Page() {
  const missionStatement =
    "At Wadada Run Club, we believe movement isn't an option, it's a lifestyle. Born from the vibrant spirit of Jamaica, we unite runners from every corner of the globe who share our passion for pushing boundaries. Whether you're chasing sunrise through Kingston streets or conquering mountain trails, we're here to fuel your journey. Our community thrives on the rhythm of footsteps, the power of perseverance, and the joy of shared victories. Join us as we run not just for fitness, but for freedom, friendship, and the pure love of movement."

  const timelineEntries = [
    {
      id: 1,
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-RJ3iTXUn5SUexF6nHMZYhMoQLNCboK.png",
      alt: "Woman runner in artistic motion blur",
      title: "Every Step Counts",
      description:
        "From your first jog around the block to your hundredth marathon, every runner has a story. At Wadada, we celebrate beginners who are just lacing up their shoes for the first time. Your pace doesn't matter—your passion does. What are you waiting for?",
      layout: "left" as const,
    },
    {
      id: 2,
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-LN9OPh9hw0b9rwSPRSslHoejcfoKHe.png",
      alt: "Male runner with determination and focus",
      title: "Find Your Rhythm",
      description:
        "Whether you're chasing personal records or simply chasing the sunrise, our community embraces every type of runner. From speed demons to mindful joggers, from trail blazers to track stars—there's a place for you here. The only question is: what are you waiting for?",
      layout: "right" as const,
    },
    {
      id: 3,
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-1FdGyjVpWQANGzsDWpoPIvF5SVI2za.png",
      alt: "Runner in dynamic motion showing strength and grace",
      title: "Join the Movement",
      description:
        "Running isn't just about the miles—it's about the moments. The early morning conversations, the shared struggles, the collective victories. At Wadada Run Club, you're not just joining a group, you're joining a family. So lace up, step out, and discover what you're truly capable of. Seriously, what are you waiting for?",
      layout: "left" as const,
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <HeroSection />

      {/* Mission Statement Section with Grid Background */}
      <section id="mission" className="relative min-h-screen flex items-center justify-center py-20 bg-white">
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 bg-grid-subtle opacity-30 pointer-events-none" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-6xl font-black tracking-wider mb-12 text-gray-900">OUR MISSION</h2>
            <TextGradientScroll
              text={missionStatement}
              className="text-2xl md:text-3xl lg:text-4xl font-medium leading-relaxed text-gray-800"
              type="word"
              textOpacity="soft"
            />
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section id="community" className="relative py-20 bg-white">
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 bg-grid-subtle opacity-30 pointer-events-none" />

        <div className="relative z-10">
          <div className="container mx-auto px-6 mb-16">
            <div className="text-center">
              <h2 className="text-4xl md:text-6xl font-black tracking-wider mb-6 text-gray-900">ALL RUNNERS WELCOME</h2>
              <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
                Every runner has a unique journey. Here are just a few stories from our inclusive community.
              </p>
            </div>
          </div>

          <Timeline entries={timelineEntries} />
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="relative py-20 bg-white">
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

      {/* Smooth Scroll Hero with CTA Overlay */}
      <section id="join" className="relative">
        <SmoothScrollHero
          scrollHeight={2500}
          desktopImage="/images/runners-motion-blur.png"
          mobileImage="/images/runners-motion-blur.png"
          initialClipPercentage={30}
          finalClipPercentage={70}
        />
      </section>
      <Chatbot />
    </div>
  )
}
