import { generalAmenities, studentPerks } from '../data/amenities.js'
import AmenitiesList from '../components/branch/AmenitiesList.jsx'

export default function Amenities() {
  return (
    <section className="max-w-4xl mx-auto px-6 py-16 page-enter">
      <h1 className="text-3xl font-bold text-navy mb-2 text-center">Amenities & Facilities</h1>
      <p className="text-charcoal/70 text-center mb-10">
        Available across all four SA Group branches.
      </p>
      <AmenitiesList general={generalAmenities} perks={studentPerks} />
    </section>
  )
}
