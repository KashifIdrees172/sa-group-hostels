import { useEffect, useRef, useState } from 'react'

export default function BranchGallery({ images = [] }) {
  const [current, setCurrent] = useState(0)
  const timerRef = useRef(null)
  const total = images.length

  useEffect(() => {
    startTimer()
    return stopTimer
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total])

  function startTimer() {
    stopTimer()
    if (total < 2) return
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % total)
    }, 3000)
  }

  function stopTimer() {
    if (timerRef.current) clearInterval(timerRef.current)
  }

  function goTo(index) {
    setCurrent(index)
    startTimer()
  }

  function next() {
    goTo((current + 1) % total)
  }

  function prev() {
    goTo((current - 1 + total) % total)
  }

  if (total === 0) return null

  return (
    <div
      className="flex flex-col items-center"
      onMouseEnter={stopTimer}
      onMouseLeave={startTimer}
    >
      {/* sliding carousel — left/right swap */}
      <div className="relative w-full max-w-2xl h-72 mx-auto rounded-2xl overflow-hidden border border-navy/10 shadow-lg">
        <div
          className="flex h-full transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {images.map((src, i) => (
            <div key={src} className="w-full h-full shrink-0 bg-navy/5">
              {/* Image comes from src/assets/images/branches/<branch-folder>/1 through 10 (.jpg or .png) */}
              <img
                src={src}
                alt={`Hostel gallery photo ${i + 1}`}
                className="w-full h-full object-cover"
                loading={i === 0 ? 'eager' : 'lazy'}
              />
            </div>
          ))}
        </div>

        {/* left / right arrow controls */}
        {total > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Previous photo"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90
                         flex items-center justify-center text-navy shadow-md
                         hover:bg-amber hover:text-white hover:scale-110
                         active:scale-95 transition-all duration-200"
            >
              ‹
            </button>
            <button
              onClick={next}
              aria-label="Next photo"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90
                         flex items-center justify-center text-navy shadow-md
                         hover:bg-amber hover:text-white hover:scale-110
                         active:scale-95 transition-all duration-200"
            >
              ›
            </button>
          </>
        )}
      </div>

      {/* dot indicators */}
      {total > 1 && (
        <div className="flex gap-2 mt-6">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to photo ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === current ? 'w-6 bg-amber' : 'w-2 bg-navy/20 hover:bg-navy/40'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
