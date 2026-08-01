import { Link } from 'react-router-dom'

export default function BranchCard({ branch }) {
  return (
    <Link
      to={`/branches/${branch.id}`}
      className="group relative block h-full rounded-3xl overflow-hidden border border-navy/10 bg-white shadow-sm hover:shadow-2xl hover:shadow-navy/15 hover:-translate-y-2 transition-all duration-500 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber/30"
    >
      <div className="relative h-52 overflow-hidden bg-navy/10">
        {/* Add this branch's cover photo at the path stored in branch.coverImage. */}
        <img
          src={branch.coverImage}
          alt={`${branch.name} building exterior`}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/75 via-navy/10 to-transparent" />
        <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full border border-white/25 group-hover:scale-125 transition-transform duration-700" />
        <div className="absolute right-5 bottom-5 w-11 h-11 rounded-full bg-white/90 backdrop-blur flex items-center justify-center text-navy text-xl group-hover:bg-amber group-hover:rotate-[-35deg] transition-all duration-300">↗</div>
      </div>

      <div className="p-6">
        {branch.isHeadOffice && <span className="inline-flex bg-amber/15 text-amber-dark text-[10px] font-bold px-2.5 py-1 rounded-full mb-3 tracking-wider">HEAD OFFICE</span>}
        <h3 className="font-display font-bold text-navy text-xl group-hover:text-amber-dark transition-colors">{branch.name}</h3>
        <p className="text-sm text-charcoal/60 mt-2">{branch.location}</p>
        <div className="mt-5 pt-4 border-t border-navy/8 flex items-end justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-charcoal/40">Starting from</p>
            <p className="font-display font-bold text-navy">Rs. {branch.bedPricing.four.toLocaleString()}<span className="text-xs font-normal text-charcoal/45"> / month</span></p>
          </div>
          <span className="text-xs font-bold text-amber-dark">Explore</span>
        </div>
      </div>
    </Link>
  )
}
