export interface Trek {
  id: string;
  name: string;
  state: string;
  district?: string;
  difficulty: 'Easy' | 'Easy–Moderate' | 'Easy-Moderate' | 'Medium' | 'Moderate' | 'Moderate–Hard' | 'Moderate-Hard' | 'Hard' | 'Extreme';
  altitude: number; // in meters
  distance: number; // in km
  duration: number; // in days
  bestSeason: string;
  bestTime: string;
  tempRange: string;
  baseCamp: string;
  baseCampDetails: string;
  rating: number;
  startingPrice: number;
  image: string;
  images: string[];
  videoUrl?: string;
  overview: string;
  coordinates: { lat: number; lon: number };
  route: string[];
  routeCoordinates: { lat: number; lon: number }[];
  elevationProfile: { distance: number; elevation: number; label: string }[];
  familyFriendly: boolean;
  soloFriendly: boolean;
  snowTrek: boolean;
  oxygenLevel: string; // e.g. "60% at Summit"
  fitnessRequirement: string;
  baseCampsCount: number;
  accommodation: string;
  transportation: string;
  nearestRailway: string;
  nearestAirport: string;
  nearestBusStand: string;
  medicalFacilities: string;
  emergencyContacts: string[];
  faqs: { question: string; answer: string }[];
  packingChecklist: { category: string; items: string[] }[];
  weatherForecast: { day: string; temp: string; condition: string; wind: string }[];
  companyId: string;
  reviews: { id: string; user: string; avatar: string; rating: number; date: string; comment: string }[];
}

export interface TrekkingCompany {
  id: string;
  name: string;
  logo: string;
  verified: boolean;
  contact: string;
  email: string;
  website: string;
  address: string;
  about: string;
  rating: number;
  availableTreks: string[]; // Trek IDs
  safetyCertifications: string[];
  reviewsCount: number;
  team: { name: string; role: string; image: string }[];
}

export interface AdventureActivity {
  id: string;
  name: string;
  category: string;
  icon: string;
  tagline: string;
  description: string;
  bestLocations: { name: string; state: string; coordinates: { lat: number; lon: number } }[];
  startingPrice: number;
  difficulty: string;
  season: string;
  gearRequired: string[];
}

export interface ForumPost {
  id: string;
  title: string;
  author: string;
  avatar: string;
  date: string;
  category: string;
  replies: number;
  likes: number;
  content: string;
}

export interface BuddyRequest {
  id: string;
  name: string;
  avatar: string;
  trekId: string;
  trekName: string;
  startDate: string;
  groupSize: number;
  currentBuddies: number;
  genderPref: string;
  description: string;
}

export interface LeaderboardUser {
  rank: number;
  name: string;
  avatar: string;
  altitudeGained: number; // in meters
  completedTreks: number;
  points: number;
  badge: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
}

// ---------------- MOCK DATA IMPLEMENTATION ----------------

