export interface Package {
  id: string;
  title: string;
  price: string;
  priceAmount: number;
  unit: string;
  duration: string;
  difficulty: 'Easy' | 'Moderate' | 'Challenging' | 'Advanced';
  description: string;
  highlights: string[];
  imageUrl: string;
  badge?: string;
  popular?: boolean;
}

export const packages: Package[] = [
  {
    id: 'sunrise-paddle-expedition',
    title: 'Sunrise Paddle Expedition',
    price: 'LKR 3,500',
    priceAmount: 3500,
    unit: '/ person',
    duration: '2 Hours',
    difficulty: 'Easy',
    description: 'Experience the magical morning tranquility of Kalawewa Reservoir. Paddle softly through golden morning mist, lotus blossoms, and spot rare water birds at dawn.',
    highlights: [
      'Early morning golden hour lake mist',
      'Endemic waterfowl & migratory bird watching',
      'Complimentary fresh Sri Lankan herbal tea',
      'Beginner-friendly guided paddle session'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1200&auto=format&fit=crop',
    badge: 'Morning Glory'
  },
  {
    id: 'classic-kalawewa-island-tour',
    title: 'Classic Kalawewa Island Tour',
    price: 'LKR 5,000',
    priceAmount: 5000,
    unit: '/ person',
    duration: '3 Hours',
    difficulty: 'Moderate',
    description: 'Our flagship reservoir tour. Explore secluded island shores, navigate rich aquatic flora, and discover King Dhatusena’s historic 5th-century engineering marvel.',
    highlights: [
      'Guided island hopping across Kalawewa Lake',
      'Historical narration of ancient reservoir heritage',
      'Fresh king coconut refreshment break on shore',
      'Premium single & double kayak gear included'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop',
    badge: 'Most Popular',
    popular: true
  },
  {
    id: 'sunset-romance-photography',
    title: 'Sunset Romance & Photography',
    price: 'LKR 6,500',
    priceAmount: 6500,
    unit: '/ couple',
    duration: '2.5 Hours',
    difficulty: 'Easy',
    description: 'Glide smoothly as the sun sets behind distant mountain ranges, casting vibrant amber hues across calm waters. Ideal for couples and photography enthusiasts.',
    highlights: [
      'Private tandem kayak setup with cushion seats',
      'Professional photo-op guidance & spots',
      'Chilled fruit platter & fresh tropical juice',
      'Serene twilight wildlife views'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop',
    badge: 'Couples Choice'
  },
  {
    id: 'full-day-exploration-camping',
    title: 'Full-Day Lake Exploration & Camping',
    price: 'LKR 12,000',
    priceAmount: 12000,
    unit: '/ person',
    duration: '6 Hours',
    difficulty: 'Challenging',
    description: 'An immersive full-day wilderness expedition traversing remote reservoir coves. Includes an island campfire lunch, swimming break, and wildlife tracking.',
    highlights: [
      'Comprehensive lake navigation & hidden cove access',
      'Authentic Sri Lankan island campfire lunch',
      'Safety escort boat & expert wilderness guide',
      'Dry bag storage, snorkeling & hammock gear'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?q=80&w=1200&auto=format&fit=crop',
    badge: 'Ultimate Expedition'
  }
];
