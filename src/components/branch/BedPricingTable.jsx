import {
  singleRoom,
  doubleRoom,
  tripleRoom,
  fourBedRoom,
  nightStayRoom,
} from '../../assets/images/index.js'

const bedTypes = [
  { key: 'single', image: singleRoom, label: 'Single Bed', sub: 'Private room · 1 resident', period: 'per month' },
  { key: 'double', image: doubleRoom, label: 'Double Bed', sub: 'Shared room · 2 residents', period: 'per month' },
  { key: 'triple', image: tripleRoom, label: 'Triple Bed', sub: 'Shared room · 3 residents', period: 'per month' },
  { key: 'four', image: fourBedRoom, label: 'Four Bed', sub: 'Shared room · 4 residents', period: 'per month' },
  { key: 'night', image: nightStayRoom, label: 'Night Stay', sub: 'Flexible short stay · 1 night', period: 'per night', badge: 'Short stay' },
]

export default function BedPricingTable({ pricing }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-5">
      {bedTypes.map((bed) => {
        const price = pricing?.[bed.key]
        return (
          <article key={bed.key} className="group overflow-hidden rounded-3xl border border-navy/10 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-amber/40 hover:shadow-xl hover:shadow-navy/10">
            <div className="relative aspect-[4/3] overflow-hidden bg-navy/5">
              <img
                src={bed.image}
                alt={`${bed.label} room at SA Group of Hostels`}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-navy/65 to-transparent" />
              <span className="absolute bottom-3 left-3 rounded-full bg-white/95 px-3 py-1 text-[10px] font-bold uppercase tracking-[.14em] text-navy shadow-sm">{bed.badge || 'Room option'}</span>
            </div>
            <div className="p-5">
              <h4 className="font-display text-lg font-extrabold text-navy">{bed.label}</h4>
              <p className="mt-1 text-xs text-charcoal/55">{bed.sub}</p>
              <div className="mt-5 flex items-end justify-between gap-3 border-t border-navy/10 pt-4">
                <div>
                  <p className="font-display text-2xl font-extrabold text-amber">
                    {typeof price === 'number' ? `Rs. ${price.toLocaleString()}` : 'Contact us'}
                  </p>
                  <p className="text-[11px] text-charcoal/45">{bed.period}</p>
                </div>
                <span className="grid h-10 w-10 place-items-center rounded-full bg-navy text-white transition-colors group-hover:bg-amber group-hover:text-navy">→</span>
              </div>
            </div>
          </article>
        )
      })}
    </div>
  )
}
