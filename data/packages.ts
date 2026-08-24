export interface Package {
  id: string;
  category: 'Dawn & Dusk' | 'Heritage' | 'Wildlife' | string;
  displayTitle: string;
  title: string;
  price: string;
  priceAmount: number;
  unit: string;
  duration: string;
  capacity: string;
  difficulty: 'Easy' | 'Moderate' | 'Challenging' | 'Advanced';
  description: string;
  highlights: string[];
  inclusions: string[];
  imageUrl: string;
  badge?: string;
  popular?: boolean;
  rating: string;
  naturalistIncluded: boolean;
  groupType: string;
}

export const packages: Package[] = [
  {
    id: 'sunrise-lotus-drift',
    category: 'Dawn & Dusk',
    displayTitle: 'S U N R I S E  L O T U S  D R I F T',
    title: 'Sunrise Lotus Drift',
    price: 'LKR 4,500',
    priceAmount: 4500,
    unit: '/person',
    duration: '2 Hours',
    capacity: 'Max 10 Guests',
    difficulty: 'Easy',
    description: 'Experience early morning mist and blooming lotus lagoons on King Dhatusena’s historic 5th-century reservoir. Escorted by local eco-naturalists with organic Ceylon tea served floating on the tranquil lake.',
    highlights: [
      'Early morning mist & lotus lagoons',
      'Endemic waterfowl & morning wildlife',
      'Single/double kayak gear & safety vests',
      'Certified local eco-naturalist escort'
    ],
    inclusions: [
      'Premium Sit-on-Top Kayak',
      'Certified Life Jacket (PFD)',
      'Local Eco-Naturalist Guide',
      'Organic Ceylon Tea on Lake'
    ],
    imageUrl: '/images/sunrise-paddle.jpg',
    badge: 'Morning Glory',
    popular: true,
    rating: '5.0 ★ Exceptional',
    naturalistIncluded: true,
    groupType: 'Small Groups'
  },
  {
    id: 'sunset-romance-couples',
    category: 'Dawn & Dusk',
    displayTitle: 'S U N S E T  R O M A N C E',
    title: 'Sunset Romance & Couples',
    price: 'LKR 7,800',
    priceAmount: 7800,
    unit: '/couple',
    duration: '2 Hours',
    capacity: 'Max 4 Couples',
    difficulty: 'Easy',
    description: 'Golden hour tranquility and scenic vistas over calm waters. Glide past ancient reservoir banks with romantic twilight photo stops, cushioned tandem kayaks, and lake-chilled refreshments.',
    highlights: [
      'Golden hour tranquility & scenic vistas',
      'Private cushioned tandem kayak setup',
      'Lake chilled tropical refreshments',
      'Twilight lake photography guidance'
    ],
    inclusions: [
      'Tandem Kayak',
      'Safety Equipment',
      'Private Guide Escort',
      'Lake Chilled Refreshments'
    ],
    imageUrl: '/images/sunset-romance.jpg',
    badge: 'Couples Choice',
    popular: true,
    rating: '4.9 ★ Romantic',
    naturalistIncluded: true,
    groupType: 'Couples & Private'
  },
  {
    id: '5th-century-island-exploration',
    category: 'Heritage',
    displayTitle: 'I S L A N D  E X P L O R A T I O N',
    title: '5th Century Island Exploration',
    price: 'LKR 6,500',
    priceAmount: 6500,
    unit: '/person',
    duration: '3.5 Hours',
    capacity: 'Max 8 Guests',
    difficulty: 'Moderate',
    description: 'Deep island trekking and historic wetland exploration across remote coves of Kalawewa. Uncover ancient 5th-century hydraulic engineering feats with expert heritage guides and fresh coconut hydration.',
    highlights: [
      '5th-century island ruins & hidden coves',
      'Hydraulic heritage canal trails',
      'Guided island trekking & nature walk',
      'Fresh king coconut hydration stop'
    ],
    inclusions: [
      'Expedition Kayak',
      'Hydraulic Heritage Guide',
      'Island Trekking',
      'Coconut Hydration'
    ],
    imageUrl: '/images/island-heritage.jpg',
    badge: 'Heritage Masterclass',
    popular: false,
    rating: '5.0 ★ Heritage',
    naturalistIncluded: true,
    groupType: 'Small Group Expedition'
  },
  {
    id: 'wild-elephant-corridor-trail',
    category: 'Wildlife',
    displayTitle: 'W I L D L I F E  C O R R I D O R',
    title: 'Wild Elephant Corridor Trail',
    price: 'LKR 8,500',
    priceAmount: 8500,
    unit: '/person',
    duration: '3 Hours',
    capacity: 'Max 6 Guests',
    difficulty: 'Moderate',
    description: 'Shoreline paddling near wild Asian elephant corridors and sanctuary banks. Maintain respectful distance under expert safety guidance with field binoculars and telephoto camera assistance.',
    highlights: [
      'Shoreline paddling near elephant corridors',
      'Ancient 5th-century feeder canal trails',
      'Certified safety instructors & real-time monitoring',
      'High-grade binoculars & wildlife tracking'
    ],
    inclusions: [
      'High-stability Kayak',
      'Telephoto Wildlife Escort',
      'Safety Buffer Protocol',
      'Field Binoculars'
    ],
    imageUrl: '/images/wildlife-elephant.jpg',
    badge: 'Wildlife Focus',
    popular: true,
    rating: '5.0 ★ Signature',
    naturalistIncluded: true,
    groupType: 'Guided Wildlife Trail'
  }
];

export function getPackageById(id: string): Package | undefined {
  return packages.find((pkg) => pkg.id === id) || packages.find((pkg) => pkg.id.includes(id));
}

export function getPackagesByCategory(category: string): Package[] {
  if (!category || category === 'all' || category === 'All Expeditions') {
    return packages;
  }
  return packages.filter((pkg) => pkg.category.toLowerCase() === category.toLowerCase());
}
