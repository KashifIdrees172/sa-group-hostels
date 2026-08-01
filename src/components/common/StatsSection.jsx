import CountUp from '../common/CountUp.jsx'

const stats = [
  { value: 5, suffix: '+', label: 'Years of Excellence' },
  { value: 2000, suffix: '+', label: 'Students & Residents Hosted' },
  { value: 4, suffix: '', label: 'Branches Across Lahore' },
  { value: 24, suffix: '/7', label: 'Support Available' },
]

export default function StatsSection() {
  return (
    <section className="bg-gradient-to-b from-amber/5 to-transparent py-4">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className="card-hover bg-white rounded-2xl border border-navy/10 px-4 py-8 text-center"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <p className="font-display font-extrabold text-navy text-3xl md:text-4xl">
                <CountUp end={stat.value} suffix={stat.suffix} />
              </p>
              <p className="text-xs md:text-sm text-charcoal/60 mt-2">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
