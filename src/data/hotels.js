import {
  hotelOneCover,
  hotelOneStandard,
  hotelOneDeluxe,
  hotelOneFamily,
  hotelTwoCover,
  hotelTwoStandard,
  hotelTwoDeluxe,
  hotelTwoFamily,
} from '../assets/images/hotels/index.js'

const hotels = [
  {
    id: 'hotel-one',
    name: 'SA Hotel - Branch 1',
    shortName: 'Hotel Branch 1',
    location: 'Lahore',
    address: 'Add hotel branch 1 address here',
    description: 'Comfortable and affordable hotel accommodation for families, travelers, and professionals with secure parking and essential facilities.',
    coverImage: hotelOneCover,
    startingPrice: 5000,
    rooms: { total: 20, available: 8 },
    parking: { totalSlots: 12, availableSlots: 5 },
    roomTypes: [
      { id: 'standard', name: 'Standard Room', price: 5000, totalRooms: 10, availableRooms: 4, maxGuests: 2, image: hotelOneStandard, description: 'A clean and comfortable room for short stays, solo travelers, or couples.' },
      { id: 'deluxe', name: 'Deluxe Room', price: 7500, totalRooms: 6, availableRooms: 2, maxGuests: 2, image: hotelOneDeluxe, description: 'A more spacious room with upgraded comfort for business and leisure guests.' },
      { id: 'family', name: 'Family Room', price: 10000, totalRooms: 4, availableRooms: 2, maxGuests: 4, image: hotelOneFamily, description: 'A larger room designed for families with comfortable sleeping space.' },
    ],
    facilities: ['24/7 Reception','Free WiFi','Parking','Air Conditioning','Hot Water','Housekeeping','Security','Power Backup'],
    contact: { phone: '03193815068', whatsapp: '923193815068' },
  },
  {
    id: 'hotel-two',
    name: 'SA Hotel - Branch 2',
    shortName: 'Hotel Branch 2',
    location: 'Lahore',
    address: 'Add hotel branch 2 address here',
    description: 'A clean and convenient hotel branch offering comfortable rooms, family accommodation, parking, and essential guest services.',
    coverImage: hotelTwoCover,
    startingPrice: 5500,
    rooms: { total: 25, available: 10 },
    parking: { totalSlots: 15, availableSlots: 7 },
    roomTypes: [
      { id: 'standard', name: 'Standard Room', price: 5500, totalRooms: 12, availableRooms: 5, maxGuests: 2, image: hotelTwoStandard, description: 'A practical and comfortable option for individual travelers and couples.' },
      { id: 'deluxe', name: 'Deluxe Room', price: 8000, totalRooms: 8, availableRooms: 3, maxGuests: 2, image: hotelTwoDeluxe, description: 'Extra space and improved comfort for guests looking for a premium stay.' },
      { id: 'family', name: 'Family Room', price: 11000, totalRooms: 5, availableRooms: 2, maxGuests: 4, image: hotelTwoFamily, description: 'A spacious family-friendly room suitable for longer and group stays.' },
    ],
    facilities: ['24/7 Reception','Free WiFi','Parking','Air Conditioning','Hot Water','Housekeeping','Security','Laundry'],
    contact: { phone: '03193815068', whatsapp: '923193815068' },
  },
]

export default hotels
