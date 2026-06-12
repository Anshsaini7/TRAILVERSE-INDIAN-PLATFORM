export interface CityLocation {
  name: string;
  lat: number;
  lon: number;
}

export const STATE_DISTRICTS: Record<string, CityLocation[]> = {
  "Andaman & Nicobar Islands (UT)": [
    { name: "Port Blair (Capital)", lat: 11.623, lon: 92.726 },
    { name: "Car Nicobar", lat: 9.167, lon: 92.767 },
    { name: "Mayabunder", lat: 12.923, lon: 92.909 }
  ],
  "Andhra Pradesh": [
    { name: "Visakhapatnam", lat: 17.6868, lon: 83.2185 },
    { name: "Vijayawada", lat: 16.5062, lon: 80.6480 },
    { name: "Guntur", lat: 16.3067, lon: 80.4365 },
    { name: "Tirupati", lat: 13.6288, lon: 79.4192 },
    { name: "Kurnool", lat: 15.8281, lon: 78.0373 },
    { name: "Nellore", lat: 14.4426, lon: 79.9865 },
    { name: "Rajamahendravaram", lat: 16.9891, lon: 81.7836 },
    { name: "Kakinada", lat: 16.9890, lon: 82.2475 },
    { name: "Kadapa", lat: 14.4673, lon: 78.8242 },
    { name: "Anantapur", lat: 14.6819, lon: 77.6006 },
    { name: "Eluru", lat: 16.7107, lon: 81.1017 },
    { name: "Ongole", lat: 15.5057, lon: 80.0499 },
    { name: "Vizianagaram", lat: 18.1067, lon: 83.3955 },
    { name: "Srikakulam", lat: 18.3125, lon: 83.8966 },
    { name: "Chittoor", lat: 13.2172, lon: 79.1003 }
  ],
  "Arunachal Pradesh": [
    { name: "Itanagar (Capital)", lat: 27.0844, lon: 93.6053 },
    { name: "Tawang", lat: 27.5852, lon: 91.8624 },
    { name: "Ziro", lat: 27.5959, lon: 93.8378 },
    { name: "Pasighat", lat: 28.0620, lon: 95.3262 },
    { name: "Bomdila", lat: 27.2645, lon: 92.4158 },
    { name: "Along", lat: 28.1670, lon: 94.7997 },
    { name: "Tezu", lat: 27.9176, lon: 96.1623 },
    { name: "Roing", lat: 28.1408, lon: 95.8421 },
    { name: "Changlang", lat: 27.1235, lon: 95.7330 }
  ],
  "Assam": [
    { name: "Guwahati", lat: 26.1445, lon: 91.7362 },
    { name: "Dibrugarh", lat: 27.4728, lon: 94.9120 },
    { name: "Silchar", lat: 24.8333, lon: 92.7789 },
    { name: "Jorhat", lat: 26.7509, lon: 94.2037 },
    { name: "Nagaon", lat: 26.3478, lon: 92.6840 },
    { name: "Tezpur", lat: 26.6528, lon: 92.7926 },
    { name: "Tinsukia", lat: 27.4886, lon: 95.3558 },
    { name: "Karimganj", lat: 24.8647, lon: 92.3591 },
    { name: "Bongaigaon", lat: 26.4715, lon: 90.5583 },
    { name: "Sivasagar", lat: 26.9822, lon: 94.6425 },
    { name: "Kokrajhar", lat: 26.4026, lon: 90.2721 }
  ],
  "Bihar": [
    { name: "Patna (Capital)", lat: 25.5941, lon: 85.1376 },
    { name: "Gaya", lat: 24.7955, lon: 85.0030 },
    { name: "Bhagalpur", lat: 25.2425, lon: 87.0145 },
    { name: "Muzaffarpur", lat: 26.1209, lon: 85.3647 },
    { name: "Purnia", lat: 25.7771, lon: 87.4753 },
    { name: "Darbhanga", lat: 26.1542, lon: 85.8918 },
    { name: "Bihar Sharif (Nalanda)", lat: 25.1982, lon: 85.5264 },
    { name: "Arrah (Bhojpur)", lat: 25.5560, lon: 84.6603 },
    { name: "Begusarai", lat: 25.4182, lon: 86.1272 },
    { name: "Chhapra (Saran)", lat: 25.7811, lon: 84.7277 },
    { name: "Katihar", lat: 25.5383, lon: 87.5717 },
    { name: "Munger", lat: 25.3748, lon: 86.4735 },
    { name: "Saharsa", lat: 25.8835, lon: 86.6006 },
    { name: "Motihari (East Champaran)", lat: 26.6522, lon: 84.9224 },
    { name: "Hajipur (Vaishali)", lat: 25.6858, lon: 85.2237 }
  ],
  "Chandigarh (UT)": [
    { name: "Chandigarh", lat: 30.7333, lon: 76.7794 }
  ],
  "Chhattisgarh": [
    { name: "Raipur (Capital)", lat: 21.2514, lon: 81.6296 },
    { name: "Bilaspur", lat: 22.0790, lon: 82.1391 },
    { name: "Durg-Bhilai", lat: 21.1904, lon: 81.3503 },
    { name: "Korba", lat: 22.3597, lon: 82.7501 },
    { name: "Rajnandgaon", lat: 21.0963, lon: 81.0315 },
    { name: "Jagdalpur (Bastar)", lat: 19.0730, lon: 82.0232 },
    { name: "Ambikapur (Surguja)", lat: 22.9996, lon: 83.1895 },
    { name: "Raigarh", lat: 21.8974, lon: 83.3910 }
  ],
  "Dadra & Nagar Haveli and Daman & Diu (UT)": [
    { name: "Silvassa", lat: 20.2766, lon: 73.0022 },
    { name: "Daman", lat: 20.3974, lon: 72.8328 },
    { name: "Diu", lat: 20.7144, lon: 70.9822 }
  ],
  "Delhi": [
    { name: "New Delhi (Capital)", lat: 28.6139, lon: 77.2090 },
    { name: "Old Delhi", lat: 28.6562, lon: 77.2307 },
    { name: "Dwarka", lat: 28.5889, lon: 77.0583 },
    { name: "Rohini", lat: 28.7158, lon: 77.1137 },
    { name: "South Delhi (Saket)", lat: 28.5244, lon: 77.2066 },
    { name: "East Delhi", lat: 28.6273, lon: 77.2917 },
    { name: "West Delhi", lat: 28.6678, lon: 77.1258 }
  ],
  "Goa": [
    { name: "Panaji (Capital)", lat: 15.4909, lon: 73.8278 },
    { name: "Margao", lat: 15.2736, lon: 73.9582 },
    { name: "Vasco da Gama", lat: 15.3997, lon: 73.8115 },
    { name: "Mapusa", lat: 15.5937, lon: 73.8142 }
  ],
  "Gujarat": [
    { name: "Ahmedabad", lat: 23.0225, lon: 72.5714 },
    { name: "Surat", lat: 21.1702, lon: 72.8311 },
    { name: "Vadodara", lat: 22.3072, lon: 73.1812 },
    { name: "Rajkot", lat: 22.3039, lon: 70.8022 },
    { name: "Bhavnagar", lat: 21.7645, lon: 72.1519 },
    { name: "Jamnagar", lat: 22.4707, lon: 70.0577 },
    { name: "Gandhinagar (Capital)", lat: 23.2156, lon: 72.6369 },
    { name: "Junagadh", lat: 21.5222, lon: 70.4579 },
    { name: "Anand", lat: 22.5645, lon: 72.9289 },
    { name: "Morbi", lat: 22.8120, lon: 70.8236 },
    { name: "Bhuj (Kutch)", lat: 23.2420, lon: 69.6669 },
    { name: "Mehsana", lat: 23.6015, lon: 72.3995 },
    { name: "Porbandar", lat: 21.6417, lon: 69.6293 }
  ],
  "Haryana": [
    { name: "Gurugram", lat: 28.4595, lon: 77.0266 },
    { name: "Faridabad", lat: 28.4089, lon: 77.3178 },
    { name: "Panipat", lat: 29.3909, lon: 76.9635 },
    { name: "Ambala", lat: 30.3782, lon: 76.7767 },
    { name: "Rohtak", lat: 28.8955, lon: 76.6066 },
    { name: "Hisar", lat: 29.1492, lon: 75.7217 },
    { name: "Karnal", lat: 29.6857, lon: 76.9905 },
    { name: "Sonipat", lat: 28.9931, lon: 77.0151 },
    { name: "Panchkula", lat: 30.6942, lon: 76.8606 },
    { name: "Kurukshetra", lat: 29.9695, lon: 76.8783 },
    { name: "Sirsa", lat: 29.5312, lon: 75.0298 }
  ],
  "Himachal Pradesh": [
    { name: "Shimla (Capital)", lat: 31.1048, lon: 77.1734 },
    { name: "Manali (Kullu)", lat: 32.2396, lon: 77.1887 },
    { name: "Dharamshala (Kangra)", lat: 32.2190, lon: 76.3234 },
    { name: "Solan", lat: 30.9045, lon: 77.0967 },
    { name: "Mandi", lat: 31.5711, lon: 76.9318 },
    { name: "Kullu", lat: 31.9579, lon: 77.1095 },
    { name: "Chamba", lat: 32.5534, lon: 76.1258 },
    { name: "Hamirpur", lat: 31.6862, lon: 76.5213 },
    { name: "Una", lat: 31.4684, lon: 76.2708 },
    { name: "Bilaspur", lat: 31.3301, lon: 76.7594 },
    { name: "Keylong (Lahaul & Spiti)", lat: 32.5714, lon: 77.0315 },
    { name: "Reckong Peo (Kinnaur)", lat: 31.5382, lon: 78.2736 },
    { name: "Nahan (Sirmaur)", lat: 30.5599, lon: 77.2954 }
  ],
  "Jammu & Kashmir (UT)": [
    { name: "Srinagar (Summer Capital)", lat: 34.0837, lon: 74.7973 },
    { name: "Jammu (Winter Capital)", lat: 32.7266, lon: 74.8643 },
    { name: "Anantnag", lat: 33.7311, lon: 75.1481 },
    { name: "Baramulla", lat: 34.1983, lon: 74.3636 },
    { name: "Kathua", lat: 32.3835, lon: 75.5219 },
    { name: "Udhampur", lat: 32.9234, lon: 75.1382 },
    { name: "Doda", lat: 33.1437, lon: 75.5684 },
    { name: "Kupwara", lat: 34.5262, lon: 74.2544 },
    { name: "Poonch", lat: 33.7681, lon: 74.0858 }
  ],
  "Jharkhand": [
    { name: "Ranchi (Capital)", lat: 23.3441, lon: 85.3090 },
    { name: "Jamshedpur (East Singhbhum)", lat: 22.8046, lon: 86.2029 },
    { name: "Dhanbad", lat: 23.7957, lon: 86.4304 },
    { name: "Bokaro Steel City", lat: 23.6693, lon: 86.1511 },
    { name: "Deoghar", lat: 24.4820, lon: 86.7003 },
    { name: "Hazaribagh", lat: 23.9925, lon: 85.3637 },
    { name: "Dumka", lat: 24.2690, lon: 87.2490 },
    { name: "Giridih", lat: 24.1915, lon: 86.3028 }
  ],
  "Karnataka": [
    { name: "Bengaluru (Capital)", lat: 12.9716, lon: 77.5946 },
    { name: "Mysuru", lat: 12.2958, lon: 76.6394 },
    { name: "Hubballi-Dharwad", lat: 15.3647, lon: 75.1240 },
    { name: "Mangaluru (Dakshina Kannada)", lat: 12.9141, lon: 74.8560 },
    { name: "Belagavi", lat: 15.8497, lon: 74.4977 },
    { name: "Davanagere", lat: 14.4644, lon: 75.9218 },
    { name: "Ballari", lat: 15.1394, lon: 76.9214 },
    { name: "Shivamogga", lat: 13.9299, lon: 75.5681 },
    { name: "Kalaburagi", lat: 17.3297, lon: 76.8343 },
    { name: "Udupi", lat: 13.3409, lon: 74.7421 },
    { name: "Hassan", lat: 13.0068, lon: 76.1025 }
  ],
  "Kerala": [
    { name: "Thiruvananthapuram (Capital)", lat: 8.5241, lon: 76.9366 },
    { name: "Kochi (Ernakulam)", lat: 9.9312, lon: 76.2673 },
    { name: "Kozhikode", lat: 11.2588, lon: 75.7804 },
    { name: "Thrissur", lat: 10.5276, lon: 76.2144 },
    { name: "Kollam", lat: 8.8932, lon: 76.6141 },
    { name: "Alappuzha", lat: 9.4981, lon: 76.3388 },
    { name: "Palakkad", lat: 10.7867, lon: 76.6548 },
    { name: "Kottayam", lat: 9.5916, lon: 76.5222 },
    { name: "Kannur", lat: 11.8745, lon: 75.3704 },
    { name: "Wayanad (Kalpetta)", lat: 11.6094, lon: 76.0827 }
  ],
  "Ladakh (UT)": [
    { name: "Leh (Capital)", lat: 34.1526, lon: 77.5771 },
    { name: "Kargil", lat: 34.5539, lon: 76.1349 }
  ],
  "Lakshadweep (UT)": [
    { name: "Kavaratti (Capital)", lat: 10.5667, lon: 72.6417 },
    { name: "Minicoy", lat: 8.2789, lon: 73.0489 }
  ],
  "Madhya Pradesh": [
    { name: "Indore", lat: 22.7196, lon: 75.8577 },
    { name: "Bhopal (Capital)", lat: 23.2599, lon: 77.4126 },
    { name: "Jabalpur", lat: 22.1760, lon: 80.0180 },
    { name: "Gwalior", lat: 26.2183, lon: 78.1828 },
    { name: "Ujjain", lat: 23.1760, lon: 75.7885 },
    { name: "Sagar", lat: 23.8388, lon: 78.7378 },
    { name: "Rewa", lat: 24.5362, lon: 81.3037 },
    { name: "Satna", lat: 24.5762, lon: 80.8328 },
    { name: "Singrauli", lat: 24.1993, lon: 82.6269 },
    { name: "Chhindwara", lat: 22.0574, lon: 78.9382 }
  ],
  "Maharashtra": [
    { name: "Mumbai (Capital)", lat: 19.0760, lon: 72.8777 },
    { name: "Pune", lat: 18.5204, lon: 73.8567 },
    { name: "Nagpur", lat: 21.1458, lon: 79.0882 },
    { name: "Nashik", lat: 19.9975, lon: 73.7898 },
    { name: "Aurangabad (Chhatrapati Sambhajinagar)", lat: 19.8762, lon: 75.3433 },
    { name: "Solapur", lat: 17.6599, lon: 75.9064 },
    { name: "Amravati", lat: 20.9374, lon: 77.7796 },
    { name: "Kolhapur", lat: 16.7050, lon: 74.2433 },
    { name: "Jalgaon", lat: 21.0077, lon: 75.5626 },
    { name: "Latur", lat: 18.4088, lon: 76.5604 },
    { name: "Nanded", lat: 19.1383, lon: 77.3210 },
    { name: "Ratnagiri", lat: 16.9902, lon: 73.3120 }
  ],
  "Manipur": [
    { name: "Imphal (Capital)", lat: 24.8170, lon: 93.9368 },
    { name: "Churachandpur", lat: 24.3333, lon: 93.6833 },
    { name: "Ukhrul", lat: 25.1167, lon: 94.4333 }
  ],
  "Meghalaya": [
    { name: "Shillong (Capital)", lat: 25.5788, lon: 91.8831 },
    { name: "Tura", lat: 25.5138, lon: 90.2202 },
    { name: "Jowai", lat: 25.4411, lon: 92.1989 }
  ],
  "Mizoram": [
    { name: "Aizawl (Capital)", lat: 23.7307, lon: 92.7173 },
    { name: "Lunglei", lat: 22.8871, lon: 92.7486 },
    { name: "Champhai", lat: 23.4561, lon: 93.3282 }
  ],
  "Nagaland": [
    { name: "Kohima (Capital)", lat: 25.6751, lon: 94.1086 },
    { name: "Dimapur", lat: 25.9094, lon: 93.7265 },
    { name: "Mokokchung", lat: 26.3262, lon: 94.5152 }
  ],
  "Odisha": [
    { name: "Bhubaneswar (Capital)", lat: 20.2961, lon: 85.8245 },
    { name: "Cuttack", lat: 20.4625, lon: 85.8830 },
    { name: "Rourkela", lat: 22.2604, lon: 84.8536 },
    { name: "Sambalpur", lat: 21.4669, lon: 83.9812 },
    { name: "Berhampur", lat: 19.3150, lon: 84.7941 },
    { name: "Puri", lat: 19.8135, lon: 85.8312 },
    { name: "Balasore", lat: 21.4934, lon: 86.9337 }
  ],
  "Puducherry (UT)": [
    { name: "Puducherry (Capital)", lat: 11.9416, lon: 79.8083 },
    { name: "Karaikal", lat: 10.9254, lon: 79.8380 },
    { name: "Mahe", lat: 11.7002, lon: 75.5342 }
  ],
  "Punjab": [
    { name: "Amritsar", lat: 31.6340, lon: 74.8723 },
    { name: "Ludhiana", lat: 30.9010, lon: 75.8573 },
    { name: "Jalandhar", lat: 31.3260, lon: 75.5762 },
    { name: "Patiala", lat: 30.3398, lon: 76.3869 },
    { name: "Bathinda", lat: 30.2110, lon: 74.9455 },
    { name: "Mohali (SAS Nagar)", lat: 30.7046, lon: 76.7179 },
    { name: "Pathankot", lat: 32.2659, lon: 75.6465 }
  ],
  "Rajasthan": [
    { name: "Jaipur (Capital)", lat: 26.9124, lon: 75.7873 },
    { name: "Jodhpur", lat: 26.2389, lon: 73.0243 },
    { name: "Udaipur", lat: 24.5854, lon: 73.7125 },
    { name: "Kota", lat: 25.2138, lon: 75.8648 },
    { name: "Bikaner", lat: 28.0167, lon: 73.3119 },
    { name: "Ajmer", lat: 26.4499, lon: 74.6399 },
    { name: "Alwar", lat: 27.5530, lon: 76.6089 },
    { name: "Jaisalmer", lat: 26.9157, lon: 70.9083 },
    { name: "Mount Abu (Sirohi)", lat: 24.5926, lon: 72.7156 }
  ],
  "Sikkim": [
    { name: "Gangtok (Capital)", lat: 27.3314, lon: 88.6138 },
    { name: "Namchi", lat: 27.1682, lon: 88.3562 },
    { name: "Mangan", lat: 27.5029, lon: 88.5281 }
  ],
  "Tamil Nadu": [
    { name: "Chennai (Capital)", lat: 13.0827, lon: 80.2707 },
    { name: "Coimbatore", lat: 11.0168, lon: 76.9558 },
    { name: "Madurai", lat: 9.9252, lon: 78.1198 },
    { name: "Tiruchirappalli", lat: 10.7905, lon: 78.7047 },
    { name: "Salem", lat: 11.6643, lon: 78.1460 },
    { name: "Tiruppur", lat: 11.1085, lon: 77.3411 },
    { name: "Vellore", lat: 12.9165, lon: 79.1325 },
    { name: "Ooty (Nilgiris)", lat: 11.4102, lon: 76.6950 },
    { name: "Kanyakumari", lat: 8.0883, lon: 77.5385 }
  ],
  "Telangana": [
    { name: "Hyderabad (Capital)", lat: 17.3850, lon: 78.4867 },
    { name: "Warangal", lat: 17.9689, lon: 79.5941 },
    { name: "Nizamabad", lat: 18.6725, lon: 78.0941 },
    { name: "Karimnagar", lat: 18.4386, lon: 79.1288 },
    { name: "Khammam", lat: 17.2473, lon: 80.1514 }
  ],
  "Tripura": [
    { name: "Agartala (Capital)", lat: 23.8315, lon: 91.2868 },
    { name: "Dharmanagar", lat: 24.3667, lon: 92.1667 },
    { name: "Udaipur (Gomati)", lat: 23.5333, lon: 91.4833 }
  ],
  "Uttar Pradesh": [
    { name: "Lucknow (Capital)", lat: 26.8467, lon: 80.9462 },
    { name: "Kanpur", lat: 26.4499, lon: 80.3319 },
    { name: "Varanasi", lat: 25.3176, lon: 82.9739 },
    { name: "Prayagraj (Allahabad)", lat: 25.4358, lon: 81.8463 },
    { name: "Agra", lat: 27.1767, lon: 78.0081 },
    { name: "Ghaziabad", lat: 28.6692, lon: 77.4538 },
    { name: "Noida/Greater Noida", lat: 28.5355, lon: 77.3910 },
    { name: "Meerut", lat: 28.9845, lon: 77.7064 },
    { name: "Bareilly", lat: 28.3670, lon: 79.4304 },
    { name: "Saharanpur", lat: 29.9680, lon: 77.5452 },
    { name: "Gorakhpur", lat: 26.7606, lon: 83.3731 },
    { name: "Jhansi", lat: 25.4484, lon: 78.5685 },
    { name: "Ayodhya", lat: 26.7922, lon: 82.1998 },
    { name: "Mathura", lat: 27.4924, lon: 77.6737 },
    { name: "Rampur", lat: 28.8143, lon: 79.0238 }
  ],
  "Uttarakhand": [
    { name: "Dehradun (Capital)", lat: 30.3165, lon: 78.0322 },
    { name: "Haridwar", lat: 29.9457, lon: 78.1642 },
    { name: "Rishikesh", lat: 30.0869, lon: 78.2676 },
    { name: "Haldwani (Nainital)", lat: 29.2183, lon: 79.5130 },
    { name: "Roorkee", lat: 29.8543, lon: 77.8880 },
    { name: "Nainital", lat: 29.3803, lon: 79.4630 },
    { name: "Mussoorie", lat: 30.4599, lon: 78.0664 },
    { name: "Almora", lat: 29.5892, lon: 79.6467 },
    { name: "Pithoragarh", lat: 29.5829, lon: 80.2182 },
    { name: "Chamoli/Gopeshwar", lat: 30.4057, lon: 79.3242 },
    { name: "Uttarkashi", lat: 30.7268, lon: 78.4354 },
    { name: "Rudraprayag", lat: 30.2843, lon: 78.9812 },
    { name: "Bageshwar", lat: 29.8404, lon: 79.7694 },
    { name: "Champawat", lat: 29.3371, lon: 80.0984 }
  ],
  "West Bengal": [
    { name: "Kolkata (Capital)", lat: 22.5726, lon: 88.3639 },
    { name: "Siliguri", lat: 26.7271, lon: 88.3953 },
    { name: "Asansol", lat: 23.6740, lon: 86.9730 },
    { name: "Durgapur", lat: 23.4808, lon: 87.3219 },
    { name: "Darjeeling", lat: 27.0410, lon: 88.2627 },
    { name: "Kalimpong", lat: 27.0600, lon: 88.4700 },
    { name: "Jalpaiguri", lat: 26.5218, lon: 88.7190 },
    { name: "Kharagpur", lat: 22.3302, lon: 87.3237 },
    { name: "Malda (English Bazar)", lat: 25.0108, lon: 88.1411 }
  ]
};
