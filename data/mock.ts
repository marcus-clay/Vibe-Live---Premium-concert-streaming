
import { Artist, EventContent, Series, RecommendationLink, CameraAngle, MerchItem, Sponsorship } from '../types';

// Robust fallback assets to ensure zero empty states
export const FALLBACK_VIDEO_URL = 'https://assets.mixkit.co/videos/preview/mixkit-pop-singer-performing-on-stage-with-lights-and-smoke-41712-large.mp4';
export const FALLBACK_IMAGE_URL = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1600&h=900&fit=crop';

// Collection of varied concert mood clips to cycle through if needed
export const VIBE_CLIPS = [
  'https://assets.mixkit.co/videos/preview/mixkit-electronic-dance-music-festival-41714-large.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-rock-band-performing-on-stage-with-lights-and-smoke-41711-large.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-crowd-cheering-at-a-concert-41708-large.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-hands-clapping-at-a-concert-41710-large.mp4'
];

export const ARTISTS: Artist[] = [
  {
    id: 'a1',
    name: 'The Weeknd',
    genre: 'R&B / Pop',
    bio: 'Abel Makkonen Tesfaye, known professionally as the Weeknd, is a Canadian singer-songwriter and record producer.',
    followers: 82400000,
    image: 'https://images.unsplash.com/photo-1619983081563-430f63602796?w=800&h=800&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1514525253361-bee8a18744ad?w=1600&h=900&fit=crop'
  },
  {
    id: 'a2',
    name: 'Daft Punk',
    genre: 'Electronic / House',
    bio: 'The legendary French electronic music duo formed in Paris in 1993 by Guy-Manuel de Homem-Christo and Thomas Bangalter.',
    followers: 15200000,
    image: 'https://images.unsplash.com/photo-1541613232333-214c674230d0?w=800&h=800&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=1600&h=900&fit=crop'
  },
  {
    id: 'a3',
    name: 'Billie Eilish',
    genre: 'Alternative / Pop',
    bio: 'American singer-songwriter known for her haunting vocals and boundary-pushing production.',
    followers: 110000000,
    image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&h=800&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=1600&h=900&fit=crop'
  },
  {
    id: 'a4',
    name: 'Kendrick Lamar',
    genre: 'Hip Hop',
    bio: 'Pulitzer Prize-winning rapper known for his philosophical depth and technical mastery.',
    followers: 24500000,
    image: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=800&h=800&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=1600&h=900&fit=crop'
  },
  {
    id: 'a5',
    name: 'Arctic Monkeys',
    genre: 'Indie Rock',
    bio: 'English rock band from Sheffield known for their sharp lyrics and evolution in sound.',
    followers: 18000000,
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&h=800&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1459749411177-042180ce673c?w=1600&h=900&fit=crop'
  },
  {
    id: 'a6',
    name: 'Fred again..',
    genre: 'Electronic / House',
    bio: 'British producer and DJ known for his "Actual Life" series and emotional live sets.',
    followers: 5400000,
    image: 'https://images.unsplash.com/photo-1571266028243-e4733b0f0bb1?w=800&h=800&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1600&h=900&fit=crop'
  },
  {
    id: 'a7',
    name: 'Rosalía',
    genre: 'Experimental Pop',
    bio: 'Spanish singer known for her innovative fusion of traditional flamenco with modern pop.',
    followers: 28900000,
    image: 'https://images.unsplash.com/photo-1526218626217-dc65a29bb444?w=800&h=800&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=1600&h=900&fit=crop'
  },
  {
    id: 'a8',
    name: 'Tame Impala',
    genre: 'Psychedelic Rock',
    bio: 'Kevin Parker’s project that redefined modern psychedelic music with cosmic soundscapes.',
    followers: 12400000,
    image: 'https://images.unsplash.com/photo-1514525253361-bee8a18744ad?w=800&h=800&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1459749411177-042180ce673c?w=1600&h=900&fit=crop'
  }
];

