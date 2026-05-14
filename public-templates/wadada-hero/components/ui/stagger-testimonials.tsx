"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

const SQRT_5000 = Math.sqrt(5000)

// Running club testimonials data with randomly generated icons
const testimonials = [
  {
    tempId: 0,
    testimonial:
      "Wadada changed my life. From struggling to run 5 minutes to completing my first marathon, this community believed in me when I didn't believe in myself.",
    by: "Sarah Chen, Marathon Finisher",
    imgSrc: "https://api.dicebear.com/7.x/initials/svg?seed=SarahChen&backgroundColor=3b82f6&textColor=ffffff",
  },
  {
    tempId: 1,
    testimonial:
      "I was intimidated to join a running group, but Wadada welcomed me with open arms. Now I have lifelong friends and the confidence to chase any goal.",
    by: "Marcus Johnson, Trail Runner",
    imgSrc: "https://api.dicebear.com/7.x/initials/svg?seed=MarcusJohnson&backgroundColor=10b981&textColor=ffffff",
  },
  {
    tempId: 2,
    testimonial:
      "The energy at Wadada runs is infectious. Whether you're fast or slow, everyone cheers you on. It's not about competition—it's about community.",
    by: "Priya Patel, 5K Enthusiast",
    imgSrc: "https://api.dicebear.com/7.x/initials/svg?seed=PriyaPatel&backgroundColor=8b5cf6&textColor=ffffff",
  },
  {
    tempId: 3,
    testimonial:
      "After years of running alone, finding Wadada was a game-changer. The group runs pushed me to new personal bests I never thought possible.",
    by: "David Rodriguez, Speed Demon",
    imgSrc: "https://api.dicebear.com/7.x/initials/svg?seed=DavidRodriguez&backgroundColor=ef4444&textColor=ffffff",
  },
  {
    tempId: 4,
    testimonial:
      "Wadada taught me that running isn't just exercise—it's therapy, friendship, and adventure all rolled into one. This club saved my mental health.",
    by: "Emma Thompson, Mindful Runner",
    imgSrc: "https://api.dicebear.com/7.x/initials/svg?seed=EmmaThompson&backgroundColor=f59e0b&textColor=ffffff",
  },
  {
    tempId: 5,
    testimonial:
      "From couch to 10K in 6 months with Wadada's support. They meet you where you are and help you discover where you can go. Pure magic.",
    by: "James Wilson, Beginner Success",
    imgSrc: "https://api.dicebear.com/7.x/initials/svg?seed=JamesWilson&backgroundColor=6366f1&textColor=ffffff",
  },
  {
    tempId: 6,
    testimonial:
      "The sunrise runs with Wadada are spiritual experiences. There's something powerful about moving together as the world wakes up around us.",
    by: "Aisha Mohammed, Dawn Patrol",
    imgSrc: "https://api.dicebear.com/7.x/initials/svg?seed=AishaMohammed&backgroundColor=ec4899&textColor=ffffff",
  },
  {
    tempId: 7,
    testimonial:
      "I joined Wadada after moving to a new city. Not only did I find my running tribe, but I found my chosen family. Movement truly is lifestyle here.",
    by: "Alex Kim, Community Builder",
    imgSrc: "https://api.dicebear.com/7.x/initials/svg?seed=AlexKim&backgroundColor=06b6d4&textColor=ffffff",
  },
  {
    tempId: 8,
    testimonial:
      "Wadada celebrates every victory, no matter how small. My first mile felt like winning the Olympics with this crew cheering me on.",
    by: "Lisa Garcia, First Mile Hero",
    imgSrc: "https://api.dicebear.com/7.x/initials/svg?seed=LisaGarcia&backgroundColor=f97316&textColor=ffffff",
  },
  {
    tempId: 9,
    testimonial:
      "The training plans at Wadada are incredible. I went from barely finishing a 5K to qualifying for Boston in just two years.",
    by: "Michael Chen, Boston Qualifier",
    imgSrc: "https://api.dicebear.com/7.x/initials/svg?seed=MichaelChen&backgroundColor=84cc16&textColor=ffffff",
  },
  {
    tempId: 10,
    testimonial:
      "What I love about Wadada is the diversity. Runners of all ages, backgrounds, and abilities come together with one shared passion.",
    by: "Sofia Rodriguez, Diversity Champion",
    imgSrc: "https://api.dicebear.com/7.x/initials/svg?seed=SofiaRodriguez&backgroundColor=a855f7&textColor=ffffff",
  },
  {
    tempId: 11,
    testimonial:
      "The accountability at Wadada is unmatched. When you know your running family is waiting for you, you show up no matter what.",
    by: "Tyler Brooks, Consistency King",
    imgSrc: "https://api.dicebear.com/7.x/initials/svg?seed=TylerBrooks&backgroundColor=059669&textColor=ffffff",
  },
  {
    tempId: 12,
    testimonial:
      "Wadada's trail running group introduced me to the most beautiful places I never knew existed. Running became my way to explore the world.",
    by: "Nina Patel, Trail Explorer",
    imgSrc: "https://api.dicebear.com/7.x/initials/svg?seed=NinaPatel&backgroundColor=0ea5e9&textColor=ffffff",
  },
  {
    tempId: 13,
    testimonial:
      "The post-run conversations at Wadada are as valuable as the runs themselves. We solve the world's problems one mile at a time.",
    by: "Robert Kim, Philosophy Runner",
    imgSrc: "https://api.dicebear.com/7.x/initials/svg?seed=RobertKim&backgroundColor=dc2626&textColor=ffffff",
  },
  {
    tempId: 14,
    testimonial:
      "I never thought I'd be a runner, but Wadada's beginner-friendly approach made it possible. Now I can't imagine life without running.",
    by: "Jessica Martinez, Late Bloomer",
    imgSrc: "https://api.dicebear.com/7.x/initials/svg?seed=JessicaMartinez&backgroundColor=7c3aed&textColor=ffffff",
  },
  {
    tempId: 15,
    testimonial:
      "The injury support at Wadada is incredible. When I was sidelined, they kept me motivated and helped me come back stronger.",
    by: "Daniel Park, Comeback Story",
    imgSrc: "https://api.dicebear.com/7.x/initials/svg?seed=DanielPark&backgroundColor=ea580c&textColor=ffffff",
  },
  {
    tempId: 16,
    testimonial:
      "Wadada's charity runs give our miles meaning. We're not just running for ourselves, we're running to make a difference.",
    by: "Rachel Green, Charity Champion",
    imgSrc: "https://api.dicebear.com/7.x/initials/svg?seed=RachelGreen&backgroundColor=16a34a&textColor=ffffff",
  },
  {
    tempId: 17,
    testimonial:
      "The technique workshops at Wadada transformed my running form. I'm faster and injury-free thanks to their expert guidance.",
    by: "Kevin Wong, Form Perfectionist",
    imgSrc: "https://api.dicebear.com/7.x/initials/svg?seed=KevinWong&backgroundColor=2563eb&textColor=ffffff",
  },
  {
    tempId: 18,
    testimonial:
      "Wadada's virtual runs during lockdown kept me sane. Even when we couldn't run together, we stayed connected as a community.",
    by: "Amanda Foster, Virtual Warrior",
    imgSrc: "https://api.dicebear.com/7.x/initials/svg?seed=AmandaFoster&backgroundColor=be185d&textColor=ffffff",
  },
  {
    tempId: 19,
    testimonial:
      "The mentorship at Wadada is life-changing. Experienced runners take newcomers under their wing and share their wisdom generously.",
    by: "Carlos Mendez, Grateful Mentee",
    imgSrc: "https://api.dicebear.com/7.x/initials/svg?seed=CarlosMendez&backgroundColor=0891b2&textColor=ffffff",
  },
]

