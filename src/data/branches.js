import {
  headOfficeCover,
  piaRoadCover,
  iqbalTownCover,
  aliTownCover,
  branchGalleries,
} from '../assets/images/index.js'

const branches = [
  {
    id: 'head-office',
    name: 'SA Hostel — Head Office',
    isHeadOffice: true,
    location: 'Thokar Niaz Baig, Lahore',
    mapQuery: 'Thokar Niaz Baig, Lahore',
    description:
      'Our flagship branch and head office — the original SA Group hostel, fully equipped for both students and working professionals.',

    // COVER IMAGE FILE:
    // src/assets/images/branches/head-office/cover.jpg
    coverImage: headOfficeCover,

    // GALLERY IMAGE FILES:
    // src/assets/images/branches/head-office/1.jpg through 10.jpg
    images: branchGalleries.headOffice,
    bedPricing: { single: 18000, double: 13000, triple: 10000, four: 8000, night: 2500 },
  },
  {
    id: 'pia-road',
    name: 'SA Hostel — PIA Road',
    isHeadOffice: false,
    location: 'PIA Road, near Wapda Town, Lahore',
    mapQuery: 'PIA Road, Wapda Town, Lahore',
    description:
      'Conveniently located near Wapda Town, ideal for professionals and students commuting across the city.',

    // COVER IMAGE FILE:
    // src/assets/images/branches/pia-road/cover.jpg
    coverImage: piaRoadCover,

    // GALLERY IMAGE FILES:
    // src/assets/images/branches/pia-road/1.jpg through 10.jpg
    images: branchGalleries.piaRoad,
    bedPricing: { single: 17000, double: 12500, triple: 9500, four: 7500, night: 2300 },
  },
  {
    id: 'iqbal-town',
    name: 'SA Hostel — Iqbal Town',
    isHeadOffice: false,
    location: 'Iqbal Town, near Punjab University, Lahore',
    mapQuery: 'Iqbal Town, near Punjab University, Lahore',
    description:
      'Our most student-focused branch — walking distance from Punjab University, with dedicated study spaces and pick & drop service.',

    // COVER IMAGE FILE:
    // src/assets/images/branches/iqbal-town/cover.jpg
    coverImage: iqbalTownCover,

    // GALLERY IMAGE FILES:
    // src/assets/images/branches/iqbal-town/1.jpg through 10.jpg
    images: branchGalleries.iqbalTown,
    bedPricing: { single: 16000, double: 12000, triple: 9000, four: 7000, night: 2200 },
  },
  {
    id: 'ali-town',
    name: 'SA Hostel — Ali Town',
    isHeadOffice: false,
    location: 'Ali Town, Lahore',
    mapQuery: 'Ali Town, Lahore',
    description:
      'A quiet, secure branch in Ali Town, suited for long-term residents looking for an affordable stay.',

    // COVER IMAGE FILE:
    // src/assets/images/branches/ali-town/cover.jpg
    coverImage: aliTownCover,

    // GALLERY IMAGE FILES:
    // src/assets/images/branches/ali-town/1.jpg through 10.jpg
    images: branchGalleries.aliTown,
    bedPricing: { single: 15000, double: 11500, triple: 8500, four: 6500, night: 2000 },
  },
]

export default branches
