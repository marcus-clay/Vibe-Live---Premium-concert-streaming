
export type ViewportType = 'mobile' | 'tablet' | 'desktop' | 'tv';

export type AccessLevel = 'free' | 'limited' | 'premium';

export interface ViewportConfig {
  width: number;
  height: number;
  scale: number;
  name: string;
}

export interface Artist {
  id: string;
  name: string;
  genre: string;
  bio: string;
  followers: number;
  image: string;
  coverImage: string;
}

export interface SongMarker {
  id: string;
  title: string;
  timestamp: number; // in seconds
}

export interface CameraAngle {
  id: string;
  label: string;
  thumbnail: string;
  videoUrl?: string;
}

export interface MerchItem {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  linkedSongId?: string;
}

export interface Sponsorship {
  brandName: string;
  logoUrl?: string;
  offerText: string;
  startTime: number;
  duration: number;
}

export interface EventContent {
  id: string;
  artistId: string;
  title: string;
  type: 'live' | 'upcoming' | 'replay';
  accessLevel: AccessLevel;
  image: string;
  startTime?: string;
  viewers?: string;
  duration: number;
  setlist: SongMarker[];
  angles: CameraAngle[];
  merch?: MerchItem[];
  sponsorships?: Sponsorship[];
  progress?: number;
  isPremium?: boolean; // Deprecated in favor of accessLevel
  price?: number;
}

export interface Series {
  id: string;
  title: string;
  description: string;
  image: string;
  seasons: Season[];
}

export interface Season {
  id: string;
  number: number;
  episodes: Episode[];
}

export interface Episode {
  id: string;
  title: string;
  description: string;
  image: string;
  duration: string;
  progress: number;
}

export interface RecommendationLink {
  source: string;
  target: string;
  type: 'genre' | 'collaboration' | 'similar' | 'era';
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
}

export interface UserEntitlements {
  ownedEventIds: string[];
  isPremiumSubscriber: boolean;
}
