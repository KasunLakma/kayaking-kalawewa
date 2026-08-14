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
  rating: string;
  naturalistIncluded: boolean;
  groupType: string;
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
    imageUrl: '/images/sunrise-paddle.jpg',
    badge: 'Morning Glory',
    rating: '5.0 ★ Exceptional',
    naturalistIncluded: true,
    groupType: 'Small Groups'
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
    imageUrl: '/images/island-tour.jpg',
    badge: 'Most Popular',
    popular: true,
    rating: '5.0 ★ Signature',
    naturalistIncluded: true,
    groupType: 'Private & Small Groups'
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
    imageUrl: '/images/sunset-romance.jpg',
    badge: 'Couples Choice',
    rating: '4.9 ★ Romantic',
    naturalistIncluded: true,
    groupType: 'Private Charter'
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
      'Dry bag storage & hammock gear'
    ],
    imageUrl: '/images/full-day.jpg',
    badge: 'Ultimate Expedition',
    rating: '5.0 ★ Master Class',
    naturalistIncluded: true,
    groupType: 'Exclusive Expeditions'
  }
];
