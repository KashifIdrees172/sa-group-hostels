function AmenityCard({ item, accent = 'blue' }) {
  const iconBg = accent === 'amber'
    ? 'bg-gradient-to-br from-amber/20 to-amber/5'
    : 'bg-gradient-to-br from-navy/10 to-sky-50'

  return (
    <article className="group card-hover h-full rounded-3xl border border-navy/10 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-amber/35 hover:shadow-xl hover:shadow-navy/10">
      <div className={`mb-5 flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl ${iconBg} ring-1 ring-navy/5`}>
        <img
          src={item.icon}
          alt=""
          aria-hidden="true"
          className="h-16 w-16 object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>
      <h4 className="font-display text-lg font-bold text-navy">{item.label}</h4>
      <p className="mt-2 text-sm leading-7 text-charcoal/65">{item.description}</p>
    </article>
  )
}

export default function AmenitiesList({ general, perks }) {
  return (
    <div className="space-y-16">
      <section>
        <div className="mb-7 flex items-end justify-between gap-4 border-b border-navy/10 pb-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.2em] text-amber">Everyday comfort</p>
            <h3 className="mt-1 text-2xl font-bold text-navy">General Facilities</h3>
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {general.map((item) => <AmenityCard key={item.label} item={item} />)}
        </div>
      </section>

      <section>
        <div className="mb-7 flex items-end justify-between gap-4 border-b border-navy/10 pb-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.2em] text-amber">Resident benefits</p>
            <h3 className="mt-1 text-2xl font-bold text-navy">More for Students</h3>
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {perks.map((item) => <AmenityCard key={item.label} item={item} accent="amber" />)}
        </div>
      </section>
    </div>
  )
}
