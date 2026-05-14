import Script from "next/script"

export function JsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Damilare Osofisan",
    url: "https://damilareoo.xyz",
    image: "https://damilareoo.xyz/api/og-image",
    jobTitle: "Designer & Developer",
    description: "Portfolio of Damilare Osofisan, a designer and developer creating digital experiences.",
    sameAs: [
      "https://linkedin.com/in/damilareoo",
      "https://github.com/damilareoo",
      "https://dribbble.com/damilareoo",
      "https://layers.to/damilareoo",
      "https://pinterest.com/damilareoo",
      "https://contra.com/damilareoo",
      "https://cosmos.so/damilareoo",
    ],
  }

  return (
    <Script id="json-ld" type="application/ld+json" strategy="afterInteractive">
      {JSON.stringify(jsonLd)}
    </Script>
  )
}
