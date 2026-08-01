const DEFAULT_MAP_QUERY = 'Thokar Niaz Baig, Lahore, Pakistan'

export default function MapEmbed({ query = DEFAULT_MAP_QUERY, heightClass = 'h-80' }) {
  const safeQuery = query?.trim() || DEFAULT_MAP_QUERY
  const src = `https://maps.google.com/maps?q=${encodeURIComponent(safeQuery)}&z=14&output=embed`

  return (
    <div className={`w-full ${heightClass} rounded-2xl overflow-hidden border border-navy/10 bg-navy/5 shadow-sm`}>
      <iframe
        title={`Google Map showing ${safeQuery}`}
        src={src}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  )
}
