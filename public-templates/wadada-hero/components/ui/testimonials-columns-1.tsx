"use client"

import React from "react"
import { motion } from "framer-motion"

export const TestimonialsColumn = (props: {
  className?: string
  testimonials: typeof testimonials
  duration?: number
}) => {
  return (
    <div className={props.className}>
      <motion.div
        animate={{
          translateY: "-50%",
        }}
        transition={{
          duration: props.duration || 10,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6 bg-background"
      >
        {[
          ...new Array(2).fill(0).map((_, index) => (
            <React.Fragment key={index}>
              {props.testimonials.map(({ text, image, name, role }, i) => (
                <div className="p-8 rounded-2xl border border-gray-200 shadow-lg max-w-sm w-full bg-white" key={i}>
                  <div className="text-lg leading-relaxed text-gray-800 font-medium">{text}</div>
                  <div className="flex items-center gap-3 mt-6">
                    <img
                      width={48}
                      height={48}
                      src={image || "/placeholder.svg"}
                      alt={name}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                    <div className="flex flex-col">
                      <div className="font-bold tracking-tight leading-5 text-gray-900">{name}</div>
                      <div className="leading-5 text-gray-600 tracking-tight text-sm">{role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </React.Fragment>
          )),
        ]}
      </motion.div>
    </div>
  )
}

// Running club testimonials data
const testimonials = [
  {
    text: "Wadada changed my life. From struggling to run 5 minutes to completing my first marathon, this community believed in me when I didn't believe in myself.",
    image: "/placeholder.svg?height=48&width=48",
    name: "Sarah Chen",
    role: "Marathon Finisher",
  },
  {
    text: "I was intimidated to join a running group, but Wadada welcomed me with open arms. Now I have lifelong friends and the confidence to chase any goal.",
    image: "/placeholder.svg?height=48&width=48",
    name: "Marcus Johnson",
    role: "Trail Runner",
  },
  {
    text: "The energy at Wadada runs is infectious. Whether you're fast or slow, everyone cheers you on. It's not about competition—it's about community.",
    image: "/placeholder.svg?height=48&width=48",
    name: "Priya Patel",
    role: "5K Enthusiast",
  },
  {
    text: "After years of running alone, finding Wadada was a game-changer. The group runs pushed me to new personal bests I never thought possible.",
    image: "/placeholder.svg?height=48&width=48",
    name: "David Rodriguez",
    role: "Speed Demon",
  },
  {
    text: "Wadada taught me that running isn't just exercise—it's therapy, friendship, and adventure all rolled into one. This club saved my mental health.",
    image: "/placeholder.svg?height=48&width=48",
    name: "Emma Thompson",
    role: "Mindful Runner",
  },
  {
    text: "From couch to 10K in 6 months with Wadada's support. They meet you where you are and help you discover where you can go. Pure magic.",
    image: "/placeholder.svg?height=48&width=48",
    name: "James Wilson",
    role: "Beginner Success",
  },
  {
    text: "The sunrise runs with Wadada are spiritual experiences. There's something powerful about moving together as the world wakes up around us.",
    image: "/placeholder.svg?height=48&width=48",
    name: "Aisha Mohammed",
    role: "Dawn Patrol",
  },
  {
    text: "I joined Wadada after moving to a new city. Not only did I find my running tribe, but I found my chosen family. Movement truly is lifestyle here.",
    image: "/placeholder.svg?height=48&width=48",
    name: "Alex Kim",
    role: "Community Builder",
  },
  {
    text: "Wadada celebrates every victory, no matter how small. My first mile felt like winning the Olympics with this crew cheering me on.",
    image: "/placeholder.svg?height=48&width=48",
    name: "Lisa Garcia",
    role: "First Mile Hero",
  },
]

export { testimonials }
