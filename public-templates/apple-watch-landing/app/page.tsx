"use client"

import type React from "react"
import { useEffect } from "react"
import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

const productImages = [
  "/apple-watch-se-with-midnight-aluminum-case-and-spo.png",
  "/apple-watch-se-side-view-with-midnight-band.png",
  "/apple-watch-se-back-view-showing-sensors.png",
  "/apple-watch-se-display-showing-fitness-app.png",
  "/apple-watch-se-charging-with-magnetic-charger.png",
]

const colorOptions = [
  { name: "colors.midnight", value: "midnight", color: "#1d1d1f" },
  { name: "colors.starlight", value: "starlight", color: "#faf0e6" },
  { name: "colors.silver", value: "silver", color: "#e3e4e6" },
]

interface Review {
  id: number
  name: string
  rating: number
  comment: string
  date: string
  verified: boolean
}

interface NewReview {
  name: string
  rating: number
  comment: string
}

const initialReviews: Review[] = [
  {
    id: 1,
    name: "Sarah K.",
    rating: 5,
    comment:
      "Perfect smartwatch for daily use! The fitness tracking is incredibly accurate and I love how it motivates me to stay active. The battery life is excellent too.",
    date: "2024-12-15",
    verified: true,
  },
  {
    id: 2,
    name: "Ahmed B.",
    rating: 4,
    comment:
      "Great value, love the crash detection feature. It gives me peace of mind when I'm driving. The heart rate monitor is also very reliable during workouts.",
    date: "2024-12-10",
    verified: true,
  },
  {
    id: 3,
    name: "Maria L.",
    rating: 5,
    comment:
      "Amazing watch! The sleep tracking has helped me understand my sleep patterns better. The interface is intuitive and the build quality feels premium.",
    date: "2024-12-08",
    verified: true,
  },
  {
    id: 4,
    name: "James R.",
    rating: 4,
    comment:
      "Solid smartwatch with great features. The GPS is accurate for my runs and the notifications are helpful. Only wish the screen was slightly larger.",
    date: "2024-12-05",
    verified: true,
  },
]