export const trekkingCompanies: TrekkingCompany[] = [
  {
    id: 'indiahikes',
    name: 'IndiaHikes',
    logo: '🏔️',
    verified: true,
    contact: '+91 80-4100-0000',
    email: 'info@indiahikes.com',
    website: 'https://indiahikes.com',
    address: '9, Kothanur Main Road, JP Nagar 7th Phase, Bengaluru, Karnataka 560062',
    about: 'IndiaHikes is India\'s largest and most recommended trekking organization. We defined the safety protocols of trekking in India and introduced the concept of green trails.',
    rating: 4.8,
    reviewsCount: 1420,
    availableTreks: ['roopkund', 'valley-of-flowers', 'kedarkantha', 'hampta-pass'],
    safetyCertifications: ['NOLS Wilderness First Aid', 'IMF Certified Guides', 'Alpine Search & Rescue'],
    team: [
      { name: 'Arjun Majumdar', role: 'Founder & CEO', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80' },
      { name: 'Swathi Chatrapathy', role: 'Chief Editor & Trek Explorer', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&h=200&q=80' }
    ]
  },
  {
    id: 'tth',
    name: 'Trek The Himalayas',
    logo: '⛺',
    verified: true,
    contact: '+91 135-244-2627',
    email: 'info@trekthehimalayas.com',
    website: 'https://trekthehimalayas.com',
    address: 'Near Tapovan Police Chowki, Badrinath Road, Tapovan, Rishikesh, Uttarakhand 249192',
    about: 'Trek The Himalayas (TTH) is an award-winning trekking company offering high-altitude treks across the Indian Himalayas for over a decade with high focus on eco-sustainability.',
    rating: 4.7,
    reviewsCount: 980,
    availableTreks: ['roopkund', 'kedarkantha', 'chadar', 'goechala'],
    safetyCertifications: ['HMI Darjeeling Certified Guides', 'Red Cross First Aid', 'Eco-Trek Partner'],
    team: [
      { name: 'Rakesh Pant', role: 'Founder', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&h=200&q=80' },
      { name: 'Sandhya Pant', role: 'Director of Operations', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&h=200&q=80' }
    ]
  },
  {
    id: 'bikat',
    name: 'Bikat Adventures',
    logo: '🧗',
    verified: true,
    contact: '+91 78381-48127',
    email: 'info@bikatadventures.com',
    website: 'https://bikatadventures.com',
    address: 'A-24, Ground Floor, Sector 3, Noida, Uttar Pradesh 201301',
    about: 'Bikat Adventures is a learning-oriented adventure community. We focus on training trekkers on technical mountaineering skills during our treks and expeditions.',
    rating: 4.6,
    reviewsCount: 750,
    availableTreks: ['hampta-pass', 'chadar', 'sandakphu'],
    safetyCertifications: ['JIM&WS Certified Leads', 'AIARE Avalanche Certifications', 'Wilderness Responder'],
    team: [
      { name: 'Girish Bhatt', role: 'Co-Founder', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&h=200&q=80' },
      { name: 'Ritika Sharma', role: 'Lead Technical Mountaineer', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80' }
    ]
  },
  {
    id: 'sahyadri-guides',
    name: 'Sahyadri Rangers',
    logo: '🌿',
    verified: true,
    contact: '+91 90223-91122',
    email: 'info@sahyadrirangers.com',
    website: 'https://sahyadrirangers.com',
    address: 'Deccan Gymkhana, Pune, Maharashtra 411004',
    about: 'Western Ghats adventure specialists specializing in historically significant fort treks, night treks, and rock climbing activities around Maharashtra.',
    rating: 4.5,
    reviewsCount: 340,
    availableTreks: ['harishchandragad'],
    safetyCertifications: ['IMF Certified Climbing Instructors', 'Local Village Search & Rescue Network'],
    team: [
      { name: 'Aditya Patil', role: 'Lead Historian & Guide', image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&h=200&q=80' }
    ]
  }
];

export const treks: Trek[] = [
  {
    id: 'roopkund',
    name: 'Roopkund Trek (Skeleton Lake)',
    state: 'Uttarakhand',
    district: 'Chamoli',
    difficulty: 'Hard',
    altitude: 5029,
    distance: 26,
    duration: 8,
    bestSeason: 'Autumn & Summer',
    bestTime: 'May to June, September to October',
    tempRange: '-5°C to 15°C',
    baseCamp: 'Lohajung',
    baseCampDetails: 'Lohajung is located in Chamoli district. It is a scenic village with tea houses, hotels, and mobile connectivity (BNSL/Jio). Accessible via Dehradun/Kathgodam.',
    rating: 4.8,
    startingPrice: 9500,
    image: 'https://i.pinimg.com/736x/c8/0b/0b/c80b0b21160b9e67337c4e76d38432a0.jpg',
    images: [
      'https://i.pinimg.com/736x/c8/0b/0b/c80b0b21160b9e67337c4e76d38432a0.jpg',
      'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=800&q=80'
    ],
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Mock placeholder
    overview: 'Roopkund is a mystery lake nestled high in the Garhwal Himalayas. The trek takes you through majestic oak forests, vast alpine meadows (Ali & Bedni Bugyal), and snow-covered glaciers, culminating at a glacial lake containing human skeletons dating back to the 9th century.',
    coordinates: { lat: 30.26, lon: 79.73 },
    route: ['Kathgodam', 'Lohajung', 'Didina', 'Ali Bugyal', 'Bedni Bugyal', 'Bhagwabasa', 'Roopkund Summit', 'Wan', 'Kathgodam'],
    routeCoordinates: [
      { lat: 29.27, lon: 79.54 }, // Kathgodam
      { lat: 30.05, lon: 79.62 }, // Lohajung Base
      { lat: 30.12, lon: 79.68 }, // Didina
      { lat: 30.18, lon: 79.71 }, // Ali Bugyal
      { lat: 30.22, lon: 79.70 }, // Bedni Bugyal
      { lat: 30.25, lon: 79.72 }, // Bhagwabasa
      { lat: 30.26, lon: 79.73 }, // Roopkund Peak
      { lat: 30.15, lon: 79.66 }  // Wan
    ],
    elevationProfile: [
      { distance: 0, elevation: 554, label: 'Kathgodam' },
      { distance: 10, elevation: 2330, label: 'Lohajung' },
      { distance: 18, elevation: 2450, label: 'Didina' },
      { distance: 26, elevation: 3400, label: 'Ali Bugyal' },
      { distance: 32, elevation: 3540, label: 'Bedni Bugyal' },
      { distance: 41, elevation: 4300, label: 'Bhagwabasa' },
      { distance: 46, elevation: 5029, label: 'Roopkund Peak' },
      { distance: 53, elevation: 2330, label: 'Wan Village' }
    ],
    familyFriendly: false,
    soloFriendly: true,
    snowTrek: true,
    oxygenLevel: '55% at Summit',
    fitnessRequirement: 'Excellent cardiovascular strength. Must run 5km in under 30 mins.',
    baseCampsCount: 2,
    accommodation: 'Tents and Homestays during trail. Guest houses at base camp.',
    transportation: 'Shared cabs from Kathgodam railway station (220 km, 9 hours drive).',
    nearestRailway: 'Kathgodam Railway Station (KGM) - 220 km',
    nearestAirport: 'Pantnagar Airport (PGH) - 250 km',
    nearestBusStand: 'Haldwani Bus Stand - 225 km',
    medicalFacilities: 'First aid oxygen cylinders carried by guides. Primary Health Center at Lohajung. Emergency evacuation via helicopter possible.',
    emergencyContacts: ['Lohajung Police: 100 / 01363-272100', 'TTH Rescue: +91-90000-00000', 'Haldwani Hospital: +91-5946-220000'],
    companyId: 'tth',
    faqs: [
      { question: 'Is Roopkund trek open currently?', answer: 'Due to environmental directives, camping on Bedni Bugyal is restricted. However, the trek can be organized with base camp stays and alternative itineraries. Consult verified operators for current permissions.' },
      { question: 'What is the mystery of Skeleton Lake?', answer: 'Scientists discovered over 500 skeletons dating back to 850 AD. The DNA shows two distinct groups who died in a single event, likely a sudden, severe hailstorm with cricket-ball-sized hail.' }
    ],
    packingChecklist: [
      { category: 'Clothing', items: ['Thermal inners (2 pairs)', 'Fleece jacket', 'Down feather jacket', 'Waterproof windcheater', 'Trekking pants (3 pairs)'] },
      { category: 'Footwear', items: ['Waterproof trekking shoes with deep treads', 'Synthetic socks (4 pairs)', 'Woolen socks (2 pairs)', 'Gaiters & Microspikes (provided by agency)'] },
      { category: 'Gear', items: ['55-65L Backpack with rain cover', 'Trekking poles (pair)', 'Headlamp with extra batteries', 'UV-protection sunglasses', '2L Thermos flask'] }
    ],
    weatherForecast: [
      { day: 'Monday', temp: '8°C / -2°C', condition: 'Sunny', wind: '12 km/h' },
      { day: 'Tuesday', temp: '7°C / -4°C', condition: 'Clear Sky', wind: '10 km/h' },
      { day: 'Wednesday', temp: '6°C / -5°C', condition: 'Partly Cloudy', wind: '18 km/h' },
      { day: 'Thursday', temp: '4°C / -7°C', condition: 'Light Snowfall', wind: '25 km/h' }
    ],
    reviews: [
      { id: 'r1', user: 'Ananya Roy', avatar: '👩', rating: 5, date: '2026-05-15', comment: 'A life-changing experience! The view of Mt. Trishul from Bedni Bugyal was absolutely majestic. The climb to Roopkund is steep but worth every drop of sweat.' },
      { id: 'r2', user: 'Kabir Mehta', avatar: '👨', rating: 4, date: '2025-10-02', comment: 'Very physically demanding. Make sure you do your cardio preparation seriously. The guides from TTH were very supportive and ensured safety.' }
    ]
  },
  {
    id: 'kedarkantha',
    name: 'Kedarkantha Peak Trek',
    state: 'Uttarakhand',
    district: 'Uttarkashi',
    difficulty: 'Easy-Moderate',
    altitude: 3810,
    distance: 11,
    duration: 6,
    bestSeason: 'Winter Snow Trek',
    bestTime: 'December to April',
    tempRange: '-8°C to 12°C',
    baseCamp: 'Sankri',
    baseCampDetails: 'Sankri is a charming village inside Govind Wildlife Sanctuary. It has plenty of hotels, home stays, and mobile networks (Jio/Airtel). Start point for multiple treks.',
    rating: 4.9,
    startingPrice: 6000,
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?auto=format&fit=crop&w=800&q=80'
    ],
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    overview: 'Kedarkantha is arguably India\'s most famous winter trek. Famous for its pine forests blanketed in deep snow, beautiful camp sites, and an incredibly rewarding summit climb that offers a 360-degree panorama of the Garhwal Himalayas (including Swargarohini, Bandarpoonch, and Black Peak).',
    coordinates: { lat: 31.02, lon: 78.17 },
    route: ['Dehradun', 'Sankri', 'Juda Ka Talab', 'Kedarkantha Base Camp', 'Kedarkantha Summit', 'Hargaon', 'Sankri', 'Dehradun'],
    routeCoordinates: [
      { lat: 30.31, lon: 78.03 }, // Dehradun
      { lat: 31.07, lon: 78.18 }, // Sankri
      { lat: 31.04, lon: 78.19 }, // Juda Ka Talab
      { lat: 31.03, lon: 78.18 }, // Base Camp
      { lat: 31.02, lon: 78.17 }, // Summit
      { lat: 31.05, lon: 78.20 }, // Hargaon
      { lat: 31.07, lon: 78.18 }  // Sankri
    ],
    elevationProfile: [
      { distance: 0, elevation: 430, label: 'Dehradun' },
      { distance: 5, elevation: 1950, label: 'Sankri' },
      { distance: 9, elevation: 2775, label: 'Juda Ka Talab' },
      { distance: 13, elevation: 3430, label: 'Base Camp' },
      { distance: 16, elevation: 3810, label: 'Summit Peak' },
      { distance: 18, elevation: 2730, label: 'Hargaon' },
      { distance: 20, elevation: 1950, label: 'Sankri' }
    ],
    familyFriendly: true,
    soloFriendly: true,
    snowTrek: true,
    oxygenLevel: '70% at Summit',
    fitnessRequirement: 'Basic fitness. Should be able to jog 4km in 30 minutes comfortably.',
    baseCampsCount: 1,
    accommodation: 'Tents on twin sharing. Clean washrooms at main campsites.',
    transportation: 'Bolero pick-up from Dehradun Railway Station (200 km, 8 hours drive).',
    nearestRailway: 'Dehradun Railway Station (DDN) - 200 km',
    nearestAirport: 'Jolly Grant Airport, Dehradun (DED) - 230 km',
    nearestBusStand: 'Dehradun ISBT - 205 km',
    medicalFacilities: 'Pulse oximeters and oxygen cylinders available at base camp and carried on trail. Clinic available at Sankri.',
    emergencyContacts: ['Sankri Rescue team: +91 94111-94222', 'Govind Sanctuary Office: 01375-22444', 'Police Sankri: 100'],
    companyId: 'indiahikes',
    faqs: [
      { question: 'Can beginners do the Kedarkantha trek?', answer: 'Yes! It is highly recommended for beginners because of its gentle slopes, clear trails, and manageable altitudes. It is a perfect introduction to winter trekking.' },
      { question: 'Will we find snow in December?', answer: 'Usually, Sankri and Juda Ka Talab start receiving snow by mid-December. The trail remains snow-covered until early April, making it a fantastic winter wonderland.' }
    ],
    packingChecklist: [
      { category: 'Clothing', items: ['Warm layers (3 sets)', 'Waterproof outer pants', 'Thermal gloves', 'Balaclava', 'Woolen cap'] },
      { category: 'Footwear', items: ['Trekking boots with good grip', 'Warm socks (3 pairs)', 'Crampons/Spikes (provided by company)'] }
    ],
    weatherForecast: [
      { day: 'Monday', temp: '5°C / -6°C', condition: 'Snow Showers', wind: '15 km/h' },
      { day: 'Tuesday', temp: '3°C / -8°C', condition: 'Heavy Snow', wind: '22 km/h' },
      { day: 'Wednesday', temp: '6°C / -4°C', condition: 'Clear Sky', wind: '8 km/h' }
    ],
    reviews: [
      { id: 'rk1', user: 'Rohit K.', avatar: '👨', rating: 5, date: '2026-01-20', comment: 'Juda ka Talab freezing and reflecting the stars was a visual I will never forget. Climbing the peak at 4 AM under the moon was surreal!' }
    ]
  },
  {
    id: 'hampta-pass',
    name: 'Hampta Pass Trek',
    state: 'Himachal Pradesh',
    district: 'Kullu',
    difficulty: 'Moderate',
    altitude: 4270,
    distance: 17.5,
    duration: 5,
    bestSeason: 'Monsoon Valley Trek',
    bestTime: 'June to September',
    tempRange: '2°C to 18°C',
    baseCamp: 'Jobra',
    baseCampDetails: 'Jobra is located 1 hour drive from Manali. Surrounded by lush pine trees and flowing rivers. No cellular connectivity beyond Jobra.',
    rating: 4.7,
    startingPrice: 7500,
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=800&q=80'
    ],
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    overview: 'Hampta Pass is famous for its dramatic shift in landscapes. The trek starts in the lush green valleys of Kullu (Manali) with oak forests and meadows, crosses the steep snowy Hampta Pass at 4,270m, and suddenly drops into the cold, barren, Martian-like desert of Spiti Valley, ending at the crescent-shaped Chandratal Lake.',
    coordinates: { lat: 32.22, lon: 77.37 },
    route: ['Manali', 'Jobra', 'Chika', 'Balu Ka Gera', 'Hampta Pass Summit', 'Shea Goru', 'Chatru', 'Chandratal', 'Manali'],
    routeCoordinates: [
      { lat: 32.24, lon: 77.19 }, // Manali
      { lat: 32.23, lon: 77.26 }, // Jobra
      { lat: 32.21, lon: 77.29 }, // Chika
      { lat: 32.20, lon: 77.33 }, // Balu Ka Gera
      { lat: 32.22, lon: 77.37 }, // Summit
      { lat: 32.23, lon: 77.40 }, // Shea Goru
      { lat: 32.27, lon: 77.42 }, // Chatru
      { lat: 32.48, lon: 77.61 }, // Chandratal
      { lat: 32.24, lon: 77.19 }  // Manali
    ],
    elevationProfile: [
      { distance: 0, elevation: 2050, label: 'Manali' },
      { distance: 5, elevation: 2980, label: 'Jobra' },
      { distance: 10, elevation: 3100, label: 'Chika' },
      { distance: 15, elevation: 3600, label: 'Balu Gera' },
      { distance: 20, elevation: 4270, label: 'Hampta Pass' },
      { distance: 23, elevation: 3900, label: 'Shea Goru' },
      { distance: 28, elevation: 3350, label: 'Chatru' }
    ],
    familyFriendly: false,
    soloFriendly: true,
    snowTrek: false,
    oxygenLevel: '65% at Summit',
    fitnessRequirement: 'Moderate fitness. Regular jogging/cycling 3 times a week is sufficient.',
    baseCampsCount: 1,
    accommodation: 'Alpine dome tents. Spiti homestays.',
    transportation: 'Pick up from Manali Mall Road (45 mins drive to Jobra).',
    nearestRailway: 'Joginder Nagar Railway Station - 145 km',
    nearestAirport: 'Bhuntar Airport, Kullu (KUU) - 50 km',
    nearestBusStand: 'Manali HRTC Bus Depot - 3 km from pickup',
    medicalFacilities: 'Oxygen cylinders carried. Closest hospital in Manali.',
    emergencyContacts: ['Manali Police: 01902-252443', 'Bikat Rescue: +91 78381-48127'],
    companyId: 'bikat',
    faqs: [
      { question: 'How is the Spiti road condition near Chatru?', answer: 'The road between Chatru and Chandratal is a dirt track with multiple water crossings (nullahs). Highly recommend a 4x4 or high clearance SUV. Roads can close during heavy rain due to landslides.' }
    ],
    packingChecklist: [
      { category: 'Gear', items: ['Waterproof backpack', 'Trekking poles', 'Poncho or raincoat (Monsoon essential)'] }
    ],
    weatherForecast: [
      { day: 'Monday', temp: '15°C / 4°C', condition: 'Overcast / Rain', wind: '12 km/h' },
      { day: 'Tuesday', temp: '14°C / 3°C', condition: 'Drizzle', wind: '10 km/h' },
      { day: 'Wednesday', temp: '12°C / 2°C', condition: 'Mist / Cloud', wind: '15 km/h' }
    ],
    reviews: [
      { id: 'rhm1', user: 'Vikram Singh', avatar: '👨', rating: 5, date: '2025-07-14', comment: 'Crossing the pass was difficult with rain and snow, but looking at the green valleys of Kullu on one side and the brown peaks of Spiti on the other was mesmerizing!' }
    ]
  },
  {
    id: 'chadar',
    name: 'Chadar Frozen River Trek',
    state: 'Ladakh',
    difficulty: 'Extreme',
    altitude: 3383,
    distance: 66,
    duration: 9,
    bestSeason: 'Extreme Winter',
    bestTime: 'January to February',
    tempRange: '-15°C to -30°C',
    baseCamp: 'Leh',
    baseCampDetails: 'Leh city. Hoteliers, medical supply stores, oxygen bars, and flight access are located here. 3 days of mandatory acclimatization in Leh is legally required.',
    rating: 4.8,
    startingPrice: 22000,
    image: 'https://images.unsplash.com/photo-1618083707368-b3823daa2726?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1618083707368-b3823daa2726?auto=format&fit=crop&w=800&q=80'
    ],
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    overview: 'Chadar Trek is a legendary sub-zero expedition walking on the frozen Zanskar River. Trekkers slide across sheets of glassy blue ice, camp inside caves along the canyon walls, and experience the ancient winter transport route of the Zanskari people in temperatures dropping to -30°C. Highlights include the magnificent semi-frozen Nerak Waterfall.',
    coordinates: { lat: 33.95, lon: 77.25 },
    route: ['Leh', 'Chilling', 'Tilat Sumdo', 'Shingra Koma', 'Tibba Cave', 'Nerak', 'Tibba Cave', 'Chilling', 'Leh'],
    routeCoordinates: [
      { lat: 34.16, lon: 77.58 }, // Leh
      { lat: 34.02, lon: 77.23 }, // Chilling
      { lat: 34.00, lon: 77.22 }, // Tilat Sumdo
      { lat: 33.98, lon: 77.21 }, // Shingra Koma
      { lat: 33.96, lon: 77.23 }, // Tibba Cave
      { lat: 33.95, lon: 77.25 }, // Nerak
      { lat: 34.16, lon: 77.58 }  // Leh
    ],
    elevationProfile: [
      { distance: 0, elevation: 3500, label: 'Leh City' },
      { distance: 15, elevation: 3180, label: 'Chilling' },
      { distance: 25, elevation: 3200, label: 'Tilat Sumdo' },
      { distance: 38, elevation: 3240, label: 'Shingra Koma' },
      { distance: 50, elevation: 3290, label: 'Tibba Cave' },
      { distance: 66, elevation: 3383, label: 'Nerak Falls' }
    ],
    familyFriendly: false,
    soloFriendly: false,
    snowTrek: true,
    oxygenLevel: '68% at Base (due to high altitude desert)',
    fitnessRequirement: 'Extreme mental & physical resilience. Must adapt to temperatures below -25°C.',
    baseCampsCount: 3,
    accommodation: 'Caves and double-layered alpine dome tents. Sleeping bags rated for -30°C.',
    transportation: 'Private 4WD Scorpio/Gypsy transport from Leh to Chilling roadhead (3 hours).',
    nearestRailway: 'Jammu Tawi Railway Station - 700 km (Not practical)',
    nearestAirport: 'Kushok Bakula Rimpoche Airport, Leh (IXL)',
    nearestBusStand: 'Leh New Bus Stand - 2 km from Leh hotel',
    medicalFacilities: 'Hyperbaric oxygen chambers in Leh. Oxygen cylinders, emergency sledges (pulka) carried by guides. Army hospitals in Leh.',
    emergencyContacts: ['Leh Disaster Management: 01982-255527', 'SNM Hospital Leh: 01982-252327', 'Leh Police Control: 100'],
    companyId: 'tth',
    faqs: [
      { question: 'What is the Chadar checkup process?', answer: 'Trekkers must undergo a mandatory medical checkup at the Leh tourist office on Day 3. Blood pressure, oxygen levels, and fitness are checked. ALH certificate is issued only to fit trekkers.' }
    ],
    packingChecklist: [
      { category: 'Footwear', items: ['Gumboots (purchased in Leh for walking on water-ice)', 'Woolen socks (5 pairs)', 'Warm trekking boots'] },
      { category: 'Clothing', items: ['Fleece layers', 'Heavy feather down jacket', 'Balaclavas', 'Waterproof gloves'] }
    ],
    weatherForecast: [
      { day: 'Monday', temp: '-12°C / -26°C', condition: 'Freezing / Clear', wind: '8 km/h' },
      { day: 'Tuesday', temp: '-15°C / -28°C', condition: 'Extreme Cold', wind: '5 km/h' }
    ],
    reviews: [
      { id: 'rcd1', user: 'Devendra J.', avatar: '👨', rating: 5, date: '2026-02-05', comment: 'Standing in front of the frozen Nerak waterfall was unreal. Walking on the ice is tricky, like a penguin walk, but once you get the hang of it, it is addictive.' }
    ]
  },
  {
    id: 'sandakphu',
    name: 'Sandakphu Phalut Trek',
    state: 'West Bengal',
    difficulty: 'Medium',
    altitude: 3636,
    distance: 46,
    duration: 6,
    bestSeason: 'Spring Flower & Winter Panoramic',
    bestTime: 'April to May, October to January',
    tempRange: '-2°C to 15°C',
    baseCamp: 'Manebhanjan / Chitrey',
    baseCampDetails: 'Chitrey is a small village near the Indo-Nepal border, featuring homestays, Buddhist stupas, and local tea stalls. Access via Darjeeling.',
    rating: 4.6,
    startingPrice: 8500,
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'
    ],
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    overview: 'Sandakphu is the highest peak in West Bengal, offering the legendary view of the "Sleeping Buddha" - a massif of mountain peaks including Everest, Lhotse, Makalu, and Kanchenjunga. The trail constantly weaves back and forth between India and Nepal, surrounded by rare red pandas, bamboo clusters, and beautiful rhododendrons.',
    coordinates: { lat: 27.10, lon: 88.00 },
    route: ['NJP', 'Manebhanjan', 'Chitrey', 'Tumling', 'Kalipokhri', 'Sandakphu Summit', 'Srikhola', 'NJP'],
    routeCoordinates: [
      { lat: 26.68, lon: 88.44 }, // NJP
      { lat: 26.98, lon: 88.12 }, // Manebhanjan
      { lat: 26.99, lon: 88.11 }, // Chitrey Base
      { lat: 27.03, lon: 88.07 }, // Tumling (Nepal)
      { lat: 27.07, lon: 88.03 }, // Kalipokhri
      { lat: 27.10, lon: 88.00 }, // Sandakphu Summit
      { lat: 27.12, lon: 88.13 }  // Srikhola
    ],
    elevationProfile: [
      { distance: 0, elevation: 114, label: 'NJP Station' },
      { distance: 10, elevation: 1920, label: 'Manebhanjan' },
      { distance: 15, elevation: 2200, label: 'Chitrey' },
      { distance: 22, elevation: 2970, label: 'Tumling' },
      { distance: 30, elevation: 3180, label: 'Kalipokhri' },
      { distance: 38, elevation: 3636, label: 'Sandakphu Summit' },
      { distance: 46, elevation: 1900, label: 'Srikhola' }
    ],
    familyFriendly: true,
    soloFriendly: true,
    snowTrek: false,
    oxygenLevel: '75% at Summit',
    fitnessRequirement: 'Moderate fitness. Ability to walk 7-8 km a day with a small backpack.',
    baseCampsCount: 1,
    accommodation: 'Cozy tea-houses (lodges) run by Indo-Nepali families with fire heaters.',
    transportation: 'Shared Sumo/Jeep from NJP Railway Station (85 km, 4 hours drive).',
    nearestRailway: 'New Jalpaiguri Railway Station (NJP) - 85 km',
    nearestAirport: 'Bagdogra Airport (IXB) - 90 km',
    nearestBusStand: 'Darjeeling Motor Stand - 28 km',
    medicalFacilities: 'First aid in tea-houses. Local health post at Sukhapokhri. Darjeeling Hospital is closest major facility.',
    emergencyContacts: ['Manebhanjan Land Rover Association: 0354-2260265', 'Darjeeling Police: 0354-2254422'],
    companyId: 'bikat',
    faqs: [
      { question: 'Do we cross the Nepal border?', answer: 'Yes! The trail runs along the international border. You will constantly enter and exit Nepal. No passport is required for Indian/Nepali citizens, but carrying a valid Government ID card is mandatory.' }
    ],
    packingChecklist: [
      { category: 'Clothing', items: ['Windproof jacket', 'Thermal inners', 'Warm cap'] },
      { category: 'Gear', items: ['Hand sanitizers', 'Valid Government ID card', 'Nepali currency (cash is preferred)'] }
    ],
    weatherForecast: [
      { day: 'Monday', temp: '14°C / 2°C', condition: 'Sunny', wind: '5 km/h' },
      { day: 'Tuesday', temp: '12°C / 1°C', condition: 'Clear', wind: '8 km/h' }
    ],
    reviews: [
      { id: 'rsd1', user: 'Amit Das', avatar: '👨', rating: 4, date: '2025-12-28', comment: 'Tea houses are very warm and hospitable. The food was simple and delicious. Woke up at 6 AM and saw the Everest cluster and Kanchenjunga together in golden light. Truly incredible.' }
    ]
  },
  {
    id: 'kumara-parvatha',
    name: 'Kumara Parvatha Trek (Pushpagiri)',
    state: 'Karnataka',
    difficulty: 'Hard',
    altitude: 1712,
    distance: 22,
    duration: 2,
    bestSeason: 'Post-Monsoon Greenery',
    bestTime: 'September to February',
    tempRange: '15°C to 28°C',
    baseCamp: 'Subrahmanya',
    baseCampDetails: 'Subrahmanya is a popular temple town in Sullia. Standard hotels, lodges, and restaurants are abundant. Excellent mobile connectivity.',
    rating: 4.7,
    startingPrice: 2500,
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80'
    ],
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    overview: 'Kumara Parvatha is the most challenging trek in South India. The trail climbs steeply through dense rainforests filled with leeches, crosses the windswept grasslands of Bhattara Mane, and navigates vertical rock faces, leading to the beautiful volcanic peak of Pushpagiri overlooking the Western Ghats.',
    coordinates: { lat: 12.66, lon: 75.68 },
    route: ['Kukke Subrahmanya Temple', 'Bhattara Mane (Homestay)', 'Kallu Mandapa', 'Shesha Parvatha', 'Kumara Parvatha Summit', 'Bhattara Mane', 'Subrahmanya'],
    routeCoordinates: [
      { lat: 12.66, lon: 75.61 }, // Kukke Temple
      { lat: 12.66, lon: 75.65 }, // Bhattara Mane
      { lat: 12.67, lon: 75.66 }, // Kallu Mandapa
      { lat: 12.67, lon: 75.67 }, // Shesha Parvatha
      { lat: 12.66, lon: 75.68 }  // Peak
    ],
    elevationProfile: [
      { distance: 0, elevation: 110, label: 'Kukke Temple' },
      { distance: 6, elevation: 760, label: 'Bhattara Mane' },
      { distance: 8, elevation: 920, label: 'Kallu Mandapa' },
      { distance: 10, elevation: 1400, label: 'Shesha Parvatha' },
      { distance: 11, elevation: 1712, label: 'KP Peak' },
      { distance: 22, elevation: 110, label: 'Kukke Temple' }
    ],
    familyFriendly: false,
    soloFriendly: true,
    snowTrek: false,
    oxygenLevel: '95% (Lower altitude forest trek)',
    fitnessRequirement: 'High leg strength and endurance. Trail climbs 1,600m vertically in a single day.',
    baseCampsCount: 1,
    accommodation: 'Sleeping bags inside Bhattara Mane courtyard or forest clearing (tents restricted by forest dept).',
    transportation: 'Overnight KSRTC bus from Bengaluru (300 km, 7 hours).',
    nearestRailway: 'Subrahmanya Road Railway Station (SBHR) - 12 km',
    nearestAirport: 'Mangaluru International Airport (IXE) - 110 km',
    nearestBusStand: 'Kukke Subrahmanya KSRTC Bus Stand - 1 km',
    medicalFacilities: 'Forest guard station at Bhattara Mane. Basic medical clinic in Subrahmanya town.',
    emergencyContacts: ['Subrahmanya Forest Range Office: 08257-230238', 'Kukke Temple Police: 08257-281200'],
    companyId: 'indiahikes',
    faqs: [
      { question: 'Are leeches common on the trail?', answer: 'During post-monsoon (September to November), leeches are extremely common in the forest section. Wear leech socks or carry salt/snuff powder to detach them.' }
    ],
    packingChecklist: [
      { category: 'Clothing', items: ['Breathable dry-fit shirts', 'Leech socks', 'Rain cover'] },
      { category: 'Gear', items: ['2.5L Water bottle (water scarce between Bhattara Mane and Peak)', 'ORSL / Glucose packets', 'Salt for leeches'] }
    ],
    weatherForecast: [
      { day: 'Monday', temp: '28°C / 18°C', condition: 'Humid / Clear', wind: '6 km/h' },
      { day: 'Tuesday', temp: '29°C / 17°C', condition: 'Sunny', wind: '5 km/h' }
    ],
    reviews: [
      { id: 'rkp1', user: 'Harish Gowda', avatar: '👨', rating: 5, date: '2026-02-12', comment: 'Undoubtedly the toughest climb. The vertical stretch after Bhattara Mane drains your energy. But the view of clouds rolling below Shesha Parvatha was magic!' }
    ]
  },
  {
    id: 'harishchandragad',
    name: 'Harishchandragad Fort Trek',
    state: 'Maharashtra',
    difficulty: 'Medium',
    altitude: 1422,
    distance: 14,
    duration: 2,
    bestSeason: 'Monsoon Cloud Walk',
    bestTime: 'July to September, November to February',
    tempRange: '12°C to 30°C',
    baseCamp: 'Khireshwar / Pachnai',
    baseCampDetails: 'Pachnai is the easiest base camp village with basic home stays. Khireshwar is a historic village via Junnar with cave systems.',
    rating: 4.8,
    startingPrice: 2000,
    image: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?auto=format&fit=crop&w=800&q=80'
    ],
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    overview: 'Harishchandragad is a historic hill fort in Ahmednagar district. Famous for the Konkan Kada (Konkan Cliff) - a massive, concave cliff face overhanging 1,800 feet into the valley, creating spectacular wind tunnels and reverse waterfalls during the monsoon. The fort contains Kedareshwar Cave with a massive Shiva Linga surrounded by ice-cold water.',
    coordinates: { lat: 19.38, lon: 73.78 },
    route: ['Pachnai Village', 'Harishchandeshwar Temple', 'Kedareshwar Cave', 'Konkan Kada', 'Taramati Peak', 'Pachnai'],
    routeCoordinates: [
      { lat: 19.39, lon: 73.74 }, // Pachnai
      { lat: 19.38, lon: 73.77 }, // Temple
      { lat: 19.38, lon: 73.78 }, // Kedareshwar Cave
      { lat: 19.38, lon: 73.76 }, // Konkan Kada
      { lat: 19.37, lon: 73.78 }  // Taramati
    ],
    elevationProfile: [
      { distance: 0, elevation: 620, label: 'Pachnai' },
      { distance: 4, elevation: 1200, label: 'Temple' },
      { distance: 5, elevation: 1220, label: 'Kedareshwar' },
      { distance: 6, elevation: 1240, label: 'Konkan Kada' },
      { distance: 8, elevation: 1422, label: 'Taramati Peak' },
      { distance: 14, elevation: 620, label: 'Pachnai' }
    ],
    familyFriendly: true,
    soloFriendly: true,
    snowTrek: false,
    oxygenLevel: '98% (Lower elevation)',
    fitnessRequirement: 'Basic stamina. Some steep patches and rock stairs require decent grip.',
    baseCampsCount: 1,
    accommodation: 'Camping tents on Konkan Kada or stone caves near the temple.',
    transportation: 'ST Bus from Mumbai/Pune to Kasara/Kalyan, then local jeep to Pachnai.',
    nearestRailway: 'Kasara Railway Station (CR) - 80 km',
    nearestAirport: 'Pune International Airport (PNQ) - 130 km',
    nearestBusStand: 'Rajur Bus Stand - 30 km',
    medicalFacilities: 'Local villagers offer primary first aid. Hospital in Rajur town.',
    emergencyContacts: ['Sahyadri Rangers Rescue: +91 90223-91122', 'Local Village Sarpanch: +91 99888-00000'],
    companyId: 'sahyadri-guides',
    faqs: [
      { question: 'What is the legend of Kedareshwar Cave?', answer: 'The cave holds a Shiva Linga surrounded by water. The ceiling is supported by only one remaining stone pillar out of four. Local legend says that when the fourth pillar breaks, it will mark the end of the current era (Kaliyuga).' }
    ],
    packingChecklist: [
      { category: 'Clothing', items: ['Quick-dry windbreaker', 'Spare clothes (monsoon will drench you)', 'Rain poncho'] },
      { category: 'Footwear', items: ['Trekking shoes with high wet-grip (crucial for monsoon rock steps)'] }
    ],
    weatherForecast: [
      { day: 'Saturday', temp: '24°C / 16°C', condition: 'Monsoon Clouds / Rain', wind: '20 km/h' },
      { day: 'Sunday', temp: '23°C / 16°C', condition: 'Heavy Fog', wind: '25 km/h' }
    ],
    reviews: [
      { id: 'rhc1', user: 'Pranav Joshi', avatar: '👨', rating: 5, date: '2025-08-14', comment: 'Standing on Konkan Kada in the monsoon while clouds are thrown upwards into your face is the most thrilling thing I have done. Pure heaven!' }
    ]
  },
  {
    id: 'triund',
    name: 'Triund Trek',
    state: 'Himachal Pradesh',
    district: 'Kangra',
    difficulty: 'Easy',
    altitude: 2850,
    distance: 9,
    duration: 2,
    bestSeason: 'Spring & Autumn',
    bestTime: 'March to June, September to December',
    tempRange: '10°C to 25°C',
    baseCamp: 'McLeod Ganj',
    baseCampDetails: 'McLeod Ganj is a well-known suburb of Dharamshala. Full of cafes, Tibetan culture, hotels, and excellent network coverage.',
    rating: 4.7,
    startingPrice: 2500,
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'
    ],
    overview: 'Triund is the crown jewel of Dharamshala, offering spectacular views of the Dhauladhar range on one side and the Kangra Valley on the other. It is an ideal weekend trek for beginners.',
    coordinates: { lat: 32.26, lon: 76.35 },
    route: ['McLeod Ganj', 'Dharamkot', 'Gallu Devi Temple', 'Triund Ridge', 'McLeod Ganj'],
    routeCoordinates: [
      { lat: 32.24, lon: 76.32 },
      { lat: 32.25, lon: 76.32 },
      { lat: 32.25, lon: 76.33 },
      { lat: 32.26, lon: 76.35 },
      { lat: 32.24, lon: 76.32 }
    ],
    elevationProfile: [
      { distance: 0, elevation: 1750, label: 'McLeod Ganj' },
      { distance: 2, elevation: 1850, label: 'Dharamkot' },
      { distance: 4, elevation: 2100, label: 'Gallu Temple' },
      { distance: 9, elevation: 2850, label: 'Triund Ridge' },
      { distance: 18, elevation: 1750, label: 'McLeod Ganj' }
    ],
    familyFriendly: true,
    soloFriendly: true,
    snowTrek: false,
    oxygenLevel: '95% at Summit',
    fitnessRequirement: 'Basic fitness. Should be able to walk 5km without issues.',
    baseCampsCount: 1,
    accommodation: 'Tents and wooden guest houses at the ridge.',
    transportation: 'Buses or taxis from Dharamshala bus stand (10 km).',
    nearestRailway: 'Pathankot Railway Station - 90 km',
    nearestAirport: 'Gaggal Airport, Kangra - 20 km',
    nearestBusStand: 'Dharamshala ISBT - 10 km',
    medicalFacilities: 'Basic clinics at McLeod Ganj. Dharamshala Civil Hospital is 12 km away.',
    emergencyContacts: ['McLeod Police: 01892-221219', 'Forest Dept Dharamshala: 01892-224887'],
    companyId: 'indiahikes',
    faqs: [
      { question: 'Is drinking water available at the top?', answer: 'Yes, but it is expensive as it is carried by mules. Carrying your own bottles is recommended.' }
    ],
    packingChecklist: [
      { category: 'Gear', items: ['Trekking poles', '2L Water bottle', 'Warm fleece layer'] }
    ],
    weatherForecast: [
      { day: 'Monday', temp: '18°C / 8°C', condition: 'Sunny', wind: '8 km/h' }
    ],
    reviews: [
      { id: 'tr1', user: 'Vikram A.', avatar: '👨', rating: 5, date: '2026-05-10', comment: 'An easy trek with unparalleled rewards. The sunset over Dharamshala is breathtaking.' }
    ]
  },
  {
    id: 'kheerganga',
    name: 'Kheerganga Trek',
    state: 'Himachal Pradesh',
    district: 'Kullu',
    difficulty: 'Easy–Moderate',
    altitude: 2960,
    distance: 12,
    duration: 3,
    bestSeason: 'Spring & Autumn',
    bestTime: 'April to June, September to November',
    tempRange: '8°C to 20°C',
    baseCamp: 'Barshaini',
    baseCampDetails: 'Barshaini is the last motorable point in Parvati Valley, near Manikaran. Small guest houses and local shops are available.',
    rating: 4.6,
    startingPrice: 2000,
    image: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=800&q=80'
    ],
    overview: 'Kheerganga is a spiritual and highly scenic trail in the Parvati Valley. It is famous for its natural hot water springs at the summit and the panoramic views of the pine-covered cliffs.',
    coordinates: { lat: 31.99, lon: 77.39 },
    route: ['Barshaini', 'Nakthan', 'Rudranag', 'Kheerganga Summit', 'Barshaini'],
    routeCoordinates: [
      { lat: 32.01, lon: 77.37 },
      { lat: 32.00, lon: 77.38 },
      { lat: 31.99, lon: 77.39 },
      { lat: 31.99, lon: 77.39 },
      { lat: 32.01, lon: 77.37 }
    ],
    elevationProfile: [
      { distance: 0, elevation: 2100, label: 'Barshaini' },
      { distance: 4, elevation: 2300, label: 'Nakthan' },
      { distance: 7, elevation: 2450, label: 'Rudranag' },
      { distance: 12, elevation: 2960, label: 'Kheerganga Summit' },
      { distance: 24, elevation: 2100, label: 'Barshaini' }
    ],
    familyFriendly: true,
    soloFriendly: true,
    snowTrek: false,
    oxygenLevel: '94% at Summit',
    fitnessRequirement: 'Basic stamina. Some muddy and slippery trails near waterfalls.',
    baseCampsCount: 1,
    accommodation: 'Tents and cafes at the top meadow.',
    transportation: 'Shared jeeps from Bhuntar or Manikaran to Barshaini.',
    nearestRailway: 'Joginder Nagar Railway Station - 120 km',
    nearestAirport: 'Bhuntar Airport, Kullu - 50 km',
    nearestBusStand: 'Barshaini Bus Stand - 0 km',
    medicalFacilities: 'Primary health center at Manikaran (15 km). Emergency clinics at Kasol.',
    emergencyContacts: ['Kasol Police: 01902-273822', 'Parvati Rescue: +91 98888-88888'],
    companyId: 'tth',
    faqs: [
      { question: 'Is the hot spring open year round?', answer: 'Yes, but during heavy winters it can get very cold and difficult to access due to snow.' }
    ],
    packingChecklist: [
      { category: 'Gear', items: ['Towel and swimwear for hot springs', 'Poncho', 'Leech protection (monsoon)'] }
    ],
    weatherForecast: [
      { day: 'Monday', temp: '16°C / 6°C', condition: 'Sunny', wind: '5 km/h' }
    ],
    reviews: [
      { id: 'kh1', user: 'Shreya D.', avatar: '👩', rating: 4, date: '2026-04-18', comment: 'Bathing in the natural hot pool after a long trek was pure bliss. Highly recommend!' }
    ]
  },
  {
    id: 'kareri-lake',
    name: 'Kareri Lake Trek',
    state: 'Himachal Pradesh',
    district: 'Kangra',
    difficulty: 'Moderate',
    altitude: 2941,
    distance: 13,
    duration: 3,
    bestSeason: 'Spring & Autumn',
    bestTime: 'May to June, September to November',
    tempRange: '5°C to 18°C',
    baseCamp: 'Kareri Village',
    baseCampDetails: 'Kareri Village is located near Dharamshala. Cozy homestays and basic organic food options are available.',
    rating: 4.5,
    startingPrice: 3200,
    image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80'
    ],
    overview: 'Kareri Lake is a shallow, fresh water lake nestled south of the Dhauladhar range. The trek follows the Nyund river stream, passing through rich pine forests, wooden bridges, and rocky boulders.',
    coordinates: { lat: 32.32, lon: 76.28 },
    route: ['Kareri Village', 'Reoti', 'Kareri Lake', 'Reoti', 'Kareri Village'],
    routeCoordinates: [
      { lat: 32.29, lon: 76.28 },
      { lat: 32.31, lon: 76.29 },
      { lat: 32.32, lon: 76.28 },
      { lat: 32.31, lon: 76.29 },
      { lat: 32.29, lon: 76.28 }
    ],
    elevationProfile: [
      { distance: 0, elevation: 1800, label: 'Kareri Village' },
      { distance: 6, elevation: 2250, label: 'Reoti Camp' },
      { distance: 13, elevation: 2940, label: 'Kareri Lake' },
      { distance: 26, elevation: 1800, label: 'Kareri Village' }
    ],
    familyFriendly: true,
    soloFriendly: true,
    snowTrek: false,
    oxygenLevel: '94% at Lake',
    fitnessRequirement: 'Moderate fitness. Long walks over stone-stairs along the river gorge.',
    baseCampsCount: 1,
    accommodation: 'Tents and stone shelters near the lake temple.',
    transportation: 'Local cabs from Dharamshala bus stand (27 km).',
    nearestRailway: 'Pathankot - 95 km',
    nearestAirport: 'Kangra gaggal - 32 km',
    nearestBusStand: 'Dharamshala Bus Stand - 27 km',
    medicalFacilities: 'First aid in village homestays. Hospital in Dharamshala.',
    emergencyContacts: ['Dharamshala rescue: +91 1892-224444', 'Police: 100'],
    companyId: 'bikat',
    faqs: [
      { question: 'Is there mobile signal at Kareri Lake?', answer: 'No, signal drops completely after Kareri Village. Jio has patchy connection at Reoti.' }
    ],
    packingChecklist: [
      { category: 'Clothing', items: ['Thermal top', 'Warm jacket', 'Leech protection (monsoon)'] }
    ],
    weatherForecast: [
      { day: 'Monday', temp: '14°C / 4°C', condition: 'Sunny', wind: '6 km/h' }
    ],
    reviews: [
      { id: 'kl1', user: 'Harish M.', avatar: '👨', rating: 4, date: '2026-05-15', comment: 'The water of Kareri Lake is crystal clear. Sleeping next to the streaming river was absolute bliss.' }
    ]
  },
  {
    id: 'prashar-lake',
    name: 'Prashar Lake Trek',
    state: 'Himachal Pradesh',
    district: 'Mandi',
    difficulty: 'Easy',
    altitude: 2730,
    distance: 7.5,
    duration: 2,
    bestSeason: 'Year Round',
    bestTime: 'January to December (Best: Winter snow or Spring)',
    tempRange: '0°C to 22°C',
    baseCamp: 'Baggi Village',
    baseCampDetails: 'Baggi is a remote village in Mandi district. It has basic guest houses and tea stalls.',
    rating: 4.6,
    startingPrice: 1800,
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80'
    ],
    overview: 'Prashar Lake is a holy lake with a three-storied pagoda temple dedicated to Sage Prashar. The lake holds a mysterious floating island that changes its position continuously. It offers 360 views of the snow-clad peaks of Dhauladhar, Pir Panjal, and Kinnaur.',
    coordinates: { lat: 31.75, lon: 77.10 },
    route: ['Baggi Village', 'Forest Trail', 'Prashar Lake Ridge', 'Prashar Lake', 'Baggi Village'],
    routeCoordinates: [
      { lat: 31.73, lon: 77.08 },
      { lat: 31.74, lon: 77.09 },
      { lat: 31.75, lon: 77.10 },
      { lat: 31.75, lon: 77.10 },
      { lat: 31.73, lon: 77.08 }
    ],
    elevationProfile: [
      { distance: 0, elevation: 1300, label: 'Baggi Village' },
      { distance: 4, elevation: 1950, label: 'Forest Trail Point' },
      { distance: 8, elevation: 2730, label: 'Prashar Lake' },
      { distance: 16, elevation: 1300, label: 'Baggi Village' }
    ],
    familyFriendly: true,
    soloFriendly: true,
    snowTrek: true,
    oxygenLevel: '96% at Lake',
    fitnessRequirement: 'Basic fitness. A steady climb through forests and meadows.',
    baseCampsCount: 1,
    accommodation: 'Temple guest rooms, tents, and Forest department rest houses.',
    transportation: 'Buses or cabs from Mandi town (50 km).',
    nearestRailway: 'Kiratpur Railway Station - 125 km',
    nearestAirport: 'Bhuntar Airport - 60 km',
    nearestBusStand: 'Mandi ISBT - 50 km',
    medicalFacilities: 'Mandi Zonal Hospital is the closest fully equipped facility.',
    emergencyContacts: ['Police Mandi: 01905-222470', 'Rescue Mandi: +91 94180-00000'],
    companyId: 'indiahikes',
    faqs: [
      { question: 'Why does the island float?', answer: 'The floating island is made of organic matter and grass roots. The movement is caused by water currents and wind changes.' }
    ],
    packingChecklist: [
      { category: 'Gear', items: ['Thermal layers (winter)', 'UV Sunglasses', 'Trekking Shoes'] }
    ],
    weatherForecast: [
      { day: 'Monday', temp: '15°C / 3°C', condition: 'Clear Sky', wind: '8 km/h' }
    ],
    reviews: [
      { id: 'pr1', user: 'Aman S.', avatar: '👨', rating: 5, date: '2026-01-10', comment: 'The pagoda temple covered in snow was like something out of a fairytale. Beautiful weekend escape.' }
    ]
  },
  {
    id: 'beas-kund',
    name: 'Beas Kund Trek',
    state: 'Himachal Pradesh',
    district: 'Kullu',
    difficulty: 'Easy–Moderate',
    altitude: 3893,
    distance: 8,
    duration: 4,
    bestSeason: 'Summer & Autumn',
    bestTime: 'May to October',
    tempRange: '0°C to 15°C',
    baseCamp: 'Solang Valley',
    baseCampDetails: 'Solang is Manali\'s adventure capital. Hostels, hotels, campsites, paragliding activities, and reliable network lines are available.',
    rating: 4.7,
    startingPrice: 4500,
    image: 'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?auto=format&fit=crop&w=800&q=80'
    ],
    overview: 'Beas Kund is the sacred glacial lake that is the source of the Beas River. The trek starts from Solang, leading through lush grasslands (Bakarthach) to the glacial basin, surrounded by peaks like Hanuman Tibba, Friendship Peak, and Shitidhar.',
    coordinates: { lat: 32.37, lon: 77.09 },
    route: ['Solang Valley', 'Dhundi', 'Bakarthach', 'Beas Kund Lake', 'Solang Valley'],
    routeCoordinates: [
      { lat: 32.31, lon: 77.15 },
      { lat: 32.34, lon: 77.13 },
      { lat: 32.36, lon: 77.11 },
      { lat: 32.37, lon: 77.09 },
      { lat: 32.31, lon: 77.15 }
    ],
    elevationProfile: [
      { distance: 0, elevation: 2480, label: 'Solang Valley' },
      { distance: 4, elevation: 2850, label: 'Dhundi Camp' },
      { distance: 6, elevation: 3300, label: 'Bakarthach Meadows' },
      { distance: 8, elevation: 3890, label: 'Beas Kund Glacier' },
      { distance: 16, elevation: 2480, label: 'Solang Valley' }
    ],
    familyFriendly: true,
    soloFriendly: true,
    snowTrek: true,
    oxygenLevel: '82% at Lake',
    fitnessRequirement: 'Moderate cardiovascular fitness. Short but steep climb on glacial moraine.',
    baseCampsCount: 1,
    accommodation: 'Tents in campsites at Dhundi or Bakarthach.',
    transportation: 'Taxis from Manali to Solang (14 km).',
    nearestRailway: 'Joginder Nagar - 150 km',
    nearestAirport: 'Bhuntar, Kullu - 60 km',
    nearestBusStand: 'Manali Private Bus Stand - 14 km',
    medicalFacilities: 'Primary clinics at Manali town. Lady Willingdon Hospital is in Manali.',
    emergencyContacts: ['Manali Rescue Team: +91-98160-00000', 'Manali Police: 01902-252443'],
    companyId: 'tth',
    faqs: [
      { question: 'Is Beas Kund recommended for beginners?', answer: 'Yes! It is one of the shortest and most accessible high-altitude glacial lake treks in Himachal Pradesh.' }
    ],
    packingChecklist: [
      { category: 'Gear', items: ['Trekking poles', 'Fleece jackets', 'Raincoat (Monsoon)'] }
    ],
    weatherForecast: [
      { day: 'Monday', temp: '12°C / 2°C', condition: 'Clear', wind: '10 km/h' }
    ],
    reviews: [
      { id: 'bk1', user: 'Rohit P.', avatar: '👨', rating: 5, date: '2025-06-22', comment: 'Standing at the edge of the lake with giant peaks looming directly above was incredibly humbling.' }
    ]
  },
  {
    id: 'bhrigu-lake',
    name: 'Bhrigu Lake Trek',
    state: 'Himachal Pradesh',
    district: 'Kullu',
    difficulty: 'Moderate',
    altitude: 4270,
    distance: 11,
    duration: 4,
    bestSeason: 'Summer & Autumn',
    bestTime: 'June to September',
    tempRange: '-2°C to 18°C',
    baseCamp: 'Gulaba',
    baseCampDetails: 'Gulaba is a scenic village on the Rohtang Pass road. Rest houses, checkposts, and small shops are available.',
    rating: 4.8,
    startingPrice: 6500,
    image: 'https://images.unsplash.com/photo-1527004013197-933c4bb611b3?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1527004013197-933c4bb611b3?auto=format&fit=crop&w=800&q=80'
    ],
    overview: 'Bhrigu Lake is a high-altitude sacred lake named after Maharishi Bhrigu. It is believed that the sage meditated here, and the lake never freezes completely. The trail climbs quickly through oak forests to alpine meadows with panoramic views of the Solang valley.',
    coordinates: { lat: 32.29, lon: 77.24 },
    route: ['Gulaba', 'Jonker Thach', 'Rola Kholi', 'Bhrigu Lake', 'Gulaba'],
    routeCoordinates: [
      { lat: 32.31, lon: 77.22 },
      { lat: 32.30, lon: 77.23 },
      { lat: 32.29, lon: 77.24 },
      { lat: 32.29, lon: 77.24 },
      { lat: 32.31, lon: 77.22 }
    ],
    elevationProfile: [
      { distance: 0, elevation: 3000, label: 'Gulaba' },
      { distance: 3, elevation: 3350, label: 'Jonker Thach' },
      { distance: 7, elevation: 3800, label: 'Rola Kholi' },
      { distance: 13, elevation: 4300, label: 'Bhrigu Lake' },
      { distance: 26, elevation: 3000, label: 'Gulaba' }
    ],
    familyFriendly: false,
    soloFriendly: true,
    snowTrek: true,
    oxygenLevel: '72% at Lake',
    fitnessRequirement: 'Moderate endurance. Rapid altitude gain requires strong lungs.',
    baseCampsCount: 1,
    accommodation: 'Campsites at Rola Kholi.',
    transportation: 'Private taxis from Manali to Gulaba (22 km).',
    nearestRailway: 'Joginder Nagar - 165 km',
    nearestAirport: 'Bhuntar - 72 km',
    nearestBusStand: 'Manali ISBT - 22 km',
    medicalFacilities: 'Manali Hospital is the closest emergency care.',
    emergencyContacts: ['Manali Police: 01902-252443', 'Bhrigu Rescue Cell: +91 94111-11111'],
    companyId: 'bikat',
    faqs: [
      { question: 'Can we camp near the lake?', answer: 'Camping is restricted directly next to the lake to preserve the holy environment. Camping is done at Rola Kholi.' }
    ],
    packingChecklist: [
      { category: 'Gear', items: ['Gaiters (early summer snow)', 'Thermos flask', 'Down jacket'] }
    ],
    weatherForecast: [
      { day: 'Monday', temp: '8°C / -3°C', condition: 'Sunny', wind: '12 km/h' }
    ],
    reviews: [
      { id: 'bh1', user: 'Nisha K.', avatar: '👩', rating: 5, date: '2026-06-12', comment: 'The alpine meadows are the best I have seen. The lake was partially frozen and looked gorgeous.' }
    ]
  },
  {
    id: 'indrahar-pass',
    name: 'Indrahar Pass Trek',
    state: 'Himachal Pradesh',
    district: 'Kangra',
    difficulty: 'Moderate–Hard',
    altitude: 4342,
    distance: 17.5,
    duration: 5,
    bestSeason: 'Summer & Autumn',
    bestTime: 'May to October',
    tempRange: '-5°C to 15°C',
    baseCamp: 'McLeod Ganj',
    baseCampDetails: 'McLeod Ganj is near Dharamshala. Cozy cafes, Tibetan culture, and good mobile network lines are available.',
    rating: 4.6,
    startingPrice: 7500,
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80'
    ],
    overview: 'Indrahar Pass is a popular mountain pass in the Dhauladhar Range. The trek starts from Dharamshala, passing through the popular Triund ridge and the high-altitude cave shelter (Lahesh Cave), leading over a steep rock trail to the pass with stunning views of the Chamba Valley and Mani Mahesh Kailash.',
    coordinates: { lat: 32.29, lon: 76.36 },
    route: ['McLeod Ganj', 'Triund', 'Illaqa Thach', 'Lahesh Cave', 'Indrahar Pass', 'McLeod Ganj'],
    routeCoordinates: [
      { lat: 32.24, lon: 76.32 },
      { lat: 32.26, lon: 76.35 },
      { lat: 32.28, lon: 76.36 },
      { lat: 32.29, lon: 76.35 },
      { lat: 32.29, lon: 76.36 },
      { lat: 32.24, lon: 76.32 }
    ],
    elevationProfile: [
      { distance: 0, elevation: 1750, label: 'McLeod Ganj' },
      { distance: 9, elevation: 2850, label: 'Triund Ridge' },
      { distance: 13, elevation: 3300, label: 'Illaqa Thach' },
      { distance: 15, elevation: 3500, label: 'Lahesh Cave' },
      { distance: 18, elevation: 4342, label: 'Indrahar Pass' },
      { distance: 35, elevation: 1750, label: 'McLeod Ganj' }
    ],
    familyFriendly: false,
    soloFriendly: true,
    snowTrek: true,
    oxygenLevel: '71% at Pass',
    fitnessRequirement: 'High endurance. Rocky climbs and steep boulders near the pass require good balance.',
    baseCampsCount: 2,
    accommodation: 'Tents and natural rock caves (Lahesh Cave).',
    transportation: 'Taxis from Dharamshala to Gallu temple.',
    nearestRailway: 'Pathankot - 90 km',
    nearestAirport: 'Kangra gaggal - 20 km',
    nearestBusStand: 'Dharamshala ISBT - 10 km',
    medicalFacilities: 'Civil Hospital at Dharamshala.',
    emergencyContacts: ['Dharamshala Police: 01892-222244', 'IMF Rescue Dharamshala: +91-90000-00000'],
    companyId: 'indiahikes',
    faqs: [
      { question: 'Is Lahesh Cave safe for night stay?', answer: 'Yes, but it can get very cold. Sleeping bags and proper gear are mandatory.' }
    ],
    packingChecklist: [
      { category: 'Gear', items: ['Trekking poles', 'High-grip hiking boots', 'Headlamp'] }
    ],
    weatherForecast: [
      { day: 'Monday', temp: '10°C / -4°C', condition: 'Sunny', wind: '15 km/h' }
    ],
    reviews: [
      { id: 'ip1', user: 'Aravind B.', avatar: '👨', rating: 5, date: '2025-10-05', comment: 'The rocky trail from Lahesh Cave to the pass is very steep. But crossing into the Chamba side is an incredible achievement.' }
    ]
  },
  {
    id: 'sar-pass',
    name: 'Sar Pass Trek',
    state: 'Himachal Pradesh',
    district: 'Kullu',
    difficulty: 'Moderate',
    altitude: 4206,
    distance: 24,
    duration: 5,
    bestSeason: 'Summer Snow Trek',
    bestTime: 'April to June',
    tempRange: '-5°C to 18°C',
    baseCamp: 'Kasol',
    baseCampDetails: 'Kasol is a popular tourist destination in Parvati Valley, Mandi. Hotels, cafes, gear shops, and excellent internet connectivity are available.',
    rating: 4.8,
    startingPrice: 7800,
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80'
    ],
    overview: 'Sar Pass is a classic snow trek in the Parvati Valley. "Sar" means lake, referring to a small frozen pond crossed during the summit climb. It is famous for its massive snow slides on the descent from the pass.',
    coordinates: { lat: 31.98, lon: 77.34 },
    route: ['Kasol', 'Grahan Village', 'Min Thach', 'Nagaru', 'Sar Pass Summit', 'Biskeri Thach', 'Barshaini', 'Kasol'],
    routeCoordinates: [
      { lat: 32.01, lon: 77.31 },
      { lat: 31.98, lon: 77.30 },
      { lat: 31.97, lon: 77.32 },
      { lat: 31.97, lon: 77.33 },
      { lat: 31.98, lon: 77.34 },
      { lat: 31.99, lon: 77.35 },
      { lat: 32.01, lon: 77.37 },
      { lat: 32.01, lon: 77.31 }
    ],
    elevationProfile: [
      { distance: 0, elevation: 1580, label: 'Kasol' },
      { distance: 10, elevation: 2350, label: 'Grahan' },
      { distance: 18, elevation: 3400, label: 'Min Thach' },
      { distance: 26, elevation: 3800, label: 'Nagaru' },
      { distance: 32, elevation: 4200, label: 'Sar Pass Peak' },
      { distance: 40, elevation: 3350, label: 'Biskeri Thach' },
      { distance: 48, elevation: 2100, label: 'Barshaini' }
    ],
    familyFriendly: false,
    soloFriendly: true,
    snowTrek: true,
    oxygenLevel: '73% at Pass',
    fitnessRequirement: 'Moderate endurance. Must be comfortable walking on snow for multiple hours.',
    baseCampsCount: 3,
    accommodation: 'Tents in high-altitude meadows.',
    transportation: 'Buses to Bhuntar, then local buses or cabs to Kasol.',
    nearestRailway: 'Joginder Nagar - 125 km',
    nearestAirport: 'Bhuntar - 32 km',
    nearestBusStand: 'Kasol Bus Stand - 0 km',
    medicalFacilities: 'Basic clinics at Kasol. Government Hospital at Bhuntar.',
    emergencyContacts: ['Kasol Police: 01902-273822', 'YHAI Helpdesk: +91 1902-273562'],
    companyId: 'tth',
    faqs: [
      { question: 'What is Nagaru campsite like?', answer: 'Nagaru is a windswept campsite with freezing winds. Tents are pitched on snow patches, making it very cold.' }
    ],
    packingChecklist: [
      { category: 'Clothing', items: ['Thermal gloves', 'Balaclava', 'Waterproof snow shoes'] }
    ],
    weatherForecast: [
      { day: 'Monday', temp: '6°C / -6°C', condition: 'Snow Showers', wind: '20 km/h' }
    ],
    reviews: [
      { id: 'sp1', user: 'Kunal R.', avatar: '👨', rating: 5, date: '2025-05-18', comment: 'The snow slide down to Biskeri is the most thrilling thing I have ever done. Highly recommend YHAI or other certified agencies.' }
    ]
  },
  {
    id: 'pin-bhaba-pass',
    name: 'Pin Bhaba Pass Trek',
    state: 'Himachal Pradesh',
    district: 'Kinnaur',
    difficulty: 'Hard',
    altitude: 4907,
    distance: 25.5,
    duration: 7,
    bestSeason: 'Late Summer Monsoon',
    bestTime: 'July to September',
    tempRange: '-5°C to 18°C',
    baseCamp: 'Kafnu',
    baseCampDetails: 'Kafnu is a remote village in Kinnaur. Basic home stays and hydro-power project hubs are located here.',
    rating: 4.9,
    startingPrice: 15500,
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80'
    ],
    overview: 'Pin Bhaba Pass is one of the most stunning cross-over treks in India. It starts in the lush, green Bhaba valley of Kinnaur, climbs over a high-altitude pass, and drops into the dry, arid, cold desert Spiti Valley (Pin Valley), showing extreme contrast in landscapes.',
    coordinates: { lat: 31.83, lon: 77.97 },
    route: ['Kafnu', 'Mullung Thach', 'Kara Meadows', 'Bhaba River Camp', 'Pin Bhaba Pass Peak', 'Mangrung Thach', 'Mud Village (Spiti)'],
    routeCoordinates: [
      { lat: 31.57, lon: 77.98 },
      { lat: 31.62, lon: 77.97 },
      { lat: 31.67, lon: 77.96 },
      { lat: 31.72, lon: 77.96 },
      { lat: 31.83, lon: 77.97 },
      { lat: 31.87, lon: 77.98 },
      { lat: 31.95, lon: 78.02 }
    ],
    elevationProfile: [
      { distance: 0, elevation: 2400, label: 'Kafnu' },
      { distance: 11, elevation: 3250, label: 'Mullung Thach' },
      { distance: 20, elevation: 3550, label: 'Kara Meadows' },
      { distance: 30, elevation: 4100, label: 'Bhaba Camp' },
      { distance: 38, elevation: 4900, label: 'Bhaba Pass' },
      { distance: 45, elevation: 4150, label: 'Mangrung Spiti' },
      { distance: 51, elevation: 3750, label: 'Mud Village' }
    ],
    familyFriendly: false,
    soloFriendly: true,
    snowTrek: true,
    oxygenLevel: '65% at Pass',
    fitnessRequirement: 'Excellent endurance. Deep snow slopes on the pass and steep moraines.',
    baseCampsCount: 2,
    accommodation: 'Alpine camping tents.',
    transportation: 'Cabs from Shimla to Kafnu (200 km, 7 hours).',
    nearestRailway: 'Shimla Toy Train - 200 km',
    nearestAirport: 'Jubarhatti, Shimla - 220 km',
    nearestBusStand: 'Kafnu Bus Stand - 0 km',
    medicalFacilities: 'Primary health center at Kafnu. Hospital at Rampur.',
    emergencyContacts: ['Kinnaur Police: 01786-222212', 'Mud Village Rescue: +91 94180-88888'],
    companyId: 'indiahikes',
    faqs: [
      { question: 'How do we travel from Spiti back to Manali?', answer: 'From Mud village, shared cabs or local HRTC buses run to Kaza, and from Kaza you can travel over Kunzum/Rohtang to Manali.' }
    ],
    packingChecklist: [
      { category: 'Gear', items: ['Leech socks', 'UV protection goggles', 'Gaiters'] }
    ],
    weatherForecast: [
      { day: 'Monday', temp: '10°C / -5°C', condition: 'Sunny', wind: '18 km/h' }
    ],
    reviews: [
      { id: 'pb1', user: 'Shrikant P.', avatar: '👨', rating: 5, date: '2025-08-20', comment: 'Crossing the pass was incredible. In a single step, the green grass disappears and you are looking at the brown Spiti desert.' }
    ]
  },
  {
    id: 'buran-ghati',
    name: 'Buran Ghati Trek',
    state: 'Himachal Pradesh',
    district: 'Shimla',
    difficulty: 'Hard',
    altitude: 4572,
    distance: 18.5,
    duration: 7,
    bestSeason: 'Spring & Autumn',
    bestTime: 'May to June, September to October',
    tempRange: '-5°C to 18°C',
    baseCamp: 'Janglik',
    baseCampDetails: 'Janglik is a heritage village in Rohru district with traditional wooden houses and apple orchards.',
    rating: 4.8,
    startingPrice: 12500,
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80'
    ],
    overview: 'Buran Ghati is a highly rewarding trek in Pabbar Valley. It is famous for its gorgeous pine forest trail, alpine lake (Chandranahan Lake), and a thrilling, nearly vertical snow wall descent from the pass.',
    coordinates: { lat: 31.37, lon: 78.13 },
    route: ['Janglik', 'Dayara Thach', 'Litham', 'Chandranahan Lake (side excursion)', 'Dunda Camp', 'Buran Ghati Pass', 'Barua Village'],
    routeCoordinates: [
      { lat: 31.29, lon: 78.08 },
      { lat: 31.31, lon: 78.09 },
      { lat: 31.33, lon: 78.10 },
      { lat: 31.34, lon: 78.11 },
      { lat: 31.35, lon: 78.12 },
      { lat: 31.37, lon: 78.13 },
      { lat: 31.40, lon: 78.14 }
    ],
    elevationProfile: [
      { distance: 0, elevation: 2800, label: 'Janglik' },
      { distance: 6, elevation: 3350, label: 'Dayara Thach' },
      { distance: 12, elevation: 3600, label: 'Litham' },
      { distance: 18, elevation: 4000, label: 'Chandranahan Lake' },
      { distance: 24, elevation: 4300, label: 'Dunda Camp' },
      { distance: 30, elevation: 4570, label: 'Buran Ghati' },
      { distance: 37, elevation: 2000, label: 'Barua Village' }
    ],
    familyFriendly: false,
    soloFriendly: true,
    snowTrek: true,
    oxygenLevel: '70% at Pass',
    fitnessRequirement: 'High level of cardiovascular endurance. Ability to slide down 80-degree snow walls.',
    baseCampsCount: 2,
    accommodation: 'Tents in beautiful high-altitude meadows (Dayara / Litham).',
    transportation: 'Shared cabs from Shimla to Janglik (150 km).',
    nearestRailway: 'Shimla - 150 km',
    nearestAirport: 'Jubarhatti - 170 km',
    nearestBusStand: 'Rohru Bus Stand - 30 km',
    medicalFacilities: 'Medical post at Rohru town.',
    emergencyContacts: ['Rohru Police: 01781-240004', 'Dharamshala Rescue: +91 90000-00000'],
    companyId: 'bikat',
    faqs: [
      { question: 'How do we descend the snow wall?', answer: 'The guides set up anchors and rope rails. Trekkers slide down using ropes, snow axes, and guides\' assistance.' }
    ],
    packingChecklist: [
      { category: 'Gear', items: ['Crampons', 'Waterproof snow gloves', 'Gaiters'] }
    ],
    weatherForecast: [
      { day: 'Monday', temp: '8°C / -4°C', condition: 'Sunny', wind: '10 km/h' }
    ],
    reviews: [
      { id: 'bg1', user: 'Aditya S.', avatar: '👨', rating: 5, date: '2025-06-12', comment: 'Dayara Thach has to be the most beautiful campsite in India. Sliding down the pass was pure adrenaline.' }
    ]
  },
  {
    id: 'pin-parvati-pass',
    name: 'Pin Parvati Pass Trek',
    state: 'Himachal Pradesh',
    district: 'Kullu',
    difficulty: 'Extreme',
    altitude: 5321,
    distance: 55,
    duration: 10,
    bestSeason: 'Mid Summer Monsoon',
    bestTime: 'July to September',
    tempRange: '-10°C to 15°C',
    baseCamp: 'Barshaini',
    baseCampDetails: 'Barshaini is the last motorable point in Parvati Valley, near Manikaran. Guest houses and shops are available.',
    rating: 4.8,
    startingPrice: 28000,
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80'
    ],
    overview: 'Pin Parvati Pass is one of the most challenging, dangerous, and remote trans-Himalayan cross-over treks in India. It links Parvati Valley (Kullu) to Pin Valley (Spiti) through a crevasse-ridden glacier at 5,300 meters. For experienced trekkers only.',
    coordinates: { lat: 31.85, lon: 77.83 },
    route: ['Barshaini', 'Kheerganga', 'Tunda Bhuj', 'Thakur Kuan', 'Odi Thach', 'Mantalai Lake', 'Pin Parvati Pass Peak', 'Wichkurung Thach', 'Mud Village (Spiti)'],
    routeCoordinates: [
      { lat: 32.01, lon: 77.37 },
      { lat: 31.99, lon: 77.39 },
      { lat: 31.97, lon: 77.45 },
      { lat: 31.95, lon: 77.52 },
      { lat: 31.91, lon: 77.60 },
      { lat: 31.88, lon: 77.68 },
      { lat: 31.85, lon: 77.83 },
      { lat: 31.88, lon: 77.92 },
      { lat: 31.95, lon: 78.02 }
    ],
    elevationProfile: [
      { distance: 0, elevation: 2100, label: 'Barshaini' },
      { distance: 12, elevation: 2960, label: 'Kheerganga' },
      { distance: 28, elevation: 3200, label: 'Tunda Bhuj' },
      { distance: 45, elevation: 3500, label: 'Thakur Kuan' },
      { distance: 60, elevation: 3800, label: 'Odi Thach' },
      { distance: 75, elevation: 4100, label: 'Mantalai Lake' },
      { distance: 92, elevation: 5319, label: 'Pin Parvati Pass' },
      { distance: 110, elevation: 3750, label: 'Mud Village' }
    ],
    familyFriendly: false,
    soloFriendly: false,
    snowTrek: true,
    oxygenLevel: '52% at Summit',
    fitnessRequirement: 'Extreme fitness. Ability to trek 10 hours a day with heavy load over glaciers and crevasses.',
    baseCampsCount: 4,
    accommodation: 'Cold wilderness camping on snow/moraines.',
    transportation: 'Taxis to Barshaini and pick up from Mud Spiti.',
    nearestRailway: 'Pathankot - 250 km',
    nearestAirport: 'Bhuntar - 50 km',
    nearestBusStand: 'Barshaini Bus Stand - 0 km',
    medicalFacilities: 'No medical care on trail. Evacuation is extremely difficult and requires military helicopter support.',
    emergencyContacts: ['Leh Command: 100', 'Spiti rescue squad: +91 94180-88888'],
    companyId: 'indiahikes',
    faqs: [
      { question: 'Why is it dangerous?', answer: 'The trail has river crossings, slippery rock trails (Tunda Bhuj), glacial moraines, crevasses, and extremely high risks of AMS.' }
    ],
    packingChecklist: [
      { category: 'Gear', items: ['Harness and rope set', 'Crampons and microspikes', 'High altitude medical kit'] }
    ],
    weatherForecast: [
      { day: 'Monday', temp: '4°C / -10°C', condition: 'Foggy / Snow', wind: '25 km/h' }
    ],
    reviews: [
      { id: 'pp1', user: 'Rajiv D.', avatar: '👨', rating: 5, date: '2025-07-28', comment: 'The toughest trek of my life. Navigating the Parvati glacier was frightening but absolutely epic.' }
    ]
  },
  {
    id: 'friendship-peak',
    name: 'Friendship Peak Trek',
    state: 'Himachal Pradesh',
    district: 'Kullu',
    difficulty: 'Hard',
    altitude: 5287,
    distance: 17,
    duration: 7,
    bestSeason: 'Summer & Autumn',
    bestTime: 'May to October',
    tempRange: '-8°C to 15°C',
    baseCamp: 'Solang Valley',
    baseCampDetails: 'Solang Valley near Manali. Standard hotels, gear rentals, paragliding zones, and mobile lines are available.',
    rating: 4.7,
    startingPrice: 22000,
    image: 'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?auto=format&fit=crop&w=800&q=80'
    ],
    overview: 'Friendship Peak is a popular trekking peak in the Pir Panjal range. It requires basic mountaineering skills like using ice axes, crampons, and roping up to navigate the steep snow and glacier slopes to the summit at 5,287m.',
    coordinates: { lat: 32.39, lon: 77.10 },
    route: ['Solang Valley', 'Dhundi', 'Bakarthach Meadows', 'Lady Leg (Base Camp)', 'Summit Ridge', 'Friendship Peak Summit', 'Solang Valley'],
    routeCoordinates: [
      { lat: 32.31, lon: 77.15 },
      { lat: 32.34, lon: 77.13 },
      { lat: 32.36, lon: 77.11 },
      { lat: 32.38, lon: 77.10 },
      { lat: 32.39, lon: 77.09 },
      { lat: 32.39, lon: 77.10 },
      { lat: 32.31, lon: 77.15 }
    ],
    elevationProfile: [
      { distance: 0, elevation: 2480, label: 'Solang Valley' },
      { distance: 4, elevation: 2850, label: 'Dhundi' },
      { distance: 8, elevation: 3300, label: 'Bakarthach' },
      { distance: 14, elevation: 3840, label: 'Lady Leg Base' },
      { distance: 20, elevation: 5287, label: 'Friendship Peak' },
      { distance: 34, elevation: 2480, label: 'Solang Valley' }
    ],
    familyFriendly: false,
    soloFriendly: false,
    snowTrek: true,
    oxygenLevel: '53% at Summit',
    fitnessRequirement: 'Excellent physical conditioning. High leg and core strength for climbing in snow.',
    baseCampsCount: 2,
    accommodation: 'High-altitude tents.',
    transportation: 'Taxis from Manali to Solang (14 km).',
    nearestRailway: 'Joginder Nagar - 150 km',
    nearestAirport: 'Bhuntar - 60 km',
    nearestBusStand: 'Manali ISBT - 14 km',
    medicalFacilities: 'First aid oxygen. Manali General Hospital is the closest medical checkpost.',
    emergencyContacts: ['HMI Rescue DAR: 100', 'Manali Rescue Team: +91 98160-00000'],
    companyId: 'bikat',
    faqs: [
      { question: 'Do we need IMF permits?', answer: 'Yes, peak climbing permits must be registered via IMF or local mountain associations. Most trekking agencies handle this.' }
    ],
    packingChecklist: [
      { category: 'Gear', items: ['Climbing harness', 'Ice axe', 'Down feather mittens', 'Alpine climbing boots'] }
    ],
    weatherForecast: [
      { day: 'Monday', temp: '5°C / -8°C', condition: 'Sunny / Cold', wind: '15 km/h' }
    ],
    reviews: [
      { id: 'fp1', user: 'Dheeraj G.', avatar: '👨', rating: 5, date: '2025-06-15', comment: 'Reaching the summit at sunrise was magical. Hanuman Tibba and other giant mountains felt so close.' }
    ]
  },
  {
    id: 'deo-tibba-base',
    name: 'Deo Tibba Base Camp Trek',
    state: 'Himachal Pradesh',
    district: 'Kullu',
    difficulty: 'Moderate',
    altitude: 4481,
    distance: 20,
    duration: 6,
    bestSeason: 'Summer & Autumn',
    bestTime: 'May to October',
    tempRange: '0°C to 18°C',
    baseCamp: 'Jagatsukh',
    baseCampDetails: 'Jagatsukh is a historic village near Manali. Old temples, local homestays, and basic amenities are available.',
    rating: 4.6,
    startingPrice: 9500,
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'
    ],
    overview: 'Deo Tibba Base Camp (Chikka) trek offers scenic views of the dome-shaped Mt. Deo Tibba (6,001m) and Mt. Indrasan (6,220m). The trail winds through lush meadows, pine forests, and glacial valleys along the Duhangan River.',
    coordinates: { lat: 32.20, lon: 77.26 },
    route: ['Jagatsukh', 'Khanul', 'Chikka Meadows', 'Serai', 'Tenta (Base Camp)', 'Chikka', 'Jagatsukh'],
    routeCoordinates: [
      { lat: 32.20, lon: 77.20 },
      { lat: 32.20, lon: 77.22 },
      { lat: 32.21, lon: 77.24 },
      { lat: 32.21, lon: 77.25 },
      { lat: 32.20, lon: 77.26 },
      { lat: 32.21, lon: 77.24 },
      { lat: 32.20, lon: 77.20 }
    ],
    elevationProfile: [
      { distance: 0, elevation: 2000, label: 'Jagatsukh' },
      { distance: 6, elevation: 2200, label: 'Khanul' },
      { distance: 14, elevation: 3200, label: 'Chikka Meadows' },
      { distance: 22, elevation: 3600, label: 'Serai' },
      { distance: 28, elevation: 4100, label: 'Tenta (Base Camp)' },
      { distance: 40, elevation: 2000, label: 'Jagatsukh' }
    ],
    familyFriendly: true,
    soloFriendly: true,
    snowTrek: false,
    oxygenLevel: '72% at Base',
    fitnessRequirement: 'Moderate endurance. Steady walks on river banks and rocky climbs.',
    baseCampsCount: 1,
    accommodation: 'Tents inside meadows.',
    transportation: 'Local cabs from Manali to Jagatsukh (6 km).',
    nearestRailway: 'Joginder Nagar - 148 km',
    nearestAirport: 'Bhuntar - 55 km',
    nearestBusStand: 'Manali ISBT - 6 km',
    medicalFacilities: 'Manali hospital is the closest medical care.',
    emergencyContacts: ['Manali Police: 01902-252443', 'Rescue Kullu: +91 94180-00000'],
    companyId: 'tth',
    faqs: [
      { question: 'What is the highlight of the trek?', answer: 'The close-up views of Deo Tibba peak and the blue waters of Chandertal lake situated near the summit base camp.' }
    ],
    packingChecklist: [
      { category: 'Gear', items: ['Trekking poles', 'Poncho', 'High UV Sunscreen'] }
    ],
    weatherForecast: [
      { day: 'Monday', temp: '14°C / 2°C', condition: 'Sunny', wind: '8 km/h' }
    ],
    reviews: [
      { id: 'dt1', user: 'Anjali V.', avatar: '👩', rating: 4, date: '2025-06-18', comment: 'The wildflower pastures of Chikka are very dream-like. Excellent trail guides.' }
    ]
  },
  {
    id: 'chandrakhani-pass',
    name: 'Chandrakhani Pass Trek',
    state: 'Himachal Pradesh',
    district: 'Kullu',
    difficulty: 'Easy–Moderate',
    altitude: 3667,
    distance: 10,
    duration: 4,
    bestSeason: 'Spring & Autumn',
    bestTime: 'April to June, September to November',
    tempRange: '2°C to 20°C',
    baseCamp: 'Naggar',
    baseCampDetails: 'Naggar is a quiet town near Manali, famous for Naggar Castle. Hotels, heritage structures, and mobile networks are available.',
    rating: 4.6,
    startingPrice: 3800,
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80'
    ],
    overview: 'Chandrakhani Pass is a gorgeous mountain pass connecting Kullu Valley with Malana village. It offers panoramic views of the Deo Tibba, Pir Panjal, and Parvati ranges, passing through giant pine and deodar forests.',
    coordinates: { lat: 32.11, lon: 77.21 },
    route: ['Naggar', 'Rumsu Village', 'Steling Meadows', 'Chandrakhani Pass Summit', 'Naggar'],
    routeCoordinates: [
      { lat: 32.11, lon: 77.16 },
      { lat: 32.11, lon: 77.18 },
      { lat: 32.12, lon: 77.20 },
      { lat: 32.11, lon: 77.21 },
      { lat: 32.11, lon: 77.16 }
    ],
    elevationProfile: [
      { distance: 0, elevation: 1800, label: 'Naggar' },
      { distance: 3, elevation: 2150, label: 'Rumsu Village' },
      { distance: 8, elevation: 2900, label: 'Steling' },
      { distance: 11, elevation: 3660, label: 'Chandrakhani Pass' },
      { distance: 22, elevation: 1800, label: 'Naggar' }
    ],
    familyFriendly: true,
    soloFriendly: true,
    snowTrek: false,
    oxygenLevel: '88% at Pass',
    fitnessRequirement: 'Moderate fitness. Trail climbs steadily up from the valley floor.',
    baseCampsCount: 1,
    accommodation: 'Tents and village guest houses.',
    transportation: 'Buses to Naggar from Patlikuhal (on Manali highway).',
    nearestRailway: 'Joginder Nagar - 135 km',
    nearestAirport: 'Bhuntar - 42 km',
    nearestBusStand: 'Patlikuhal - 5 km',
    medicalFacilities: 'Clinics at Naggar. Zonal Hospital at Kullu.',
    emergencyContacts: ['Naggar Police: 01902-248322', 'Manali Rescue: +91 98160-00000'],
    companyId: 'indiahikes',
    faqs: [
      { question: 'Can we visit Malana village?', answer: 'Yes, but respect local customs. Malana villagers have strict rules regarding touching their temples or walls.' }
    ],
    packingChecklist: [
      { category: 'Gear', items: ['Trekking poles', 'Poncho', 'Cap'] }
    ],
    weatherForecast: [
      { day: 'Monday', temp: '16°C / 4°C', condition: 'Sunny', wind: '6 km/h' }
    ],
    reviews: [
      { id: 'cp1', user: 'Vivek T.', avatar: '👨', rating: 4, date: '2025-05-12', comment: 'Rumsu village is full of wooden architecture. The view of snow peaks from the pass is beautiful.' }
    ]
  },
  {
    id: 'lama-dugh',
    name: 'Lama Dugh Trek',
    state: 'Himachal Pradesh',
    district: 'Kullu',
    difficulty: 'Easy',
    altitude: 3018,
    distance: 6,
    duration: 1,
    bestSeason: 'Spring & Autumn',
    bestTime: 'April to October',
    tempRange: '5°C to 20°C',
    baseCamp: 'Manali',
    baseCampDetails: 'Manali is a major tourism hub. Hotels, hostels, restaurants, and excellent connectivity are available.',
    rating: 4.6,
    startingPrice: 1500,
    image: 'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?auto=format&fit=crop&w=800&q=80'
    ],
    overview: 'Lama Dugh is a popular day trek starting directly from Old Manali. The trail climbs steeply through pine, oak, and cedar forests to a beautiful alpine meadow (Lama Dugh) with views of Manali town and the surrounding Dhauladhar range.',
    coordinates: { lat: 32.25, lon: 77.16 },
    route: ['Old Manali', 'Hadimba Temple Forest', 'Lama Dugh Meadow', 'Old Manali'],
    routeCoordinates: [
      { lat: 32.25, lon: 77.18 },
      { lat: 32.25, lon: 77.17 },
      { lat: 32.25, lon: 77.16 },
      { lat: 32.25, lon: 77.18 }
    ],
    elevationProfile: [
      { distance: 0, elevation: 2050, label: 'Old Manali' },
      { distance: 2, elevation: 2200, label: 'Hadimba Forest' },
      { distance: 6, elevation: 3017, label: 'Lama Dugh Meadow' },
      { distance: 12, elevation: 2050, label: 'Old Manali' }
    ],
    familyFriendly: true,
    soloFriendly: true,
    snowTrek: false,
    oxygenLevel: '93% at Meadow',
    fitnessRequirement: 'Basic fitness. The trail is steep on the first half.',
    baseCampsCount: 1,
    accommodation: 'None (Day trek). Camping possible with custom permissions.',
    transportation: 'Walk from Old Manali.',
    nearestRailway: 'Joginder Nagar - 145 km',
    nearestAirport: 'Bhuntar - 50 km',
    nearestBusStand: 'Manali ISBT - 2 km',
    medicalFacilities: 'Manali Mission Hospital is nearby.',
    emergencyContacts: ['Manali Police: 01902-252443', 'Rescue Cell Old Manali: +91 99999-00000'],
    companyId: 'sahyadri-guides',
    faqs: [
      { question: 'Are there water sources on the trail?', answer: 'No, there are no water sources along the route. Carry at least 2L of water per person.' }
    ],
    packingChecklist: [
      { category: 'Gear', items: ['2L Water bottle', 'Raincoat', 'Trekking shoes'] }
    ],
    weatherForecast: [
      { day: 'Monday', temp: '16°C / 6°C', condition: 'Sunny', wind: '5 km/h' }
    ],
    reviews: [
      { id: 'ld1', user: 'Megha S.', avatar: '👩', rating: 5, date: '2026-05-01', comment: 'A perfect day trek in Manali. The meadow is wide and peaceful, a sharp escape from the crowded town.' }
    ]
  },
  {
    id: 'patalsu-peak',
    name: 'Patalsu Peak Trek',
    state: 'Himachal Pradesh',
    district: 'Kullu',
    difficulty: 'Moderate',
    altitude: 4220,
    distance: 8,
    duration: 2,
    bestSeason: 'Summer & Autumn',
    bestTime: 'May to October',
    tempRange: '0°C to 18°C',
    baseCamp: 'Solang Valley',
    baseCampDetails: 'Solang is Manali\'s adventure capital, offering hostels, cafes, and paragliding zones.',
    rating: 4.7,
    startingPrice: 3500,
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80'
    ],
    overview: 'Patalsu Peak is a prominent trekking summit overlooking the Solang Valley. It offers an excellent training summit for aspiring mountaineers, providing panoramic views of the Shitidhar, Friendship, and Hanuman Tibba peaks.',
    coordinates: { lat: 32.33, lon: 77.17 },
    route: ['Solang Valley', 'Shakarux Thach', 'Patalsu Peak Summit', 'Solang Valley'],
    routeCoordinates: [
      { lat: 32.31, lon: 77.15 },
      { lat: 32.32, lon: 77.16 },
      { lat: 32.33, lon: 77.17 },
      { lat: 32.31, lon: 77.15 }
    ],
    elevationProfile: [
      { distance: 0, elevation: 2480, label: 'Solang Valley' },
      { distance: 4, elevation: 3100, label: 'Shakarux Meadows' },
      { distance: 8, elevation: 4220, label: 'Patalsu Peak Summit' },
      { distance: 16, elevation: 2480, label: 'Solang Valley' }
    ],
    familyFriendly: false,
    soloFriendly: true,
    snowTrek: true,
    oxygenLevel: '74% at Summit',
    fitnessRequirement: 'Good cardio strength. Steep ridge climbs and high altitude winds.',
    baseCampsCount: 1,
    accommodation: 'Camping tents at Shakarux.',
    transportation: 'Cabs from Manali to Solang (14 km).',
    nearestRailway: 'Joginder Nagar - 150 km',
    nearestAirport: 'Bhuntar - 60 km',
    nearestBusStand: 'Manali ISBT - 14 km',
    medicalFacilities: 'Manali hospital is the closest medical care.',
    emergencyContacts: ['Manali Police: 01902-252443', 'Rescue Solang: +91 94111-22222'],
    companyId: 'indiahikes',
    faqs: [
      { question: 'Is snow gear required in May?', answer: 'Yes, microspikes and gaiters are usually required for snow crossings near the summit.' }
    ],
    packingChecklist: [
      { category: 'Gear', items: ['Trekking poles', 'UV Sunglasses', 'Warm thermal top'] }
    ],
    weatherForecast: [
      { day: 'Monday', temp: '10°C / -2°C', condition: 'Clear', wind: '12 km/h' }
    ],
    reviews: [
      { id: 'ppk1', user: 'Rohan D.', avatar: '👨', rating: 4, date: '2025-06-18', comment: 'Steep climb all the way but reaching the summit was highly satisfying. Hanuman Tibba looks majestic.' }
    ]
  },
  {
    id: 'seven-lakes',
    name: 'Seven Lakes Trek',
    state: 'Himachal Pradesh',
    district: 'Kangra',
    difficulty: 'Hard',
    altitude: 4801,
    distance: 32.5,
    duration: 7,
    bestSeason: 'Late Summer',
    bestTime: 'July to September',
    tempRange: '-5°C to 15°C',
    baseCamp: 'Bada Bhangal',
    baseCampDetails: 'Bada Bhangal is one of the most remote and isolated villages in Himachal Pradesh, accessible only via high-altitude passes.',
    rating: 4.8,
    startingPrice: 19500,
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80'
    ],
    overview: 'The Seven Lakes Trek (or Dhauladhar Seven Lakes) is a raw, unexplored, and remote trail. It crosses high mountain passes to visit a cluster of seven sacred glacial lakes located deep inside the wilderness of the Dhauladhar Range.',
    coordinates: { lat: 32.34, lon: 76.65 },
    route: ['Bada Bhangal', 'Marhi', 'Plachach Thach', 'Seven Lakes Basin', 'Bada Bhangal'],
    routeCoordinates: [
      { lat: 32.35, lon: 76.60 },
      { lat: 32.34, lon: 76.62 },
      { lat: 32.34, lon: 76.63 },
      { lat: 32.34, lon: 76.65 },
      { lat: 32.35, lon: 76.60 }
    ],
    elevationProfile: [
      { distance: 0, elevation: 2550, label: 'Bada Bhangal' },
      { distance: 15, elevation: 3300, label: 'Marhi Camp' },
      { distance: 28, elevation: 3900, label: 'Plachach Thach' },
      { distance: 36, elevation: 4800, label: 'Seven Lakes Peak' },
      { distance: 65, elevation: 2550, label: 'Bada Bhangal' }
    ],
    familyFriendly: false,
    soloFriendly: false,
    snowTrek: true,
    oxygenLevel: '68% at Lakes',
    fitnessRequirement: 'Extreme fitness and self-reliance. Trekking in raw wilderness without defined paths.',
    baseCampsCount: 3,
    accommodation: 'Alpine survival tents.',
    transportation: 'Trek access over Thamsar or Kalihani passes from Bir or Manali.',
    nearestRailway: 'Pathankot - 180 km',
    nearestAirport: 'Kangra gaggal - 90 km',
    nearestBusStand: 'Bir Bus Stand - 50 km',
    medicalFacilities: 'No medical care or cellular signal. Evacuation requires satellite signaling and military help.',
    emergencyContacts: ['SDM Baijnath: 01894-263013', 'Kangra Rescue team: +91 94111-00000'],
    companyId: 'bikat',
    faqs: [
      { question: 'Why is this trek so remote?', answer: 'Bada Bhangal is cut off from roads. Accessing the village alone requires 3 days of heavy trekking over high passes, making it very isolated.' }
    ],
    packingChecklist: [
      { category: 'Gear', items: ['Satellite beacon / GPS', 'Rope kits', 'Warm sleeping bags'] }
    ],
    weatherForecast: [
      { day: 'Monday', temp: '8°C / -5°C', condition: 'Cloudy / Snow', wind: '22 km/h' }
    ],
    reviews: [
      { id: 'sl1', user: 'Deepak J.', avatar: '👨', rating: 5, date: '2025-08-10', comment: 'Truly pristine. We did not meet a single human for five days. The seven lakes are pure glacial magic.' }
    ]
  },
  {
    id: 'thamsar-pass',
    name: 'Thamsar Pass Trek',
    state: 'Himachal Pradesh',
    district: 'Kangra',
    difficulty: 'Hard',
    altitude: 4800,
    distance: 36,
    duration: 8,
    bestSeason: 'Summer & Autumn',
    bestTime: 'June to October',
    tempRange: '-5°C to 15°C',
    baseCamp: 'Rajgundha',
    baseCampDetails: 'Rajgundha is an eco-village near Billing, famous for its organic farming and beautiful clay houses.',
    rating: 4.7,
    startingPrice: 14000,
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'
    ],
    overview: 'Thamsar Pass is a high mountain pass in the Dhauladhar Range. It connects the beautiful Kangra Valley (via Billing and Rajgundha) to the remote village of Bada Bhangal, passing through glacial lakes, dense pine valleys, and raw rock trails.',
    coordinates: { lat: 32.29, lon: 76.78 },
    route: ['Rajgundha', 'Palachach', 'Panhartu', 'Thamsar Lake', 'Thamsar Pass Peak', 'Bada Bhangal', 'Rajgundha'],
    routeCoordinates: [
      { lat: 32.09, lon: 76.82 },
      { lat: 32.14, lon: 76.81 },
      { lat: 32.19, lon: 76.79 },
      { lat: 32.26, lon: 76.78 },
      { lat: 32.29, lon: 76.78 },
      { lat: 32.35, lon: 76.60 },
      { lat: 32.09, lon: 76.82 }
    ],
    elevationProfile: [
      { distance: 0, elevation: 2400, label: 'Rajgundha' },
      { distance: 15, elevation: 3000, label: 'Palachach Thach' },
      { distance: 28, elevation: 3600, label: 'Panhartu Camp' },
      { distance: 42, elevation: 4300, label: 'Thamsar Lake' },
      { distance: 50, elevation: 4800, label: 'Thamsar Pass' },
      { distance: 72, elevation: 2550, label: 'Bada Bhangal' }
    ],
    familyFriendly: false,
    soloFriendly: false,
    snowTrek: true,
    oxygenLevel: '68% at Pass',
    fitnessRequirement: 'High level of stamina. Steep moraines and walking over glaciers required.',
    baseCampsCount: 2,
    accommodation: 'Alpine camping tents.',
    transportation: 'Taxis to Billing, then walk to Rajgundha.',
    nearestRailway: 'Pathankot - 140 km',
    nearestAirport: 'Kangra gaggal - 70 km',
    nearestBusStand: 'Baijnath Bus Stand - 40 km',
    medicalFacilities: 'Baijnath Civil Hospital is the closest fully equipped medical post.',
    emergencyContacts: ['Baijnath Police: 01894-263020', 'Rescue Kangra: +91 94111-00000'],
    companyId: 'indiahikes',
    faqs: [
      { question: 'Is the pass open in June?', answer: 'Yes, but it is heavily snow-covered. Microspikes and experienced guides are highly recommended.' }
    ],
    packingChecklist: [
      { category: 'Gear', items: ['Microspikes', 'Thermos flask', 'Down feather jacket'] }
    ],
    weatherForecast: [
      { day: 'Monday', temp: '10°C / -4°C', condition: 'Sunny / Windy', wind: '15 km/h' }
    ],
    reviews: [
      { id: 'tp1', user: 'Sanjay K.', avatar: '👨', rating: 5, date: '2025-09-12', comment: 'The pass offers incredible views of the Kangra valley and Mani Mahesh range. A true wilderness cross-over.' }
    ]
  },
  {
    id: 'kugti-pass',
    name: 'Kugti Pass Trek',
    state: 'Himachal Pradesh',
    district: 'Chamba',
    difficulty: 'Hard',
    altitude: 5029,
    distance: 22.5,
    duration: 6,
    bestSeason: 'Summer & Autumn',
    bestTime: 'June to September',
    tempRange: '-8°C to 15°C',
    baseCamp: 'Kugti Village',
    baseCampDetails: 'Kugti is a remote shepherd village in Chamba district, preserving old wooden culture and temple networks.',
    rating: 4.8,
    startingPrice: 15000,
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80'
    ],
    overview: 'Kugti Pass is a challenging, holy mountain pass in the Pir Panjal Range. It is a traditional crossing trail used by Gaddi shepherds, passing through ancient temples (Kelang Temple), pine forest gorges, and a steep vertical glacier climb to the pass at 5,030m.',
    coordinates: { lat: 32.44, lon: 76.67 },
    route: ['Kugti Village', 'Kelang Temple', 'Duggi Cave', 'Kugti Pass Peak', 'Keylong (Lahaul)'],
    routeCoordinates: [
      { lat: 32.48, lon: 76.57 },
      { lat: 32.47, lon: 76.60 },
      { lat: 32.46, lon: 76.62 },
      { lat: 32.44, lon: 76.67 },
      { lat: 32.57, lon: 77.03 }
    ],
    elevationProfile: [
      { distance: 0, elevation: 2600, label: 'Kugti Village' },
      { distance: 8, elevation: 3200, label: 'Kelang Temple' },
      { distance: 16, elevation: 3800, label: 'Duggi Cave' },
      { distance: 28, elevation: 4300, label: 'Alyas Camp' },
      { distance: 35, elevation: 5030, label: 'Kugti Pass Peak' },
      { distance: 45, elevation: 3080, label: 'Keylong Lahaul' }
    ],
    familyFriendly: false,
    soloFriendly: false,
    snowTrek: true,
    oxygenLevel: '60% at Pass',
    fitnessRequirement: 'High level of physical conditioning. Crevasse crossing and steep ice climbing.',
    baseCampsCount: 2,
    accommodation: 'Tents and sheep shelter stone walls.',
    transportation: 'Local cabs from Bharmour to Kugti (20 km).',
    nearestRailway: 'Pathankot - 180 km',
    nearestAirport: 'Gaggal Airport, Kangra - 160 km',
    nearestBusStand: 'Bharmour Bus Stand - 20 km',
    medicalFacilities: 'Civil Hospital at Bharmour.',
    emergencyContacts: ['Bharmour Police: 01895-225021', 'Rescue Chamba: +91 94111-00000'],
    companyId: 'tth',
    faqs: [
      { question: 'Is the trek religious?', answer: 'Yes, Kugti pass is sacred to Lord Shiva. Gaddis pray at Kelang temple before crossing the pass.' }
    ],
    packingChecklist: [
      { category: 'Gear', items: ['Crampons', 'Ice axe', 'High altitude sleeping bags'] }
    ],
    weatherForecast: [
      { day: 'Monday', temp: '6°C / -8°C', condition: 'Sunny / Ice', wind: '20 km/h' }
    ],
    reviews: [
      { id: 'kp1', user: 'Shekhar G.', avatar: '👨', rating: 5, date: '2025-08-15', comment: 'Climbing the Kugti glacier with shepherds and their thousand sheep was an unforgettable scene.' }
    ]
  },
  {
    id: 'yulla-kanda',
    name: 'Yulla Kanda Trek',
    state: 'Himachal Pradesh',
    district: 'Kinnaur',
    difficulty: 'Hard',
    altitude: 4900,
    distance: 12,
    duration: 4,
    bestSeason: 'June to October',
    bestTime: 'June to October',
    tempRange: '-5°C to 20°C',
    baseCamp: 'Yulla Village',
    baseCampDetails: 'Yulla Village (Yulla Khas) is located in the Kinnaur district of Himachal Pradesh. A remote village with traditional wooden houses, apple orchards, and limited cellular connectivity (BSNL only).',
    rating: 4.7,
    startingPrice: 11000,
    image: 'https://images.hive.blog/DQmQby9NtzJgvDAam4cEu7tpSq2PAciGwvyQoSwKfsEXqGZ/IMG20210626160947_Original.jpg',
    images: [
      'https://images.hive.blog/DQmQby9NtzJgvDAam4cEu7tpSq2PAciGwvyQoSwKfsEXqGZ/IMG20210626160947_Original.jpg'
    ],
    overview: 'Yulla Kanda is famous for holding the highest Krishna Temple in the world, situated next to a holy lake at 3,895m (with the pass climbing up to 4,725m). Legend says the lake was made by the Pandavas, and local people float traditional hats in it to predict their fortune.',
    coordinates: { lat: 31.55, lon: 77.99 },
    route: ['Yulla Village', 'Forest Clearing', 'Yulla Lake Temple', 'Yulla Kanda Pass Peak', 'Yulla Village'],
    routeCoordinates: [
      { lat: 31.55, lon: 77.95 },
      { lat: 31.56, lon: 77.97 },
      { lat: 31.55, lon: 77.99 },
      { lat: 31.55, lon: 77.99 },
      { lat: 31.55, lon: 77.95 }
    ],
    elevationProfile: [
      { distance: 0, elevation: 2200, label: 'Yulla Village' },
      { distance: 6, elevation: 3100, label: 'Forest Camp' },
      { distance: 13, elevation: 3895, label: 'Krishna Temple Lake' },
      { distance: 16, elevation: 4725, label: 'Yulla Kanda Pass' },
      { distance: 26, elevation: 2200, label: 'Yulla Village' }
    ],
    familyFriendly: false,
    soloFriendly: false,
    snowTrek: false,
    oxygenLevel: '62% at Pass',
    fitnessRequirement: 'High physical endurance. The trail is steep with loose gravel and scree.',
    baseCampsCount: 1,
    accommodation: 'Tents next to the holy lake or village homestays.',
    transportation: 'Jeep from Shimla/Rampur to Tapri, then local vehicle to Yulla village.',
    nearestRailway: 'Kalka Railway Station (KLK) - 270 km',
    nearestAirport: 'Shimla Airport (SLV) - 250 km',
    nearestBusStand: 'Tapri Bus Stand - 12 km',
    medicalFacilities: 'Primary health clinic at Tapri. Major hospital at Rampur (95 km).',
    emergencyContacts: ['Kinnaur Police: 01786-222212', 'Tapri Rescue base: +91 94180-00000'],
    companyId: 'indiahikes',
    faqs: [
      { question: 'What is the significance of the floating hat ritual?', answer: 'Local devotees float traditional Kinnauri caps (hats) in the holy lake. If the cap floats to the other side without sinking, it is believed to bring extreme good fortune.' }
    ],
    packingChecklist: [
      { category: 'Gear', items: ['Trekking poles', 'Waterproof windbreaker', 'BSNL SIM card (only provider with network)'] }
    ],
    weatherForecast: [
      { day: 'Monday', temp: '14°C / -2°C', condition: 'Sunny / Cold Nights', wind: '12 km/h' }
    ],
    reviews: [
      { id: 'yk1', user: 'Sunil K.', avatar: '👨', rating: 5, date: '2025-09-02', comment: 'Visiting the Krishna Temple next to the silent mountain lake was a deeply spiritual experience. The climb to the pass is very challenging.' }
    ]
  },
  {
    id: 'miyar-valley',
    name: 'Miyar Valley Trek',
    state: 'Himachal Pradesh',
    district: 'Lahaul',
    difficulty: 'Moderate–Hard',
    altitude: 4115,
    distance: 27.5,
    duration: 7,
    bestSeason: 'Summer (June to September)',
    bestTime: 'June to September',
    tempRange: '0°C to 18°C',
    baseCamp: 'Khanjar / Udaipur',
    baseCampDetails: 'Khanjar is the last village in the Miyar Valley. Udaipur is the main junction town in Lahaul with budget hotels and local vehicle rentals.',
    rating: 4.6,
    startingPrice: 13500,
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'
    ],
    overview: 'Miyar Valley, also known as Lahaul\'s Valley of Flowers, is a flat, scenic glacial valley filled with wildflowers, sapphire streams, and stunning granite peaks. It is popular among both trekkers and rock climbers.',
    coordinates: { lat: 32.90, lon: 76.85 },
    route: ['Udaipur', 'Khanjar', 'Zardung Meadows', 'Miyar Glacier Snout', 'Khanjar'],
    routeCoordinates: [
      { lat: 32.73, lon: 76.90 },
      { lat: 32.85, lon: 76.86 },
      { lat: 32.90, lon: 76.85 },
      { lat: 32.95, lon: 76.82 },
      { lat: 32.85, lon: 76.86 }
    ],
    elevationProfile: [
      { distance: 0, elevation: 2750, label: 'Udaipur' },
      { distance: 10, elevation: 3300, label: 'Khanjar Village' },
      { distance: 28, elevation: 3750, label: 'Zardung Meadows' },
      { distance: 40, elevation: 4115, label: 'Miyar Glacier snout' },
      { distance: 55, elevation: 3300, label: 'Khanjar Village' }
    ],
    familyFriendly: true,
    soloFriendly: true,
    snowTrek: false,
    oxygenLevel: '78% at Glacier',
    fitnessRequirement: 'Moderate fitness. Flat trail walk but covers long distances over multiple days.',
    baseCampsCount: 1,
    accommodation: 'Tents in high meadows.',
    transportation: 'Taxis from Keylong or Manali to Udaipur and Khanjar.',
    nearestRailway: 'Joginder Nagar - 190 km',
    nearestAirport: 'Bhuntar Airport - 130 km',
    nearestBusStand: 'Udaipur Bus Stand - 28 km',
    medicalFacilities: 'Hospital at Keylong (75 km) and Udaipur clinic.',
    emergencyContacts: ['Keylong Police: 01900-222226', 'Lahaul Rescue: +91 94180-00000'],
    companyId: 'bikat',
    faqs: [
      { question: 'Is the valley flat?', answer: 'Yes, unlike other Himalayan valleys, Miyar is remarkably flat, making the walking very pleasant and less strenuous.' }
    ],
    packingChecklist: [
      { category: 'Gear', items: ['Trekking poles', 'UV Sunscreen', 'Warm fleece layer'] }
    ],
    weatherForecast: [
      { day: 'Monday', temp: '16°C / 2°C', condition: 'Sunny', wind: '8 km/h' }
    ],
    reviews: [
      { id: 'mv1', user: 'Sunita R.', avatar: '👩', rating: 5, date: '2025-07-15', comment: 'The carpet of wildflowers in July was incredible. Super flat and easy on the knees!' }
    ]
  },
  {
    id: 'sara-umga-pass',
    name: 'Sara Umga Pass Trek',
    state: 'Himachal Pradesh',
    district: 'Lahaul',
    difficulty: 'Extreme',
    altitude: 5200,
    distance: 32,
    duration: 8,
    bestSeason: 'Summer (June to September)',
    bestTime: 'June to September',
    tempRange: '-10°C to 15°C',
    baseCamp: 'Chhatru',
    baseCampDetails: 'Chhatru is a transit settlement on the Manali-Spiti road. Dhaba tents, basic supplies, and checkposts are located here.',
    rating: 4.8,
    startingPrice: 24000,
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80'
    ],
    overview: 'Sara Umga Pass is a high-altitude expedition connecting Kullu Valley with the cold desert of Lahaul. The trail climbs over steep moraines and requires navigating a heavily crevassed glacier to the pass at 5,200m.',
    coordinates: { lat: 32.25, lon: 77.48 },
    route: ['Chhatru', 'Chikka', 'Tenta Camp', 'Glacier Camp', 'Sara Umga Pass Peak', 'Chhatru'],
    routeCoordinates: [
      { lat: 32.27, lon: 77.42 },
      { lat: 32.26, lon: 77.45 },
      { lat: 32.25, lon: 77.46 },
      { lat: 32.25, lon: 77.48 },
      { lat: 32.27, lon: 77.42 }
    ],
    elevationProfile: [
      { distance: 0, elevation: 3350, label: 'Chhatru' },
      { distance: 10, elevation: 3800, label: 'Chikka Meadows' },
      { distance: 22, elevation: 4200, label: 'Tenta Camp' },
      { distance: 32, elevation: 5200, label: 'Sara Umga Pass' },
      { distance: 64, elevation: 3350, label: 'Chhatru' }
    ],
    familyFriendly: false,
    soloFriendly: false,
    snowTrek: true,
    oxygenLevel: '53% at Pass',
    fitnessRequirement: 'Extreme fitness. Experience in snow walking, roping, and high altitude acclimatization is mandatory.',
    baseCampsCount: 2,
    accommodation: 'High-altitude expedition tents.',
    transportation: 'Shared cabs from Manali to Chhatru (65 km).',
    nearestRailway: 'Joginder Nagar - 190 km',
    nearestAirport: 'Bhuntar Airport - 110 km',
    nearestBusStand: 'Manali Bus Stand - 65 km',
    medicalFacilities: 'No medical care on trail. Closest hospital in Manali.',
    emergencyContacts: ['Manali Police: 01902-252443', 'Lahaul Rescue: +91 94180-00000'],
    companyId: 'bikat',
    faqs: [
      { question: 'Do we cross crevasses?', answer: 'Yes, the glacier has multiple open and hidden crevasses. Roping up and using crampons is essential.' }
    ],
    packingChecklist: [
      { category: 'Gear', items: ['Climbing harness', 'Ice axe', 'Crampons', 'Warm mittens'] }
    ],
    weatherForecast: [
      { day: 'Monday', temp: '4°C / -8°C', condition: 'Snow Showers', wind: '20 km/h' }
    ],
    reviews: [
      { id: 'su1', user: 'Amit K.', avatar: '👨', rating: 5, date: '2025-08-12', comment: 'Crossing the pass was extremely tough with soft snow, but the view of Shigri peaks was unmatched.' }
    ]
  },
  {
    id: 'lamkhaga-pass',
    name: 'Lamkhaga Pass Trek',
    state: 'Himachal Pradesh',
    district: 'Kinnaur',
    difficulty: 'Extreme',
    altitude: 5282,
    distance: 45,
    duration: 11,
    bestSeason: 'June to October',
    bestTime: 'June to October',
    tempRange: '-10°C to 15°C',
    baseCamp: 'Chitkul',
    baseCampDetails: 'Chitkul is the last inhabited village on the Indo-Tibetan border in Kinnaur, featuring wooden structures and BSNL network.',
    rating: 4.9,
    startingPrice: 26000,
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80'
    ],
    overview: 'Lamkhaga Pass is a classic, high-altitude border cross-over trek connecting Harsil in Garhwal (Uttarakhand) with Chitkul in Kinnaur (Himachal Pradesh). It crosses remote, wild, and glaciated terrain along the Indo-China border, requiring strict inner-line permits.',
    coordinates: { lat: 31.25, lon: 78.43 },
    route: ['Harsil', 'Kyarkoti', 'Lamkhaga Base Camp', 'Lamkhaga Pass Peak', 'Dumti', 'Chitkul'],
    routeCoordinates: [
      { lat: 31.04, lon: 78.69 },
      { lat: 31.12, lon: 78.58 },
      { lat: 31.20, lon: 78.48 },
      { lat: 31.25, lon: 78.43 },
      { lat: 31.29, lon: 78.44 },
      { lat: 31.35, lon: 78.43 }
    ],
    elevationProfile: [
      { distance: 0, elevation: 2620, label: 'Harsil' },
      { distance: 15, elevation: 3820, label: 'Kyarkoti Meadows' },
      { distance: 35, elevation: 4400, label: 'Lamkhaga Base' },
      { distance: 48, elevation: 5282, label: 'Lamkhaga Pass' },
      { distance: 70, elevation: 4050, label: 'Dumti Forest post' },
      { distance: 90, elevation: 3450, label: 'Chitkul Kinnaur' }
    ],
    familyFriendly: false,
    soloFriendly: false,
    snowTrek: true,
    oxygenLevel: '52% at Pass',
    fitnessRequirement: 'Extreme cardio endurance. Multi-day glacier walking and capability to handle temperatures below -5°C.',
    baseCampsCount: 3,
    accommodation: 'Wilderness camping in snow/rocks.',
    transportation: 'Buses/cabs to Harsil (Uttarakhand) and pick up from Chitkul (Kinnaur).',
    nearestRailway: 'Dehradun Railway Station - 220 km',
    nearestAirport: 'Jolly Grant Airport, Dehradun - 240 km',
    nearestBusStand: 'Chitkul Bus Stand - 0 km',
    medicalFacilities: 'No medical centers. Strict military border checkposts are located along the route.',
    emergencyContacts: ['ITBP Chitkul: 100', 'Kinnaur Disaster Cell: 01786-222212'],
    companyId: 'indiahikes',
    faqs: [
      { question: 'Do Indian citizens need permits?', answer: 'Yes, an Inner Line Permit (ILP) signed by the District Magistrate of Uttarkashi and Kinnaur is mandatory due to close proximity to the border.' }
    ],
    packingChecklist: [
      { category: 'Gear', items: ['Inner Line Permit documents', 'Snow gaiters', 'Mountaineering ropes'] }
    ],
    weatherForecast: [
      { day: 'Monday', temp: '2°C / -12°C', condition: 'Blizzard / Snow', wind: '30 km/h' }
    ],
    reviews: [
      { id: 'lh1', user: 'Sanjeev N.', avatar: '👨', rating: 5, date: '2025-09-18', comment: 'Crossing from Uttarakhand to Himachal over the snowfields of Lamkhaga was a wild adventure. The ITBP jawans at Chitkul were very welcoming.' }
    ]
  },
  {
    id: 'bhaba-pass',
    name: 'Bhaba Pass Trek',
    state: 'Himachal Pradesh',
    district: 'Kinnaur',
    difficulty: 'Hard',
    altitude: 4877,
    distance: 25,
    duration: 7,
    bestSeason: 'July to September',
    bestTime: 'July to September',
    tempRange: '-5°C to 18°C',
    baseCamp: 'Kafnu',
    baseCampDetails: 'Kafnu is a quiet village in Kinnaur, featuring local homestays and basic checkposts.',
    rating: 4.8,
    startingPrice: 14000,
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80'
    ],
    overview: 'Bhaba Pass connects the green valleys of Kinnaur to the arid landscapes of Spiti. The trail runs alongside Bhaba river, climbing from lush green forests and meadows to the high, dry Spiti cold desert, ending at Mud village.',
    coordinates: { lat: 31.80, lon: 77.95 },
    route: ['Kafnu', 'Kara Meadows', 'Bhaba Pass Peak', 'Mud Spiti'],
    routeCoordinates: [
      { lat: 31.57, lon: 77.98 },
      { lat: 31.67, lon: 77.96 },
      { lat: 31.80, lon: 77.95 },
      { lat: 31.95, lon: 78.02 }
    ],
    elevationProfile: [
      { distance: 0, elevation: 2400, label: 'Kafnu' },
      { distance: 20, elevation: 3550, label: 'Kara Meadows' },
      { distance: 35, elevation: 4876, label: 'Bhaba Pass' },
      { distance: 50, elevation: 3750, label: 'Mud Spiti' }
    ],
    familyFriendly: false,
    soloFriendly: true,
    snowTrek: true,
    oxygenLevel: '66% at Pass',
    fitnessRequirement: 'High endurance. Steep climbs over rocky scree and snow slopes near the pass.',
    baseCampsCount: 1,
    accommodation: 'Tents in high meadows.',
    transportation: 'Shared cabs from Shimla to Kafnu.',
    nearestRailway: 'Shimla Toy Train - 200 km',
    nearestAirport: 'Shimla - 220 km',
    nearestBusStand: 'Kafnu Bus Stand - 0 km',
    medicalFacilities: 'Clinics at Kafnu and Tapri.',
    emergencyContacts: ['Kinnaur Police: 01786-222212', 'Mud Rescue team: +91 94180-88888'],
    companyId: 'indiahikes',
    faqs: [
      { question: 'Is the Spiti side road open?', answer: 'Yes, during summer the road between Mud village, Kaza, and Manali is open for vehicles.' }
    ],
    packingChecklist: [
      { category: 'Gear', items: ['Trekking poles', 'Poncho', 'Warm wool layers'] }
    ],
    weatherForecast: [
      { day: 'Monday', temp: '12°C / -4°C', condition: 'Sunny / Windy', wind: '15 km/h' }
    ],
    reviews: [
      { id: 'bp1', user: 'Harish K.', avatar: '👨', rating: 5, date: '2025-08-14', comment: 'The green fields of Kara and the contrast Spiti side was beautiful. An excellent alternative to Pin Bhaba.' }
    ]
  },
  {
    id: 'nag-tibba',
    name: 'Nag Tibba Trek',
    state: 'Uttarakhand',
    district: 'Tehri Garhwal',
    difficulty: 'Easy',
    altitude: 3022,
    distance: 8,
    duration: 2,
    bestSeason: 'Autumn & Spring',
    bestTime: 'October to April',
    tempRange: '0°C to 18°C',
    baseCamp: 'Pantwari',
    baseCampDetails: 'Pantwari is a small village near Mussoorie, featuring local homestays and basic amenities.',
    rating: 4.6,
    startingPrice: 3200,
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80'
    ],
    overview: 'Nag Tibba (Serpent\'s Peak) is the highest peak in the lesser Himalayan region of Uttarakhand. It is a perfect weekend trek for beginners, offering clear views of Bandarpoonch, Swargarohini, and the Gangotri group of peaks.',
    coordinates: { lat: 30.58, lon: 78.15 },
    route: ['Dehradun', 'Pantwari', 'Nag Tibba Base', 'Nag Tibba Summit', 'Pantwari', 'Dehradun'],
    routeCoordinates: [
      { lat: 30.31, lon: 78.03 },
      { lat: 30.55, lon: 78.12 },
      { lat: 30.57, lon: 78.14 },
      { lat: 30.58, lon: 78.15 }
    ],
    elevationProfile: [
      { distance: 0, elevation: 430, label: 'Dehradun' },
      { distance: 5, elevation: 1400, label: 'Pantwari' },
      { distance: 9, elevation: 2600, label: 'Nag Tibba Base' },
      { distance: 13, elevation: 3022, label: 'Nag Tibba Peak' }
    ],
    familyFriendly: true,
    soloFriendly: true,
    snowTrek: true,
    oxygenLevel: '92% at Summit',
    fitnessRequirement: 'Basic stamina. Walk 4-5 km comfortably.',
    baseCampsCount: 1,
    accommodation: 'Tents and guesthouses.',
    transportation: 'Shared cabs from Dehradun.',
    nearestRailway: 'Dehradun Railway Station - 85 km',
    nearestAirport: 'Jolly Grant Airport, Dehradun - 110 km',
    nearestBusStand: 'Dehradun ISBT - 90 km',
    medicalFacilities: 'Basic clinic at Pantwari. Hospital in Mussoorie (55 km).',
    emergencyContacts: ['Pantwari Police: 100', 'Mussoorie Hospital: +91 135-2632541'],
    faqs: [
      { question: 'Is Nag Tibba suitable for kids?', answer: 'Yes! It is one of the easiest weekend treks and is highly recommended for families and children.' }
    ],
    packingChecklist: [
      { category: 'Gear', items: ['Trekking poles', '2L Water bottle', 'Warm fleece layer'] }
    ],
    weatherForecast: [
      { day: 'Monday', temp: '15°C / 4°C', condition: 'Sunny', wind: '8 km/h' }
    ],
    companyId: 'tth',
    reviews: [
      { id: 'nt1', user: 'Varun S.', avatar: '👨', rating: 5, date: '2026-04-12', comment: 'An amazing weekend escape. The sunrise over the snowy peaks was spectacular.' }
    ]
  },
  {
    id: 'dayara-bugyal',
    name: 'Dayara Bugyal Trek',
    state: 'Uttarakhand',
    district: 'Uttarkashi',
    difficulty: 'Easy-Moderate',
    altitude: 3688,
    distance: 11,
    duration: 5,
    bestSeason: 'Winter & Autumn',
    bestTime: 'December to March, September to November',
    tempRange: '-2°C to 15°C',
    baseCamp: 'Raithal',
    baseCampDetails: 'Raithal is a scenic heritage village in Uttarkashi district, famous for apple orchards and traditional homes.',
    rating: 4.8,
    startingPrice: 7500,
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'
    ],
    overview: 'Dayara Bugyal is one of the most expansive and beautiful alpine meadows in India. The trek winds through deep maple and oak forests, opening up to vast green pastures that transform into a winter wonderland in December.',
    coordinates: { lat: 30.82, lon: 78.55 },
    route: ['Dehradun', 'Raithal', 'Gui Camp', 'Dayara Top', 'Raithal', 'Dehradun'],
    routeCoordinates: [
      { lat: 30.31, lon: 78.03 },
      { lat: 30.77, lon: 78.52 },
      { lat: 30.80, lon: 78.54 },
      { lat: 30.82, lon: 78.55 }
    ],
    elevationProfile: [
      { distance: 0, elevation: 430, label: 'Dehradun' },
      { distance: 6, elevation: 2100, label: 'Raithal' },
      { distance: 10, elevation: 2900, label: 'Gui Camp' },
      { distance: 15, elevation: 3688, label: 'Dayara Top' }
    ],
    familyFriendly: true,
    soloFriendly: true,
    snowTrek: true,
    oxygenLevel: '80% at Summit',
    fitnessRequirement: 'Moderate fitness. Regular jogging/walking is recommended.',
    baseCampsCount: 1,
    accommodation: 'Tents and local homestays.',
    transportation: 'Bolero pick-ups from Dehradun.',
    nearestRailway: 'Dehradun Railway Station - 180 km',
    nearestAirport: 'Jolly Grant Airport, Dehradun - 205 km',
    nearestBusStand: 'Uttarkashi Bus Stand - 35 km',
    medicalFacilities: 'Primary health center at Bhatwari. Hospital at Uttarkashi.',
    emergencyContacts: ['Bhatwari Police: 01374-242222', 'Uttarkashi Hospital: 01374-222216'],
    faqs: [
      { question: 'What is Gui campsite famous for?', answer: 'Gui is surrounded by dense forests and has cozy igloo-like forest huts, offering a very unique camping experience.' }
    ],
    packingChecklist: [
      { category: 'Clothing', items: ['Thermal layers (winter)', 'Waterproof outer pants', 'Thermal gloves'] }
    ],
    weatherForecast: [
      { day: 'Monday', temp: '10°C / -3°C', condition: 'Sunny / Clear', wind: '10 km/h' }
    ],
    companyId: 'indiahikes',
    reviews: [
      { id: 'db1', user: 'Neha M.', avatar: '👩', rating: 5, date: '2026-01-15', comment: 'The vast meadows blanketed in snow looked like a dreamscape. Perfect winter trek!' }
    ]
  },
  {
    id: 'chopta-tungnath',
    name: 'Chopta Tungnath Trek',
    state: 'Uttarakhand',
    district: 'Rudraprayag',
    difficulty: 'Easy',
    altitude: 3680,
    distance: 3.5,
    duration: 1,
    bestSeason: 'Year-round',
    bestTime: 'April to November',
    tempRange: '5°C to 20°C',
    baseCamp: 'Chopta',
    baseCampDetails: 'Chopta is a scenic hamlet known as the mini Switzerland of Uttarakhand, located inside Kedarnath Wildlife Sanctuary.',
    rating: 4.7,
    startingPrice: 1500,
    image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80'
    ],
    overview: 'This is a short, paved day trek leading to Tungnath Temple, the highest Shiva temple in the world. It passes through beautiful rhododendron forests and high meadows, with views of Mt. Chaukhamba and Nanda Devi.',
    coordinates: { lat: 30.49, lon: 79.22 },
    route: ['Chopta', 'Tungnath Temple', 'Chopta'],
    routeCoordinates: [
      { lat: 30.48, lon: 79.21 },
      { lat: 30.49, lon: 79.22 },
      { lat: 30.48, lon: 79.21 }
    ],
    elevationProfile: [
      { distance: 0, elevation: 2680, label: 'Chopta' },
      { distance: 3.5, elevation: 3680, label: 'Tungnath Temple' }
    ],
    familyFriendly: true,
    soloFriendly: true,
    snowTrek: false,
    oxygenLevel: '82% at Temple',
    fitnessRequirement: 'Basic stamina. The trail is fully paved but climbs steadily.',
    baseCampsCount: 1,
    accommodation: 'None (Day trek). Lodges and camps available at Chopta.',
    transportation: 'Buses or taxis from Rishikesh/Haridwar.',
    nearestRailway: 'Rishikesh Railway Station - 200 km',
    nearestAirport: 'Jolly Grant Airport, Dehradun - 220 km',
    nearestBusStand: 'Ukhimath Bus Stand - 30 km',
    medicalFacilities: 'Government clinic at Ukhimath. Zonal hospital at Rudraprayag.',
    emergencyContacts: ['Ukhimath Police: 01364-264222', 'Rudraprayag Hospital: 01364-233211'],
    faqs: [
      { question: 'Is Tungnath temple open in winter?', answer: 'The temple remains closed in winter due to heavy snow. The idol of Lord Shiva is shifted down to Mukunath temple in Maku village.' }
    ],
    packingChecklist: [
      { category: 'Gear', items: ['Comfortable walking shoes', 'Poncho (monsoon)', 'Sun protection cap'] }
    ],
    weatherForecast: [
      { day: 'Monday', temp: '16°C / 6°C', condition: 'Partly Cloudy', wind: '6 km/h' }
    ],
    companyId: 'sahyadri-guides',
    reviews: [
      { id: 'ct1', user: 'Shrikant J.', avatar: '👨', rating: 5, date: '2026-05-20', comment: 'A short but deeply spiritual hike. The surrounding mountains were completely clear and visible.' }
    ]
  },
  {
    id: 'tungnath-chandrashila',
    name: 'Tungnath Chandrashila Trek',
    state: 'Uttarakhand',
    district: 'Rudraprayag',
    difficulty: 'Easy-Moderate',
    altitude: 4000,
    distance: 5,
    duration: 2,
    bestSeason: 'Spring & Winter',
    bestTime: 'March to June, November to January',
    tempRange: '-4°C to 15°C',
    baseCamp: 'Chopta',
    baseCampDetails: 'Chopta is located at 2,680m in Rudraprayag. Famous for alpine meadows and wildlife.',
    rating: 4.8,
    startingPrice: 3500,
    image: 'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?auto=format&fit=crop&w=800&q=80'
    ],
    overview: 'Extending the Chopta-Tungnath trail, this trek climbs up to the Chandrashila summit at 4,000m. The peak offers a jaw-dropping 360-degree panorama of the Garhwal and Kumaon Himalayas, including Kedar Dome, Trishul, and Chaukhamba.',
    coordinates: { lat: 30.49, lon: 79.23 },
    route: ['Chopta', 'Tungnath Temple', 'Chandrashila Summit', 'Chopta'],
    routeCoordinates: [
      { lat: 30.48, lon: 79.21 },
      { lat: 30.49, lon: 79.22 },
      { lat: 30.49, lon: 79.23 },
      { lat: 30.48, lon: 79.21 }
    ],
    elevationProfile: [
      { distance: 0, elevation: 2680, label: 'Chopta' },
      { distance: 3.5, elevation: 3680, label: 'Tungnath Temple' },
      { distance: 5, elevation: 4000, label: 'Chandrashila Peak' }
    ],
    familyFriendly: true,
    soloFriendly: true,
    snowTrek: true,
    oxygenLevel: '76% at Summit',
    fitnessRequirement: 'Basic stamina. The final stretch to Chandrashila is steep and rocky.',
    baseCampsCount: 1,
    accommodation: 'Camps and guest houses in Chopta.',
    transportation: 'Shared cabs from Rishikesh.',
    nearestRailway: 'Rishikesh - 200 km',
    nearestAirport: 'Jolly Grant, Dehradun - 220 km',
    nearestBusStand: 'Ukhimath Bus Stand - 30 km',
    medicalFacilities: 'First aid in Chopta. Hospital in Rudraprayag.',
    emergencyContacts: ['Ukhimath Police: 01364-264222', 'Rudraprayag Hospital: 01364-233211'],
    faqs: [
      { question: 'Is there mobile connectivity in Chopta?', answer: 'Jio has basic connectivity at Chopta, but signal strength is patchy on the trail.' }
    ],
    packingChecklist: [
      { category: 'Gear', items: ['Trekking shoes with good grip', 'Warm layers', 'UV Sunglasses'] }
    ],
    weatherForecast: [
      { day: 'Monday', temp: '12°C / 2°C', condition: 'Sunny', wind: '8 km/h' }
    ],
    companyId: 'tth',
    reviews: [
      { id: 'tc1', user: 'Rahul P.', avatar: '👨', rating: 5, date: '2026-05-18', comment: 'Standing on the Chandrashila peak at sunrise was a spiritual experience. The view of Mt. Chaukhamba was breathtaking.' }
    ]
  },
  {
    id: 'deoriatal-chandrashila',
    name: 'Deoriatal Chandrashila Trek',
    state: 'Uttarakhand',
    district: 'Rudraprayag',
    difficulty: 'Easy-Moderate',
    altitude: 4000,
    distance: 15,
    duration: 5,
    bestSeason: 'Spring & Autumn',
    bestTime: 'March to May, September to November',
    tempRange: '-3°C to 15°C',
    baseCamp: 'Sari Village',
    baseCampDetails: 'Sari Village is the starting point, famous for agricultural fields, local homestays, and clay houses.',
    rating: 4.8,
    startingPrice: 8000,
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80'
    ],
    overview: 'This classic crossover trek starts at Sari Village, climbs to the beautiful Deoriatal Lake which reflects Mt. Chaukhamba on its crystal clear waters, crosses dense rhododendron forests to Chopta, and concludes with a summit climb of Chandrashila Peak.',
    coordinates: { lat: 30.52, lon: 79.13 },
    route: ['Haridwar', 'Sari Village', 'Deoriatal Lake', 'Chopta Forest Camp', 'Chandrashila Peak', 'Sari'],
    routeCoordinates: [
      { lat: 29.94, lon: 78.16 },
      { lat: 30.51, lon: 79.12 },
      { lat: 30.52, lon: 79.13 },
      { lat: 30.48, lon: 79.21 },
      { lat: 30.49, lon: 79.23 }
    ],
    elevationProfile: [
      { distance: 0, elevation: 314, label: 'Haridwar' },
      { distance: 5, elevation: 2000, label: 'Sari Village' },
      { distance: 8, elevation: 2438, label: 'Deoriatal Lake' },
      { distance: 12, elevation: 2680, label: 'Chopta Camp' },
      { distance: 15, elevation: 4000, label: 'Chandrashila Peak' }
    ],
    familyFriendly: true,
    soloFriendly: true,
    snowTrek: true,
    oxygenLevel: '76% at Summit',
    fitnessRequirement: 'Moderate fitness. Regular walking/cardio prep is sufficient.',
    baseCampsCount: 2,
    accommodation: 'Tents and village homestays.',
    transportation: 'Shared cabs from Haridwar/Rishikesh.',
    nearestRailway: 'Rishikesh Railway Station - 190 km',
    nearestAirport: 'Jolly Grant Airport - 210 km',
    nearestBusStand: 'Ukhimath Bus Stand - 15 km',
    medicalFacilities: 'Government clinic at Ukhimath. Zonal hospital at Rudraprayag.',
    emergencyContacts: ['Ukhimath Police: 01364-264222', 'Rudraprayag Hospital: 01364-233211'],
    faqs: [
      { question: 'Why is Deoriatal famous?', answer: 'Devotees believe that the gods bathed in this lake. Waking up to see Mt. Chaukhamba reflected in the water is a photographer\'s dream.' }
    ],
    packingChecklist: [
      { category: 'Gear', items: ['Trekking poles', 'Poncho', 'UV Sunglasses', 'Warm fleece layer'] }
    ],
    weatherForecast: [
      { day: 'Monday', temp: '14°C / 2°C', condition: 'Sunny', wind: '8 km/h' }
    ],
    companyId: 'indiahikes',
    reviews: [
      { id: 'dc1', user: 'Sunita R.', avatar: '👩', rating: 5, date: '2026-05-15', comment: 'The rhododendron forests in April were a blaze of red flowers. Highly recommend!' }
    ]
  },
  {
    id: 'valley-of-flowers',
    name: 'Valley of Flowers Trek',
    state: 'Uttarakhand',
    district: 'Chamoli',
    difficulty: 'Moderate',
    altitude: 4298,
    distance: 17,
    duration: 6,
    bestSeason: 'Monsoon',
    bestTime: 'July to September',
    tempRange: '3°C to 18°C',
    baseCamp: 'Govindghat',
    baseCampDetails: 'Govindghat is a bustling town near Joshimath on the banks of Alaknanda river, featuring hotels and gurudwaras.',
    rating: 4.8,
    startingPrice: 9500,
    image: 'https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?auto=format&fit=crop&w=800&q=80'
    ],
    overview: 'Valley of Flowers is a UNESCO World Heritage Site nestled in the Chamoli district. The valley comes alive during the monsoon with over 500 species of alpine flowers. The trek also climbs to the holy lake of Hemkund Sahib, a sacred Sikh shrine located at 4,329m.',
    coordinates: { lat: 30.72, lon: 79.60 },
    route: ['Rishikesh', 'Govindghat', 'Ghangaria', 'Valley of Flowers', 'Hemkund Sahib', 'Govindghat'],
    routeCoordinates: [
      { lat: 30.08, lon: 78.26 },
      { lat: 30.62, lon: 79.56 },
      { lat: 30.70, lon: 79.59 },
      { lat: 30.72, lon: 79.60 },
      { lat: 30.70, lon: 79.62 }
    ],
    elevationProfile: [
      { distance: 0, elevation: 340, label: 'Rishikesh' },
      { distance: 10, elevation: 1828, label: 'Govindghat' },
      { distance: 22, elevation: 3048, label: 'Ghangaria' },
      { distance: 26, elevation: 3658, label: 'Valley Floor' },
      { distance: 32, elevation: 4329, label: 'Hemkund Sahib' }
    ],
    familyFriendly: true,
    soloFriendly: true,
    snowTrek: false,
    oxygenLevel: '72% at Hemkund',
    fitnessRequirement: 'Moderate endurance. The climb to Hemkund Sahib is steep.',
    baseCampsCount: 1,
    accommodation: 'Guesthouses and hotels at Ghangaria (camping inside the valley is forbidden).',
    transportation: 'Shared cabs or buses from Rishikesh to Govindghat.',
    nearestRailway: 'Rishikesh Railway Station - 290 km',
    nearestAirport: 'Jolly Grant Airport, Dehradun - 310 km',
    nearestBusStand: 'Joshimath Bus Stand - 20 km',
    medicalFacilities: 'Military clinics at Ghangaria. Primary Health Center at Joshimath.',
    emergencyContacts: ['Ghangaria Police post: 100', 'Joshimath Hospital: 01389-222102'],
    faqs: [
      { question: 'When is the best time to see the flowers?', answer: 'The valley is at its bloom peak from mid-July to the end of August, shortly after the monsoon rains begin.' }
    ],
    packingChecklist: [
      { category: 'Gear', items: ['High wet-grip trekking shoes', 'Poncho/Raincoat', 'Trekking poles'] }
    ],
    weatherForecast: [
      { day: 'Monday', temp: '15°C / 5°C', condition: 'Rainy', wind: '12 km/h' }
    ],
    companyId: 'tth',
    reviews: [
      { id: 'vf1', user: 'Amit K.', avatar: '👨', rating: 5, date: '2025-08-10', comment: 'Standing in a valley full of orchids and blue poppies was surreal. The climb to Hemkund Sahib was challenging but rewarding.' }
    ]
  },
  {
    id: 'kuari-pass',
    name: 'Kuari Pass Trek',
    state: 'Uttarakhand',
    district: 'Chamoli',
    difficulty: 'Moderate',
    altitude: 3815,
    distance: 16.5,
    duration: 6,
    bestSeason: 'Winter Snow Trek',
    bestTime: 'December to March',
    tempRange: '-5°C to 12°C',
    baseCamp: 'Dhak Village',
    baseCampDetails: 'Dhak is a small road-head village near Joshimath. Basic homestays and trail guides are available.',
    rating: 4.7,
    startingPrice: 9000,
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80'
    ],
    overview: 'Kuari Pass (Lord Curzon\'s trail) is a highly recommended winter trek. It crosses beautiful alpine forests and wide meadows (Gorson Bugyal), offering close-up views of Mt. Nanda Devi, Dronagiri, and Hathi Ghoda peaks.',
    coordinates: { lat: 30.55, lon: 79.65 },
    route: ['Joshimath', 'Dhak Village', 'Chitrakantha', 'Tali Top', 'Kuari Pass Peak', 'Auli'],
    routeCoordinates: [
      { lat: 30.55, lon: 79.56 },
      { lat: 30.54, lon: 79.60 },
      { lat: 30.54, lon: 79.63 },
      { lat: 30.55, lon: 79.65 },
      { lat: 30.55, lon: 79.65 },
      { lat: 30.53, lon: 79.56 }
    ],
    elevationProfile: [
      { distance: 0, elevation: 1874, label: 'Joshimath' },
      { distance: 5, elevation: 2100, label: 'Dhak Village' },
      { distance: 10, elevation: 3300, label: 'Chitrakantha' },
      { distance: 15, elevation: 3500, label: 'Tali Top' },
      { distance: 20, elevation: 3815, label: 'Kuari Pass' },
      { distance: 28, elevation: 2500, label: 'Auli Resort' }
    ],
    familyFriendly: true,
    soloFriendly: true,
    snowTrek: true,
    oxygenLevel: '78% at Pass',
    fitnessRequirement: 'Moderate stamina. Ability to walk in snow for 5-6 hours.',
    baseCampsCount: 2,
    accommodation: 'Tents in high-altitude meadows.',
    transportation: 'Taxis from Haridwar/Rishikesh to Joshimath.',
    nearestRailway: 'Rishikesh Railway Station - 250 km',
    nearestAirport: 'Jolly Grant Airport, Dehradun - 270 km',
    nearestBusStand: 'Joshimath Bus Stand - 12 km',
    medicalFacilities: 'Zonal hospital at Joshimath.',
    emergencyContacts: ['Joshimath Police: 01389-222100', 'TTH Helpdesk: +91 90000-00000'],
    faqs: [
      { question: 'Why is it called Lord Curzon\'s trail?', answer: 'The pass became popular after Lord Curzon, the Viceroy of India, trekked here in 1905, establishing a path that became famous among early explorers.' }
    ],
    packingChecklist: [
      { category: 'Gear', items: ['Gaiters and Microspikes (winter)', 'Thermal inners', 'Warm cap'] }
    ],
    weatherForecast: [
      { day: 'Monday', temp: '8°C / -4°C', condition: 'Clear', wind: '12 km/h' }
    ],
    companyId: 'indiahikes',
    reviews: [
      { id: 'kup1', user: 'Harish M.', avatar: '👨', rating: 5, date: '2026-01-20', comment: 'The view of Mt. Nanda Devi from the pass is something I will never forget. Excellent guide team.' }
    ]
  },
  {
    id: 'brahmatal',
    name: 'Brahmatal Trek',
    state: 'Uttarakhand',
    district: 'Chamoli',
    difficulty: 'Moderate',
    altitude: 3734,
    distance: 12,
    duration: 6,
    bestSeason: 'Winter Snow Trek',
    bestTime: 'December to February',
    tempRange: '-6°C to 10°C',
    baseCamp: 'Lohajung',
    baseCampDetails: 'Lohajung is located in Chamoli, accessible via Kathgodam/Dehradun.',
    rating: 4.8,
    startingPrice: 8500,
    image: 'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?auto=format&fit=crop&w=800&q=80'
    ],
    overview: 'Brahmatal is a holy lake dedicated to Lord Brahma. The trek offers a classic winter snow experience, passing through dark oak forests and snow-covered ridges with close-up views of Mt. Trishul and Nanda Ghunti peaks.',
    coordinates: { lat: 30.15, lon: 79.68 },
    route: ['Kathgodam', 'Lohajung', 'Bekaltal', 'Brahmatal Lake', 'Brahmatal Ridge', 'Lohajung'],
    routeCoordinates: [
      { lat: 29.27, lon: 79.54 },
      { lat: 30.05, lon: 79.62 },
      { lat: 30.10, lon: 79.65 },
      { lat: 30.14, lon: 79.67 },
      { lat: 30.15, lon: 79.68 }
    ],
    elevationProfile: [
      { distance: 0, elevation: 554, label: 'Kathgodam' },
      { distance: 10, elevation: 2330, label: 'Lohajung' },
      { distance: 16, elevation: 2950, label: 'Bekaltal Lake' },
      { distance: 22, elevation: 3180, label: 'Brahmatal Lake' },
      { distance: 26, elevation: 3734, label: 'Brahmatal Peak' }
    ],
    familyFriendly: true,
    soloFriendly: true,
    snowTrek: true,
    oxygenLevel: '80% at Summit',
    fitnessRequirement: 'Moderate stamina. Regular cardio preparation is recommended.',
    baseCampsCount: 1,
    accommodation: 'Campsites next to snow patches.',
    transportation: 'Shared cabs from Kathgodam.',
    nearestRailway: 'Kathgodam Railway Station - 220 km',
    nearestAirport: 'Pantnagar Airport - 250 km',
    nearestBusStand: 'Haldwani Bus Stand - 225 km',
    medicalFacilities: 'Clinic at Lohajung. Hospital at Dewal.',
    emergencyContacts: ['Lohajung Police: 100', 'Dewal Clinic: +91 94111-00000'],
    faqs: [
      { question: 'Is Bekaltal lake frozen in winter?', answer: 'Yes, Bekaltal lake freezes completely in January, reflecting the surrounding oak forests.' }
    ],
    packingChecklist: [
      { category: 'Gear', items: ['Crampons/Spikes', 'Thermal water bottle', 'Down jacket'] }
    ],
    weatherForecast: [
      { day: 'Monday', temp: '6°C / -6°C', condition: 'Snowy', wind: '15 km/h' }
    ],
    companyId: 'bikat',
    reviews: [
      { id: 'bt1', user: 'Varun K.', avatar: '👨', rating: 5, date: '2026-01-10', comment: 'Camping on the snow next to Bekaltal lake under the stars was incredible. Great adventure!' }
    ]
  },
  {
    id: 'ali-bedni-bugyal',
    name: 'Ali Bedni Bugyal Trek',
    state: 'Uttarakhand',
    district: 'Chamoli',
    difficulty: 'Moderate',
    altitude: 3825,
    distance: 15,
    duration: 7,
    bestSeason: 'Autumn & Spring',
    bestTime: 'May to June, September to October',
    tempRange: '-2°C to 15°C',
    baseCamp: 'Lohajung',
    baseCampDetails: 'Lohajung is the base camp, located at 2,330m in Chamoli district.',
    rating: 4.8,
    startingPrice: 9500,
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80'
    ],
    overview: 'This trek explores the twin meadows of Ali and Bedni Bugyal, which are among the largest and most pristine alpine pastures in Asia. The trail passes through dense oak and rhododendron forests, offering close-up views of Mt. Trishul and Nanda Ghunti.',
    coordinates: { lat: 30.22, lon: 79.70 },
    route: ['Kathgodam', 'Lohajung', 'Didina', 'Ali Bugyal', 'Bedni Bugyal', 'Wan', 'Kathgodam'],
    routeCoordinates: [
      { lat: 29.27, lon: 79.54 },
      { lat: 30.05, lon: 79.62 },
      { lat: 30.12, lon: 79.68 },
      { lat: 30.18, lon: 79.71 },
      { lat: 30.22, lon: 79.70 }
    ],
    elevationProfile: [
      { distance: 0, elevation: 554, label: 'Kathgodam' },
      { distance: 10, elevation: 2330, label: 'Lohajung' },
      { distance: 18, elevation: 2450, label: 'Didina' },
      { distance: 26, elevation: 3400, label: 'Ali Bugyal' },
      { distance: 32, elevation: 3825, label: 'Bedni Bugyal' }
    ],
    familyFriendly: false,
    soloFriendly: true,
    snowTrek: false,
    oxygenLevel: '78% at Meadows',
    fitnessRequirement: 'Moderate fitness. Ability to hike uphill for 4-5 hours a day.',
    baseCampsCount: 2,
    accommodation: 'Alpine camping tents.',
    transportation: 'Shared cabs from Kathgodam.',
    nearestRailway: 'Kathgodam - 220 km',
    nearestAirport: 'Pantnagar - 250 km',
    nearestBusStand: 'Dewal Bus Stand - 24 km',
    medicalFacilities: 'Government clinic at Lohajung.',
    emergencyContacts: ['Lohajung Police: 100', 'Dewal Health Post: 01363-272101'],
    faqs: [
      { question: 'Are camping permits required?', answer: 'Yes, forest permits are required to camp on the meadows, which are strictly managed by local forest departments.' }
    ],
    packingChecklist: [
      { category: 'Gear', items: ['Trekking poles', 'Fleece jackets', 'Raincover'] }
    ],
    weatherForecast: [
      { day: 'Monday', temp: '14°C / 2°C', condition: 'Sunny', wind: '8 km/h' }
    ],
    companyId: 'indiahikes',
    reviews: [
      { id: 'ab1', user: 'Anil K.', avatar: '👨', rating: 5, date: '2025-06-12', comment: 'The green grass undulating like sea waves under the shadow of Mt. Trishul was majestic.' }
    ]
  },
  {
    id: 'har-ki-dun',
    name: 'Har Ki Dun Trek',
    state: 'Uttarakhand',
    district: 'Uttarkashi',
    difficulty: 'Moderate',
    altitude: 3612,
    distance: 22,
    duration: 7,
    bestSeason: 'Spring & Autumn',
    bestTime: 'April to June, September to November',
    tempRange: '-2°C to 15°C',
    baseCamp: 'Sankri',
    baseCampDetails: 'Sankri is a popular trekking base inside Govind Wildlife Sanctuary.',
    rating: 4.8,
    startingPrice: 10500,
    image: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=800&q=80'
    ],
    overview: 'Har Ki Dun (Valley of Gods) is a cradle-shaped valley inside Govind National Park. The trail goes along the Supin River, passing through ancient wooden villages (Osla and Seema) that preserve centuries-old culture and architecture, ending under the shadow of Swargarohini peak.',
    coordinates: { lat: 31.15, lon: 78.40 },
    route: ['Dehradun', 'Sankri', 'Taluka', 'Osla', 'Har Ki Dun Valley', 'Sankri'],
    routeCoordinates: [
      { lat: 30.31, lon: 78.03 },
      { lat: 31.07, lon: 78.18 },
      { lat: 31.09, lon: 78.25 },
      { lat: 31.12, lon: 78.33 },
      { lat: 31.15, lon: 78.40 }
    ],
    elevationProfile: [
      { distance: 0, elevation: 430, label: 'Dehradun' },
      { distance: 6, elevation: 1950, label: 'Sankri' },
      { distance: 12, elevation: 2100, label: 'Taluka' },
      { distance: 22, elevation: 2600, label: 'Osla Village' },
      { distance: 34, elevation: 3612, label: 'Har Ki Dun' }
    ],
    familyFriendly: true,
    soloFriendly: true,
    snowTrek: true,
    oxygenLevel: '82% at Valley Floor',
    fitnessRequirement: 'Moderate stamina. Long walks (10-12 km daily) on river banks.',
    baseCampsCount: 2,
    accommodation: 'Wooden guesthouses, homestays, and tents.',
    transportation: 'Bolero cabs from Dehradun.',
    nearestRailway: 'Dehradun Railway Station - 200 km',
    nearestAirport: 'Jolly Grant, Dehradun - 220 km',
    nearestBusStand: 'Sankri Bus Depot - 0 km',
    medicalFacilities: 'Clinic at Sankri. Primary Health Center at Purola.',
    emergencyContacts: ['Sankri Rescue: +91 94111-94222', 'Purola Hospital: 01373-222412'],
    faqs: [
      { question: 'What is the Duryodhana Temple legend?', answer: 'The temple in Osla village was historically dedicated to Duryodhana, but local villagers now worship Someshwar (a form of Shiva).' }
    ],
    packingChecklist: [
      { category: 'Gear', items: ['Trekking poles', 'Poncho', 'Comfortable hiking shoes'] }
    ],
    weatherForecast: [
      { day: 'Monday', temp: '14°C / -1°C', condition: 'Sunny', wind: '8 km/h' }
    ],
    companyId: 'tth',
    reviews: [
      { id: 'hd1', user: 'Rajesh S.', avatar: '👨', rating: 5, date: '2025-06-18', comment: 'The valley architecture is incredibly unique. Standing at the snout under Swargarohini peak was breathtaking.' }
    ]
  },
  {
    id: 'pangarchulla-peak',
    name: 'Pangarchulla Peak Trek',
    state: 'Uttarakhand',
    district: 'Chamoli',
    difficulty: 'Moderate-Hard',
    altitude: 4593,
    distance: 18,
    duration: 7,
    bestSeason: 'Spring Snow Climb',
    bestTime: 'April to May',
    tempRange: '-8°C to 12°C',
    baseCamp: 'Dhak Village',
    baseCampDetails: 'Dhak is near Joshimath. Basic base camp hotels and gear stores are available.',
    rating: 4.7,
    startingPrice: 11500,
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80'
    ],
    overview: 'Pangarchulla is a challenging peak climbing trek in the Nanda Devi sanctuary region. The summit climb requires navigating steep snow ridges and boulder systems, providing a thrilling introduction to basic mountaineering.',
    coordinates: { lat: 30.52, lon: 79.72 },
    route: ['Joshimath', 'Dhak', 'Khulara Camp', 'Pangarchulla Summit', 'Joshimath'],
    routeCoordinates: [
      { lat: 30.55, lon: 79.56 },
      { lat: 30.54, lon: 79.60 },
      { lat: 30.53, lon: 79.66 },
      { lat: 30.52, lon: 79.72 }
    ],
    elevationProfile: [
      { distance: 0, elevation: 1874, label: 'Joshimath' },
      { distance: 5, elevation: 2100, label: 'Dhak' },
      { distance: 12, elevation: 3225, label: 'Khulara Camp' },
      { distance: 18, elevation: 4593, label: 'Pangarchulla Summit' }
    ],
    familyFriendly: false,
    soloFriendly: false,
    snowTrek: true,
    oxygenLevel: '65% at Summit',
    fitnessRequirement: 'Excellent endurance. Must be comfortable climbing in soft snow and steep slopes.',
    baseCampsCount: 2,
    accommodation: 'High altitude camping tents.',
    transportation: 'Local cabs from Joshimath.',
    nearestRailway: 'Rishikesh Railway Station - 250 km',
    nearestAirport: 'Jolly Grant Airport - 270 km',
    nearestBusStand: 'Joshimath Bus Stand - 12 km',
    medicalFacilities: ' Joshimath Zonal Hospital is the closest medical checkpost.',
    emergencyContacts: ['Joshimath Police: 01389-222100', 'Bikat Rescue: +91 78381-48127'],
    faqs: [
      { question: 'Is climbing gear provided by the company?', answer: 'Yes, crampons, gaiters, and ice axes are usually provided by the organizing agencies during the summit push.' }
    ],
    packingChecklist: [
      { category: 'Clothing', items: ['Thermal top', 'Warm mittens', 'Waterproof snow pants'] }
    ],
    weatherForecast: [
      { day: 'Monday', temp: '5°C / -8°C', condition: 'Sunny / Ice', wind: '18 km/h' }
    ],
    companyId: 'bikat',
    reviews: [
      { id: 'ppk2', user: 'Harish R.', avatar: '👨', rating: 5, date: '2025-05-10', comment: 'An absolute thriller. Climbing the final ridge on hard snow was scary but highly satisfying.' }
    ]
  },
  {
    id: 'gaumukh',
    name: 'Gaumukh Trek',
    state: 'Uttarakhand',
    district: 'Uttarkashi',
    difficulty: 'Moderate',
    altitude: 4023,
    distance: 18,
    duration: 6,
    bestSeason: 'Summer & Autumn',
    bestTime: 'May to June, September to November',
    tempRange: '0°C to 15°C',
    baseCamp: 'Gangotri',
    baseCampDetails: 'Gangotri is a holy temple town on the banks of Bhagirathi river, featuring guest houses and temples.',
    rating: 4.7,
    startingPrice: 9000,
    image: 'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?auto=format&fit=crop&w=800&q=80'
    ],
    overview: 'This holy trek leads to Gaumukh, the snout of the Gangotri Glacier and the geological source of the Bhagirathi River (Ganga). The trail goes inside Gangotri National Park, offering views of Mt. Shivling and Bhagirathi peaks.',
    coordinates: { lat: 30.92, lon: 79.08 },
    route: ['Gangotri', 'Chirbasa', 'Bhojbasa', 'Gaumukh Snout', 'Gangotri'],
    routeCoordinates: [
      { lat: 30.99, lon: 78.93 },
      { lat: 30.96, lon: 79.01 },
      { lat: 30.94, lon: 79.05 },
      { lat: 30.92, lon: 79.08 }
    ],
    elevationProfile: [
      { distance: 0, elevation: 3415, label: 'Gangotri' },
      { distance: 9, elevation: 3580, label: 'Chirbasa' },
      { distance: 14, elevation: 3790, label: 'Bhojbasa' },
      { distance: 18, elevation: 4023, label: 'Gaumukh Snout' }
    ],
    familyFriendly: true,
    soloFriendly: true,
    snowTrek: false,
    oxygenLevel: '75% at Snout',
    fitnessRequirement: 'Moderate stamina. Steady climbs over rocky pathways.',
    baseCampsCount: 1,
    accommodation: 'Tents and tourist rest houses at Bhojbasa.',
    transportation: 'Private cabs from Uttarkashi/Dehradun.',
    nearestRailway: 'Dehradun Railway Station - 240 km',
    nearestAirport: 'Jolly Grant Airport, Dehradun - 260 km',
    nearestBusStand: 'Gangotri Bus Stand - 0 km',
    medicalFacilities: 'Medical post at Gangotri and army clinic at Bhojbasa.',
    emergencyContacts: ['Gangotri Police: 01374-222244', 'Uttarkashi Disaster Cell: 01374-222212'],
    faqs: [
      { question: 'Are permits mandatory for Gaumukh?', answer: 'Yes, a national park permit (Bhagirathi permit) is strictly limited to 150 trekkers per day. Apply online or at Uttarkashi forest office.' }
    ],
    packingChecklist: [
      { category: 'Gear', items: ['Trekking shoes', 'Thermal flask', 'Warm Cap'] }
    ],
    weatherForecast: [
      { day: 'Monday', temp: '12°C / 1°C', condition: 'Sunny', wind: '10 km/h' }
    ],
    companyId: 'tth',
    reviews: [
      { id: 'gm1', user: 'Shanti N.', avatar: '👩', rating: 5, date: '2025-06-18', comment: 'Standing in front of the massive ice cave of Gaumukh was incredibly holy. The surrounding Shivling peak looked spectacular.' }
    ]
  },
  {
    id: 'gaumukh-tapovan',
    name: 'Gaumukh Tapovan Trek',
    state: 'Uttarakhand',
    district: 'Uttarkashi',
    difficulty: 'Hard',
    altitude: 4450,
    distance: 23,
    duration: 8,
    bestSeason: 'Summer & Autumn',
    bestTime: 'May to June, September to October',
    tempRange: '-5°C to 12°C',
    baseCamp: 'Gangotri',
    baseCampDetails: 'Gangotri is located at 3,415m. Famous temple town with complete networks and lodges.',
    rating: 4.8,
    startingPrice: 12500,
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'
    ],
    overview: 'Crossing the glacier from Gaumukh snout, this trek climbs up to the meadow of Tapovan located directly at the base of Mt. Shivling (6,543m). Tapovan is an alpine pasture filled with bubbling streams and wildflowers, home to multiple meditating sages.',
    coordinates: { lat: 30.90, lon: 79.07 },
    route: ['Gangotri', 'Bhojbasa', 'Gaumukh', 'Tapovan Meadows', 'Gangotri'],
    routeCoordinates: [
      { lat: 30.99, lon: 78.93 },
      { lat: 30.94, lon: 79.05 },
      { lat: 30.92, lon: 79.08 },
      { lat: 30.90, lon: 79.07 }
    ],
    elevationProfile: [
      { distance: 0, elevation: 3415, label: 'Gangotri' },
      { distance: 14, elevation: 3790, label: 'Bhojbasa' },
      { distance: 18, elevation: 4023, label: 'Gaumukh' },
      { distance: 23, elevation: 4450, label: 'Tapovan Meadows' }
    ],
    familyFriendly: false,
    soloFriendly: false,
    snowTrek: true,
    oxygenLevel: '68% at Meadows',
    fitnessRequirement: 'High endurance. Steep vertical climbs over glacial moraines and scree.',
    baseCampsCount: 2,
    accommodation: 'Alpine camping tents at Tapovan or ashram guest rooms.',
    transportation: 'Shared cabs from Uttarkashi.',
    nearestRailway: 'Dehradun Railway - 240 km',
    nearestAirport: 'Jolly Grant, Dehradun - 260 km',
    nearestBusStand: 'Gangotri Bus Stand - 0 km',
    medicalFacilities: 'Emergency first aid at Bhojbasa ITBP post. Hospital in Uttarkashi.',
    emergencyContacts: ['ITBP Bhojbasa: 100', 'Uttarkashi Police: 01374-222244'],
    faqs: [
      { question: 'Who is Mouni Baba?', answer: 'Mouni Baba is a famous sage who meditated in Tapovan for years without speaking. Trekkers often visit his hut.' }
    ],
    packingChecklist: [
      { category: 'Gear', items: ['Microspikes', 'Trekking poles', 'High-grip hiking boots'] }
    ],
    weatherForecast: [
      { day: 'Monday', temp: '8°C / -6°C', condition: 'Sunny / Windy', wind: '15 km/h' }
    ],
    companyId: 'bikat',
    reviews: [
      { id: 'gt1', user: 'Harish V.', avatar: '👨', rating: 5, date: '2025-09-12', comment: 'The view of Mt. Shivling rising vertically above the Tapovan meadow was absolutely jaw-dropping. Tough climb but worth it!' }
    ]
  },
  {
    id: 'kedartal',
    name: 'Kedartal Trek',
    state: 'Uttarakhand',
    district: 'Uttarkashi',
    difficulty: 'Hard',
    altitude: 4749,
    distance: 17,
    duration: 7,
    bestSeason: 'Summer & Autumn',
    bestTime: 'May to June, September to October',
    tempRange: '-8°C to 10°C',
    baseCamp: 'Gangotri',
    baseCampDetails: 'Gangotri is located at 3,415m. Perfect temple town with lodges and guest houses.',
    rating: 4.8,
    startingPrice: 14000,
    image: 'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?auto=format&fit=crop&w=800&q=80'
    ],
    overview: 'Kedartal (Shiva\'s Lake) is a high-altitude glacial lake nestled at 4,749m. The trek climbs steeply through the Kedar Ganga valley, surrounded by massive peaks like Thalaysagar, Bhrigupanth, and Mt. Jogin, reflecting on the turquoise waters of the lake.',
    coordinates: { lat: 30.93, lon: 78.96 },
    route: ['Gangotri', 'Bhoj Kharak', 'Kedar Kharak', 'Kedartal Lake', 'Gangotri'],
    routeCoordinates: [
      { lat: 30.99, lon: 78.93 },
      { lat: 30.97, lon: 78.94 },
      { lat: 30.95, lon: 78.95 },
      { lat: 30.93, lon: 78.96 }
    ],
    elevationProfile: [
      { distance: 0, elevation: 3415, label: 'Gangotri' },
      { distance: 6, elevation: 3780, label: 'Bhoj Kharak' },
      { distance: 12, elevation: 4200, label: 'Kedar Kharak' },
      { distance: 17, elevation: 4749, label: 'Kedartal Lake' }
    ],
    familyFriendly: false,
    soloFriendly: false,
    snowTrek: true,
    oxygenLevel: '60% at Lake',
    fitnessRequirement: 'Excellent endurance. The trail has steep patches, rocky slides, and a narrow spider wall crossing.',
    baseCampsCount: 2,
    accommodation: 'Alpine camping tents.',
    transportation: 'Shared cabs from Uttarkashi.',
    nearestRailway: 'Dehradun Railway - 240 km',
    nearestAirport: 'Jolly Grant, Dehradun - 260 km',
    nearestBusStand: 'Gangotri Bus Stand - 0 km',
    medicalFacilities: 'Zonal hospital at Uttarkashi. Basic first aid in base camp.',
    emergencyContacts: ['Gangotri Police: 01374-222244', 'Uttarkashi Disaster: 01374-222212'],
    faqs: [
      { question: 'Why is the trail considered difficult?', answer: 'The trail is a steep climb with loose rocks, scree, and a tricky spider wall patch that requires extreme care and balance.' }
    ],
    packingChecklist: [
      { category: 'Gear', items: ['Trekking poles', 'Microspikes', 'Thermos flask'] }
    ],
    weatherForecast: [
      { day: 'Monday', temp: '6°C / -6°C', condition: 'Clear', wind: '12 km/h' }
    ],
    companyId: 'tth',
    reviews: [
      { id: 'kt1', user: 'Harish R.', avatar: '👨', rating: 5, date: '2025-06-15', comment: 'The reflection of Thalaysagar peak on the emerald water of Kedartal at sunrise was magical. Hardest climb but highly satisfying.' }
    ]
  },
  {
    id: 'satopanth-lake',
    name: 'Satopanth Lake Trek',
    state: 'Uttarakhand',
    district: 'Chamoli',
    difficulty: 'Hard',
    altitude: 4602,
    distance: 25,
    duration: 8,
    bestSeason: 'Summer & Autumn',
    bestTime: 'May to June, September to October',
    tempRange: '-6°C to 12°C',
    baseCamp: 'Mana Village',
    baseCampDetails: 'Mana is the last Indian village on the Tibetan border near Badrinath temple, rich in culture and stone cottages.',
    rating: 4.8,
    startingPrice: 16000,
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80'
    ],
    overview: 'Satopanth is a sacred, triangular glacial lake nestled at 4,602m. Legend says the holy trinity of Hindu gods (Brahma, Vishnu, and Mahesh) meditated at the three corners of the lake. The trail climbs over steep moraines along the Alaknanda river, with views of Mt. Swargarohini, Chaukhamba, and Nilkantha.',
    coordinates: { lat: 30.76, lon: 79.37 },
    route: ['Badrinath', 'Mana Village', 'Laxmiban', 'Chakratirtha', 'Satopanth Lake', 'Badrinath'],
    routeCoordinates: [
      { lat: 30.74, lon: 79.49 },
      { lat: 30.77, lon: 79.49 },
      { lat: 30.76, lon: 79.44 },
      { lat: 30.76, lon: 79.40 },
      { lat: 30.76, lon: 79.37 }
    ],
    elevationProfile: [
      { distance: 0, elevation: 3300, label: 'Badrinath' },
      { distance: 3, elevation: 3200, label: 'Mana Village' },
      { distance: 10, elevation: 3900, label: 'Laxmiban' },
      { distance: 18, elevation: 4250, label: 'Chakratirtha' },
      { distance: 25, elevation: 4602, label: 'Satopanth Lake' }
    ],
    familyFriendly: false,
    soloFriendly: false,
    snowTrek: true,
    oxygenLevel: '62% at Lake',
    fitnessRequirement: 'High endurance. Rocky moraines and glacier walks require strong ankle support.',
    baseCampsCount: 2,
    accommodation: 'Tents and stone caves near the trail.',
    transportation: 'Taxis to Badrinath and Mana village.',
    nearestRailway: 'Rishikesh Railway - 295 km',
    nearestAirport: 'Jolly Grant, Dehradun - 315 km',
    nearestBusStand: 'Badrinath Bus Depot - 3 km',
    medicalFacilities: 'Army hospital at Badrinath. Evacuation is difficult.',
    emergencyContacts: ['Badrinath Police: 01389-222211', 'Badrinath Army post: 100'],
    faqs: [
      { question: 'What is the Swargarohini legend?', answer: 'Local people believe that Swargarohini is the path to heaven which Yudhisthira and his dog climbed, located next to the lake.' }
    ],
    packingChecklist: [
      { category: 'Gear', items: ['Trekking poles', 'High altitude sleeping bag', 'Crampons'] }
    ],
    weatherForecast: [
      { day: 'Monday', temp: '8°C / -5°C', condition: 'Sunny / Windy', wind: '15 km/h' }
    ],
    companyId: 'bikat',
    reviews: [
      { id: 'sl2', user: 'Sunil K.', avatar: '👨', rating: 5, date: '2025-09-02', comment: 'Visiting the holy triangular lake next to the silent glacier was deeply spiritual. The moraine walk is very challenging.' }
    ]
  },
  {
    id: 'bali-pass',
    name: 'Bali Pass Trek',
    state: 'Uttarakhand',
    district: 'Uttarkashi',
    difficulty: 'Hard',
    altitude: 4940,
    distance: 33,
    duration: 9,
    bestSeason: 'Summer & Autumn',
    bestTime: 'June, September to October',
    tempRange: '-8°C to 12°C',
    baseCamp: 'Sankri',
    baseCampDetails: 'Sankri is inside Govind National Park, featuring hotels and basic guest houses.',
    rating: 4.8,
    startingPrice: 16500,
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80'
    ],
    overview: 'Bali Pass is a high mountain pass connecting the Har Ki Dun valley to Yamunotri (Janki Chatti). The trek traverses deep pine forests, alpine meadows (Odari), and climbs over a steep, narrow snow ridge to the pass at 4,940m, concluding with a descent to the Yamunotri temple.',
    coordinates: { lat: 31.05, lon: 78.43 },
    route: ['Dehradun', 'Sankri', 'Taluka', 'Osla', 'Odari Camp', 'Bali Pass Peak', 'Janki Chatti', 'Dehradun'],
    routeCoordinates: [
      { lat: 30.31, lon: 78.03 },
      { lat: 31.07, lon: 78.18 },
      { lat: 31.09, lon: 78.25 },
      { lat: 31.12, lon: 78.33 },
      { lat: 31.08, lon: 78.38 },
      { lat: 31.05, lon: 78.43 },
      { lat: 31.01, lon: 78.45 }
    ],
    elevationProfile: [
      { distance: 0, elevation: 430, label: 'Dehradun' },
      { distance: 5, elevation: 1950, label: 'Sankri' },
      { distance: 15, elevation: 2600, label: 'Osla' },
      { distance: 25, elevation: 4100, label: 'Odari Camp' },
      { distance: 30, elevation: 4940, label: 'Bali Pass' },
      { distance: 33, elevation: 2650, label: 'Janki Chatti' }
    ],
    familyFriendly: false,
    soloFriendly: false,
    snowTrek: true,
    oxygenLevel: '62% at Pass',
    fitnessRequirement: 'High level of stamina. Steep scree descent and ridge walking over snow are required.',
    baseCampsCount: 2,
    accommodation: 'High altitude camping tents.',
    transportation: 'Private cabs from Dehradun.',
    nearestRailway: 'Dehradun - 200 km',
    nearestAirport: 'Jolly Grant, Dehradun - 220 km',
    nearestBusStand: 'Sankri Bus Depot - 0 km',
    medicalFacilities: 'Government clinic at Sankri and Janki Chatti.',
    emergencyContacts: ['Sankri Police: 100', 'Yamunotri Temple post: 100'],
    faqs: [
      { question: 'Is the descent from the pass steep?', answer: 'Yes, the descent toward Yamunotri is a nearly vertical drop on loose gravel and snow. Anchoring and ropes are used by guides.' }
    ],
    packingChecklist: [
      { category: 'Gear', items: ['Crampons', 'High-grip hiking boots', 'Gaiters', 'Headlamp'] }
    ],
    weatherForecast: [
      { day: 'Monday', temp: '6°C / -8°C', condition: 'Snowy', wind: '20 km/h' }
    ],
    companyId: 'indiahikes',
    reviews: [
      { id: 'bp2', user: 'Shekhar G.', avatar: '👨', rating: 5, date: '2025-08-15', comment: 'Crossing the pass was extremely tough with soft snow, but descending into Yamunotri temple was legendary.' }
    ]
  },
  {
    id: 'borasu-pass',
    name: 'Borasu Pass Trek',
    state: 'Uttarakhand',
    district: 'Uttarkashi',
    difficulty: 'Extreme',
    altitude: 5250,
    distance: 40,
    duration: 9,
    bestSeason: 'Summer & Autumn',
    bestTime: 'June, September to October',
    tempRange: '-10°C to 10°C',
    baseCamp: 'Sankri',
    baseCampDetails: 'Sankri is the base camp inside Govind sanctuary, located 200 km from Dehradun.',
    rating: 4.9,
    startingPrice: 22000,
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80'
    ],
    overview: 'Borasu Pass is a challenging, high-altitude border cross-over trek connecting Har Ki Dun valley (Uttarakhand) with Chitkul in Kinnaur (Himachal Pradesh). It crosses remote, glaciated terrain along the Indo-China border, requiring experienced navigation and ropes to cross the crevassed glacier snout.',
    coordinates: { lat: 31.18, lon: 78.43 },
    route: ['Sankri', 'Taluka', 'Osla', 'Har Ki Dun', 'Morinda Tal', 'Borasu Pass Peak', 'Chitkul'],
    routeCoordinates: [
      { lat: 31.07, lon: 78.18 },
      { lat: 31.09, lon: 78.25 },
      { lat: 31.12, lon: 78.33 },
      { lat: 31.15, lon: 78.40 },
      { lat: 31.17, lon: 78.41 },
      { lat: 31.18, lon: 78.43 },
      { lat: 31.35, lon: 78.43 }
    ],
    elevationProfile: [
      { distance: 0, elevation: 1950, label: 'Sankri' },
      { distance: 10, elevation: 2600, label: 'Osla' },
      { distance: 20, elevation: 3612, label: 'Har Ki Dun' },
      { distance: 28, elevation: 4200, label: 'Morinda Tal' },
      { distance: 35, elevation: 5250, label: 'Borasu Pass' },
      { distance: 40, elevation: 3450, label: 'Chitkul HP' }
    ],
    familyFriendly: false,
    soloFriendly: false,
    snowTrek: true,
    oxygenLevel: '52% at Pass',
    fitnessRequirement: 'Extreme fitness. Ability to trek 10 hours a day over crevassed glaciers.',
    baseCampsCount: 3,
    accommodation: 'Alpine camping tents.',
    transportation: 'Bolero cabs from Dehradun.',
    nearestRailway: 'Dehradun - 200 km',
    nearestAirport: 'Jolly Grant, Dehradun - 220 km',
    nearestBusStand: 'Chitkul Bus Stand - 0 km',
    medicalFacilities: 'No medical care on trail. Closest hospital in Chitkul or Sankri.',
    emergencyContacts: ['ITBP Chitkul: 100', 'Sankri Police: 100'],
    faqs: [
      { question: 'Do we cross the glacier?', answer: 'Yes, the glacier is crevassed and requires roping up and crampons to navigate safely.' }
    ],
    packingChecklist: [
      { category: 'Gear', items: ['Harness and rope set', 'Crampons and microspikes', 'Down jacket'] }
    ],
    weatherForecast: [
      { day: 'Monday', temp: '4°C / -10°C', condition: 'Snowy', wind: '25 km/h' }
    ],
    companyId: 'bikat',
    reviews: [
      { id: 'bp3', user: 'Ranjan K.', avatar: '👨', rating: 5, date: '2025-08-14', comment: 'Crossing from Uttarakhand to Himachal over the snow fields of Borasu was an epic achievement.' }
    ]
  },
  {
    id: 'audens-col',
    name: 'Auden\'s Col Trek',
    state: 'Uttarakhand',
    district: 'Uttarkashi',
    difficulty: 'Extreme',
    altitude: 5486,
    distance: 45,
    duration: 15,
    bestSeason: 'Mid Summer',
    bestTime: 'June to September',
    tempRange: '-15°C to 8°C',
    baseCamp: 'Gangotri',
    baseCampDetails: 'Gangotri is located at 3,415m. Famous temple town with complete networks and lodges.',
    rating: 4.9,
    startingPrice: 38000,
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80'
    ],
    overview: 'Auden\'s Col is one of the most high-altitude and dangerous mountain pass treks in the Garhwal Himalayas. It connects Gangotri (Bhagirathi valley) with Kedarnath (Mandakini valley) through a crevasse-ridden glacier and a steep 70-degree ridge crossing at 5,486 meters, named after John Auden who discovered it in 1935.',
    coordinates: { lat: 30.88, lon: 78.91 },
    route: ['Gangotri', 'Nala Camp', 'Rudugaira Base', 'Auden\'s Col Base', 'Auden\'s Col Pass', 'Khatling Glacier', 'Kedarnath'],
    routeCoordinates: [
      { lat: 30.99, lon: 78.93 },
      { lat: 30.96, lon: 78.92 },
      { lat: 30.92, lon: 78.91 },
      { lat: 30.90, lon: 78.90 },
      { lat: 30.88, lon: 78.91 },
      { lat: 30.86, lon: 78.93 },
      { lat: 30.73, lon: 79.06 }
    ],
    elevationProfile: [
      { distance: 0, elevation: 3415, label: 'Gangotri' },
      { distance: 10, elevation: 3750, label: 'Nala Camp' },
      { distance: 18, elevation: 4350, label: 'Rudugaira Base' },
      { distance: 28, elevation: 4800, label: 'Col Base' },
      { distance: 35, elevation: 5486, label: 'Auden\'s Col' },
      { distance: 45, elevation: 3580, label: 'Kedarnath' }
    ],
    familyFriendly: false,
    soloFriendly: false,
    snowTrek: true,
    oxygenLevel: '50% at Summit',
    fitnessRequirement: 'Extreme fitness. Experience in using climbing ropes, ice axes, and snow anchors is mandatory.',
    baseCampsCount: 4,
    accommodation: 'Cold wilderness camping on snow/glaciers.',
    transportation: 'Shared cabs from Dehradun.',
    nearestRailway: 'Rishikesh Railway - 250 km',
    nearestAirport: 'Jolly Grant, Dehradun - 270 km',
    nearestBusStand: 'Gangotri Bus Depot - 0 km',
    medicalFacilities: 'No medical care on trail. Evacuation is extremely difficult and requires military helicopter support.',
    emergencyContacts: ['Kedarnath Rescue: 100', 'Uttarkashi Disaster Cell: 01374-222212'],
    faqs: [
      { question: 'Why is it dangerous?', answer: 'The crossing of Khatling glacier has massive open and hidden crevasses. Ropes, harnesses, and experienced mountaineering guides are mandatory.' }
    ],
    packingChecklist: [
      { category: 'Gear', items: ['Climbing harness', 'Ice axe', 'Mountaineering ropes', 'Down feather mittens'] }
    ],
    weatherForecast: [
      { day: 'Monday', temp: '2°C / -12°C', condition: 'Blizzard / Snow', wind: '25 km/h' }
    ],
    companyId: 'bikat',
    reviews: [
      { id: 'ac2', user: 'Vikram D.', avatar: '👨', rating: 5, date: '2025-07-28', comment: 'Navigating Khatling glacier was frightening but absolutely epic. For experienced mountaineers only.' }
    ]
  },
  {
    id: 'kalindi-khal',
    name: 'Kalindi Khal Trek',
    state: 'Uttarakhand',
    district: 'Uttarkashi',
    difficulty: 'Extreme',
    altitude: 5943,
    distance: 50,
    duration: 14,
    bestSeason: 'Mid Summer',
    bestTime: 'July to August',
    tempRange: '-15°C to 5°C',
    baseCamp: 'Gangotri',
    baseCampDetails: 'Gangotri is the starting town, located at 3,415m. Lodges and emergency posts are located here.',
    rating: 4.9,
    startingPrice: 45000,
    image: 'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?auto=format&fit=crop&w=800&q=80'
    ],
    overview: 'Kalindi Khal is arguably the highest, most difficult, and most dangerous trekking pass in the world. The trail crosses a high pass at 5,943m, linking Gangotri with Badrinath temple. It goes through the core of Gangotri glacier snout, requiring extensive mountaineering skills.',
    coordinates: { lat: 30.85, lon: 79.22 },
    route: ['Gangotri', 'Bhojbasa', 'Nandanvan', 'Vasuki Tal', 'Kalindi Base', 'Kalindi Pass Peak', 'Arwa Tal', 'Badrinath'],
    routeCoordinates: [
      { lat: 30.99, lon: 78.93 },
      { lat: 30.94, lon: 79.05 },
      { lat: 30.91, lon: 79.10 },
      { lat: 30.87, lon: 79.16 },
      { lat: 30.85, lon: 79.20 },
      { lat: 30.85, lon: 79.22 },
      { lat: 30.84, lon: 79.31 },
      { lat: 30.74, lon: 79.49 }
    ],
    elevationProfile: [
      { distance: 0, elevation: 3415, label: 'Gangotri' },
      { distance: 14, elevation: 3790, label: 'Bhojbasa' },
      { distance: 22, elevation: 4340, label: 'Nandanvan' },
      { distance: 30, elevation: 4890, label: 'Vasuki Tal' },
      { distance: 40, elevation: 5130, label: 'Kalindi Base' },
      { distance: 45, elevation: 5943, label: 'Kalindi Pass' },
      { distance: 50, elevation: 3300, label: 'Badrinath' }
    ],
    familyFriendly: false,
    soloFriendly: false,
    snowTrek: true,
    oxygenLevel: '45% at Pass',
    fitnessRequirement: 'Extreme physical conditioning and technical mountaineering certifications.',
    baseCampsCount: 5,
    accommodation: 'High altitude dome tents on glaciers.',
    transportation: 'Taxis to Gangotri and pick up from Badrinath.',
    nearestRailway: 'Rishikesh Railway - 295 km',
    nearestAirport: 'Jolly Grant, Dehradun - 315 km',
    nearestBusStand: 'Badrinath Bus Depot - 3 km',
    medicalFacilities: 'No medical care on trail. Evacuation requires satellite signaling and military help.',
    emergencyContacts: ['Badrinath Army Post: 100', 'ITBP Gangotri: 100'],
    faqs: [
      { question: 'What permits are required?', answer: 'A special Inner Line Permit (ILP) signed by the District Magistrate of Uttarkashi and IMF registration are mandatory.' }
    ],
    packingChecklist: [
      { category: 'Gear', items: ['Inner Line Permit documents', 'Snow anchors and rope rails', 'Mountaineering boots'] }
    ],
    weatherForecast: [
      { day: 'Monday', temp: '1°C / -15°C', condition: 'Blizzard', wind: '30 km/h' }
    ],
    companyId: 'indiahikes',
    reviews: [
      { id: 'kk1', user: 'Rajiv D.', avatar: '👨', rating: 5, date: '2025-08-20', comment: 'Crossing the Kalindi pass next to Mt. Shivling and Chaukhamba was the wildest adventure of my life. Epic!' }
    ]
  },
  {
    id: 'panwali-kantha',
    name: 'Panwali Kantha Trek',
    state: 'Uttarakhand',
    district: 'Tehri Garhwal',
    difficulty: 'Moderate',
    altitude: 3505,
    distance: 15,
    duration: 5,
    bestSeason: 'Spring & Winter',
    bestTime: 'April to June, November to January',
    tempRange: '0°C to 18°C',
    baseCamp: 'Guttu',
    baseCampDetails: 'Guttu is a remote village in Tehri district, featuring basic guest houses and tea stalls.',
    rating: 4.6,
    startingPrice: 7000,
    image: 'https://images.unsplash.com/photo-1527004013197-933c4bb611b3?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1527004013197-933c4bb611b3?auto=format&fit=crop&w=800&q=80'
    ],
    overview: 'Panwali Kantha offers some of the most beautiful alpine meadows in the Tehri Garhwal region. The trek climbs to a high ridge at 3,505m, providing views of the Kedarnath, Chaukhamba, and Gangotri peak ranges.',
    coordinates: { lat: 30.64, lon: 78.83 },
    route: ['Rishikesh', 'Guttu', 'Panwali Kantha Ridge', 'Guttu', 'Rishikesh'],
    routeCoordinates: [
      { lat: 30.08, lon: 78.26 },
      { lat: 30.53, lon: 78.75 },
      { lat: 30.64, lon: 78.83 },
      { lat: 30.53, lon: 78.75 }
    ],
    elevationProfile: [
      { distance: 0, elevation: 340, label: 'Rishikesh' },
      { distance: 10, elevation: 1500, label: 'Guttu' },
      { distance: 15, elevation: 3505, label: 'Panwali Kantha' }
    ],
    familyFriendly: true,
    soloFriendly: true,
    snowTrek: true,
    oxygenLevel: '82% at Ridge',
    fitnessRequirement: 'Moderate stamina. Steady climb through forests.',
    baseCampsCount: 1,
    accommodation: 'Tents and forest rest houses.',
    transportation: 'Local buses or cabs from Rishikesh to Guttu.',
    nearestRailway: 'Rishikesh Railway - 120 km',
    nearestAirport: 'Jolly Grant, Dehradun - 140 km',
    nearestBusStand: 'Guttu Bus Stand - 0 km',
    medicalFacilities: 'Clinic at Guttu. Zonal hospital at Tehri.',
    emergencyContacts: ['Guttu Police: 100', 'Tehri Hospital: 01376-233211'],
    faqs: [
      { question: 'Is the trek open in December?', answer: 'Yes, it is a very beautiful winter trek with rolling meadows covered in deep snow.' }
    ],
    packingChecklist: [
      { category: 'Gear', items: ['Warm fleece jacket', 'Trekking poles', 'Poncho'] }
    ],
    weatherForecast: [
      { day: 'Monday', temp: '14°C / 2°C', condition: 'Sunny', wind: '8 km/h' }
    ],
    companyId: 'tth',
    reviews: [
      { id: 'pk1', user: 'Shikha G.', avatar: '👩', rating: 5, date: '2025-10-15', comment: 'The wide meadows are very peaceful. Perfect view of snow peaks.' }
    ]
  },
  {
    id: 'surya-top',
    name: 'Surya Top Trek',
    state: 'Uttarakhand',
    district: 'Uttarkashi',
    difficulty: 'Moderate',
    altitude: 4200,
    distance: 18,
    duration: 7,
    bestSeason: 'Spring & Autumn',
    bestTime: 'May to June, September to October',
    tempRange: '-2°C to 15°C',
    baseCamp: 'Raithal',
    baseCampDetails: 'Raithal is near Uttarkashi town, famous for apple orchards and traditional homes.',
    rating: 4.7,
    startingPrice: 9500,
    image: 'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?auto=format&fit=crop&w=800&q=80'
    ],
    overview: 'Surya Top is a scenic mountain pass trek starting from Uttarkashi. The trail climbs quickly through the Dayara Bugyal meadows, leading over a steep rock trail to the top with stunning views of the Gangotri peaks.',
    coordinates: { lat: 30.85, lon: 78.58 },
    route: ['Raithal', 'Gui Thach', 'Dayara Meadows', 'Surya Top Peak', 'Raithal'],
    routeCoordinates: [
      { lat: 30.77, lon: 78.52 },
      { lat: 30.80, lon: 78.54 },
      { lat: 30.82, lon: 78.55 },
      { lat: 30.85, lon: 78.58 }
    ],
    elevationProfile: [
      { distance: 0, elevation: 2100, label: 'Raithal' },
      { distance: 6, elevation: 2900, label: 'Gui Camp' },
      { distance: 12, elevation: 3688, label: 'Dayara Meadows' },
      { distance: 18, elevation: 4200, label: 'Surya Top' }
    ],
    familyFriendly: false,
    soloFriendly: true,
    snowTrek: true,
    oxygenLevel: '71% at Top',
    fitnessRequirement: 'Moderate endurance. Steep moraine climbs.',
    baseCampsCount: 2,
    accommodation: 'Alpine camping tents.',
    transportation: 'Shared cabs from Dehradun.',
    nearestRailway: 'Dehradun - 180 km',
    nearestAirport: 'Jolly Grant - 205 km',
    nearestBusStand: 'Uttarkashi ISBT - 35 km',
    medicalFacilities: 'Zonal hospital at Uttarkashi.',
    emergencyContacts: ['Uttarkashi Police: 01374-222212', 'Uttarkashi Disaster: 01374-222216'],
    faqs: [
      { question: 'Is the summit climb difficult?', answer: 'The final climb is steep with loose scree, requiring experienced guides and microspikes if snow is present.' }
    ],
    packingChecklist: [
      { category: 'Gear', items: ['Trekking poles', 'Fleece jackets', 'Raincoat'] }
    ],
    weatherForecast: [
      { day: 'Monday', temp: '10°C / -4°C', condition: 'Sunny', wind: '15 km/h' }
    ],
    companyId: 'tth',
    reviews: [
      { id: 'st1', user: 'Aravind B.', avatar: '👨', rating: 5, date: '2025-10-05', comment: 'The view from Surya Top was incredible. Chaukhamba and Bandarpoonch felt so close.' }
    ]
  },
  {
    id: 'dodital',
    name: 'Dodital Trek',
    state: 'Uttarakhand',
    district: 'Uttarkashi',
    difficulty: 'Easy-Moderate',
    altitude: 3048,
    distance: 11,
    duration: 4,
    bestSeason: 'Spring & Winter',
    bestTime: 'March to June, October to December',
    tempRange: '2°C to 18°C',
    baseCamp: 'Sangam Chatti',
    baseCampDetails: 'Sangam Chatti is a small road-head hamlet near Uttarkashi town, with basic homestays and stores.',
    rating: 4.7,
    startingPrice: 6500,
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80'
    ],
    overview: 'Dodital is a beautiful fresh-water lake nestled at 3,048m. Legend says that Lord Ganesha was born here. The lake is famous for golden trout fish, surrounded by dense oak and pine forests, with a trail climbing further up to Darwa Top at 4,130m.',
    coordinates: { lat: 30.88, lon: 78.50 },
    route: ['Uttarkashi', 'Sangam Chatti', 'Bebra Camp', 'Dodital Lake', 'Sangam Chatti'],
    routeCoordinates: [
      { lat: 30.73, lon: 78.43 },
      { lat: 30.78, lon: 78.45 },
      { lat: 30.82, lon: 78.47 },
      { lat: 30.88, lon: 78.50 }
    ],
    elevationProfile: [
      { distance: 0, elevation: 1158, label: 'Uttarkashi' },
      { distance: 3, elevation: 1350, label: 'Sangam Chatti' },
      { distance: 8, elevation: 2200, label: 'Bebra Camp' },
      { distance: 11, elevation: 3048, label: 'Dodital Lake' }
    ],
    familyFriendly: true,
    soloFriendly: true,
    snowTrek: true,
    oxygenLevel: '88% at Lake',
    fitnessRequirement: 'Basic stamina. Walk 5-6 km comfortably.',
    baseCampsCount: 1,
    accommodation: 'Tents and forest rest houses.',
    transportation: 'Shared cabs from Uttarkashi.',
    nearestRailway: 'Dehradun Railway - 160 km',
    nearestAirport: 'Jolly Grant, Dehradun - 180 km',
    nearestBusStand: 'Uttarkashi Bus Stand - 15 km',
    medicalFacilities: 'Zonal hospital at Uttarkashi.',
    emergencyContacts: ['Uttarkashi Police: 01374-222212', 'Uttarkashi Hospital: 01374-222216'],
    faqs: [
      { question: 'Why is it called Lord Ganesha\'s birthplace?', answer: 'According to legend, Goddess Parvati created Ganesha from clay next to this lake and bathed in it, naming it the holy lake.' }
    ],
    packingChecklist: [
      { category: 'Gear', items: ['Trekking shoes', 'Warm Cap', 'Raincoat'] }
    ],
    weatherForecast: [
      { day: 'Monday', temp: '14°C / 4°C', condition: 'Sunny', wind: '8 km/h' }
    ],
    companyId: 'indiahikes',
    reviews: [
      { id: 'dd1', user: 'Shikha K.', avatar: '👩', rating: 5, date: '2025-06-12', comment: 'The lake was extremely peaceful. Simple and beautiful trek.' }
    ]
  },

  // ─────────────────────────────────────────────
  // JAMMU & KASHMIR TREKS
  // ─────────────────────────────────────────────

  {
    id: 'kashmir-great-lakes',
    name: 'Kashmir Great Lakes Trek',
    state: 'Jammu & Kashmir',
    district: 'Ganderbal',
    difficulty: 'Moderate-Hard',
    altitude: 4206,      // 13,800 ft in metres
    distance: 37,
    duration: 7,
    bestSeason: 'Jul – Sep',
    bestTime: 'Mid-July to Mid-September',
    tempRange: '5°C to 20°C (Day) | -2°C to 8°C (Night)',
    baseCamp: 'Sonamarg',
    baseCampDetails: 'Sonamarg is a well-connected hill station in Ganderbal district, 87 km from Srinagar, serving as the gateway for this iconic alpine lake circuit.',
    rating: 4.9,
    startingPrice: 18500,
    image: 'https://images.unsplash.com/photo-1605640840605-14ac1855827b?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1605640840605-14ac1855827b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80'
    ],
    overview: 'The Kashmir Great Lakes Trek is one of the most breathtaking high-altitude lake circuits in the world. Spanning 7–8 days through the alpine meadows of Gangabal, this trail connects seven pristine glacial lakes — Vishansar, Krishansar, Gadsar, Satsar, Gangabal, and Nundkol — set against dramatic peaks of the Himalayas. Every campsite offers jaw-dropping reflections of snow-capped mountains on glassy lake surfaces.',
    coordinates: { lat: 34.24, lon: 75.28 },
    route: ['Sonamarg Base → Nichnai Pass (4,100m)', 'Nichnai → Vishansar Lake (3,710m)', 'Vishansar → Krishansar → Gadsar', 'Gadsar → Satsar Lakes', 'Satsar → Gangabal Twin Lakes (3,576m)', 'Gangabal → Naranag (2,153m)', 'Naranag → Drive to Srinagar'],
    routeCoordinates: [
      { lat: 34.30, lon: 75.32 },
      { lat: 34.27, lon: 75.28 },
      { lat: 34.24, lon: 75.24 },
      { lat: 34.21, lon: 75.20 },
      { lat: 34.18, lon: 75.16 }
    ],
    elevationProfile: [
      { distance: 0, elevation: 2740, label: 'Sonamarg' },
      { distance: 8, elevation: 4100, label: 'Nichnai Pass' },
      { distance: 15, elevation: 3710, label: 'Vishansar Lake' },
      { distance: 22, elevation: 4175, label: 'Gadsar Pass' },
      { distance: 30, elevation: 3576, label: 'Gangabal Lake' },
      { distance: 37, elevation: 2153, label: 'Naranag' }
    ],
    familyFriendly: false,
    soloFriendly: false,
    snowTrek: true,
    oxygenLevel: '72% at Gadsar Pass',
    fitnessRequirement: 'Strong fitness required. Daily walks of 10–15 km at high altitude.',
    baseCampsCount: 6,
    accommodation: 'Camping only. Tents provided by operator.',
    transportation: 'Drive from Srinagar to Sonamarg (2.5 hrs). Return via Naranag–Srinagar.',
    nearestRailway: 'Banihal Railway Station – 150 km',
    nearestAirport: 'Sheikh ul-Alam International Airport, Srinagar – 87 km',
    nearestBusStand: 'Sonamarg Bus Stop – 1 km',
    medicalFacilities: 'First aid at camps. Nearest hospital in Sonamarg.',
    emergencyContacts: ['J&K Tourism Helpline: 0194-2452690', 'Ganderbal Police: 01942-250007'],
    faqs: [
      { question: 'Is a permit required?', answer: 'Yes. Permits are required from the J&K Forest Department. Your operator will arrange these.' },
      { question: 'What is the best month?', answer: 'August is considered the best — the snow has melted, wildflowers bloom, and all lakes are fully accessible.' }
    ],
    packingChecklist: [
      { category: 'Gear', items: ['4-season sleeping bag', 'Trekking poles', 'Gaiters', 'Crampons (early season)', 'Rain poncho'] },
      { category: 'Clothing', items: ['Thermal base layers', 'Fleece mid-layer', 'Down jacket', 'Waterproof shell', 'Gloves', 'Balaclava'] },
      { category: 'Essentials', items: ['Sunscreen SPF 50+', 'UV sunglasses', 'Water purification tablets', 'Personal first-aid kit', 'Trekking permit copies'] }
    ],
    weatherForecast: [
      { day: 'Monday', temp: '18°C / 5°C', condition: 'Sunny', wind: '10 km/h' },
      { day: 'Tuesday', temp: '14°C / 2°C', condition: 'Partly Cloudy', wind: '14 km/h' },
      { day: 'Wednesday', temp: '10°C / 0°C', condition: 'Overcast', wind: '18 km/h' }
    ],
    companyId: 'thrillophilia',
    reviews: [
      { id: 'kgl1', user: 'Rajan M.', avatar: '🧔', rating: 5, date: '2025-08-10', comment: 'Absolutely surreal. Seven lakes in seven days — each more beautiful than the last. Gangabal at sunrise made me tear up.' },
      { id: 'kgl2', user: 'Priyanka S.', avatar: '👩', rating: 5, date: '2025-08-24', comment: 'Best trek of my life without doubt. The reflection of Haramukh peak on Gangabal Lake is unbelievable.' }
    ]
  },

  {
    id: 'tarsar-marsar',
    name: 'Tarsar Marsar Trek',
    state: 'Jammu & Kashmir',
    district: 'Anantnag',
    difficulty: 'Moderate',
    altitude: 4026,      // 13,201 ft in metres
    distance: 24,
    duration: 6,
    bestSeason: 'Jul – Sep',
    bestTime: 'July to September',
    tempRange: '8°C to 22°C (Day) | 0°C to 8°C (Night)',
    baseCamp: 'Aru Valley',
    baseCampDetails: 'Aru Valley is 12 km from Pahalgam and serves as the trailhead for this twin-lake alpine circuit in the South Kashmir Himalayas.',
    rating: 4.8,
    startingPrice: 15500,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=800&q=80'
    ],
    overview: 'The Tarsar Marsar Trek is widely considered one of Kashmir\'s most beautiful treks, taking you through lush alpine meadows and wildflower carpets to two stunning high-altitude lakes — Tarsar (blue-green gem) and Marsar (the mysterious lake hidden behind a ridge). The route passes through Lidder Valley, Shekwas meadow, and the dramatic Tarsar Pass, offering views of Kolhoi and Sunset peaks.',
    coordinates: { lat: 34.07, lon: 75.48 },
    route: ['Aru → Lidderwat (3,180m)', 'Lidderwat → Shekwas Meadow (3,690m)', 'Shekwas → Tarsar Lake (3,914m)', 'Tarsar → Sundarsar → Marsar Lake (4,026m)', 'Marsar → Homwas', 'Homwas → Aru Valley'],
    routeCoordinates: [
      { lat: 34.06, lon: 75.30 },
      { lat: 34.07, lon: 75.36 },
      { lat: 34.09, lon: 75.42 },
      { lat: 34.10, lon: 75.48 },
      { lat: 34.08, lon: 75.44 }
    ],
    elevationProfile: [
      { distance: 0, elevation: 2438, label: 'Aru Valley' },
      { distance: 6, elevation: 3180, label: 'Lidderwat' },
      { distance: 11, elevation: 3690, label: 'Shekwas' },
      { distance: 16, elevation: 3914, label: 'Tarsar Lake' },
      { distance: 20, elevation: 4026, label: 'Marsar Lake' },
      { distance: 24, elevation: 2438, label: 'Aru Valley' }
    ],
    familyFriendly: false,
    soloFriendly: true,
    snowTrek: false,
    oxygenLevel: '75% at Marsar Lake',
    fitnessRequirement: 'Moderate fitness. Comfortable with 10 km daily walks.',
    baseCampsCount: 3,
    accommodation: 'Camping with tents. Guesthouses available at Aru.',
    transportation: 'Drive from Srinagar to Pahalgam (96 km), then shared cab to Aru.',
    nearestRailway: 'Banihal Railway Station – 110 km',
    nearestAirport: 'Sheikh ul-Alam International Airport, Srinagar – 96 km',
    nearestBusStand: 'Pahalgam Bus Stand – 12 km',
    medicalFacilities: 'First aid at camps. Nearest hospital in Pahalgam.',
    emergencyContacts: ['Pahalgam Police: 01936-243201', 'Anantnag District Hospital: 01932-225290'],
    faqs: [
      { question: 'Is the trek beginner-friendly?', answer: 'It\'s suitable for people with some prior trekking experience. Complete beginners may struggle on the pass day.' },
      { question: 'When do wildflowers bloom?', answer: 'Early July sees the most spectacular wildflower blooms across Shekwas meadow and the Lidder valley.' }
    ],
    packingChecklist: [
      { category: 'Gear', items: ['Trekking poles', '3-season sleeping bag', 'Waterproof backpack cover', 'Headlamp'] },
      { category: 'Clothing', items: ['Fleece jacket', 'Windproof jacket', 'Quick-dry trousers', 'Thermal inner', 'Sunhat'] },
      { category: 'Essentials', items: ['Sunscreen SPF 50+', 'Lip balm', 'Insect repellent', 'Personal first-aid kit', 'Energy bars'] }
    ],
    weatherForecast: [
      { day: 'Monday', temp: '20°C / 8°C', condition: 'Sunny', wind: '8 km/h' },
      { day: 'Tuesday', temp: '17°C / 5°C', condition: 'Partly Cloudy', wind: '12 km/h' },
      { day: 'Wednesday', temp: '13°C / 2°C', condition: 'Afternoon Showers', wind: '16 km/h' }
    ],
    companyId: 'indiahikes',
    reviews: [
      { id: 'tm1', user: 'Aditya V.', avatar: '🧑', rating: 5, date: '2025-07-18', comment: 'Tarsar Lake is the most beautiful lake I have ever seen. The blue-green colour is magical in sunlight.' },
      { id: 'tm2', user: 'Sneha R.', avatar: '👩‍🦱', rating: 4, date: '2025-08-03', comment: 'Tough last day but absolutely worth every step. Marsar is hauntingly beautiful.' }
    ]
  },

  {
    id: 'naranag-gangabal',
    name: 'Naranag Gangabal Trek',
    state: 'Jammu & Kashmir',
    district: 'Ganderbal',
    difficulty: 'Moderate',
    altitude: 3505,      // 11,500 ft in metres
    distance: 13,
    duration: 3,
    bestSeason: 'Jun – Sep',
    bestTime: 'June to September',
    tempRange: '10°C to 22°C (Day) | 2°C to 10°C (Night)',
    baseCamp: 'Naranag Village',
    baseCampDetails: 'Naranag is a small village 50 km from Srinagar in the Ganderbal district, home to ancient temple ruins and the starting point of this lake trek.',
    rating: 4.7,
    startingPrice: 9500,
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1605640840605-14ac1855827b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=800&q=80'
    ],
    overview: 'The Naranag Gangabal Trek offers one of the most direct and scenic routes to Gangabal Lake — one of the twin lakes nestled at the foot of Haramukh peak (5,143m). Beginning at the ancient Naranag temple ruins (8th century), the trail climbs through dense forests of pine and birch, opening into vast meadows before reaching the twin lakes of Gangabal and Nundkol. A shorter alternative to the full Kashmir Great Lakes circuit.',
    coordinates: { lat: 34.22, lon: 75.16 },
    route: ['Naranag Village (2,153m) → Sarbal Meadow', 'Sarbal → Trunkhal Meadow (3,200m)', 'Trunkhal → Nundkol Lake (3,505m) → Gangabal Lake', 'Gangabal Lake → Return via same route → Naranag'],
    routeCoordinates: [
      { lat: 34.22, lon: 75.16 },
      { lat: 34.21, lon: 75.19 },
      { lat: 34.20, lon: 75.22 },
      { lat: 34.19, lon: 75.25 }
    ],
    elevationProfile: [
      { distance: 0, elevation: 2153, label: 'Naranag Village' },
      { distance: 4, elevation: 2800, label: 'Sarbal Meadow' },
      { distance: 8, elevation: 3200, label: 'Trunkhal' },
      { distance: 13, elevation: 3505, label: 'Gangabal Lake' }
    ],
    familyFriendly: false,
    soloFriendly: true,
    snowTrek: false,
    oxygenLevel: '78% at Gangabal Lake',
    fitnessRequirement: 'Moderate fitness. 6–8 km walks per day.',
    baseCampsCount: 2,
    accommodation: 'Camping with tents. Basic dhaba at Naranag.',
    transportation: 'Drive from Srinagar to Naranag via Kangan (~50 km, 1.5 hrs).',
    nearestRailway: 'Banihal Railway Station – 100 km',
    nearestAirport: 'Sheikh ul-Alam International Airport, Srinagar – 50 km',
    nearestBusStand: 'Kangan Bus Stop – 14 km',
    medicalFacilities: 'Basic first aid at camp. District hospital in Kangan.',
    emergencyContacts: ['Ganderbal Police: 01942-250007', 'Kangan Health Centre: 01942-244310'],
    faqs: [
      { question: 'Can beginners do this trek?', answer: 'Yes, with moderate fitness. The shorter 3-day version is manageable for first-timers comfortable with 7–8 km daily hiking.' },
      { question: 'Are the Naranag ruins worth seeing?', answer: 'Absolutely. The 8th-century Naranag temple complex is an archaeological wonder and a great way to start the trek.' }
    ],
    packingChecklist: [
      { category: 'Gear', items: ['Trekking shoes', 'Trekking poles', 'Sleeping bag', 'Headlamp'] },
      { category: 'Clothing', items: ['Fleece jacket', 'Waterproof layer', 'Thermal inner', 'Cap and gloves'] },
      { category: 'Essentials', items: ['Water bottle (2L)', 'Sunscreen', 'Personal first-aid kit', 'Snacks / dry fruits'] }
    ],
    weatherForecast: [
      { day: 'Monday', temp: '20°C / 8°C', condition: 'Clear', wind: '7 km/h' },
      { day: 'Tuesday', temp: '16°C / 4°C', condition: 'Partly Cloudy', wind: '10 km/h' },
      { day: 'Wednesday', temp: '12°C / 1°C', condition: 'Overcast', wind: '14 km/h' }
    ],
    companyId: 'bikat-adventures',
    reviews: [
      { id: 'ng1', user: 'Farhan A.', avatar: '🧔', rating: 5, date: '2025-07-05', comment: 'Haramukh reflected in Gangabal Lake at golden hour is a sight I will never forget. Short but absolutely stunning.' },
      { id: 'ng2', user: 'Kavitha L.', avatar: '👩', rating: 4, date: '2025-08-15', comment: 'Perfect 3-day getaway from Srinagar. The Naranag ruins were a wonderful cultural bonus.' }
    ]
  },

  {
    id: 'tulian-lake',
    name: 'Tulian Lake Trek',
    state: 'Jammu & Kashmir',
    district: 'Anantnag',
    difficulty: 'Moderate-Hard',
    altitude: 3685,      // 12,087 ft in metres
    distance: 16,
    duration: 2,
    bestSeason: 'Jul – Sep',
    bestTime: 'July to September',
    tempRange: '6°C to 18°C (Day) | -2°C to 6°C (Night)',
    baseCamp: 'Pahalgam',
    baseCampDetails: 'Pahalgam is a popular hill resort 96 km from Srinagar, serving as the base for this intense high-altitude day/overnight trek to Kashmir\'s highest accessible lake.',
    rating: 4.7,
    startingPrice: 7500,
    image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80'
    ],
    overview: 'Tulian Lake is the highest accessible lake in Kashmir, sitting at 12,087 ft above sea level. This intense 2–3 day trek from Pahalgam climbs steeply through the beautiful Lidder valley forests and open meadows to reach the stunning frozen lake that remains snow-covered well into July. The views from the lake ridge of the entire Pir Panjal range are among the finest panoramas in the Kashmir valley.',
    coordinates: { lat: 34.01, lon: 75.36 },
    route: ['Pahalgam (2,130m) → Baisaran Meadow', 'Baisaran → Tulian Lake Trail (steep ascent)', 'Summit: Tulian Lake (3,685m) – overnight camp', 'Return: Tulian Lake → Pahalgam'],
    routeCoordinates: [
      { lat: 34.01, lon: 75.31 },
      { lat: 34.02, lon: 75.33 },
      { lat: 34.02, lon: 75.35 },
      { lat: 34.01, lon: 75.36 }
    ],
    elevationProfile: [
      { distance: 0, elevation: 2130, label: 'Pahalgam' },
      { distance: 4, elevation: 2600, label: 'Baisaran Meadow' },
      { distance: 9, elevation: 3200, label: 'Steep Ascent' },
      { distance: 13, elevation: 3500, label: 'Lake Approach' },
      { distance: 16, elevation: 3685, label: 'Tulian Lake' }
    ],
    familyFriendly: false,
    soloFriendly: true,
    snowTrek: true,
    oxygenLevel: '76% at Tulian Lake',
    fitnessRequirement: 'Good fitness essential. Very steep ascent of 1,500m in one day.',
    baseCampsCount: 1,
    accommodation: 'Camping at lake or return same day. Guesthouses in Pahalgam.',
    transportation: 'Drive from Srinagar to Pahalgam (96 km, ~2.5 hrs).',
    nearestRailway: 'Banihal Railway Station – 110 km',
    nearestAirport: 'Sheikh ul-Alam International Airport, Srinagar – 96 km',
    nearestBusStand: 'Pahalgam Bus Stand – 2 km',
    medicalFacilities: 'Pahalgam has a government hospital. First aid at camp.',
    emergencyContacts: ['Pahalgam Police: 01936-243201', 'Anantnag District Hospital: 01932-225290'],
    faqs: [
      { question: 'Can I do this as a day trek?', answer: 'Fit trekkers can do it as a long day (10–12 hours). For a more relaxed experience, camping overnight at the lake is recommended.' },
      { question: 'Is snow present in July?', answer: 'Yes, the lake is surrounded by snow well into July and sometimes August. Crampons may be needed for early-season visits.' }
    ],
    packingChecklist: [
      { category: 'Gear', items: ['Trekking poles (essential)', 'Crampons (Jul)', '3-season sleeping bag', 'Headlamp', 'Gaiters'] },
      { category: 'Clothing', items: ['Down jacket', 'Waterproof shell', 'Thermal base layer', 'Gloves', 'Balaclava'] },
      { category: 'Essentials', items: ['High-energy snacks', 'Water purification tablets', 'Sunscreen SPF 50+', 'Personal first-aid kit'] }
    ],
    weatherForecast: [
      { day: 'Monday', temp: '16°C / 2°C', condition: 'Clear', wind: '12 km/h' },
      { day: 'Tuesday', temp: '12°C / -1°C', condition: 'Partly Cloudy', wind: '16 km/h' },
      { day: 'Wednesday', temp: '8°C / -3°C', condition: 'Overcast', wind: '20 km/h' }
    ],
    companyId: 'bikat-adventures',
    reviews: [
      { id: 'tul1', user: 'Imran K.', avatar: '🧔', rating: 5, date: '2025-08-02', comment: 'The steep climb is brutal but Tulian Lake is worth every ache. Crystal blue water surrounded by snow — simply magical.' },
      { id: 'tul2', user: 'Deepa N.', avatar: '👩', rating: 4, date: '2025-07-20', comment: 'Very challenging but rewarding. The panoramic view of the Pir Panjal range from the lake ridge is unmatched.' }
    ]
  },

  // ─────────────────────────────────────────────
  // SIKKIM TREKS
  // ─────────────────────────────────────────────

  {
    id: 'goechala',
    name: 'Goechala Trek',
    state: 'Sikkim',
    district: 'West Sikkim',
    difficulty: 'Moderate-Hard',
    altitude: 4940,
    distance: 45,
    duration: 9,
    bestSeason: 'Apr – May, Oct – Nov',
    bestTime: 'April–May and October–November',
    tempRange: '2°C to 15°C (Day) | -8°C to 0°C (Night)',
    baseCamp: 'Yuksom',
    baseCampDetails: 'Yuksom is the first capital of Sikkim and the historic gateway to the Kangchenjunga biosphere. It sits at 1,780m in West Sikkim, ~120 km from Gangtok.',
    rating: 4.9,
    startingPrice: 24000,
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80'
    ],
    overview: 'The Goechala Trek is widely regarded as one of the finest high-altitude treks in India, offering the closest ground-level view of Kangchenjunga — the world\'s third highest peak (8,586m). The 9-day journey from Yuksom passes through dense rhododendron forests, pristine Himalayan lakes, and a dramatic push to Goechala Pass (4,940m) where the entire Kangchenjunga massif fills the horizon.',
    coordinates: { lat: 27.43, lon: 88.22 },
    route: ['Yuksom (1,780m) → Sachen (1,650m)', 'Sachen → Tshoka (3,050m)', 'Tshoka → Dzongri (4,020m)', 'Dzongri → Thangsing (3,930m)', 'Thangsing → Samiti Lake (4,200m)', 'Samiti Lake → Goechala Pass (4,940m)', 'Return: Goechala → Kokchurung → Yuksom'],
    routeCoordinates: [
      { lat: 27.48, lon: 88.22 }, { lat: 27.45, lon: 88.20 },
      { lat: 27.43, lon: 88.19 }, { lat: 27.41, lon: 88.18 },
      { lat: 27.40, lon: 88.20 }, { lat: 27.43, lon: 88.22 }
    ],
    elevationProfile: [
      { distance: 0, elevation: 1780, label: 'Yuksom' },
      { distance: 8, elevation: 3050, label: 'Tshoka' },
      { distance: 16, elevation: 4020, label: 'Dzongri' },
      { distance: 24, elevation: 3930, label: 'Thangsing' },
      { distance: 32, elevation: 4200, label: 'Samiti Lake' },
      { distance: 37, elevation: 4940, label: 'Goechala Pass' },
      { distance: 45, elevation: 1780, label: 'Yuksom Return' }
    ],
    familyFriendly: false,
    soloFriendly: false,
    snowTrek: true,
    oxygenLevel: '68% at Goechala Pass',
    fitnessRequirement: 'Excellent fitness required. Long high-altitude days of 12–15 km.',
    baseCampsCount: 5,
    accommodation: 'Forest Department trekkers\' huts and camping tents.',
    transportation: 'Drive from Gangtok to Yuksom (~120 km, 4–5 hrs via NH10 & NH710).',
    nearestRailway: 'New Jalpaiguri (NJP) Railway Station – 148 km',
    nearestAirport: 'Bagdogra Airport – 124 km',
    nearestBusStand: 'Yuksom Bus Stand – 0 km',
    medicalFacilities: 'Basic health post at Yuksom. Nearest hospital in Geyzing (30 km).',
    emergencyContacts: ['Sikkim Tourism Helpline: 03592-201634', 'West Sikkim Police: 03595-250033'],
    faqs: [
      { question: 'Is a permit required?', answer: 'Yes. A Protected Area Permit (PAP) is mandatory for the Kangchenjunga region. Your operator will arrange it. Foreign nationals also need a Restricted Area Permit.' },
      { question: 'What is the most scenic moment?', answer: 'The sunrise from Dzongri Top (a 1-hour detour at 4,200m) offering 360° views of Kangchenjunga, Pandim, Kabru, and Rathong is the single most spectacular moment on the trek.' }
    ],
    packingChecklist: [
      { category: 'Gear', items: ['4-season sleeping bag (-15°C)', 'Trekking poles', 'Gaiters', 'Crampons', 'Headlamp + extra batteries'] },
      { category: 'Clothing', items: ['Heavy down jacket', 'Waterproof shell', 'Thermal base layers (2 sets)', 'Waterproof gloves', 'Balaclava', 'Wool socks'] },
      { category: 'Essentials', items: ['PAP permit copies', 'Sunscreen SPF 60+', 'Diamox (altitude medication)', 'Water purification tablets', 'Energy gels/bars'] }
    ],
    weatherForecast: [
      { day: 'Monday', temp: '10°C / -5°C', condition: 'Clear', wind: '15 km/h' },
      { day: 'Tuesday', temp: '7°C / -7°C', condition: 'Partly Cloudy', wind: '18 km/h' },
      { day: 'Wednesday', temp: '4°C / -10°C', condition: 'Snowfall possible', wind: '22 km/h' }
    ],
    companyId: 'indiahikes',
    reviews: [
      { id: 'gc1', user: 'Siddharth P.', avatar: '🧔', rating: 5, date: '2025-10-18', comment: 'Standing at Goechala with Kangchenjunga right in my face — I have no words. The greatest morning of my life.' },
      { id: 'gc2', user: 'Meghna T.', avatar: '👩', rating: 5, date: '2025-05-04', comment: 'The rhododendron forests in bloom combined with snow-capped peaks is a surreal combination. 10/10.' }
    ]
  },

  {
    id: 'dzongri',
    name: 'Dzongri Trek',
    state: 'Sikkim',
    district: 'West Sikkim',
    difficulty: 'Moderate',
    altitude: 4020,
    distance: 10,
    duration: 5,
    bestSeason: 'Apr – May, Oct – Nov',
    bestTime: 'April–May and October–November',
    tempRange: '5°C to 18°C (Day) | -5°C to 2°C (Night)',
    baseCamp: 'Yuksom',
    baseCampDetails: 'Yuksom is the first capital of Sikkim and the gateway to the Kangchenjunga region, at 1,780m altitude in West Sikkim.',
    rating: 4.7,
    startingPrice: 14000,
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1585136917228-d79f3bce0dca?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80'
    ],
    overview: 'The Dzongri Trek is the perfect short introduction to the Kangchenjunga region — a 5-day high-altitude journey from historic Yuksom through lush rhododendron forests and yak pastures to the Dzongri plateau. At 4,020m, Dzongri offers a 360° panorama of the world\'s third highest peak. Shorter and less demanding than Goechala, ideal for trekkers seeking an authentic Sikkim Himalayan experience.',
    coordinates: { lat: 27.43, lon: 88.19 },
    route: ['Yuksom (1,780m) → Sachen (1,650m)', 'Sachen → Tshoka (3,050m)', 'Tshoka → Phedang (3,670m)', 'Phedang → Dzongri (4,020m)', 'Dzongri Top sunrise → Return to Yuksom'],
    routeCoordinates: [
      { lat: 27.48, lon: 88.22 }, { lat: 27.46, lon: 88.21 },
      { lat: 27.45, lon: 88.20 }, { lat: 27.43, lon: 88.19 }
    ],
    elevationProfile: [
      { distance: 0, elevation: 1780, label: 'Yuksom' },
      { distance: 3, elevation: 2380, label: 'Sachen' },
      { distance: 6, elevation: 3050, label: 'Tshoka' },
      { distance: 8, elevation: 3670, label: 'Phedang' },
      { distance: 10, elevation: 4020, label: 'Dzongri' }
    ],
    familyFriendly: false,
    soloFriendly: true,
    snowTrek: true,
    oxygenLevel: '73% at Dzongri',
    fitnessRequirement: 'Moderate fitness. 8–10 km daily walks with significant altitude gain.',
    baseCampsCount: 3,
    accommodation: 'Forest Department trekkers\' huts and camping tents.',
    transportation: 'Drive from Gangtok to Yuksom (~120 km, 4–5 hrs).',
    nearestRailway: 'New Jalpaiguri (NJP) – 148 km',
    nearestAirport: 'Bagdogra Airport – 124 km',
    nearestBusStand: 'Yuksom Bus Stand – 0 km',
    medicalFacilities: 'Basic health post at Yuksom. Nearest hospital in Geyzing.',
    emergencyContacts: ['Sikkim Tourism Helpline: 03592-201634', 'West Sikkim Police: 03595-250033'],
    faqs: [
      { question: 'Is Dzongri suitable for first-time trekkers?', answer: 'Yes, with reasonable fitness. It is shorter and less demanding than Goechala, making it a great introduction to high-altitude Sikkim trekking.' },
      { question: 'Can I extend to Goechala?', answer: 'Absolutely. Many trekkers do 5-day Dzongri first as acclimatisation before continuing to Goechala. Combined trip is 9–10 days.' }
    ],
    packingChecklist: [
      { category: 'Gear', items: ['3–4 season sleeping bag', 'Trekking poles', 'Headlamp', 'Gaiters', 'Crampons (Oct–Nov)'] },
      { category: 'Clothing', items: ['Down jacket', 'Fleece mid-layer', 'Waterproof shell', 'Thermal inner', 'Gloves', 'Warm hat'] },
      { category: 'Essentials', items: ['PAP permit copies', 'Sunscreen SPF 50+', 'Altitude medication (Diamox)', 'Water purification tablets', 'Dry fruits & snacks'] }
    ],
    weatherForecast: [
      { day: 'Monday', temp: '14°C / -2°C', condition: 'Clear', wind: '12 km/h' },
      { day: 'Tuesday', temp: '10°C / -4°C', condition: 'Partly Cloudy', wind: '15 km/h' },
      { day: 'Wednesday', temp: '6°C / -6°C', condition: 'Overcast', wind: '18 km/h' }
    ],
    companyId: 'bikat-adventures',
    reviews: [
      { id: 'dz1', user: 'Rahul G.', avatar: '🧑', rating: 5, date: '2025-10-10', comment: 'Dzongri Top at 5 AM with Kangchenjunga glowing orange in the first light. Nothing compares. Absolutely nothing.' },
      { id: 'dz2', user: 'Ananya B.', avatar: '👩‍🦰', rating: 4, date: '2025-04-22', comment: 'The rhododendron forest in full April bloom is a magical sight. Tshoka to Dzongri is absolutely stunning.' }
    ]
  },

  {
    id: 'green-lake',
    name: 'Green Lake Trek',
    state: 'Sikkim',
    district: 'North Sikkim',
    difficulty: 'Hard',
    altitude: 4883,
    distance: 32,
    duration: 11,
    bestSeason: 'May, Oct – Nov',
    bestTime: 'May and October–November',
    tempRange: '0°C to 12°C (Day) | -15°C to -5°C (Night)',
    baseCamp: 'Lachen',
    baseCampDetails: 'Lachen is a remote village in North Sikkim at 2,750m, accessible by road from Gangtok (~113 km). It is the last road-accessible point before this restricted zone trek begins.',
    rating: 4.8,
    startingPrice: 32000,
    image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1585136917228-d79f3bce0dca?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80'
    ],
    overview: 'The Green Lake Trek is one of the most remote, restricted, and breathtaking treks in India. Located in a highly protected zone of North Sikkim near the Indo-China border, the trail follows the Zemu Glacier — longest in the Eastern Himalayas — to Green Lake base camp, offering up-close views of Kangchenjunga\'s northeast face, Siniolchu, and Simvu peaks. Sir Edmund Hillary trained here before Everest. Open to Indian nationals only with very limited annual slots.',
    coordinates: { lat: 27.72, lon: 88.55 },
    route: ['Lachen (2,750m) → Tallem', 'Tallem → Zemu Glacier Snout (3,800m)', 'Zemu Glacier → Yabuk (4,200m)', 'Yabuk → Green Lake Base Camp (4,883m)', 'Explore & acclimatisation days at Green Lake', 'Green Lake → Zemu → Lachen'],
    routeCoordinates: [
      { lat: 27.73, lon: 88.54 }, { lat: 27.72, lon: 88.55 },
      { lat: 27.71, lon: 88.56 }, { lat: 27.70, lon: 88.57 }
    ],
    elevationProfile: [
      { distance: 0, elevation: 2750, label: 'Lachen' },
      { distance: 6, elevation: 3200, label: 'Tallem' },
      { distance: 12, elevation: 3800, label: 'Zemu Glacier Snout' },
      { distance: 20, elevation: 4200, label: 'Yabuk' },
      { distance: 26, elevation: 4600, label: 'Upper Glacier' },
      { distance: 32, elevation: 4883, label: 'Green Lake Camp' }
    ],
    familyFriendly: false,
    soloFriendly: false,
    snowTrek: true,
    oxygenLevel: '60% at Green Lake Camp',
    fitnessRequirement: 'Exceptional fitness mandatory. Glacier travel experience preferred. Prior high-altitude trek above 4,500m required.',
    baseCampsCount: 4,
    accommodation: 'Expedition tents only. No huts or shelters on route.',
    transportation: 'Drive from Gangtok to Lachen (~113 km, 5–6 hrs). Only shared sumos available.',
    nearestRailway: 'New Jalpaiguri (NJP) – 200 km',
    nearestAirport: 'Bagdogra Airport – 178 km',
    nearestBusStand: 'Mangan Bus Stand – 65 km',
    medicalFacilities: 'No medical facilities on route. Operator must carry emergency oxygen. Nearest hospital in Mangan (65 km).',
    emergencyContacts: ['North Sikkim Police: 03592-234567', 'SDMA Sikkim Emergency: 03592-201634'],
    faqs: [
      { question: 'Who is eligible for this trek?', answer: 'Only Indian nationals are permitted. You must have prior high-altitude experience above 4,500m and a special Inner Line Permit from the Sikkim Government. Foreign nationals are not allowed.' },
      { question: 'How many slots are available each year?', answer: 'The Government of Sikkim restricts entries. Generally small groups of 6–10 per season window. Book very early — slots fill months in advance.' },
      { question: 'Is glacier travel involved?', answer: 'Yes. The route crosses sections of the Zemu Glacier moraine. Crampons and knowledge of glacier travel are essential.' }
    ],
    packingChecklist: [
      { category: 'Gear', items: ['Expedition sleeping bag (-20°C rated)', 'Ice axe', 'Crampons', 'Trekking poles', 'Glacier goggles', 'Avalanche transceiver'] },
      { category: 'Clothing', items: ['Expedition down jacket', 'Hardshell waterproof jacket + pants', 'Thermal base layers (3 sets)', 'Waterproof mittens', 'Balaclava', 'Wool socks (4 pairs)'] },
      { category: 'Essentials', items: ['Inner Line Permit + PAP (mandatory)', 'Diamox', 'Emergency oxygen canister', 'Satellite communicator', 'Sunscreen SPF 70+', 'High-calorie expedition rations'] }
    ],
    weatherForecast: [
      { day: 'Monday', temp: '8°C / -12°C', condition: 'Clear', wind: '20 km/h' },
      { day: 'Tuesday', temp: '5°C / -14°C', condition: 'Partly Cloudy', wind: '25 km/h' },
      { day: 'Wednesday', temp: '2°C / -16°C', condition: 'Heavy snow risk', wind: '30 km/h' }
    ],
    companyId: 'thrillophilia',
    reviews: [
      { id: 'gl1', user: 'Vikram S.', avatar: '🧔', rating: 5, date: '2025-05-12', comment: 'Green Lake is the most demanding and most rewarding thing I have ever done. Standing on the Zemu Glacier in Hillary\'s footsteps — unforgettable.' },
      { id: 'gl2', user: 'Priya N.', avatar: '👩', rating: 5, date: '2024-10-28', comment: 'One of India\'s greatest secrets. The northeast face of Kangchenjunga from Green Lake fills the entire sky. Indescribable.' }
    ]
  },
  {
    id: 'markha-valley',
    name: 'Markha Valley Trek',
    state: 'Ladakh',
    district: 'Leh',
    difficulty: 'Moderate-Hard',
    altitude: 5200,
    distance: 37,
    duration: 7,
    bestSeason: 'Jun – Sep',
    bestTime: 'June to September',
    tempRange: '15°C to 25°C (Day) | -5°C to 5°C (Night)',
    baseCamp: 'Skiu',
    baseCampDetails: 'Skiu is a small village in the Markha Valley, accessible via road from Leh through Chilling.',
    rating: 4.7,
    startingPrice: 18000,
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'
    ],
    overview: 'The Markha Valley Trek is one of the most popular and scenic treks in Ladakh, taking you through contrasting dry landscapes, green barley fields, remote villages, and high mountain passes. The trail crosses the high pass of Kongmaru La (5,200m) and offers spectacular views of Kang Yatse peak.',
    coordinates: { lat: 33.91, lon: 77.37 },
    route: ['Leh → Chilling → Skiu (3,400m)', 'Skiu → Markha (3,700m)', 'Markha → Hankar (4,000m)', 'Hankar → Nimaling (4,700m)', 'Nimaling → Kongmaru La (5,200m) → Shang Sumdo', 'Shang Sumdo → Leh'],
    routeCoordinates: [{ lat: 34.15, lon: 77.58 }, { lat: 34.01, lon: 77.25 }, { lat: 33.99, lon: 77.27 }, { lat: 33.91, lon: 77.37 }, { lat: 33.88, lon: 77.42 }, { lat: 33.84, lon: 77.52 }],
    elevationProfile: [
      { distance: 0, elevation: 3500, label: 'Leh' },
      { distance: 10, elevation: 3400, label: 'Skiu' },
      { distance: 20, elevation: 3700, label: 'Markha' },
      { distance: 28, elevation: 4700, label: 'Nimaling' },
      { distance: 33, elevation: 5200, label: 'Kongmaru La' },
      { distance: 37, elevation: 3670, label: 'Shang Sumdo' }
    ],
    familyFriendly: false,
    soloFriendly: true,
    snowTrek: false,
    oxygenLevel: '65% at Kongmaru La',
    fitnessRequirement: 'Good physical fitness. Acclimatization in Leh for 3 days is essential.',
    baseCampsCount: 5,
    accommodation: 'Homestays in villages and camping at Nimaling.',
    transportation: 'Taxi or local bus from Leh to Chilling/Skiu.',
    nearestRailway: 'Jammu Tawi – 700 km',
    nearestAirport: 'Kushok Bakula Rimpoche Airport, Leh',
    nearestBusStand: 'Leh Bus Stand',
    medicalFacilities: 'Basic medical support in Markha village; rescue is possible by horse or helicopter.',
    emergencyContacts: ['Leh Police: 01982-252296', 'District Hospital Leh: 01982-252014'],
    faqs: [
      { question: 'Is drinking water available on the trail?', answer: 'Yes, water is available from streams and homestays. Always use water purification tablets.' },
      { question: 'What is the accommodation like?', answer: 'You will stay in local Ladakhi homestays, which is a great way to experience local culture and food.' }
    ],
    packingChecklist: [
      { category: 'Gear', items: ['Trekking poles', 'Water bottles with filter', 'Warm sleeping bag'] },
      { category: 'Clothing', items: ['Fleece jacket', 'Thermal inners', 'Windcheater'] }
    ],
    weatherForecast: [
      { day: 'Monday', temp: '20°C / 2°C', condition: 'Sunny', wind: '10 km/h' },
      { day: 'Tuesday', temp: '18°C / 0°C', condition: 'Clear', wind: '12 km/h' }
    ],
    companyId: 'indiahikes',
    reviews: [
      { id: 'mv_r1', user: 'Amit K.', avatar: '🧔', rating: 5, date: '2025-08-10', comment: 'Loved staying with Ladakhi families. The view of Kang Yatse from Nimaling was spectacular!' }
    ]
  },
  {
    id: 'kang-yatse-ii',
    name: 'Kang Yatse II Trek',
    state: 'Ladakh',
    district: 'Leh',
    difficulty: 'Hard',
    altitude: 6250,
    distance: 45,
    duration: 9,
    bestSeason: 'Jul – Sep',
    bestTime: 'July to September',
    tempRange: '10°C to 20°C (Day) | -15°C to -5°C (Night)',
    baseCamp: 'Nimaling',
    baseCampDetails: 'Nimaling is a high altitude meadow at 4,700m, used as the base camp for climbing Kang Yatse II.',
    rating: 4.9,
    startingPrice: 35000,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=800&q=80'
    ],
    overview: 'Kang Yatse II (6,250m) is a serious trekking peak in Ladakh, offering an introduction to mountaineering. The climb involves crossing glacier moraines, using crampons and ropes on snow slopes, and a challenging summit push. It offers panoramic views of the Karakoram range and Tibet.',
    coordinates: { lat: 33.75, lon: 77.56 },
    route: ['Leh → Chilling → Skiu', 'Skiu → Markha', 'Markha → Hankar', 'Hankar → Nimaling Base Camp', 'Acclimatization at Base Camp', 'Summit Push to Kang Yatse II (6,250m) → Nimaling', 'Nimaling → Shang Sumdo → Leh'],
    routeCoordinates: [{ lat: 34.15, lon: 77.58 }, { lat: 34.01, lon: 77.25 }, { lat: 33.91, lon: 77.37 }, { lat: 33.84, lon: 77.52 }, { lat: 33.75, lon: 77.56 }],
    elevationProfile: [
      { distance: 0, elevation: 3500, label: 'Leh' },
      { distance: 15, elevation: 3400, label: 'Skiu' },
      { distance: 30, elevation: 4700, label: 'Nimaling Base Camp' },
      { distance: 38, elevation: 6250, label: 'Kang Yatse II Summit' },
      { distance: 45, elevation: 3670, label: 'Shang Sumdo' }
    ],
    familyFriendly: false,
    soloFriendly: false,
    snowTrek: true,
    oxygenLevel: '45% at Summit',
    fitnessRequirement: 'Excellent endurance and strength. Prior high-altitude trekking experience mandatory.',
    baseCampsCount: 6,
    accommodation: 'Camping tents at Nimaling and High Camp.',
    transportation: 'Private vehicle from Leh.',
    nearestRailway: 'Jammu Tawi – 700 km',
    nearestAirport: 'Leh Airport',
    nearestBusStand: 'Leh Bus Stand',
    medicalFacilities: 'Oxygen cylinders and medical kits carried by operators. Rescue by helicopter.',
    emergencyContacts: ['Leh Police: 01982-252296', 'Army Base Hospital Leh: 01982-252012'],
    faqs: [
      { question: 'Do I need climbing gear?', answer: 'Yes, crampons, ice axe, harness, and ropes are required for the summit push, typically provided by the operator.' }
    ],
    packingChecklist: [
      { category: 'Gear', items: ['Climbing boots', 'Crampons', 'Harness', 'Ice axe', 'Warm sleeping bag'] },
      { category: 'Clothing', items: ['Down jacket', 'Waterproof gloves', 'Woolen socks'] }
    ],
    weatherForecast: [
      { day: 'Monday', temp: '10°C / -10°C', condition: 'Sunny/Windy', wind: '25 km/h' },
      { day: 'Tuesday', temp: '8°C / -12°C', condition: 'Clear', wind: '20 km/h' }
    ],
    companyId: 'bikat-adventures',
    reviews: [
      { id: 'ky_r1', user: 'Rohan P.', avatar: '🧔', rating: 5, date: '2025-07-28', comment: 'My first 6,000m peak! The summit night was grueling, but watching the sunrise over Tibet was unmatched.' }
    ]
  },
  {
    id: 'stok-kangri',
    name: 'Stok Kangri Trek',
    state: 'Ladakh',
    district: 'Leh',
    difficulty: 'Hard',
    altitude: 6153,
    distance: 20,
    duration: 6,
    bestSeason: 'Jul – Sep',
    bestTime: 'July to September',
    tempRange: '10°C to 22°C (Day) | -15°C to -5°C (Night)',
    baseCamp: 'Stok Village',
    baseCampDetails: 'Stok village is located about 15 km south of Leh and contains the Stok Palace.',
    rating: 4.8,
    startingPrice: 30000,
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'
    ],
    overview: 'Stok Kangri (6,153m) is one of the highest trekking peaks in India. Known for its challenging altitude, it offers climbers a thrilling high-altitude mountaineering experience. Note: Stok Kangri has been temporarily closed for environmental reasons by the local association, but remains a legendary trek in Ladakh.',
    coordinates: { lat: 34.01, lon: 77.51 },
    route: ['Leh → Stok Village (3,600m)', 'Stok Village → Chang Ma (3,900m)', 'Chang Ma → Mankorma (4,300m)', 'Mankorma → Stok Kangri Base Camp (4,900m)', 'Acclimatization and Training', 'Summit Push (6,153m) → Base Camp', 'Base Camp → Stok Village → Leh'],
    routeCoordinates: [{ lat: 34.15, lon: 77.58 }, { lat: 34.07, lon: 77.54 }, { lat: 34.04, lon: 77.53 }, { lat: 34.01, lon: 77.51 }],
    elevationProfile: [
      { distance: 0, elevation: 3500, label: 'Leh' },
      { distance: 5, elevation: 3600, label: 'Stok Village' },
      { distance: 12, elevation: 4900, label: 'Base Camp' },
      { distance: 16, elevation: 6153, label: 'Stok Kangri Summit' },
      { distance: 20, elevation: 3500, label: 'Leh' }
    ],
    familyFriendly: false,
    soloFriendly: false,
    snowTrek: true,
    oxygenLevel: '48% at Summit',
    fitnessRequirement: 'Superb cardiovascular fitness and prior high altitude trekking experience.',
    baseCampsCount: 4,
    accommodation: 'Camping tents.',
    transportation: 'Drive from Leh to Stok Village.',
    nearestRailway: 'Jammu Tawi – 700 km',
    nearestAirport: 'Leh Airport',
    nearestBusStand: 'Leh Bus Stand',
    medicalFacilities: 'Oxygen, medical kit, pulse oximeters carried by guide.',
    emergencyContacts: ['Stok Police Station: 01982-252296', 'SNM Hospital Leh: 01982-252014'],
    faqs: [
      { question: 'Is Stok Kangri open currently?', answer: 'It is currently closed by the Stok Village association for glacier rejuvenation, but bookings are expected to reopen in future seasons.' }
    ],
    packingChecklist: [
      { category: 'Gear', items: ['Crampons', 'Climbing Boots', 'Headlamp', 'Walking poles'] },
      { category: 'Clothing', items: ['Down jacket', 'Fleece gloves', 'Balaclava'] }
    ],
    weatherForecast: [
      { day: 'Monday', temp: '12°C / -8°C', condition: 'Clear', wind: '15 km/h' },
      { day: 'Tuesday', temp: '10°C / -10°C', condition: 'Sunny', wind: '18 km/h' }
    ],
    companyId: 'thrillophilia',
    reviews: [
      { id: 'sk_r1', user: 'Deepak M.', avatar: '🧔', rating: 5, date: '2025-08-05', comment: 'Extremely tough summit night, but standing at 20,187 ft with Karakoram ranges stretching out was worth every sweat.' }
    ]
  },
  {
    id: 'sham-valley',
    name: 'Sham Valley Trek',
    state: 'Ladakh',
    district: 'Leh',
    difficulty: 'Easy',
    altitude: 3870,
    distance: 16,
    duration: 3,
    bestSeason: 'Year-Round',
    bestTime: 'May to October',
    tempRange: '15°C to 28°C (Day) | 2°C to 10°C (Night)',
    baseCamp: 'Likir',
    baseCampDetails: 'Likir is a beautiful village known for Likir Monastery, about 52 km from Leh.',
    rating: 4.5,
    startingPrice: 9000,
    image: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=400&q=80',
    images: [
      'https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=400&q=80'
    ],
    overview: 'Known as the "Baby Trek" of Ladakh, the Sham Valley Trek passes through traditional villages, ancient Buddhist monasteries, and easy passes like Tsermangchen La (3,750m). It is ideal for beginners and families who want to experience Ladakhi culture and village life.',
    coordinates: { lat: 34.29, lon: 77.21 },
    route: ['Leh → Likir (3,650m) → Yangthang (3,600m)', 'Yangthang → Hemis Shukpachan (3,690m)', 'Hemis Shukpachan → Temisgam (3,200m) → Leh'],
    routeCoordinates: [{ lat: 34.15, lon: 77.58 }, { lat: 34.29, lon: 77.21 }, { lat: 34.30, lon: 77.16 }, { lat: 34.31, lon: 77.12 }],
    elevationProfile: [
      { distance: 0, elevation: 3500, label: 'Leh' },
      { distance: 5, elevation: 3650, label: 'Likir' },
      { distance: 10, elevation: 3690, label: 'Hemis Shukpachan' },
      { distance: 16, elevation: 3200, label: 'Temisgam' }
    ],
    familyFriendly: true,
    soloFriendly: true,
    snowTrek: false,
    oxygenLevel: '85% at highest point',
    fitnessRequirement: 'Basic physical fitness. Suitable for families and children.',
    baseCampsCount: 3,
    accommodation: 'Village homestays.',
    transportation: 'Taxi or public bus from Leh.',
    nearestRailway: 'Jammu Tawi – 700 km',
    nearestAirport: 'Leh Airport',
    nearestBusStand: 'Leh Bus Stand',
    medicalFacilities: 'Basic dispensaries in larger villages.',
    emergencyContacts: ['Leh Police: 01982-252296', 'Health Center Khalsi: 01982-246022'],
    faqs: [
      { question: 'Is this trek suitable for kids?', answer: 'Yes, this is an easy walk with mild elevation changes, making it ideal for families.' }
    ],
    packingChecklist: [
      { category: 'Gear', items: ['Sun hat', 'Water bottle', 'Sunscreen'] },
      { category: 'Clothing', items: ['Light sweater', 'Sun-protective shirts', 'Trekking shoes'] }
    ],
    weatherForecast: [
      { day: 'Monday', temp: '25°C / 8°C', condition: 'Sunny', wind: '8 km/h' },
      { day: 'Tuesday', temp: '26°C / 7°C', condition: 'Sunny', wind: '5 km/h' }
    ],
    companyId: 'indiahikes',
    reviews: [
      { id: 'sv_r1', user: 'Sarah T.', avatar: '👩', rating: 4.5, date: '2025-06-15', comment: 'The homestays were so welcoming, and the apricots in Hemis Shukpachan were delicious!' }
    ]
  },
  {
    id: 'singalila-ridge',
    name: 'Singalila Ridge Trek',
    state: 'West Bengal',
    district: 'Darjeeling',
    difficulty: 'Moderate-Hard',
    altitude: 3657,
    distance: 42,
    duration: 7,
    bestSeason: 'Mar – May, Oct – Dec',
    bestTime: 'March to May and October to December',
    tempRange: '5°C to 18°C (Day) | -5°C to 5°C (Night)',
    baseCamp: 'Manebhanjan',
    baseCampDetails: 'Manebhanjan is a border town 26 km from Darjeeling, the entrance to Singalila National Park.',
    rating: 4.7,
    startingPrice: 13000,
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'
    ],
    overview: 'The Singalila Ridge Trek is a scenic journey along the border of India and Nepal, offering views of the Sleeping Buddha range (Kanchenjunga) and Everest. The trail runs through the Singalila National Park, home to rare flora and fauna, including Red Pandas and Rhododendrons.',
    coordinates: { lat: 27.10, lon: 88.00 },
    route: ['Darjeeling → Manebhanjan → Chitrey', 'Chitrey → Tumling (2,970m)', 'Tumling → Kalipokhri (3,186m)', 'Kalipokhri → Sandakphu (3,636m)', 'Sandakphu → Phalut (3,600m)', 'Phalut → Gorkhey', 'Gorkhey → Srikhola → Darjeeling'],
    routeCoordinates: [{ lat: 27.03, lon: 88.26 }, { lat: 26.98, lon: 88.12 }, { lat: 27.03, lon: 88.07 }, { lat: 27.07, lon: 88.03 }, { lat: 27.10, lon: 88.00 }, { lat: 27.17, lon: 88.02 }, { lat: 27.12, lon: 88.13 }],
    elevationProfile: [
      { distance: 0, elevation: 2134, label: 'Manebhanjan' },
      { distance: 11, elevation: 2970, label: 'Tumling' },
      { distance: 23, elevation: 3186, label: 'Kalipokhri' },
      { distance: 31, elevation: 3636, label: 'Sandakphu' },
      { distance: 42, elevation: 3600, label: 'Phalut' }
    ],
    familyFriendly: true,
    soloFriendly: true,
    snowTrek: false,
    oxygenLevel: '70% at Sandakphu',
    fitnessRequirement: 'Moderate fitness. Ability to walk 10-15 km per day.',
    baseCampsCount: 5,
    accommodation: 'Tea houses and homestays.',
    transportation: 'Land Rover or taxi from Darjeeling.',
    nearestRailway: 'New Jalpaiguri (NJP) – 90 km',
    nearestAirport: 'Bagdogra Airport – 95 km',
    nearestBusStand: 'Darjeeling Bus Stand',
    medicalFacilities: 'Basic primary health centers in Manebhanjan and Sandakphu.',
    emergencyContacts: ['Darjeeling Police: 0354-2254422', 'Sukhia Pokhri Health Center: 0354-2260233'],
    faqs: [
      { question: 'Do I need a permit?', answer: 'Yes, entry permits for Singalila National Park are required and can be obtained at the Manebhanjan entry gate.' }
    ],
    packingChecklist: [
      { category: 'Gear', items: ['Trekking poles', 'Backpack 50L', 'Flashlight'] },
      { category: 'Clothing', items: ['Warm fleece', 'Windproof jacket', 'Trekking shoes'] }
    ],
    weatherForecast: [
      { day: 'Monday', temp: '12°C / 2°C', condition: 'Mist', wind: '12 km/h' },
      { day: 'Tuesday', temp: '15°C / 4°C', condition: 'Clear', wind: '10 km/h' }
    ],
    companyId: 'bikat-adventures',
    reviews: [
      { id: 'sr_r1', user: 'Nikhil D.', avatar: '🧔', rating: 5, date: '2025-11-12', comment: 'Stunning sunset over the Kanchenjunga range. We stayed in cozy wooden lodges.' }
    ]
  },
  {
    id: 'david-scott-trail',
    name: 'David Scott Trail',
    state: 'Meghalaya',
    district: 'East Khasi Hills',
    difficulty: 'Easy',
    altitude: 1492,
    distance: 16,
    duration: 1,
    bestSeason: 'Oct – Apr',
    bestTime: 'October to April',
    tempRange: '15°C to 24°C (Day) | 8°C to 15°C (Night)',
    baseCamp: 'Mawphlang',
    baseCampDetails: 'Mawphlang is a village 25 km from Shillong, famous for its Sacred Grove forest.',
    rating: 4.6,
    startingPrice: 2000,
    image: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=400&q=80',
    images: [
      'https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=400&q=80'
    ],
    overview: 'The David Scott Trail is a historic 16 km trek from Mawphlang to Lad Mawphlang, laid by British administrator David Scott in the 1800s. The trail passes through stunning Khasi hills, cascading rivers, old stone bridges, and beautiful pine forests.',
    coordinates: { lat: 25.45, lon: 91.75 },
    route: ['Mawphlang (Start) → Ka Iew Luri Lura → Umiam River Bridge → Lad Mawphlang (End)'],
    routeCoordinates: [{ lat: 25.45, lon: 91.75 }, { lat: 25.42, lon: 91.73 }, { lat: 25.37, lon: 91.76 }],
    elevationProfile: [
      { distance: 0, elevation: 1492, label: 'Mawphlang' },
      { distance: 8, elevation: 1200, label: 'Umiam River' },
      { distance: 16, elevation: 1510, label: 'Lad Mawphlang' }
    ],
    familyFriendly: true,
    soloFriendly: true,
    snowTrek: false,
    oxygenLevel: '95%',
    fitnessRequirement: 'Easy walking trail, suitable for beginners and families.',
    baseCampsCount: 1,
    accommodation: 'Homestays in Mawphlang; hotels in Shillong.',
    transportation: 'Taxi from Shillong to Mawphlang.',
    nearestRailway: 'Guwahati Railway Station – 125 km',
    nearestAirport: 'Umroi Airport, Shillong – 55 km | Guwahati Airport – 140 km',
    nearestBusStand: 'Shillong Bus Stand',
    medicalFacilities: 'Dispensary in Mawphlang. Major hospitals in Shillong.',
    emergencyContacts: ['Shillong Police: 0364-2222277', 'Mawphlang PHC: 0364-2535032'],
    faqs: [
      { question: 'Is a guide necessary?', answer: 'While the trail is marked, hiring a local guide from Mawphlang is highly recommended to learn about local history.' }
    ],
    packingChecklist: [
      { category: 'Gear', items: ['Water bottle', 'Daypack', 'Camera'] },
      { category: 'Clothing', items: ['Comfortable walking shoes', 'Raincoat (monsoon prep)', 'Sun hat'] }
    ],
    weatherForecast: [
      { day: 'Monday', temp: '22°C / 12°C', condition: 'Sunny', wind: '8 km/h' },
      { day: 'Tuesday', temp: '20°C / 14°C', condition: 'Light rain', wind: '10 km/h' }
    ],
    companyId: 'thrillophilia',
    reviews: [
      { id: 'ds_r1', user: 'Anjali S.', avatar: '👩', rating: 5, date: '2025-12-01', comment: 'A beautiful walk through history. The old stone bridge is straight out of a fairy tale.' }
    ]
  },
  {
    id: 'double-decker-root-bridge',
    name: 'Double Decker Living Root Bridge Trek',
    state: 'Meghalaya',
    district: 'East Khasi Hills',
    difficulty: 'Easy-Moderate',
    altitude: 732,
    distance: 3.5,
    duration: 1,
    bestSeason: 'Oct – May',
    bestTime: 'October to May',
    tempRange: '18°C to 28°C (Day) | 12°C to 18°C (Night)',
    baseCamp: 'Tyrna Village',
    baseCampDetails: 'Tyrna is a small village 20 km from Cherrapunji, where the stairs down to Nongriat begin.',
    rating: 4.8,
    startingPrice: 1500,
    image: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=400&q=80',
    images: [
      'https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=400&q=80'
    ],
    overview: 'Located in Nongriat village, the Double Decker Living Root Bridge is a bio-engineering marvel grown from the roots of Ficus elastica trees by the Khasi tribe. The trek is a steep descent of over 3,500 concrete steps through lush forests, crossing wire suspension bridges over crystal-clear blue pools.',
    coordinates: { lat: 25.27, lon: 91.68 },
    route: ['Tyrna Village (Start) → 3,500 Steps Down → Nongriat Village (Double Decker Bridge) → Rainbow Falls (Optional extension)'],
    routeCoordinates: [{ lat: 25.27, lon: 91.68 }, { lat: 25.26, lon: 91.67 }, { lat: 25.25, lon: 91.66 }],
    elevationProfile: [
      { distance: 0, elevation: 732, label: 'Tyrna Village' },
      { distance: 2.5, elevation: 150, label: 'Nongriat Bridge' },
      { distance: 3.5, elevation: 250, label: 'Rainbow Falls' }
    ],
    familyFriendly: true,
    soloFriendly: true,
    snowTrek: false,
    oxygenLevel: '98%',
    fitnessRequirement: 'Good knee strength for climbing down and up 3,500 steps.',
    baseCampsCount: 1,
    accommodation: 'Homestays in Nongriat village.',
    transportation: 'Local taxi from Cherrapunji/Sohra.',
    nearestRailway: 'Guwahati – 150 km',
    nearestAirport: 'Guwahati Airport – 160 km',
    nearestBusStand: 'Cherrapunji Bus Stand',
    medicalFacilities: 'Basic first aid in Nongriat. Hospital in Sohra (Cherrapunji).',
    emergencyContacts: ['Sohra Police: 03637-222239', 'Cherrapunji CHC: 03637-222240'],
    faqs: [
      { question: 'How long does the climb back up take?', answer: 'Climbing up the 3,500 steps takes about 1.5 to 2.5 hours depending on fitness.' }
    ],
    packingChecklist: [
      { category: 'Gear', items: ['Trekking pole', 'Water bottle', 'Quick-dry towel'] },
      { category: 'Clothing', items: ['Comfortable shoes with good grip', 'Extra set of clothes for swimming', 'Rain poncho'] }
    ],
    weatherForecast: [
      { day: 'Monday', temp: '24°C / 16°C', condition: 'Sunny', wind: '6 km/h' },
      { day: 'Tuesday', temp: '22°C / 17°C', condition: 'Humid/Rainy', wind: '8 km/h' }
    ],
    companyId: 'thrillophilia',
    reviews: [
      { id: 'lrb_r1', user: 'Ramesh K.', avatar: '🧔', rating: 5, date: '2025-11-20', comment: 'Swimming in the natural blue pools under the root bridge was magical. The steps are tough but worth it!' }
    ]
  },
  {
    id: 'mechuka-trek',
    name: 'Mechuka Trek',
    state: 'Arunachal Pradesh',
    district: 'Shi Yomi',
    difficulty: 'Moderate',
    altitude: 2438,
    distance: 15,
    duration: 3,
    bestSeason: 'Oct – Apr',
    bestTime: 'October to April',
    tempRange: '5°C to 18°C (Day) | -2°C to 8°C (Night)',
    baseCamp: 'Mechuka Village',
    baseCampDetails: 'Mechuka is a scenic valley at 1,828m, inhabited by the Memba tribe. It has homestays and is close to the China border.',
    rating: 4.7,
    startingPrice: 15000,
    image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=400&q=80',
    images: [
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=400&q=80'
    ],
    overview: 'Mechuka (Menchukha) is a hidden valley in Shi Yomi district of Arunachal Pradesh. This trek takes you through rolling green meadows (often compared to Switzerland), pine forests, bamboo bridges, and holy caves, offering stunning views of snow-clad eastern Himalayan peaks.',
    coordinates: { lat: 28.60, lon: 94.12 },
    route: ['Mechuka Valley (Start) → Yarlung Camp → Samten Yongcha Monastery → Shiyong Village'],
    routeCoordinates: [{ lat: 28.60, lon: 94.12 }, { lat: 28.58, lon: 94.08 }, { lat: 28.62, lon: 94.14 }],
    elevationProfile: [
      { distance: 0, elevation: 1828, label: 'Mechuka Valley' },
      { distance: 8, elevation: 2100, label: 'Monastery' },
      { distance: 15, elevation: 2438, label: 'Mechuka Viewpoint' }
    ],
    familyFriendly: true,
    soloFriendly: true,
    snowTrek: false,
    oxygenLevel: '80%',
    fitnessRequirement: 'Moderate fitness; suitable for beginners and family groups.',
    baseCampsCount: 2,
    accommodation: 'Homestays in Mechuka.',
    transportation: 'Shared Sumo or private taxi from Along (Aalo) or Pasighat.',
    nearestRailway: 'Silapathar Railway Station – 240 km',
    nearestAirport: 'Lilabari Airport, Lakhimpur – 380 km | Dibrugarh Airport – 300 km',
    nearestBusStand: 'Aalo Bus Stand',
    medicalFacilities: 'Community Health Center in Mechuka.',
    emergencyContacts: ['Mechuka Police Station: 03783-222223', 'District Administration: 03783-222221'],
    faqs: [
      { question: 'Do I need an Inner Line Permit (ILP)?', answer: 'Yes, an ILP (for Indian nationals) or PAP (Protected Area Permit for foreigners) is mandatory to enter Arunachal Pradesh.' }
    ],
    packingChecklist: [
      { category: 'Gear', items: ['ILP Document', 'Daypack', 'Warm sleeping bag'] },
      { category: 'Clothing', items: ['Down jacket', 'Fleece sweaters', 'Sturdy boots'] }
    ],
    weatherForecast: [
      { day: 'Monday', temp: '15°C / 4°C', condition: 'Sunny', wind: '10 km/h' },
      { day: 'Tuesday', temp: '14°C / 3°C', condition: 'Cloudy', wind: '12 km/h' }
    ],
    companyId: 'bikat-adventures',
    reviews: [
      { id: 'mt_r1', user: 'Tashi W.', avatar: '🧔', rating: 5, date: '2025-10-15', comment: 'Extremely peaceful valley. The Memba people are very warm, and the monastery has a mystical vibe.' }
    ]
  },
  {
    id: 'gorichen-base-camp',
    name: 'Gorichen Base Camp Trek',
    state: 'Arunachal Pradesh',
    district: 'Tawang',
    difficulty: 'Hard',
    altitude: 4268,
    distance: 20,
    duration: 5,
    bestSeason: 'Sep – Oct',
    bestTime: 'September and October',
    tempRange: '8°C to 15°C (Day) | -8°C to 0°C (Night)',
    baseCamp: 'Jang',
    baseCampDetails: 'Jang is a small town between Dirang and Tawang, close to Nuranang Falls.',
    rating: 4.8,
    startingPrice: 22000,
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80'
    ],
    overview: 'This trek leads to the base camp of Mount Gorichen (6,488m), the highest peak in Arunachal Pradesh. It is a challenging trek passing through high alpine lakes, grazing grounds of yaks, and dense rhododendron forests, offering stunning close-up views of the sacred Gorichen peak.',
    coordinates: { lat: 27.80, lon: 92.20 },
    route: ['Jang (2,200m) → Chander (2,900m) → Thimbu → Gorichen Base Camp (4,268m) → Jang'],
    routeCoordinates: [{ lat: 27.58, lon: 91.98 }, { lat: 27.65, lon: 92.05 }, { lat: 27.80, lon: 92.20 }],
    elevationProfile: [
      { distance: 0, elevation: 2200, label: 'Jang' },
      { distance: 8, elevation: 2900, label: 'Chander' },
      { distance: 15, elevation: 3600, label: 'Thimbu' },
      { distance: 20, elevation: 4268, label: 'Base Camp' }
    ],
    familyFriendly: false,
    soloFriendly: false,
    snowTrek: true,
    oxygenLevel: '60%',
    fitnessRequirement: 'High level of fitness required. Acclimatization in Dirang/Tawang is highly recommended.',
    baseCampsCount: 4,
    accommodation: 'High altitude camping tents.',
    transportation: 'Taxi from Tawang or Bomdila to Jang.',
    nearestRailway: 'Bhalukpong Railway Station – 220 km',
    nearestAirport: 'Tezpur Airport – 280 km | Guwahati Airport – 420 km',
    nearestBusStand: 'Tawang Bus Stand',
    medicalFacilities: 'No medical help on trail. Nearest hospital is in Tawang.',
    emergencyContacts: ['Tawang Police: 03794-222274', 'District Hospital Tawang: 03794-222204'],
    faqs: [
      { question: 'What permits are required?', answer: 'You need an ILP/PAP, and also a forest entry clearance from the Divisional Forest Officer (DFO) in Tawang.' }
    ],
    packingChecklist: [
      { category: 'Gear', items: ['Mountaineering tents', 'Heavy duty warm sleeping bag', 'Crampons'] },
      { category: 'Clothing', items: ['Thermal inner layers', 'Down feather jacket', 'Waterproof gloves'] }
    ],
    weatherForecast: [
      { day: 'Monday', temp: '10°C / -2°C', condition: 'Sunny', wind: '15 km/h' },
      { day: 'Tuesday', temp: '8°C / -5°C', condition: 'Windy/Cold', wind: '20 km/h' }
    ],
    companyId: 'thrillophilia',
    reviews: [
      { id: 'gbc_r1', user: 'Lobsang D.', avatar: '🧔', rating: 5, date: '2025-10-02', comment: 'Spectacular views of Gorichen. The trail is lonely and beautiful, with grazing yaks everywhere.' }
    ]
  }
];

