"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ProductCard } from "./product-card"
import { QuickLookModal } from "./quick-look-modal"
import { Reveal } from "./reveal"

const featuredProducts = [
  {
    id: "4",
    name: "Verde Modular Chair",
    price: "€4,890",
    image: "/green-velvet-modular-chair.png",
    badge: "New" as const,
    materials: ["Copper Frame", "Premium Velvet"],
    swatches: [
      { name: "Forest Green", color: "#355E3B" },
      { name: "Sage Green", color: "#9CAF88" },
      { name: "Copper", color: "#B87333" },
    ],
    quickLookImages: [
      "/green-velvet-modular-chair.png",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
    ],
    dimensions: "W: 180cm × D: 90cm × H: 75cm",
  },
  {
    id: "7",
    name: "Terracotta Cloud Chair",
    price: "€5,250",
    image: "/terracotta-cloud-chair.png",
    badge: "New" as const,
    materials: ["Copper Frame", "Terracotta Velvet"],
    swatches: [
      { name: "Terracotta", color: "#E2725B" },
      { name: "Burnt Orange", color: "#CC5500" },
      { name: "Copper", color: "#B87333" },
    ],
    quickLookImages: [
      "/terracotta-cloud-chair.png",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
    ],
    dimensions: "W: 95cm × D: 85cm × H: 80cm",
  },
  {
    id: "8",
    name: "Sage Copper Lounge",
    price: "€4,675",
    image: "/sage-copper-lounge-chair.png",
    badge: "Limited" as const,
    materials: ["Copper Frame", "Sage Velvet"],
    swatches: [
      { name: "Sage Green", color: "#9CAF88" },
      { name: "Forest Green", color: "#355E3B" },
      { name: "Copper", color: "#B87333" },
    ],
    quickLookImages: [
      "/sage-copper-lounge-chair.png",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
    ],
    dimensions: "W: 85cm × D: 90cm × H: 75cm",
  },
]

export function FeaturedProducts() {
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleQuickLook = (product: any) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedProduct(null)
  }

  return (
    <section className="py-20 lg:py-32" id="featured-products">
      <div className="container-custom">
        <Reveal>
          <div className="text-left mb-16">
            <h2 className="text-4xl text-neutral-900 mb-4 lg:text-6xl">
              Featured <span className="italic font-light">Collection</span>
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl">
              Discover our most beloved pieces, each crafted with meticulous attention to detail and timeless design
              principles.
            </p>
          </div>
        </Reveal>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.3,
              },
            },
          }}
        >
          {featuredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.8,
                    ease: [0.21, 0.47, 0.32, 0.98],
                  },
                },
              }}
            >
              <Reveal delay={index * 0.1}>
                <ProductCard product={product} onQuickLook={handleQuickLook} />
              </Reveal>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <QuickLookModal product={selectedProduct} isOpen={isModalOpen} onClose={closeModal} />
    </section>
  )
}
