import CountUp from '../common/CountUp.jsx'

const stats = [
  { value: 5, suffix: '+', label: 'Years of Excellence', icon: '🏆' },
  { value: 2000, suffix: '+', label: 'Students & Residents Hosted', icon: '🎓' },
  { value: 4, suffix: '', label: 'Branches Across Lahore', icon: '📍' },
  { value: 24, suffix: '/7', label: 'Support Available', icon: '🛡️' },
]

export default function StatsSection() {
  return (
    <section className="relative bg-gradient-to-b from-amber/5 to-transparent py-10">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className="stat-card"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <span className="text-2xl">{stat.icon}</span>
              <p className="font-display font-extrabold text-navy text-3xl md:text-4xl mt-3">
                <CountUp end={stat.value} suffix={stat.suffix} />
              </p>
              <p className="text-xs md:text-sm text-charcoal/60 mt-2 leading-snug">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