export default function HomePage() {
  const { t, isRTL } = useLanguage()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [selectedColor, setSelectedColor] = useState("midnight")
  const [reviews, setReviews] = useState<Review[]>(initialReviews)
  const [newReview, setNewReview] = useState<NewReview>({
    name: "",
    rating: 0,
    comment: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isVerifiedBuyer, setIsVerifiedBuyer] = useState(false)

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % productImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length)
  }

  const renderStars = (rating: number, interactive = false, onRatingChange?: (rating: number) => void) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            } ${interactive ? "cursor-pointer hover:text-yellow-400" : ""}`}
            onClick={interactive && onRatingChange ? () => onRatingChange(star) : undefined}
          />
        ))}
      </div>
    )
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isVerifiedBuyer) {
      alert(t("reviews.verifiedOnly"))
      return
    }

    if (!newReview.name.trim() || !newReview.comment.trim() || newReview.rating === 0) {
      alert("Please fill in all fields and select a rating.")
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const review: Review = {
      id: reviews.length + 1,
      name: newReview.name,
      rating: newReview.rating,
      comment: newReview.comment,
      date: new Date().toISOString().split("T")[0],
      verified: true,
    }

    setReviews((prev) => [review, ...prev])
    setNewReview({ name: "", rating: 0, comment: "" })
    setIsSubmitting(false)

    alert("Thank you for your review!")
  }

  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length

  useEffect(() => {
    if (typeof window !== "undefined") {
      const verified = localStorage.getItem("verifiedBuyer") === "true"
      setIsVerifiedBuyer(verified)
    }
  }, [])

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-background py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="flex justify-center lg:justify-start">
              <div className="relative">
                {/* Main Product Image */}
                <div className="relative w-80 h-80 lg:w-96 lg:h-96">
                  <img
                    src={productImages[currentImageIndex] || "/placeholder.svg"}
                    alt={t("hero.title")}
                    className="w-full h-full object-contain"
                  />

                  {/* Gallery Navigation */}
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-colors"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-colors"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                {/* Image Indicators */}
                <div className="flex justify-center space-x-2 mt-4">
                  {productImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentImageIndex ? "bg-accent" : "bg-gray-300"
                      }`}
                      aria-label={`View image ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div className={`text-center lg:text-${isRTL ? "right" : "left"}`}>
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">{t("hero.title")}</h1>
              <p className="text-lg text-muted-foreground mb-2">{t("hero.subtitle")}</p>
              <p className="text-xl text-foreground mb-6 text-pretty">{t("hero.description")}</p>

              <div className="mb-6">
                <div className="flex items-center justify-center lg:justify-start space-x-4">
                  <span className="text-2xl text-muted-foreground line-through">{t("hero.oldPrice")}</span>
                  <span className="text-4xl font-bold text-accent">{t("hero.newPrice")}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">Limited time offer - Save $50!</p>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-semibold text-foreground mb-4">{t("colors.title")}</h3>
                <div className="flex justify-center lg:justify-start space-x-4">
                  {colorOptions.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setSelectedColor(color.value)}
                      className={`relative w-12 h-12 rounded-full border-2 transition-all ${
                        selectedColor === color.value
                          ? "border-accent scale-110"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                      style={{ backgroundColor: color.color }}
                      aria-label={t(color.name)}
                    >
                      {selectedColor === color.value && (
                        <div className="absolute inset-0 rounded-full border-2 border-white" />
                      )}
                    </button>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Selected: {t(colorOptions.find((c) => c.value === selectedColor)?.name || "colors.midnight")}
                </p>
              </div>

              <Link href="/checkout">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-3 text-lg">
                  {t("hero.buyNow")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Product Description Section */}
      <section className="py-16 lg:py-24 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6 text-balance">
                {t("product.description.title")}
              </h2>
              <p className="text-lg text-muted-foreground mb-8 text-pretty leading-relaxed">
                {t("product.description.text")}
              </p>

              {/* Key Features List */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <span className="text-foreground">Advanced fitness and sleep tracking</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <span className="text-foreground">Crash Detection and Emergency SOS</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <span className="text-foreground">Built-in GPS and cellular connectivity</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <span className="text-foreground">Water resistant to 50 meters</span>
                </div>
              </div>
            </div>

            {/* Inline Product Images */}
            <div className="grid grid-cols-2 gap-4">
              <img
                src="/apple-watch-se-fitness-tracking-interface.png"
                alt="Fitness tracking"
                className="w-full h-48 object-cover rounded-lg"
              />
              <img
                src="/apple-watch-se-heart-rate-monitoring.png"
                alt="Heart rate monitoring"
                className="w-full h-48 object-cover rounded-lg"
              />
              <img
                src="/apple-watch-se-gps-navigation.png"
                alt="GPS navigation"
                className="w-full h-48 object-cover rounded-lg"
              />
              <img
                src="/apple-watch-se-water-resistance.png"
                alt="Water resistance"
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="py-16 lg:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Reviews Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4 text-balance">{t("reviews.title")}</h2>
            <div className="flex items-center justify-center space-x-4">
              <div className="flex items-center space-x-2">
                {renderStars(Math.round(averageRating))}
                <span className="text-lg font-semibold">{averageRating.toFixed(1)}</span>
                <span className="text-muted-foreground">({reviews.length} reviews)</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Reviews List */}
            <div className="lg:col-span-2 space-y-6">
              {reviews.map((review) => (
                <Card key={review.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-foreground">{review.name}</h3>
                          {review.verified && (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                              Verified Buyer
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{new Date(review.date).toLocaleDateString()}</p>
                      </div>
                      {renderStars(review.rating)}
                    </div>
                    <p className="text-foreground text-pretty">{review.comment}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Add Review Form */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle>{t("reviews.writeReview")}</CardTitle>
                </CardHeader>
                <CardContent>
                  {!isVerifiedBuyer ? (
                    <div className="text-center p-6">
                      <p className="text-muted-foreground mb-4">{t("reviews.verifiedOnly")}</p>
                      <Link href="/checkout">
                        <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                          {t("hero.buyNow")}
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmitReview} className="space-y-4">
                      {/* Name */}
                      <div>
                        <Label htmlFor="reviewName">{t("reviews.yourName")}</Label>
                        <Input
                          id="reviewName"
                          type="text"
                          value={newReview.name}
                          onChange={(e) => setNewReview((prev) => ({ ...prev, name: e.target.value }))}
                          placeholder={t("reviews.yourName")}
                          required
                        />
                      </div>

                      {/* Rating */}
                      <div>
                        <Label>{t("reviews.rating")}</Label>
                        <div className="mt-2">
                          {renderStars(newReview.rating, true, (rating) =>
                            setNewReview((prev) => ({ ...prev, rating })),
                          )}
                        </div>
                      </div>

                      {/* Comment */}
                      <div>
                        <Label htmlFor="reviewComment">{t("reviews.yourReview")}</Label>
                        <Textarea
                          id="reviewComment"
                          value={newReview.comment}
                          onChange={(e) => setNewReview((prev) => ({ ...prev, comment: e.target.value }))}
                          placeholder={t("reviews.placeholder")}
                          rows={4}
                          required
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? t("reviews.submitting") : t("reviews.submit")}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-muted">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4 text-balance">{t("cta.title")}</h2>
          <p className="text-lg text-muted-foreground mb-8 text-pretty">{t("cta.description")}</p>
          <Link href="/checkout">
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-3 text-lg">
              {t("cta.button")}
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
