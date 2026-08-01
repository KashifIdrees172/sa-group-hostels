import { useParams, Link } from 'react-router-dom'
import branches from '../data/branches.js'
import { generalAmenities, studentPerks } from '../data/amenities.js'
import BranchGallery from '../components/branch/BranchGallery.jsx'
import BedPricingTable from '../components/branch/BedPricingTable.jsx'
import AmenitiesList from '../components/branch/AmenitiesList.jsx'
import MapEmbed from '../components/common/MapEmbed.jsx'
import Button from '../components/common/Button.jsx'
import Reveal from '../components/common/Reveal.jsx'

export default function BranchDetail() {
  const { branchId } = useParams()
  const branch = branches.find((b) => b.id === branchId)

  if (!branch) {
    return (
      <section className="max-w-3xl mx-auto px-6 py-16 text-center">
        <p className="text-charcoal/70">Branch not found.</p>
        <Link to="/#branches" className="text-amber font-semibold">Back to Branches</Link>
      </section>
    )
  }

  return (
    <div className="page-enter">

      {/* HERO BANNER */}
      <section className="relative bg-navy min-h-[430px] flex items-center overflow-hidden">
        {/* BRANCH HERO IMAGE: add the file referenced by branch.coverImage. */}
        <img src={branch.coverImage} alt={`${branch.name} exterior`} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-navy/80" />
        <div className="relative max-w-5xl mx-auto px-6 py-16 text-center">
          {branch.isHeadOffice && (
            <span className="inline-block bg-amber text-navy text-xs font-bold px-3 py-1 rounded-full mb-4 tracking-wide">
              HEAD OFFICE
            </span>
          )}
          <h1 className="text-3xl md:text-4xl font-bold text-cream">{branch.name}</h1>
          <p className="text-cream/70 mt-2">{branch.location}</p>
          <p className="text-cream/80 mt-5 max-w-xl mx-auto leading-relaxed">
            {branch.description}
          </p>
          <div className="flex justify-center gap-3 mt-7">
            <Button href="#book" variant="secondary">Book Inspection</Button>
            <Button to="/#branches" variant="light">← All Branches</Button>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 space-y-16 py-16">

        {/* GALLERY */}
        <Reveal>
          <p className="text-amber font-semibold text-sm tracking-[3px] text-center mb-2">GALLERY</p>
          <h2 className="text-2xl font-bold text-navy text-center mb-8">A Look Inside</h2>
          <BranchGallery images={branch.images} />
        </Reveal>

        {/* BED PRICING */}
        <Reveal>
          <p className="text-amber font-semibold text-sm tracking-[3px] text-center mb-2">PRICING</p>
          <h2 className="text-2xl font-bold text-navy text-center mb-8">Bed Types & Pricing</h2>
          <BedPricingTable pricing={branch.bedPricing} />
        </Reveal>

        {/* AMENITIES */}
        <Reveal>
          <p className="text-amber font-semibold text-sm tracking-[3px] text-center mb-2">FACILITIES</p>
          <h2 className="text-2xl font-bold text-navy text-center mb-10">Amenities at This Branch</h2>
          <AmenitiesList general={generalAmenities} perks={studentPerks} />
        </Reveal>

        {/* LOCATION */}
        <Reveal>
          <p className="text-amber font-semibold text-sm tracking-[3px] text-center mb-2">FIND US</p>
          <h2 className="text-2xl font-bold text-navy text-center mb-8">Location</h2>
          <MapEmbed query={branch.mapQuery} />
        </Reveal>

        {/* CTA */}
        <Reveal>
          <div id="book" className="text-center bg-navy rounded-2xl py-12 px-6 scroll-mt-20">
            <p className="text-cream font-display font-bold text-xl mb-2">
              Interested in {branch.name}?
            </p>
            <p className="text-cream/70 mb-6 max-w-md mx-auto">
              Send an inquiry and our team will get back to you via phone or WhatsApp to arrange a visit.
            </p>
            <Button to="/#contact" variant="secondary">Send an Inquiry</Button>
          </div>
        </Reveal>

      </div>
    </div>
  )
}
