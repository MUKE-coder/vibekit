"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Minus, Plus, CheckCircle } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useLanguage } from "@/contexts/language-context"

interface FormData {
  fullName: string
  email: string
  phone: string
  address: string
  quantity: number
  paymentMethod: string
}

interface FormErrors {
  fullName?: string
  email?: string
  phone?: string
  address?: string
  paymentMethod?: string
}

export default function CheckoutPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { t } = useLanguage()
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    quantity: 1,
    paymentMethod: "",
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
  const [selectedColor, setSelectedColor] = useState("midnight")

  useEffect(() => {
    const color = searchParams.get("color") || "midnight"
    setSelectedColor(color)
  }, [searchParams])

  const originalPrice = 299
  const discountedPrice = 249
  const discount = originalPrice - discountedPrice
  const subtotal = discountedPrice * formData.quantity
  const totalPrice = subtotal

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required"
    } else if (!/^\+?[\d\s\-()]+$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number"
    }

    if (!formData.address.trim()) {
      newErrors.address = "Delivery address is required"
    }

    if (!formData.paymentMethod) {
      newErrors.paymentMethod = "Please select a payment method"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    if (typeof window !== "undefined") {
      localStorage.setItem("verifiedBuyer", "true")
    }
    setOrderComplete(true)
    setIsSubmitting(false)
  }

  const updateQuantity = (change: number) => {
    setFormData((prev) => ({
      ...prev,
      quantity: Math.max(1, prev.quantity + change),
    }))
  }

  const getColorName = (color: string) => {
    const colorMap: { [key: string]: string } = {
      midnight: t("colors.midnight"),
      starlight: t("colors.starlight"),
      silver: t("colors.silver"),
    }
    return colorMap[color] || t("colors.midnight")
  }

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="text-center">
            <CardContent className="p-8">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-foreground mb-4">Order Confirmed!</h1>
              <p className="text-lg text-muted-foreground mb-6">
                Thank you for your purchase! Your Apple Watch SE will be shipped to your address within 2-3 business
                days.
              </p>

              <div className="bg-muted p-4 rounded-lg mb-6">
                <h3 className="font-semibold text-foreground mb-2">Order Details</h3>
                <p className="text-sm text-muted-foreground">Apple Watch SE - {getColorName(selectedColor)}</p>
                <p className="text-sm text-muted-foreground">Quantity: {formData.quantity}</p>
                <p className="text-sm text-muted-foreground">Total: ${totalPrice}</p>
              </div>

              <div className="bg-green-50 border border-green-200 p-4 rounded-lg mb-6">
                <p className="text-sm text-green-800 font-medium">
                  🎉 You're now a verified buyer! You can leave reviews and help other customers make informed
                  decisions.
                </p>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={() => router.push("/#reviews")}
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                >
                  Leave a Review
                </Button>
                <Button variant="outline" onClick={() => router.push("/")} className="w-full">
                  Continue Shopping
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground text-balance">{t("checkout.title")}</h1>
          <p className="text-muted-foreground mt-2">Complete your order for the Apple Watch SE</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Shipping & Payment Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Full Name */}
                  <div>
                    <Label htmlFor="fullName">{t("checkout.fullName")} *</Label>
                    <Input
                      id="fullName"
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData((prev) => ({ ...prev, fullName: e.target.value }))}
                      className={errors.fullName ? "border-destructive" : ""}
                      placeholder={t("checkout.fullName")}
                    />
                    {errors.fullName && <p className="text-sm text-destructive mt-1">{errors.fullName}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <Label htmlFor="email">{t("checkout.email")} *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                      className={errors.email ? "border-destructive" : ""}
                      placeholder={t("checkout.email")}
                    />
                    {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
                  </div>

                  {/* Phone Number */}
                  <div>
                    <Label htmlFor="phone">{t("checkout.phone")} *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                      className={errors.phone ? "border-destructive" : ""}
                      placeholder={t("checkout.phone")}
                    />
                    {errors.phone && <p className="text-sm text-destructive mt-1">{errors.phone}</p>}
                  </div>

                  {/* Delivery Address */}
                  <div>
                    <Label htmlFor="address">{t("checkout.address")} *</Label>
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                      className={errors.address ? "border-destructive" : ""}
                      placeholder={t("checkout.address")}
                      rows={3}
                    />
                    {errors.address && <p className="text-sm text-destructive mt-1">{errors.address}</p>}
                  </div>

                  {/* Quantity */}
                  <div>
                    <Label>{t("checkout.quantity")}</Label>
                    <div className="flex items-center space-x-3 mt-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(-1)}
                        disabled={formData.quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="text-lg font-medium w-8 text-center">{formData.quantity}</span>
                      <Button type="button" variant="outline" size="sm" onClick={() => updateQuantity(1)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div>
                    <Label htmlFor="paymentMethod">{t("checkout.paymentMethod")} *</Label>
                    <Select
                      value={formData.paymentMethod}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, paymentMethod: value }))}
                    >
                      <SelectTrigger className={errors.paymentMethod ? "border-destructive" : ""}>
                        <SelectValue placeholder={t("checkout.paymentMethod")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="credit-card">{t("checkout.creditCard")}</SelectItem>
                        <SelectItem value="paypal">{t("checkout.paypal")}</SelectItem>
                        <SelectItem value="cash-on-delivery">{t("checkout.cashOnDelivery")}</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.paymentMethod && <p className="text-sm text-destructive mt-1">{errors.paymentMethod}</p>}
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? t("checkout.processing") : t("checkout.placeOrder")}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>{t("checkout.orderSummary")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <img
                    src="/apple-watch-se-with-midnight-aluminum-case-and-spo.png"
                    alt="Apple Watch SE"
                    className="w-16 h-16 object-contain"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-sm text-pretty">
                      {t("hero.title")} - {getColorName(selectedColor)}
                    </h3>
                    <p className="text-xs text-muted-foreground">{t("hero.subtitle")}</p>
                  </div>
                </div>

                <div className="border-t border-border pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{t("checkout.subtotal")}:</span>
                    <span>${subtotal}</span>
                  </div>
                  <div className="flex justify-between text-sm text-green-600">
                    <span>{t("checkout.discount")}:</span>
                    <span>-${discount * formData.quantity}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>{t("checkout.quantity")}:</span>
                    <span>{formData.quantity}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping:</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="border-t border-border pt-2">
                    <div className="flex justify-between font-semibold text-lg">
                      <span>{t("checkout.total")}:</span>
                      <span className="text-accent">${totalPrice}</span>
                    </div>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground space-y-1">
                  <p>• Free shipping on all orders</p>
                  <p>• 30-day return policy</p>
                  <p>• 1-year Apple warranty included</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
