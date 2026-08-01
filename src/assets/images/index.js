// Central image registry for Vite.
import hero1 from './hero/hero1.png'
import hero2 from './hero/hero2.png'
import hero3 from './hero/hero3.png'
import hero4 from './hero/hero4.png'

import about1 from './about/about1.png'
import about2 from './about/about2.png'
import about3 from './about/about3.png'
import about4 from './about/about4.png'

import logo from './logo/logo.png.jpeg'
import logoWhite from './logo/logo-white.png'
import favicon from './logo/favicon.png'

import wifiIcon from './icons/wifi.png'
import securityIcon from './icons/security.png'
import cctvIcon from './icons/cctv.png'
import laundryIcon from './icons/laundry.png'
import parkingIcon from './icons/parking.png'
import cleaningIcon from './icons/cleaning.png'
import kitchenIcon from './icons/kitchen.png'
import waterIcon from './icons/water.png'
import generatorIcon from './icons/generator.png'
import studyIcon from './icons/study.png'
import facebookIcon from './icons/facebook.png'
import instagramIcon from './icons/instagram.png'
import whatsappIcon from './icons/whatsapp.png'

import singleRoom from './rooms/single.png'
import doubleRoom from './rooms/double.png'
import tripleRoom from './rooms/triple.png'
import fourBedRoom from './rooms/four-bed.png'
import nightStayRoom from './rooms/night-stay.png'

import student1 from './reviews/student1.png'
import student2 from './reviews/student2.png'
import student3 from './reviews/student3.png'
import student4 from './reviews/student4.png'
import student5 from './reviews/student5.png'
import student6 from './reviews/student6.png'

const branchFiles = import.meta.glob('./branches/**/*.{jpg,jpeg,png,webp}', {
  eager: true,
  import: 'default',
})

const getBranchFile = (branch, fileBase) => {
  const match = Object.entries(branchFiles).find(([path]) => {
    const fileName = path.split('/').pop()?.replace(/\.(jpg|jpeg|png|webp)$/i, '')
    return path.includes(`/branches/${branch}/`) && fileName === String(fileBase)
  })
  return match?.[1] || hero2
}

const getGallery = (branch) => Array.from({ length: 10 }, (_, i) => getBranchFile(branch, i + 1))

export { hero1, hero2, hero3, hero4 }
export { about1, about2, about3, about4 }
export { logo, logoWhite, favicon }
export {
  wifiIcon,
  securityIcon,
  cctvIcon,
  laundryIcon,
  parkingIcon,
  cleaningIcon,
  kitchenIcon,
  waterIcon,
  generatorIcon,
  studyIcon,
  facebookIcon,
  instagramIcon,
  whatsappIcon,
}
export { singleRoom, doubleRoom, tripleRoom, fourBedRoom, nightStayRoom }
export { student1, student2, student3, student4, student5, student6 }

export const contactOffice = about1
export const headOfficeCover = getBranchFile('head-office', 'cover')
export const piaRoadCover = getBranchFile('pia-road', 'cover')
export const iqbalTownCover = getBranchFile('iqbal-town', 'cover')
export const aliTownCover = getBranchFile('ali-town', 'cover')

export const branchGalleries = {
  headOffice: getGallery('head-office'),
  piaRoad: getGallery('pia-road'),
  iqbalTown: getGallery('iqbal-town'),
  aliTown: getGallery('ali-town'),
}
