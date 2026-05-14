"use client"

import { LiquidButton } from "@/components/ui/liquid-glass-button"
import { motion } from "framer-motion"
import { MapPin, Users, Calendar, Trophy } from "lucide-react"

export default function CTASection() {
  return (
    <section className="relative py-32 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-grid-subtle opacity-20 pointer-events-none" />

      {/* Background Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-gray-900/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-gray-900/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* Main CTA Heading */}
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-wider mb-6 text-gray-900 leading-none">
            READY TO
            <br />
            <span className="bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent">
              RUN WITH US?
            </span>
          </h2>

          {/* Supporting Text */}
          <p className="text-xl md:text-2xl lg:text-3xl text-gray-700 mb-12 leading-relaxed font-medium">
            Join thousands of runners worldwide who've found their tribe,
            <br className="hidden md:block" />
            pushed their limits, and discovered what they're truly capable of.
          </p>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16"
          >
            <div className="text-center">
              <div className="flex justify-center mb-3">
                <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="text-3xl md:text-4xl font-black text-gray-900 mb-1">50K+</div>
              <div className="text-sm md:text-base text-gray-600 font-medium">Global Runners</div>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-3">
                <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="text-3xl md:text-4xl font-black text-gray-900 mb-1">120+</div>
              <div className="text-sm md:text-base text-gray-600 font-medium">Cities Worldwide</div>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-3">
                <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="text-3xl md:text-4xl font-black text-gray-900 mb-1">365</div>
              <div className="text-sm md:text-base text-gray-600 font-medium">Days of Running</div>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-3">
                <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="text-3xl md:text-4xl font-black text-gray-900 mb-1">10K+</div>
              <div className="text-sm md:text-base text-gray-600 font-medium">Goals Achieved</div>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="flex justify-center"
          >
            <LiquidButton
              size="xxl"
              className="font-bold text-xl tracking-wide px-12 py-4 bg-gray-900 hover:bg-gray-800 text-white border-2 border-gray-900 hover:scale-105 transition-all duration-300"
            >
              JOIN WADADA NOW
            </LiquidButton>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
            className="mt-16 pt-8 border-t border-gray-200"
          >
            <p className="text-sm text-gray-500 mb-4 font-medium">TRUSTED BY RUNNERS WORLDWIDE</p>
            <div className="flex flex-wrap justify-center items-center gap-8 text-gray-400">
              <span className="text-sm font-semibold">🏃‍♀️ BEGINNER FRIENDLY</span>
              <span className="text-sm font-semibold">🌍 GLOBAL COMMUNITY</span>
              <span className="text-sm font-semibold">🏆 PROVEN RESULTS</span>
              <span className="text-sm font-semibold">💯 FREE TO JOIN</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
