import { PrismaClient, PlaceCategory, PriceCategory } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.businessAnalyticsEvent.deleteMany();
  await prisma.businessListItem.deleteMany();
  await prisma.businessList.deleteMany();
  await prisma.businessFavorite.deleteMany();
  await prisma.businessFollow.deleteMany();
  await prisma.complaintCase.deleteMany();
  await prisma.businessDocument.deleteMany();
  await prisma.businessBadge.deleteMany();
  await prisma.businessQnA.deleteMany();
  await prisma.businessInquiry.deleteMany();
  await prisma.businessReport.deleteMany();
  await prisma.businessReview.deleteMany();
  await prisma.businessEvent.deleteMany();
  await prisma.businessBlogPost.deleteMany();
  await prisma.businessOffer.deleteMany();
  await prisma.businessPackage.deleteMany();
  await prisma.businessService.deleteMany();
  await prisma.businessMedia.deleteMany();
  await prisma.businessBranch.deleteMany();
  await prisma.business.deleteMany();
  await prisma.siteSetting.deleteMany();
  await prisma.translationPhrase.deleteMany();
  await prisma.emergencyNumber.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.faq.deleteMany();
  await prisma.waitlist.deleteMany();
  await prisma.feedback.deleteMany();
  await prisma.photo.deleteMany();
  await prisma.priceSubmission.deleteMany();
  await prisma.price.deleteMany();
  await prisma.place.deleteMany();
  await prisma.city.deleteMany();
  await prisma.user.deleteMany();

  const settings = [
    { key: "hero_tagline", value: "The Honest Travel Companion" },
    { key: "hero_title", value: "Travel smart. Pay what's fair." },
    { key: "hero_subtitle", value: "Know every place. Nepal first — then the world." },
    { key: "waitlist_count", value: "2400" },
    { key: "cities_count", value: "6" },
    { key: "about_mission", value: "TrueRoute was born in Birgunj, Nepal — from watching tourists overcharged every single day. We build the first honest price database so you can show your phone and pay what's fair." },
    { key: "founder_name", value: "TrueRoute Founder" },
    { key: "founder_location", value: "Birgunj, Nepal" },
  ];
  for (const s of settings) {
    await prisma.siteSetting.create({ data: s });
  }

  const ktm = await prisma.city.create({
    data: {
      name: "Kathmandu",
      slug: "kathmandu",
      country: "Nepal",
      description: "Valley of temples, markets, and living heritage.",
      lat: 27.7172,
      lng: 85.324,
      isActive: true,
      sortOrder: 1,
    },
  });

  const pokhara = await prisma.city.create({
    data: {
      name: "Pokhara",
      slug: "pokhara",
      country: "Nepal",
      description: "Lakes, Annapurna views, and adventure base.",
      lat: 28.2096,
      lng: 83.9856,
      isActive: true,
      sortOrder: 2,
    },
  });

  const chitwan = await prisma.city.create({
    data: { name: "Chitwan", slug: "chitwan", country: "Nepal", description: "Jungle safaris and river life.", isActive: true, sortOrder: 3 },
  });
  const lumbini = await prisma.city.create({
    data: { name: "Lumbini", slug: "lumbini", country: "Nepal", description: "Birthplace of Buddha.", isActive: true, sortOrder: 4 },
  });
  const nagarkot = await prisma.city.create({
    data: { name: "Nagarkot", slug: "nagarkot", country: "Nepal", description: "Himalaya sunrise ridge.", isActive: true, sortOrder: 5 },
  });
  const mustang = await prisma.city.create({
    data: { name: "Mustang", slug: "mustang", country: "Nepal", description: "High desert trails and ancient kingdom.", isActive: true, sortOrder: 6 },
  });

  const places = [
    {
      cityId: ktm.id,
      name: "Boudhanath Stupa",
      slug: "boudhanath",
      category: PlaceCategory.TEMPLE,
      lat: 27.7215,
      lng: 85.362,
      entryFeeLocal: 0,
      entryFeeTourist: 400,
      history: "One of the largest spherical stupas in Nepal and a UNESCO World Heritage Site.",
      fairPriceTip: "Official entry ~NPR 400. Ignore touts offering 'guide + entry' for NPR 1,500+.",
      featured: true,
    },
    {
      cityId: ktm.id,
      name: "Pashupatinath Temple",
      slug: "pashupatinath",
      category: PlaceCategory.TEMPLE,
      lat: 27.7108,
      lng: 85.348,
      entryFeeLocal: 0,
      entryFeeTourist: 1000,
      history: "Sacred Hindu temple complex on the Bagmati River.",
      fairPriceTip: "Foreigner entry ~NPR 1,000. No guide required for basic visit.",
    },
    {
      cityId: ktm.id,
      name: "Thamel",
      slug: "thamel",
      category: PlaceCategory.MARKET,
      lat: 27.7154,
      lng: 85.3123,
      history: "Kathmandu's main tourist district — shops, cafes, and guesthouses.",
      fairPriceTip: "Ask for local menu prices. Dal Bhat fair ~NPR 150–250.",
    },
    {
      cityId: ktm.id,
      name: "Kathmandu Durbar Square",
      slug: "durbar-square",
      category: PlaceCategory.PALACE,
      lat: 27.7041,
      lng: 85.3074,
      entryFeeTourist: 1000,
      history: "Royal palace square with centuries of Newari architecture.",
    },
    {
      cityId: ktm.id,
      name: "Swayambhunath",
      slug: "swayambhunath",
      category: PlaceCategory.TEMPLE,
      lat: 27.7147,
      lng: 85.2906,
      entryFeeTourist: 200,
      history: "The Monkey Temple — hilltop stupa overlooking the valley.",
      featured: true,
    },
    {
      cityId: ktm.id,
      name: "Patan Durbar Square",
      slug: "patan",
      category: PlaceCategory.PALACE,
      lat: 27.6711,
      lng: 85.3247,
      entryFeeTourist: 1000,
      history: "Lalitpur's ancient royal square and craft heritage.",
    },
    {
      cityId: pokhara.id,
      name: "Phewa Lake",
      slug: "phewa-lake",
      category: PlaceCategory.LAKE,
      lat: 28.2096,
      lng: 83.945,
      history: "Pokhara's mirror lake with Annapurna reflections.",
      featured: true,
    },
  ];

  for (const p of places) {
    await prisma.place.create({ data: { ...p, approved: true } });
  }

  const prices = [
    {
      cityId: ktm.id,
      category: PriceCategory.TRANSPORT,
      serviceName: "Rickshaw",
      routeFrom: "Thamel",
      routeTo: "Patan",
      touristPriceMin: 500,
      fairPriceMin: 120,
      localTip: "Show fair price on screen. Agree before ride starts.",
    },
    {
      cityId: ktm.id,
      category: PriceCategory.TRANSPORT,
      serviceName: "Taxi (meter)",
      routeFrom: "Airport",
      routeTo: "Thamel",
      touristPriceMin: 800,
      fairPriceMin: 450,
      localTip: "Insist on meter or agree fixed NPR 450–550.",
    },
    {
      cityId: ktm.id,
      category: PriceCategory.FOOD,
      serviceName: "Dal Bhat set",
      routeFrom: "Thamel",
      touristPriceMin: 600,
      fairPriceMin: 150,
      localTip: "Local eateries away from main strip charge NPR 150–250.",
    },
    {
      cityId: ktm.id,
      category: PriceCategory.ACCOMMODATION,
      serviceName: "Budget guesthouse",
      routeFrom: "Thamel",
      touristPriceMin: 2500,
      fairPriceMin: 800,
      localTip: "Walk-in tourist rate often 3× online price. Book online or negotiate.",
    },
    {
      cityId: ktm.id,
      category: PriceCategory.ATTRACTION,
      serviceName: "Temple tout 'guide'",
      routeFrom: "Boudhanath",
      touristPriceMin: 1500,
      fairPriceMin: 0,
      localTip: "No guide needed. Official entry only.",
    },
    {
      cityId: ktm.id,
      category: PriceCategory.SHOPPING,
      serviceName: "SIM card (tourist)",
      routeFrom: "Thamel",
      touristPriceMin: 1500,
      fairPriceMin: 500,
      localTip: "Official shops ~NPR 500–700 for basic data SIM.",
    },
    {
      cityId: pokhara.id,
      category: PriceCategory.TRANSPORT,
      serviceName: "Lake taxi boat (1hr)",
      routeFrom: "Lakeside",
      touristPriceMin: 2000,
      fairPriceMin: 800,
      localTip: "Share boat or negotiate before boarding.",
    },
    {
      cityId: pokhara.id,
      category: PriceCategory.FOOD,
      serviceName: "Momo plate (10pc)",
      routeFrom: "Lakeside",
      touristPriceMin: 350,
      fairPriceMin: 120,
    },
  ];

  for (const pr of prices) {
    await prisma.price.create({
      data: { ...pr, verified: true, touristPriceMax: pr.touristPriceMin, fairPriceMax: pr.fairPriceMin },
    });
  }

  await prisma.faq.createMany({
    data: [
      {
        question: "Is TrueRoute really free for tourists?",
        answer: "Yes — forever. Tourists never pay for fair prices, maps, translation, or emergency info. Revenue later comes from optional business listings, not from travelers.",
        sortOrder: 1,
      },
      {
        question: "How do you verify prices are accurate?",
        answer: "Locals and travelers submit real prices with receipts when possible. Our team reviews each submission before it goes live. Outdated prices can be flagged by the community.",
        sortOrder: 2,
      },
      {
        question: "Does it work without internet?",
        answer: "Emergency numbers and key phrases can be cached offline. Full maps and AI chat need connection — we're building deeper offline packs for trekking regions.",
        sortOrder: 3,
      },
      {
        question: "Which countries are covered?",
        answer: "Launching in Nepal (Kathmandu, Pokhara, Chitwan, Lumbini, Nagarkot, Mustang). Bhutan and India tourist cities come next, then Southeast Asia.",
        sortOrder: 4,
      },
      {
        question: "How can I contribute prices?",
        answer: "Sign up, go to Submit Price, enter what you actually paid, and optionally attach a receipt photo. After admin approval, you help every traveler after you.",
        sortOrder: 5,
      },
      {
        question: "Is my location data private?",
        answer: "GPS is used only on your device for maps and SOS unless you explicitly share location. We don't sell location data.",
        sortOrder: 6,
      },
      {
        question: "Can I use TrueRoute without an account?",
        answer: "Browse fair prices, maps preview, emergency numbers, and translation phrases without signing up. Saving places, AI chat, and submissions require a free account.",
        sortOrder: 7,
      },
    ],
  });

  await prisma.testimonial.createMany({
    data: [
      {
        authorName: "Sarah M.",
        nationality: "USA",
        location: "Kathmandu, Nepal",
        rating: 5,
        text: "Showed the rickshaw driver the fair price on TrueRoute — he dropped from NPR 500 to NPR 150. Game changer.",
        featured: true,
        sortOrder: 1,
      },
      {
        authorName: "Klaus W.",
        nationality: "Germany",
        location: "Pokhara, Nepal",
        rating: 5,
        text: "Finally an app that tells you what locals actually pay. The Dal Bhat comparison alone saved me money every day.",
        featured: true,
        sortOrder: 2,
      },
      {
        authorName: "Yuki T.",
        nationality: "Japan",
        location: "Boudhanath, Nepal",
        rating: 5,
        text: "Avoided a fake guide at the stupa. The entry fee on screen matched the official booth exactly.",
        featured: true,
        sortOrder: 3,
      },
      {
        authorName: "Ana R.",
        nationality: "Brazil",
        location: "Thamel, Nepal",
        rating: 5,
        text: "Translation phrases + fair prices in one place. Felt confident walking around without a tour group.",
        featured: true,
        sortOrder: 4,
      },
    ],
  });

  await prisma.emergencyNumber.createMany({
    data: [
      { label: "Police", number: "100", description: "General police emergency", sortOrder: 1 },
      { label: "Ambulance", number: "102", sortOrder: 2 },
      { label: "Tourist Police", number: "1144", description: "Dedicated tourist assistance", sortOrder: 3 },
      { label: "Fire", number: "101", sortOrder: 4 },
      { label: "Mountain Rescue", number: "4411767", sortOrder: 5 },
    ],
  });

  const phrases = [
    { category: "Prices", english: "What is the local price?", nepali: "स्थानीय मूल्य कति हो?", hindi: "स्थानीय कीमत क्या है?" },
    { category: "Prices", english: "That is too expensive.", nepali: "यो धेरै महँगो छ।", hindi: "यह बहुत महंगा है।" },
    { category: "Transport", english: "Please use the meter.", nepali: "कृपया मिटर प्रयोग गर्नुहोस्।", hindi: "कृपया मीटर का उपयोग करें।" },
    { category: "Transport", english: "I will pay NPR ___ only.", nepali: "म ___ मात्र तिर्छु।", hindi: "मैं केवल ___ रुपये दूंगा।" },
    { category: "Food", english: "Is this the local menu price?", nepali: "यो स्थानीय मेनु मूल्य हो?", hindi: "क्या यह स्थानीय मेनू कीमत है?" },
    { category: "Emergency", english: "I need help. Call police.", nepali: "मलाई मद्दत चाहिन्छ। प्रहरीलाई फोन गर्नुहोस्।", hindi: "मुझे मदद चाहिए। पुलिस को बुलाओ।" },
  ];

  for (let i = 0; i < phrases.length; i++) {
    await prisma.translationPhrase.create({ data: { ...phrases[i], sortOrder: i + 1 } });
  }

  await prisma.photo.createMany({
    data: [
      { url: "https://picsum.photos/seed/boudha/600/800", caption: "Boudhanath at dawn", cityTag: "Kathmandu", isHero: true, sortOrder: 1 },
      { url: "https://picsum.photos/seed/phewa/600/800", caption: "Phewa Lake", cityTag: "Pokhara", sortOrder: 2 },
      { url: "https://picsum.photos/seed/patan/600/800", caption: "Patan courtyards", cityTag: "Lalitpur", sortOrder: 3 },
      { url: "https://picsum.photos/seed/chitwan/600/800", caption: "Chitwan safari", cityTag: "Chitwan", sortOrder: 4 },
      { url: "https://picsum.photos/seed/lumbini/600/800", caption: "Lumbini garden", cityTag: "Lumbini", sortOrder: 5 },
      { url: "https://picsum.photos/seed/nagarkot/600/800", caption: "Nagarkot sunrise", cityTag: "Nagarkot", sortOrder: 6 },
    ],
  });

  await prisma.user.create({
    data: {
      email: "founder@trueroute.app",
      name: "Founder",
      role: "SUPERADMIN",
      nationality: "Nepal",
    },
  });

  const businessOwner = await prisma.user.create({
    data: {
      email: "owner@himalayanguesthouse.demo",
      name: "Ram Thapa",
      role: "BUSINESS",
      nationality: "Nepal",
    },
  });

  const hotel = await prisma.business.create({
    data: {
      slug: "himalayan-guest-house-thamel",
      qrCode: "hgthamel1",
      accountType: "BUSINESS",
      category: "HOTEL",
      status: "APPROVED",
      subscriptionPlan: "PREMIUM",
      name: "Himalayan Guest House",
      tagline: "Fair prices, honest hospitality in Thamel",
      description:
        "Family-run guest house since 1998. We publish all room rates upfront — no hidden tourist surcharges. Free WiFi, airport pickup, and rooftop breakfast with Himalaya views.",
      establishedYear: 1998,
      email: "stay@himalayanguesthouse.demo",
      phone: "+977-1-4412345",
      whatsapp: "+9779841234567",
      website: "https://example.com/himalayan-guest-house",
      cityId: ktm.id,
      lat: 27.715,
      lng: 85.312,
      address: "Thamel Marg, Kathmandu 44600",
      nearbyLandmarks: "Near Kathmandu Guest House, 5 min walk to Garden of Dreams",
      coverImageUrl: "https://picsum.photos/seed/hotel-cover/1200/600",
      logoUrl: "https://picsum.photos/seed/hotel-logo/200/200",
      languagesJson: JSON.stringify(["English", "Nepali", "Hindi"]),
      amenitiesJson: JSON.stringify([
        "Free WiFi",
        "Airport Pickup",
        "Rooftop Breakfast",
        "Hot Shower",
        "Luggage Storage",
      ]),
      certificationsJson: JSON.stringify(["NTB Registered", "Fair Pricing Certified"]),
      uspJson: JSON.stringify([
        "Published room rates — same for walk-ins and online",
        "No commission-hungry touts at our door",
        "24/7 tourist police contact on reception wall",
      ]),
      businessHours: JSON.stringify({
        Mon: "24 hours",
        Tue: "24 hours",
        Wed: "24 hours",
        Thu: "24 hours",
        Fri: "24 hours",
        Sat: "24 hours",
        Sun: "24 hours",
      }),
      trustScore: 92,
      emergencyTrustScore: 95,
      featured: true,
      verifiedAt: new Date(),
      ownerId: businessOwner.id,
    },
  });

  await prisma.businessService.createMany({
    data: [
      {
        businessId: hotel.id,
        name: "Standard Double Room",
        description: "Clean room with attached bath",
        priceMin: 2500,
        priceMax: 3000,
        includesJson: JSON.stringify(["Breakfast", "WiFi", "Daily cleaning"]),
        excludesJson: JSON.stringify(["Airport transfer"]),
        fairPriceNote: "Thamel fair range NPR 2000–3500 for similar standard",
        sortOrder: 1,
      },
      {
        businessId: hotel.id,
        name: "Airport Pickup",
        priceMin: 800,
        priceMax: 1000,
        hiddenFeeWarning: "Some taxis charge NPR 1500+ from airport — our fixed rate is NPR 800",
        sortOrder: 2,
      },
    ],
  });

  await prisma.businessBadge.createMany({
    data: [
      { businessId: hotel.id, badgeType: "VERIFIED" },
      { businessId: hotel.id, badgeType: "FAIR_PRICING" },
      { businessId: hotel.id, badgeType: "COMMUNITY_TRUSTED" },
    ],
  });

  await prisma.businessReview.createMany({
    data: [
      {
        businessId: hotel.id,
        authorName: "Sarah M.",
        nationality: "UK",
        overallRating: 5,
        serviceQuality: 5,
        fairPricing: 5,
        cleanliness: 4,
        safety: 5,
        text: "Showed the receptionist TrueRoute fair price range — they matched it exactly. No surprises.",
        approved: true,
      },
      {
        businessId: hotel.id,
        authorName: "Kenji T.",
        nationality: "Japan",
        overallRating: 4,
        fairPricing: 5,
        cleanliness: 4,
        text: "Honest pricing on the wall. Rare in Thamel.",
        approved: true,
      },
    ],
  });

  const adventure = await prisma.business.create({
    data: {
      slug: "everest-base-camp-treks",
      qrCode: "ebctrek01",
      accountType: "BUSINESS",
      category: "ADVENTURE",
      status: "APPROVED",
      name: "Everest Base Camp Treks",
      tagline: "Licensed guides, transparent trek packages",
      description:
        "Government-licensed trekking agency. All package prices include permits, guide, porter, and meals — listed clearly with no hidden add-ons at trailhead.",
      email: "trek@ebctreks.demo",
      phone: "+977-61-523456",
      whatsapp: "+9779851234567",
      cityId: pokhara.id,
      lat: 28.21,
      lng: 83.96,
      address: "Lakeside, Pokhara",
      coverImageUrl: "https://picsum.photos/seed/trek-cover/1200/600",
      languagesJson: JSON.stringify(["English", "Nepali"]),
      amenitiesJson: JSON.stringify([
        "Certified Guides",
        "Safety Equipment",
        "Insurance Coverage",
        "Emergency Evacuation Plan",
      ]),
      trustScore: 88,
      emergencyTrustScore: 90,
      featured: true,
      verifiedAt: new Date(),
    },
  });

  await prisma.businessPackage.create({
    data: {
      businessId: adventure.id,
      name: "EBC Classic 14 Days",
      description: "Kathmandu → Lukla → EBC → return",
      price: 115000,
      duration: "14 days",
      includesJson: JSON.stringify([
        "Flights Lukla",
        "All permits",
        "Guide & porter",
        "Teahouse meals",
      ]),
      excludesJson: JSON.stringify(["Personal gear", "Tips", "Travel insurance"]),
      published: true,
    },
  });

  await prisma.businessBadge.createMany({
    data: [
      { businessId: adventure.id, badgeType: "VERIFIED" },
      { businessId: adventure.id, badgeType: "GOVERNMENT_VERIFIED" },
    ],
  });

  const cafe = await prisma.business.create({
    data: {
      slug: "himalayan-java-cafe",
      qrCode: "hjcafe01",
      accountType: "BUSINESS",
      category: "CAFE",
      status: "APPROVED",
      name: "Himalayan Java",
      tagline: "Specialty coffee with published menu prices",
      description: "Popular Lakeside cafe. Menu shows same prices for locals and tourists.",
      email: "hello@himalayanjava.demo",
      cityId: pokhara.id,
      lat: 28.209,
      lng: 83.957,
      address: "Baidam Road, Lakeside",
      trustScore: 85,
      verifiedAt: new Date(),
    },
  });

  await prisma.businessQnA.createMany({
    data: [
      {
        businessId: hotel.id,
        question: "Do you charge extra for tourists?",
        askerName: "Mike",
        answer: "No — our published rates are the same for everyone. Ask at reception to see the rate card.",
        answeredAt: new Date(),
      },
      {
        businessId: adventure.id,
        question: "Is travel insurance included?",
        askerName: "Lisa",
        answer: "Insurance is not included but we help you verify your policy covers high altitude trekking.",
        answeredAt: new Date(),
      },
    ],
  });

  await prisma.businessEvent.create({
    data: {
      businessId: cafe.id,
      title: "Live Acoustic Night",
      description: "Local musicians, no cover charge",
      startsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      location: "Himalayan Java Lakeside",
      ticketPrice: 0,
      published: true,
    },
  });

  console.log("✅ TrueRoute database seeded successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
