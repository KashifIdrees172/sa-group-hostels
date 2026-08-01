import { useEffect, useState } from 'react'
import ReviewCard from './ReviewCard.jsx'

export default function ReviewsSlider({ reviews }) {
  const [current, setCurrent] = useState(0)
  useEffect(() => {
    const timer = setInterval(() => setCurrent((v) => (v + 1) % reviews.length), 5500)
    return () => clearInterval(timer)
  }, [reviews.length])
  const go = (dir) => setCurrent((current + dir + reviews.length) % reviews.length)
  return (
    <div className="relative max-w-3xl mx-auto">
      <div className="overflow-hidden rounded-3xl">
        <div className="flex transition-transform duration-700 ease-out" style={{ transform: `translateX(-${current * 100}%)` }}>
          {reviews.map((review) => <div key={review.id} className="w-full shrink-0 p-1"><ReviewCard review={review} /></div>)}
        </div>
      </div>
      <div className="flex justify-center items-center gap-4 mt-6">
        <button onClick={() => go(-1)} aria-label="Previous review" className="carousel-btn">←</button>
        <div className="flex gap-2">{reviews.map((r, i) => <button key={r.id} onClick={() => setCurrent(i)} aria-label={`Review ${i+1}`} className={`h-2 rounded-full transition-all ${i === current ? 'w-7 bg-amber' : 'w-2 bg-navy/15 hover:bg-navy/30'}`} />)}</div>
        <button onClick={() => go(1)} aria-label="Next review" className="carousel-btn">→</button>
      </div>
    </div>
  )
}
