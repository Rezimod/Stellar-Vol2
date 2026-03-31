export interface PlanetData {
  name: string;
  symbol: string;
  imageUrl: string;
  mass: string;
  diameter: string;
  distanceFromSun: string;
  orbitalPeriod: string;
  moons: number;
  temperatureRange: string;
  description: string;
  description_ka: string;
  bodyId: string; // astronomy-engine body name
}

export const PLANETS: PlanetData[] = [
  {
    name: 'Mercury',
    symbol: '☿',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Mercury_in_true_color.jpg/600px-Mercury_in_true_color.jpg',
    mass: '3.30 × 10²³ kg',
    diameter: '4,879 km',
    distanceFromSun: '0.39 AU',
    orbitalPeriod: '88 days',
    moons: 0,
    temperatureRange: '-180°C to 430°C',
    description: 'The smallest planet and closest to the Sun, Mercury has virtually no atmosphere and experiences the most extreme temperature swings in the solar system. Despite its proximity to the Sun, it is not the hottest planet.',
    description_ka: 'ყველაზე პატარა პლანეტა და მზის ყველაზე ახლო მეზობელი. პრაქტიკულად ატმოსფერო არ გააჩნია და ტემპერატურა -180°C-დან 430°C-მდე იცვლება. ვენერაზე ცხელი არ არის.',
    bodyId: 'Mercury',
  },
  {
    name: 'Venus',
    symbol: '♀',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Venus_from_Mariner_10.jpg/600px-Venus_from_Mariner_10.jpg',
    mass: '4.87 × 10²⁴ kg',
    diameter: '12,104 km',
    distanceFromSun: '0.72 AU',
    orbitalPeriod: '225 days',
    moons: 0,
    temperatureRange: '~465°C (constant)',
    description: 'The brightest object in the night sky after the Moon, Venus is shrouded in thick clouds of sulfuric acid. Its runaway greenhouse effect makes it the hottest planet — hotter even than Mercury.',
    description_ka: 'ყველაზე კაშკაშა ობიექტი ღამის ცაში მთვარის შემდეგ. გოგირდმჟავას ღრუბლებია გარემოცული. კლიმატის ავარია — ყველაზე ცხელი პლანეტა.',
    bodyId: 'Venus',
  },
  {
    name: 'Mars',
    symbol: '♂',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/OSIRIS_Mars_true_color.jpg/600px-OSIRIS_Mars_true_color.jpg',
    mass: '6.39 × 10²³ kg',
    diameter: '6,779 km',
    distanceFromSun: '1.52 AU',
    orbitalPeriod: '687 days',
    moons: 2,
    temperatureRange: '-125°C to 20°C',
    description: 'The Red Planet gets its color from iron oxide (rust) on its surface. Mars hosts Olympus Mons, the tallest volcano in the solar system, and Valles Marineris, a canyon system that dwarfs Earth\'s Grand Canyon.',
    description_ka: 'წითელი პლანეტა რკინის ოქსიდის (ჟანგის) გამო. ოლიმპ მონსი — მზის სისტემის ყველაზე მაღალი ვულკანი — და ვალეს მარინერის კანიონია ამ პლანეტაზე.',
    bodyId: 'Mars',
  },
  {
    name: 'Jupiter',
    symbol: '♃',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Jupiter_and_its_shrunken_Great_Red_Spot.jpg/600px-Jupiter_and_its_shrunken_Great_Red_Spot.jpg',
    mass: '1.90 × 10²⁷ kg',
    diameter: '139,820 km',
    distanceFromSun: '5.20 AU',
    orbitalPeriod: '11.9 years',
    moons: 95,
    temperatureRange: '-145°C (cloud tops)',
    description: 'The king of planets — Jupiter is so massive that all other planets in the solar system could fit inside it twice over. Its iconic Great Red Spot is a storm that has raged for at least 350 years.',
    description_ka: 'ყველაზე დიდი პლანეტა — დანარჩენ ყველა პლანეტაზე 2.5-ჯერ მეტი მასა. დიდი წითელი ლაქა — ქარიშხალი 350 წელია ბობოქრობს.',
    bodyId: 'Jupiter',
  },
  {
    name: 'Saturn',
    symbol: '♄',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Saturn_during_Equinox.jpg/600px-Saturn_during_Equinox.jpg',
    mass: '5.68 × 10²⁶ kg',
    diameter: '116,460 km',
    distanceFromSun: '9.58 AU',
    orbitalPeriod: '29.4 years',
    moons: 146,
    temperatureRange: '-178°C (cloud tops)',
    description: 'Saturn\'s magnificent ring system — made of ice and rock — stretches 282,000 km across but is only about 10 meters thick. It is the least dense planet; it would float on water.',
    description_ka: 'ყინულისა და კლდის ნაწილაკებისგან შემდგარი რგოლები 270,000 კმ-ზე ვრცელდება. სიმჭიდროვე წყლის 30%-ია — წყალზე დაცურავდა.',
    bodyId: 'Saturn',
  },
  {
    name: 'Uranus',
    symbol: '⛢',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Uranus2.jpg/600px-Uranus2.jpg',
    mass: '8.68 × 10²⁵ kg',
    diameter: '50,724 km',
    distanceFromSun: '19.2 AU',
    orbitalPeriod: '84 years',
    moons: 28,
    temperatureRange: '-224°C (coldest planet)',
    description: 'Uranus rotates on its side with an axial tilt of 98°, likely caused by a massive ancient collision. It is the coldest planetary atmosphere in the solar system, despite not being the farthest from the Sun.',
    description_ka: 'ყინულის გიგანტი — 98°-ით დახრილი ღერძით. ამის გამო ეს პლანეტა პრაქტიკულად „გვერდზე" ტრიალებს მზის გარშემო.',
    bodyId: 'Uranus',
  },
  {
    name: 'Neptune',
    symbol: '♆',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Neptune_-_Voyager_2_%2829347980845%29_flatten_crop.jpg/600px-Neptune_-_Voyager_2_%2829347980845%29_flatten_crop.jpg',
    mass: '1.02 × 10²⁶ kg',
    diameter: '49,244 km',
    distanceFromSun: '30.1 AU',
    orbitalPeriod: '164.8 years',
    moons: 16,
    temperatureRange: '-218°C (average)',
    description: 'The windiest planet in the solar system, Neptune\'s storms can reach 2,100 km/h. Its largest moon Triton orbits in the opposite direction to Neptune\'s rotation — a captured Kuiper Belt object.',
    description_ka: 'ყველაზე ძლიერი ქარი მზის სისტემაში — 2100 კმ/სთ. ბნელი ლაქა — ქარიშხალი — ატლანტიკის ოკეანის ზომის. მზიდან 4.5 მლრდ კმ.',
    bodyId: 'Neptune',
  },
  {
    name: 'Pluto',
    symbol: '⯓',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Pluto_in_True_Color_-_High-Res.jpg/600px-Pluto_in_True_Color_-_High-Res.jpg',
    mass: '1.31 × 10²² kg',
    diameter: '2,376 km',
    distanceFromSun: '39.5 AU (avg)',
    orbitalPeriod: '248 years',
    moons: 5,
    temperatureRange: '-230°C to -218°C',
    description: 'Reclassified as a dwarf planet in 2006, Pluto still captures imaginations. NASA\'s New Horizons mission revealed heart-shaped nitrogen ice plains, towering water-ice mountains, and a surprisingly complex geology.',
    description_ka: 'კარლიკული პლანეტა კეიპერის სარტყელში. 2015 წელს New Horizons-მა მისი გული — ტომბოს რეგიო — გამოავლინა. ყინულიანი მთებია 3500 მ სიმაღლის.',
    bodyId: 'Pluto',
  },
];