const createMockAngles = (): CameraAngle[] => [
  { 
    id: 'cam1', 
    label: 'Main Stage', 
    thumbnail: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=200&h=112&fit=crop',
    videoUrl: VIBE_CLIPS[0]
  },
  { 
    id: 'cam2', 
    label: 'Close Up', 
    thumbnail: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=200&h=112&fit=crop',
    videoUrl: VIBE_CLIPS[1]
  },
  { 
    id: 'cam3', 
    label: 'Crowd View', 
    thumbnail: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=200&h=112&fit=crop',
    videoUrl: VIBE_CLIPS[2]
  },
  { 
    id: 'cam4', 
    label: 'Backstage', 
    thumbnail: 'https://images.unsplash.com/photo-1459749411177-042180ce673c?w=200&h=112&fit=crop',
    videoUrl: VIBE_CLIPS[3]
  },
];

export interface VibeEvent extends EventContent {
  videoUrl: string;
}

export const EVENTS: VibeEvent[] = [
  {
    id: 'e1',
    artistId: 'a1',
    title: 'After Hours til Dawn',
    type: 'live',
    accessLevel: 'premium',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=450&fit=crop',
    viewers: '12.8K',
    duration: 120,
    setlist: [
      { id: 's1', title: 'Dawn FM', timestamp: 0 },
      { id: 's2', title: 'Gasoline', timestamp: 150 },
      { id: 's3', title: 'Sacrifice', timestamp: 480 },
      { id: 's4', title: 'Take My Breath', timestamp: 720 },
      { id: 's5', title: 'How Do I Make You Love Me?', timestamp: 960 },
    ],
    angles: createMockAngles(),
    price: 19.99,
    videoUrl: VIBE_CLIPS[0]
  },
  {
    id: 'e2',
    artistId: 'a6',
    title: 'Boiler Room London',
    type: 'live',
    accessLevel: 'premium',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&h=450&fit=crop',
    viewers: '8.4K',
    duration: 90,
    setlist: [
      { id: 'j1', title: 'Rumble', timestamp: 0 },
      { id: 'j2', title: 'Delilah', timestamp: 180 },
    ],
    angles: createMockAngles(),
    price: 14.99,
    videoUrl: VIBE_CLIPS[1]
  },
  {
    id: 'e3',
    artistId: 'a3',
    title: 'Hit Me Hard and Soft Live',
    type: 'upcoming',
    accessLevel: 'premium',
    image: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&h=450&fit=crop',
    startTime: '2024-12-01T21:00:00Z',
    duration: 120,
    setlist: [
      { id: 'b1', title: 'Skinny', timestamp: 0 },
      { id: 'b2', title: 'Lunch', timestamp: 300 },
    ],
    angles: createMockAngles(),
    videoUrl: VIBE_CLIPS[2]
  }
];

export const SERIES: Series[] = [
  {
    id: 's1',
    title: 'The Making of Dawn FM',
    description: 'Go behind the scenes of one of the most ambitious albums of the decade.',
    image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&h=450&fit=crop',
    seasons: [
      {
        id: 'sea1',
        number: 1,
        episodes: [
          { id: 'ep1', title: 'A New Universe', description: 'Conceptualizing the sonic world.', image: 'https://images.unsplash.com/photo-1514525253361-bee8a18744ad?w=800&h=450&fit=crop', duration: '24m', progress: 1 },
          { id: 'ep2', title: 'The Sonic Landscape', description: 'Crafting the 80s palette.', image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&h=450&fit=crop', duration: '32m', progress: 0.5 },
        ]
      }
    ]
  }
];

export const RECOMMENDATION_LINKS: RecommendationLink[] = [
  { source: 'a1', target: 'a3', type: 'similar' },
  { source: 'a1', target: 'a2', type: 'collaboration' },
  { source: 'a3', target: 'a4', type: 'genre' },
  { source: 'a6', target: 'a2', type: 'similar' }
];
