import reviews from '../data/reviews.js'
import ReviewsSlider from '../components/reviews/ReviewsSlider.jsx'

export default function Reviews() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-16 page-enter">
      <h1 className="text-3xl font-bold text-navy mb-2 text-center">What Our Residents Say</h1>
      <p className="text-charcoal/70 text-center mb-10">
        Real feedback from students and professionals across our branches.
      </p>
      <ReviewsSlider reviews={reviews} />
    </section>
  )
}