export const adventureActivities: AdventureActivity[] = [
  {
    id: 'trekking',
    name: 'High Altitude Trekking',
    category: 'Trekking',
    icon: '🥾',
    tagline: 'Scale the highest peaks and cross ancient passes',
    description: 'From gentle pine valley strolls to grueling glacial pass crossings over 5,000 meters. Trekking in India takes you through alpine meadows, skeleton lakes, and frozen valleys.',
    bestLocations: [
      { name: 'Roopkund', state: 'Uttarakhand', coordinates: { lat: 30.26, lon: 79.73 } },
      { name: 'Hampta Pass', state: 'Himachal Pradesh', coordinates: { lat: 32.22, lon: 77.37 } }
    ],
    startingPrice: 8000,
    difficulty: 'Easy to Extreme',
    season: 'Year-Round (Best: May - Nov)',
    gearRequired: ['Waterproof Trekking Shoes', 'Down Jacket', 'Trekking Pole', 'Backpack']
  },
  {
    id: 'camping',
    name: 'Wilderness Camping',
    category: 'Camping',
    icon: '⛺',
    tagline: 'Sleep under a canopy of billion stars',
    description: 'Camp in lush high-altitude meadows (Bugyals), alongside sparkling glacial lakes, or on sand dunes. Experience true disconnection from screens and connection with the universe.',
    bestLocations: [
      { name: 'Ali Bugyal', state: 'Uttarakhand', coordinates: { lat: 30.18, lon: 79.71 } },
      { name: 'Chandratal Lake', state: 'Himachal Pradesh', coordinates: { lat: 32.48, lon: 77.61 } }
    ],
    startingPrice: 2500,
    difficulty: 'Easy',
    season: 'May to October',
    gearRequired: ['Sleeping Bag (-5°C rated)', 'Dome Tent', 'Headlamp', 'Thermos flask']
  },
  {
    id: 'river-rafting',
    name: 'White Water River Rafting',
    category: 'River Rafting',
    icon: '🛶',
    tagline: 'Tame the wild rapids of the Ganga and Indus',
    description: 'Crash through Grade III, IV, and V rapids. Rishikesh is the white-water capital, but river runs in Ladakh (Zanskar) and Arunachal (Brahmaputra) offer extreme wilderness thrills.',
    bestLocations: [
      { name: 'Rishikesh', state: 'Uttarakhand', coordinates: { lat: 30.08, lon: 78.26 } },
      { name: 'Zanskar River', state: 'Ladakh', coordinates: { lat: 33.95, lon: 77.25 } }
    ],
    startingPrice: 1500,
    difficulty: 'Medium to Hard',
    season: 'September to June',
    gearRequired: ['Life Jacket (PFD)', 'Water Sports Helmet', 'Neoprene Wetsuit', 'Dry Bag']
  },
  {
    id: 'mountain-biking',
    name: 'Mountain Biking',
    category: 'Mountain Biking',
    icon: '🚲',
    tagline: 'Ride the highest motorable dirt tracks',
    description: 'Race down the steep dirt tracks of Manali, navigate the high-altitude deserts of Spiti, or ride the rolling hills of the Western Ghats.',
    bestLocations: [
      { name: 'Leh-Manali Highway', state: 'Ladakh / Himachal', coordinates: { lat: 32.9, lon: 77.3 } }
    ],
    startingPrice: 5000,
    difficulty: 'Hard',
    season: 'June to September',
    gearRequired: ['Full-suspension Mountain Bike', 'Full-face Helmet', 'Elbow & Knee pads', 'Hydration Pack']
  },
  {
    id: 'rock-climbing',
    name: 'Rock Climbing & Bouldering',
    category: 'Rock Climbing',
    icon: '🧗',
    tagline: 'Defy gravity on natural granite cliffs',
    description: 'From bouldering in the ruins of Hampi to scaling massive granite crags in Badami or the high rock walls of Miyar Valley in Himachal.',
    bestLocations: [
      { name: 'Hampi Boulders', state: 'Karnataka', coordinates: { lat: 15.33, lon: 76.46 } },
      { name: 'Badami Cliffs', state: 'Karnataka', coordinates: { lat: 15.91, lon: 75.68 } }
    ],
    startingPrice: 3000,
    difficulty: 'Hard to Extreme',
    season: 'November to February',
    gearRequired: ['Climbing Shoes', 'Chalk bag', 'Harness', 'Belay device']
  },
  {
    id: 'paragliding',
    name: 'Paragliding',
    category: 'Paragliding',
    icon: '🪂',
    tagline: 'Soar like an eagle over tea gardens and snow peaks',
    description: 'Fly tandem or solo from Bir Billing - ranked as the second best paragliding take-off site in the world, staying airborne in thermal currents.',
    bestLocations: [
      { name: 'Bir Billing', state: 'Himachal Pradesh', coordinates: { lat: 32.04, lon: 76.73 } }
    ],
    startingPrice: 3000,
    difficulty: 'Easy (Tandem) / Hard (Solo)',
    season: 'October to June',
    gearRequired: ['Paraglider Wing', 'Harness with Reserve Parachute', 'Radio', 'Wind Checker']
  },
  {
    id: 'skiing',
    name: 'Alpine Skiing & Snowboarding',
    category: 'Skiing',
    icon: '⛷️',
    tagline: 'Carve through deep powder in the Himalayas',
    description: 'Gulmarg offers some of the deepest, fluffiest powder snow in Asia with gondola lifts climbing to 4,000m. Auli in Uttarakhand offers beautiful pine-fringed runs.',
    bestLocations: [
      { name: 'Gulmarg', state: 'Jammu & Kashmir', coordinates: { lat: 34.05, lon: 74.38 } },
      { name: 'Auli', state: 'Uttarakhand', coordinates: { lat: 30.53, lon: 79.56 } }
    ],
    startingPrice: 7000,
    difficulty: 'Medium to Hard',
    season: 'January to March',
    gearRequired: ['Skis / Snowboard', 'Ski Boots', 'Thermal goggles', 'Helmets']
  },
  {
    id: 'scuba-diving',
    name: 'Scuba Diving',
    category: 'Scuba Diving',
    icon: '🤿',
    tagline: 'Explore coral gardens and volcanic shipwrecks',
    description: 'Dive into the crystal clear turquoise waters of Havelock and Neil islands in the Andamans. Explore vibrant corals, sea turtles, dugongs, and ancient shipwrecks.',
    bestLocations: [
      { name: 'Havelock Island', state: 'Andaman Islands', coordinates: { lat: 12.03, lon: 92.98 } }
    ],
    startingPrice: 4500,
    difficulty: 'Easy to Medium',
    season: 'October to May',
    gearRequired: ['Scuba Regulator', 'Buoyancy Control Device (BCD)', 'Dive Computer', 'Wetsuit']
  },
  {
    id: 'desert-safari',
    name: 'Desert Safari',
    category: 'Desert Safari',
    icon: '🐪',
    tagline: 'Ride into the golden sunsets of Thar Desert',
    description: 'Explore the vast sand dunes of Jaisalmer. Camp in traditional tents, enjoy Rajasthani folk music under the stars, and experience camel or dune buggy rides.',
    bestLocations: [
      { name: 'Sam Sand Dunes', state: 'Rajasthan', coordinates: { lat: 26.91, lon: 70.90 } }
    ],
    startingPrice: 2000,
    difficulty: 'Easy',
    season: 'October to March',
    gearRequired: ['Sun protection sunglasses', 'Scarf', 'Loose cotton clothing']
  }
];

