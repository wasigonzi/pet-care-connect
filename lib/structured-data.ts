export const organizationStructuredData = {
  "@context": "https://schema.org",
  "@type": "VeterinaryClinic",
  "name": "Pet Care Connect",
  "description": "Sistema integral de gestión para clínicas veterinarias. Administra pacientes, citas, historiales médicos, facturación y comunicación con clientes.",
  "url": "https://petcareconnect.com",
  "logo": "https://petcareconnect.com/logo.png",
  "sameAs": [
    "https://facebook.com/petcareconnect",
    "https://twitter.com/petcareconnect",
    "https://instagram.com/petcareconnect"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+1-555-0123",
    "contactType": "customer service",
    "availableLanguage": ["Spanish", "English"]
  },
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "123 Veterinary Street",
    "addressLocality": "Ciudad",
    "addressRegion": "Estado",
    "postalCode": "12345",
    "addressCountry": "ES"
  },
  "openingHours": [
    "Mo-Fr 08:00-18:00",
    "Sa 09:00-14:00"
  ],
  "priceRange": "$$",
  "paymentAccepted": ["Cash", "Credit Card", "Debit Card"],
  "currenciesAccepted": "EUR"
}

export const softwareApplicationStructuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Pet Care Connect",
  "description": "Sistema integral de gestión para clínicas veterinarias",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web Browser",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "EUR"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "ratingCount": "150"
  },
  "featureList": [
    "Gestión de pacientes",
    "Sistema de citas",
    "Historiales médicos",
    "Facturación integrada",
    "Portal para clientes",
    "Recordatorios automáticos",
    "Gestión de inventario",
    "Reportes y análisis"
  ]
}

export const breadcrumbStructuredData = (items: Array<{name: string, url: string}>) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.url
  }))
})