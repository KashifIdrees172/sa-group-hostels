import BranchCard from '../components/branch/BranchCard.jsx'
import branches from '../data/branches.js'

export default function Branches() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-16 page-enter">
      <h1 className="text-3xl font-bold text-navy mb-2 text-center">Our Branches</h1>
      <p className="text-charcoal/70 text-center mb-10">
        Four locations across Lahore — pick the one closest to you.
      </p>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
        {branches.map((branch) => (
          <BranchCard key={branch.id} branch={branch} />
        ))}
      </div>
    </section>
  )
}