interface TestimonialCardProps {
  position: number
  testimonial: (typeof testimonials)[0]
  handleMove: (steps: number) => void
  cardSize: number
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ position, testimonial, handleMove, cardSize }) => {
  const isCenter = position === 0
  return (
    <div
      onClick={() => handleMove(position)}
      className={cn(
        "absolute left-1/2 top-1/2 cursor-pointer border-2 p-8 transition-all duration-500 ease-in-out",
        isCenter
          ? "z-10 bg-gray-900 text-white border-gray-900"
          : "z-0 bg-white text-gray-900 border-gray-200 hover:border-gray-400",
      )}
      style={{
        width: cardSize,
        height: cardSize,
        clipPath: `polygon(50px 0%, calc(100% - 50px) 0%, 100% 50px, 100% 100%, calc(100% - 50px) 100%, 50px 100%, 0 100%, 0 0)`,
        transform: `
          translate(-50%, -50%) 
          translateX(${(cardSize / 1.5) * position}px)
          translateY(${isCenter ? -65 : position % 2 ? 15 : -15}px)
          rotate(${isCenter ? 0 : position % 2 ? 2.5 : -2.5}deg)
        `,
        boxShadow: isCenter ? "0px 8px 0px 4px hsl(var(--border))" : "0px 0px 0px 0px transparent",
      }}
    >
      <span
        className="absolute block origin-top-right rotate-45 bg-gray-300"
        style={{
          right: -2,
          top: 48,
          width: SQRT_5000,
          height: 2,
        }}
      />
      <img
        src={testimonial.imgSrc || "/placeholder.svg"}
        alt={`${testimonial.by.split(",")[0]}`}
        className="mb-4 h-14 w-12 bg-gray-100 object-cover object-top"
        style={{
          boxShadow: "3px 3px 0px hsl(var(--background))",
        }}
      />
      <h3 className={cn("text-base sm:text-xl font-medium", isCenter ? "text-white" : "text-gray-900")}>
        "{testimonial.testimonial}"
      </h3>
      <p
        className={cn(
          "absolute bottom-8 left-8 right-8 mt-2 text-sm italic",
          isCenter ? "text-gray-300" : "text-gray-600",
        )}
      >
        - {testimonial.by}
      </p>
    </div>
  )
}

