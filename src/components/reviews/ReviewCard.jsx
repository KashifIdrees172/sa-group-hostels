export default function ReviewCard({ review }) {
  return (
    <article className="relative bg-white border border-navy/10 rounded-3xl p-8 md:p-10 shadow-xl shadow-navy/5 min-h-[280px] flex flex-col justify-between overflow-hidden">
      <span className="absolute right-7 top-0 text-[110px] leading-none font-serif text-amber/10" aria-hidden>“</span>
      <div>
        <div className="text-amber mb-5 tracking-wider" aria-label={`${review.rating} out of 5 stars`}>{'★'.repeat(review.rating)}{'☆'.repeat(5-review.rating)}</div>
        <p className="text-lg md:text-xl text-charcoal/75 leading-relaxed italic relative z-10">“{review.text}”</p>
      </div>
      <div className="flex items-center gap-3 mt-7">
        {/* Add the resident/reviewer image using review.image (student1.jpg, student2.jpg, etc.). */}
        <img
          src={review.image}
          alt={`${review.name}, resident at ${review.branch}`}
          className="w-12 h-12 rounded-full object-cover border-2 border-amber/30"
          loading="lazy"
        />
        <div><p className="font-semibold text-navy">{review.name}</p><p className="text-xs text-charcoal/45">Resident · {review.branch}</p></div>
      </div>
    </article>
  )
}
