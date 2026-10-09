import React from 'react'

const paths = {
  hotel: <><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M9 21v-5h6v5M8 7h1m6 0h1M8 11h1m6 0h1"/></>,
  bed: <><path d="M3 4v16M3 17h18v3M3 13h18v4H3z"/><path d="M6 13V8h5a3 3 0 0 1 3 3v2M14 10h4a3 3 0 0 1 3 3"/></>,
  car: <><path d="m5 11 2-5h10l2 5M4 17H3v-6h18v6h-1M4 17h16M6 17v2m12-2v2"/><circle cx="7" cy="14" r="1"/><circle cx="17" cy="14" r="1"/></>,
  money: <><circle cx="12" cy="13" r="8"/><path d="M12 5V2m-3 0h6M14.5 10.5c-.6-.8-1.4-1-2.5-1-2 0-2.7 2.4-.3 3.1l1.2.4c2.4.8 1.7 3.1-.5 3.1-1.2 0-2.2-.5-2.8-1.2M12 8v10"/></>,
}

export default function LineIcon({ name, size = 24, className = '' }) {
  return <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">{paths[name] || paths.hotel}</svg>
}