export const StaggerTestimonials: React.FC = () => {
  const [cardSize, setCardSize] = useState(365)
  const [testimonialsList, setTestimonialsList] = useState(testimonials)

  const handleMove = (steps: number) => {
    const newList = [...testimonialsList]
    if (steps > 0) {
      for (let i = steps; i > 0; i--) {
        const item = newList.shift()
        if (!item) return
        newList.push({ ...item, tempId: Math.random() })
      }
    } else {
      for (let i = steps; i < 0; i++) {
        const item = newList.pop()
        if (!item) return
        newList.unshift({ ...item, tempId: Math.random() })
      }
    }
    setTestimonialsList(newList)
  }

  useEffect(() => {
    const updateSize = () => {
      const { matches } = window.matchMedia("(min-width: 640px)")
      setCardSize(matches ? 365 : 290)
    }
    updateSize()
    window.addEventListener("resize", updateSize)
    return () => window.removeEventListener("resize", updateSize)
  }, [])

  return (
    <div className="relative w-full overflow-hidden bg-white" style={{ height: 600 }}>
      {testimonialsList.map((testimonial, index) => {
        const position =
          testimonialsList.length % 2 ? index - (testimonialsList.length + 1) / 2 : index - testimonialsList.length / 2
        return (
          <TestimonialCard
            key={testimonial.tempId}
            testimonial={testimonial}
            handleMove={handleMove}
            position={position}
            cardSize={cardSize}
          />
        )
      })}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        <button
          onClick={() => handleMove(-1)}
          className={cn(
            "flex h-14 w-14 items-center justify-center text-2xl transition-colors",
            "bg-white border-2 border-gray-300 hover:bg-gray-900 hover:text-white",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2",
          )}
          aria-label="Previous testimonial"
        >
          <ChevronLeft />
        </button>
        <button
          onClick={() => handleMove(1)}
          className={cn(
            "flex h-14 w-14 items-center justify-center text-2xl transition-colors",
            "bg-white border-2 border-gray-300 hover:bg-gray-900 hover:text-white",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2",
          )}
          aria-label="Next testimonial"
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  )
}
