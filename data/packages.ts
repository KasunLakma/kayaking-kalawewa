export interface Package {
  id: string;
  category: string;
  displayTitle: string;
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
    id: 'sunrise-expedition',
    category: 'SUNRISE EXPEDITION',
    displayTitle: 'S U N R I S E  E X P E D I T I O N',
    title: 'Sunrise Expedition',
    price: 'LKR 4,500',
    priceAmount: 4500,
    unit: '/ person',
    duration: '2 Hours',
    difficulty: 'Easy',
    description: 'Experience early morning mist and blooming lotus lagoons on King Dhatusena’s historic 5th-century reservoir. Includes single or double kayak, international-grade life jacket & certified guide.',
    highlights: [
      'Early morning mist & lotus lagoons',
      'Endemic waterfowl & morning wildlife',
      'Single/double kayak gear & safety vests',
      'Certified local naturalist escort'
    ],
    imageUrl: '/images/sunrise-paddle.jpg',
    badge: 'Morning Glory',
    popular: true,
    rating: '5.0 ★ Exceptional',
    naturalistIncluded: true,
    groupType: 'Small Groups'
  },
  {
    id: 'sunset-romance',
    category: 'SUNSET ROMANCE & COUPLES',
    displayTitle: 'S U N S E T  R O M A N C E',
    title: 'Sunset Romance & Couples',
    price: 'LKR 7,500',
    priceAmount: 7500,
    unit: '/ couple',
    duration: '2 Hours',
    difficulty: 'Easy',
    description: 'Golden hour tranquility and scenic vistas over calm waters. Glide past ancient reservoir banks with romantic twilight photo stops and cushioned tandem kayaks.',
    highlights: [
      'Golden hour tranquility & scenic vistas',
      'Private cushioned tandem kayak setup',
      'Chilled tropical juice & fruit platter',
      'Twilight lake photography guidance'
    ],
    imageUrl: '/images/sunset-romance.jpg',
    badge: 'Couples Choice',
    popular: true,
    rating: '4.9 ★ Romantic',
    naturalistIncluded: true,
    groupType: 'Couples & Private'
  },
  {
    id: 'full-lake-exploration',
    category: 'FULL LAKE EXPLORATION',
    displayTitle: 'F U L L  L A K E  E X P L O R A T I O N',
    title: 'Full Lake Exploration',
    price: 'LKR 14,000',
    priceAmount: 14000,
    unit: '/ person',
    duration: 'Full Day Expedition',
    difficulty: 'Challenging',
    description: 'Full day island exploration, historic wetlands, and endemic waterfowl observation across remote coves of Kalawewa. Includes traditional island refreshment stop and safety escort.',
    highlights: [
      'Comprehensive island exploration & hidden coves',
      'Historic 5th-century wetland & canal paths',
      'Traditional island herbal tea & lunch refresh',
      'Dry bag storage & full gear suite'
    ],
    imageUrl: '/images/island-tour.jpg',
    badge: 'Full Day Masterclass',
    popular: false,
    rating: '5.0 ★ Ultimate',
    naturalistIncluded: true,
    groupType: 'Full Day Charter'
  },
  {
    id: 'wildlife-corridor-trail',
    category: 'WILDLIFE CORRIDOR TRAIL',
    displayTitle: 'W I L D L I F E  C O R R I D O R',
    title: 'Wildlife Corridor Trail',
    price: 'LKR 8,500',
    priceAmount: 8500,
    unit: '/ person',
    duration: '3 Hours',
    difficulty: 'Moderate',
    description: 'Shoreline paddling near wild Asian elephant corridors and ancient canal paths. Maintain respectful distance under expert safety guidance as wildlife visits the water bank.',
    highlights: [
      'Shoreline paddling near elephant corridors',
      'Ancient 5th-century feeder canal trails',
      'Certified safety instructors & real-time monitoring',
      'High-grade binoculars & wildlife tracking'
    ],
    imageUrl: '/images/full-day.jpg',
    badge: 'Wildlife Focus',
    popular: true,
    rating: '5.0 ★ Signature',
    naturalistIncluded: true,
    groupType: 'Guided Wildlife Trail'
  }
];
