export type OfflinePrice = {
  id: string;
  serviceName: string;
  routeFrom?: string | null;
  routeTo?: string | null;
  touristPriceMin: number;
  touristPriceMax?: number | null;
  fairPriceMin: number;
  fairPriceMax?: number | null;
  localTip?: string | null;
  category: string;
  city?: { name: string; slug?: string };
};

export type OfflinePlace = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  history?: string | null;
  category: string;
  lat?: number | null;
  lng?: number | null;
  entryFeeLocal?: number | null;
  entryFeeTourist?: number | null;
  fairPriceTip?: string | null;
  howToGetThere?: string | null;
  bestTime?: string | null;
  city?: { name: string; slug?: string };
};

export type OfflineCity = {
  id: string;
  name: string;
  slug: string;
  country: string;
  description?: string | null;
  lat?: number;
  lng?: number;
};

export type OfflineEmergency = {
  id: string;
  label: string;
  number: string;
  description?: string | null;
};

export type OfflinePhrase = {
  id: string;
  category: string;
  english: string;
  nepali: string;
  hindi?: string | null;
};

export type OfflineFaq = {
  id: string;
  question: string;
  answer: string;
};

export type OfflineDangerZone = {
  id: string;
  zone_name: string;
  reason: string;
  latitude: number;
  longitude: number;
  radius_meters: number;
  severity: string;
};

export type OfflineWeather = {
  city: string;
  temperature: number;
  feels_like: number;
  condition: string;
  description: string;
  icon: string;
  humidity: number;
  wind_speed: number;
  is_severe: boolean;
  fetchedAt: string;
};

export type OfflineBundle = {
  syncedAt: string;
  version: number;
  prices: OfflinePrice[];
  places: OfflinePlace[];
  cities: OfflineCity[];
  emergency: OfflineEmergency[];
  phrases: OfflinePhrase[];
  faq: OfflineFaq[];
  settings: Record<string, string>;
  dangerZones: OfflineDangerZone[];
  weather: Record<string, OfflineWeather>;
};

export type QueuedSubmission = {
  id: string;
  cityId: string;
  category: string;
  serviceName: string;
  routeFrom?: string;
  routeTo?: string;
  pricePaid: number;
  notes?: string;
  createdAt: string;
};

export type QueuedGpsPoint = {
  id: string;
  latitude: number;
  longitude: number;
  accuracy?: number;
  speed?: number;
  createdAt: string;
};

export type QueuedTranslation = {
  id: string;
  source_text: string;
  source_language: string;
  target_language: string;
  translated_text: string;
  createdAt: string;
};

export type QueuedActivity = {
  id: string;
  action_type: string;
  details?: Record<string, unknown>;
  createdAt: string;
};

export type LocalTouristProfile = {
  name: string;
  email?: string;
  nationality?: string;
  createdAt: string;
};

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  at: string;
};

export const OFFLINE_DB_NAME = "trueroute-offline";
export const OFFLINE_DB_VERSION = 2;
export const OFFLINE_STORE = "bundle";
export const LS_KEYS = {
  profile: "tr_profile",
  chat: "tr_chat_history",
  submissions: "tr_pending_submissions",
  gpsQueue: "tr_gps_queue",
  translateQueue: "tr_translate_queue",
  activityQueue: "tr_activity_queue",
  waitlistQueue: "tr_waitlist_queue",
  sessionId: "tr_session_id",
  syncAt: "tr_last_sync",
  installDismissed: "tr_pwa_install_dismissed",
  lastDangerAlert: "tr_last_danger_alert",
} as const;