export const forumPosts: ForumPost[] = [];

export const buddyRequests: BuddyRequest[] = [];

export const leaderboardUsers: LeaderboardUser[] = [
  { rank: 1, name: 'Tenzing Norgay Fan', avatar: '👨', altitudeGained: 24500, completedTreks: 12, points: 9800, badge: 'Himalayan Sherpa' },
  { rank: 2, name: 'Priya Adventure', avatar: '👩', altitudeGained: 18350, completedTreks: 8, points: 7400, badge: 'Peak Conqueror' },
  { rank: 3, name: 'Siddharth Roy', avatar: '👨', altitudeGained: 15400, completedTreks: 7, points: 6100, badge: 'Cloud Walker' },
  { rank: 4, name: 'Rohan Sharma', avatar: '👨', altitudeGained: 11200, completedTreks: 5, points: 4800, badge: 'Trail Blazer' },
  { rank: 5, name: 'Kavita Iyer', avatar: '👩', altitudeGained: 9800, completedTreks: 4, points: 3900, badge: 'Explorer' }
];

export const blogPosts: BlogPost[] = [
  {
    id: 'blog1',
    title: 'High Altitude Packing Checklist: What to carry and what to leave behind',
    excerpt: 'Packing for a Himalayan trek is an art of weight management. Learn how to layer your clothing and pack smart.',
    content: 'The golden rule of packing for high altitude treks is: "Pack light, pack right." Every gram on your back feels like a kilogram at 4,000 meters. Always use the three-layer clothing system: base layer (sweat-wicking), middle layer (fleece for warmth), and outer layer (wind and water protection). Leave heavy cotton jeans and non-essential electronics behind.',
    image: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=400&q=80',
    category: 'Gear Guide',
    author: 'Swathi Chatrapathy',
    date: '2026-05-20',
    readTime: '6 mins'
  },
  {
    id: 'blog2',
    title: 'Rethinking Eco-Tourism: Leave No Trace in the Indian Himalayas',
    excerpt: 'With increasing footfall on trekking trails, eco-tourism is no longer an option but a critical necessity. How you can make a difference.',
    content: 'Littering on trails destroys delicate alpine ecosystems where trash does not decompose due to freezing temperatures. Carry all wrapper trash back with you to the base camp. Respect wildlife, stay on the designated trail paths, and use dry eco-toilets provided by operators instead of polluting local streams.',
    image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=400&q=80',
    category: 'Eco Travel',
    author: 'Arjun Majumdar',
    date: '2026-06-01',
    readTime: '8 mins'
  }
];
