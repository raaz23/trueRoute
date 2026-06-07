export const cityFields = [
  { key: "name", label: "Name" },
  { key: "slug", label: "Slug" },
  { key: "country", label: "Country" },
  { key: "description", label: "Description", type: "textarea" as const },
  { key: "lat", label: "Latitude", type: "number" as const },
  { key: "lng", label: "Longitude", type: "number" as const },
  { key: "isActive", label: "Active", type: "boolean" as const },
  { key: "sortOrder", label: "Sort order", type: "number" as const },
];

export const placeFields = [
  { key: "cityId", label: "City ID" },
  { key: "name", label: "Name" },
  { key: "slug", label: "Slug" },
  {
    key: "category",
    label: "Category",
    type: "select" as const,
    options: [
      "TEMPLE",
      "PALACE",
      "LAKE",
      "MARKET",
      "PARK",
      "MUSEUM",
      "TRAIL",
      "VIEWPOINT",
    ].map((v) => ({ value: v, label: v })),
  },
  { key: "description", label: "Description", type: "textarea" as const },
  { key: "history", label: "History", type: "textarea" as const },
  { key: "lat", label: "Lat", type: "number" as const },
  { key: "lng", label: "Lng", type: "number" as const },
  { key: "entryFeeLocal", label: "Entry (local NPR)", type: "number" as const },
  { key: "entryFeeTourist", label: "Entry (tourist NPR)", type: "number" as const },
  { key: "fairPriceTip", label: "Fair price tip", type: "textarea" as const },
  { key: "approved", label: "Approved", type: "boolean" as const },
  { key: "featured", label: "Featured", type: "boolean" as const },
];

export const priceFields = [
  { key: "cityId", label: "City ID" },
  {
    key: "category",
    label: "Category",
    type: "select" as const,
    options: ["TRANSPORT", "FOOD", "ACCOMMODATION", "ATTRACTION", "SHOPPING"].map((v) => ({
      value: v,
      label: v,
    })),
  },
  { key: "serviceName", label: "Service" },
  { key: "routeFrom", label: "From" },
  { key: "routeTo", label: "To" },
  { key: "touristPriceMin", label: "Tourist min NPR", type: "number" as const },
  { key: "fairPriceMin", label: "Fair min NPR", type: "number" as const },
  { key: "localTip", label: "Tip", type: "textarea" as const },
  { key: "verified", label: "Verified", type: "boolean" as const },
];

export const faqFields = [
  { key: "question", label: "Question" },
  { key: "answer", label: "Answer", type: "textarea" as const },
  { key: "sortOrder", label: "Order", type: "number" as const },
  { key: "published", label: "Published", type: "boolean" as const },
];

export const testimonialFields = [
  { key: "authorName", label: "Name" },
  { key: "nationality", label: "Nationality" },
  { key: "location", label: "Location" },
  { key: "rating", label: "Rating", type: "number" as const },
  { key: "text", label: "Quote", type: "textarea" as const },
  { key: "featured", label: "Featured", type: "boolean" as const },
  { key: "published", label: "Published", type: "boolean" as const },
  { key: "sortOrder", label: "Order", type: "number" as const },
];

export const photoFields = [
  { key: "url", label: "Image URL" },
  { key: "caption", label: "Caption" },
  { key: "cityTag", label: "City tag" },
  { key: "approved", label: "Approved", type: "boolean" as const },
  { key: "sortOrder", label: "Order", type: "number" as const },
];

export const emergencyFields = [
  { key: "label", label: "Label" },
  { key: "number", label: "Number" },
  { key: "description", label: "Description" },
  { key: "sortOrder", label: "Order", type: "number" as const },
  { key: "published", label: "Published", type: "boolean" as const },
];

export const phraseFields = [
  { key: "category", label: "Category" },
  { key: "english", label: "English" },
  { key: "nepali", label: "Nepali" },
  { key: "hindi", label: "Hindi" },
  { key: "published", label: "Published", type: "boolean" as const },
];

export const settingFields = [
  { key: "key", label: "Key" },
  { key: "value", label: "Value", type: "textarea" as const },
];

export const businessFields = [
  { key: "name", label: "Name" },
  { key: "slug", label: "Slug" },
  { key: "qrCode", label: "QR Code" },
  {
    key: "accountType",
    label: "Account type",
    type: "select" as const,
    options: ["BUSINESS", "ORGANIZATION", "GOVERNMENT"].map((v) => ({ value: v, label: v })),
  },
  {
    key: "category",
    label: "Category",
    type: "select" as const,
    options: [
      "HOTEL", "RESORT", "RESTAURANT", "CAFE", "TRAVEL_AGENCY", "TOUR_OPERATOR",
      "ADVENTURE", "TRANSPORT", "TAXI", "CAR_RENTAL", "BIKE_RENTAL", "SHOP",
      "HANDICRAFT", "CULTURAL_CENTER", "MUSEUM", "ATTRACTION", "EMERGENCY_SERVICE",
      "NGO", "GOVERNMENT", "OTHER",
    ].map((v) => ({ value: v, label: v })),
  },
  {
    key: "status",
    label: "Status",
    type: "select" as const,
    options: ["PENDING", "APPROVED", "REJECTED", "SUSPENDED"].map((v) => ({ value: v, label: v })),
  },
  {
    key: "subscriptionPlan",
    label: "Plan",
    type: "select" as const,
    options: ["FREE", "PREMIUM", "ENTERPRISE"].map((v) => ({ value: v, label: v })),
  },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "cityId", label: "City ID" },
  { key: "description", label: "Description", type: "textarea" as const },
  { key: "trustScore", label: "Trust score", type: "number" as const },
  { key: "featured", label: "Featured", type: "boolean" as const },
  { key: "rejectionNote", label: "Rejection note", type: "textarea" as const },
];
