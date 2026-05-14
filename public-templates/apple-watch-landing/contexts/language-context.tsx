"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export type Language = "en" | "ar"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
  isRTL: boolean
}

const translations = {
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.reviews": "Reviews",
    "nav.brand": "SmartShop",

    // Hero Section
    "hero.title": "Apple Watch SE",
    "hero.subtitle": "2nd Gen, 2023 | GPS 40mm",
    "hero.description":
      "Smartwatch with Midnight Aluminium Case with Midnight Sport Band S/M. Fitness & Sleep Tracker, Crash Detection, Heart Rate Monitor.",
    "hero.buyNow": "Buy Now",
    "hero.oldPrice": "$299",
    "hero.newPrice": "$249",

    // Product Description
    "product.description.title": "Advanced Health & Fitness Companion",
    "product.description.text":
      "The Apple Watch SE combines essential Apple Watch features with a sleek design and affordable price. Track your workouts, monitor your health, stay connected, and stay safe with advanced features like Crash Detection and Emergency SOS.",

    // Colors
    "colors.title": "Available Colors",
    "colors.midnight": "Midnight",
    "colors.starlight": "Starlight",
    "colors.silver": "Silver",

    // Reviews
    "reviews.title": "Customer Reviews",
    "reviews.average": "Average Rating",
    "reviews.writeReview": "Write a Review",
    "reviews.yourName": "Your Name",
    "reviews.rating": "Rating",
    "reviews.yourReview": "Your Review",
    "reviews.placeholder": "Share your experience with the Apple Watch SE...",
    "reviews.submit": "Submit Review",
    "reviews.submitting": "Submitting...",
    "reviews.verifiedOnly": "Only verified buyers can leave reviews",

    // CTA Section
    "cta.title": "Ready to Transform Your Health Journey?",
    "cta.description": "Join millions who trust Apple Watch SE to stay healthy, connected, and safe every day.",
    "cta.button": "Order Your Apple Watch SE Today",

    // Footer
    "footer.copyright": "© 2024 SmartShop. All rights reserved.",

    // Checkout
    "checkout.title": "Checkout",
    "checkout.orderSummary": "Order Summary",
    "checkout.fullName": "Full Name",
    "checkout.email": "Email",
    "checkout.phone": "Phone Number",
    "checkout.address": "Delivery Address",
    "checkout.quantity": "Quantity",
    "checkout.paymentMethod": "Payment Method",
    "checkout.creditCard": "Credit Card",
    "checkout.paypal": "PayPal",
    "checkout.cashOnDelivery": "Cash on Delivery",
    "checkout.subtotal": "Subtotal",
    "checkout.discount": "Discount",
    "checkout.total": "Total",
    "checkout.placeOrder": "Place Order",
    "checkout.processing": "Processing...",
  },
  ar: {
    // Navigation
    "nav.home": "الرئيسية",
    "nav.reviews": "التقييمات",
    "nav.brand": "سمارت شوب",

    // Hero Section
    "hero.title": "أبل واتش SE",
    "hero.subtitle": "الجيل الثاني، 2023 | GPS 40 مم",
    "hero.description":
      "ساعة ذكية مع علبة ألومنيوم منتصف الليل وحزام رياضي منتصف الليل S/M. متتبع اللياقة والنوم، كشف الحوادث، مراقب معدل ضربات القلب.",
    "hero.buyNow": "اشتري الآن",
    "hero.oldPrice": "299$",
    "hero.newPrice": "249$",

    // Product Description
    "product.description.title": "رفيق متقدم للصحة واللياقة البدنية",
    "product.description.text":
      "تجمع أبل واتش SE بين الميزات الأساسية لساعة أبل مع تصميم أنيق وسعر معقول. تتبع تمارينك، راقب صحتك، ابق متصلاً، وابق آمناً مع الميزات المتقدمة مثل كشف الحوادث و SOS الطوارئ.",

    // Colors
    "colors.title": "الألوان المتاحة",
    "colors.midnight": "منتصف الليل",
    "colors.starlight": "ضوء النجوم",
    "colors.silver": "فضي",

    // Reviews
    "reviews.title": "تقييمات العملاء",
    "reviews.average": "متوسط التقييم",
    "reviews.writeReview": "اكتب تقييماً",
    "reviews.yourName": "اسمك",
    "reviews.rating": "التقييم",
    "reviews.yourReview": "تقييمك",
    "reviews.placeholder": "شارك تجربتك مع أبل واتش SE...",
    "reviews.submit": "إرسال التقييم",
    "reviews.submitting": "جاري الإرسال...",
    "reviews.verifiedOnly": "يمكن للمشترين المؤكدين فقط ترك التقييمات",

    // CTA Section
    "cta.title": "هل أنت مستعد لتحويل رحلة صحتك؟",
    "cta.description": "انضم إلى الملايين الذين يثقون في أبل واتش SE للبقاء بصحة جيدة ومتصلين وآمنين كل يوم.",
    "cta.button": "اطلب أبل واتش SE اليوم",

    // Footer
    "footer.copyright": "© 2024 سمارت شوب. جميع الحقوق محفوظة.",

    // Checkout
    "checkout.title": "الدفع",
    "checkout.orderSummary": "ملخص الطلب",
    "checkout.fullName": "الاسم الكامل",
    "checkout.email": "البريد الإلكتروني",
    "checkout.phone": "رقم الهاتف",
    "checkout.address": "عنوان التسليم",
    "checkout.quantity": "الكمية",
    "checkout.paymentMethod": "طريقة الدفع",
    "checkout.creditCard": "بطاقة ائتمان",
    "checkout.paypal": "باي بال",
    "checkout.cashOnDelivery": "الدفع عند التسليم",
    "checkout.subtotal": "المجموع الفرعي",
    "checkout.discount": "الخصم",
    "checkout.total": "المجموع",
    "checkout.placeOrder": "تأكيد الطلب",
    "checkout.processing": "جاري المعالجة...",
  },
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  useEffect(() => {
    // Load saved language from localStorage
    if (typeof window !== "undefined") {
      const savedLanguage = localStorage.getItem("language") as Language
      if (savedLanguage && (savedLanguage === "en" || savedLanguage === "ar")) {
        setLanguage(savedLanguage)
      }
    }
  }, [])

  useEffect(() => {
    // Save language to localStorage and update document direction
    if (typeof window !== "undefined") {
      localStorage.setItem("language", language)
      document.documentElement.lang = language
      document.documentElement.dir = language === "ar" ? "rtl" : "ltr"
    }
  }, [language])

  const t = (key: string): string => {
    return translations[language][key as keyof (typeof translations)[typeof language]] || key
  }

  const isRTL = language === "ar"

  return <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
