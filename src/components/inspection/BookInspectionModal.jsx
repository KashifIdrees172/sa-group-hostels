import { useEffect, useId, useRef, useState } from 'react'
import branches from '../../data/branches.js'

// Replace this with the WhatsApp number that should receive inspection requests.
// Use international format without +, spaces, or dashes. Example: 923001234567
const WHATSAPP_NUMBER = '923294234986'

const initialForm = {
  fullName: '',
  mobile: '',
  cnic: '',
  age: '',
  gender: '',
  city: '',
  branch: '',
  roomType: '',
  visitDate: '',
  visitTime: '',
  residentType: 'Student',
  moveInDate: '',
  message: '',
  notes: '',
}

const roomTypes = ['Single Bed', 'Double Bed', 'Triple Bed', 'Four Bed', 'Night Stay', 'Not decided yet']
const visitTimes = ['10:00 AM – 12:00 PM', '12:00 PM – 2:00 PM', '2:00 PM – 4:00 PM', '4:00 PM – 6:00 PM']

function Field({ label, required, children, className = '' }) {
  return (
    <label className={`inspection-field ${className}`}>
      <span>{label}{required && <b aria-hidden="true"> *</b>}</span>
      {children}
    </label>
  )
}

export default function BookInspectionModal({ open, onClose }) {
  const titleId = useId()
  const modalRef = useRef(null)
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState('')

  const today = new Date()
  const minDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
    .toISOString()
    .split('T')[0]

  useEffect(() => {
    if (!open) return

    const oldOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const firstInput = modalRef.current?.querySelector('input, select, textarea, button')
    window.setTimeout(() => firstInput?.focus(), 80)

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()

      if (event.key === 'Tab' && modalRef.current) {
        const focusable = [...modalRef.current.querySelectorAll(
          'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [href]'
        )]
        if (!focusable.length) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = oldOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, onClose])

  if (!open) return null

  const update = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    if (error) setError('')
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const cleanMobile = form.mobile.replace(/\D/g, '')
    if (cleanMobile.length < 10 || cleanMobile.length > 13) {
      setError('Please enter a valid mobile number.')
      return
    }

    const selectedBranch = branches.find((branch) => branch.id === form.branch)
    const lines = [
      '🏠 *New Hostel Inspection Request*',
      '',
      `👤 *Full Name:* ${form.fullName}`,
      `📱 *Mobile:* ${form.mobile}`,
      form.cnic ? `🪪 *CNIC:* ${form.cnic}` : null,
      form.age ? `🎂 *Age:* ${form.age}` : null,
      form.gender ? `⚧ *Gender:* ${form.gender}` : null,
      form.city ? `📍 *City:* ${form.city}` : null,
      '',
      `🏢 *Preferred Branch:* ${selectedBranch?.name || form.branch}`,
      `🛏️ *Room Type:* ${form.roomType}`,
      `📅 *Inspection Date:* ${form.visitDate}`,
      `🕒 *Preferred Time:* ${form.visitTime}`,
      `🎓 *Resident Type:* ${form.residentType}`,
      form.moveInDate ? `📦 *Expected Move-in:* ${form.moveInDate}` : null,
      '',
      `💬 *Requirements:* ${form.message}`,
      form.notes ? `📝 *Additional Notes:* ${form.notes}` : null,
      '',
      '_Sent from the SA Group of Hostels website._',
    ].filter(Boolean)

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
    setForm(initialForm)
    onClose()
  }

  return (
    <div className="inspection-overlay" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose()
    }}>
      <section
        ref={modalRef}
        className="inspection-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className="inspection-modal__header">
          <div>
            <p className="inspection-kicker">Schedule a visit</p>
            <h2 id={titleId}>Book Hostel Inspection</h2>
            <p>Complete the form and our reception team will receive your request on WhatsApp.</p>
          </div>
          <button type="button" onClick={onClose} className="inspection-close" aria-label="Close inspection form">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
          </button>
        </div>

        <form className="inspection-form" onSubmit={handleSubmit}>
          <div className="inspection-grid">
            <Field label="Full Name" required>
              <input name="fullName" value={form.fullName} onChange={update} placeholder="e.g. Muhammad Awais" autoComplete="name" required />
            </Field>
            <Field label="Mobile Number" required>
              <input name="mobile" value={form.mobile} onChange={update} placeholder="03001234567" inputMode="tel" autoComplete="tel" required />
            </Field>
            <Field label="CNIC (Optional)">
              <input name="cnic" value={form.cnic} onChange={update} placeholder="35202-1234567-1" inputMode="numeric" />
            </Field>
            <Field label="Age">
              <input name="age" value={form.age} onChange={update} placeholder="e.g. 22" type="number" min="15" max="80" />
            </Field>
            <Field label="Gender">
              <select name="gender" value={form.gender} onChange={update}>
                <option value="">Select gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Prefer not to say</option>
              </select>
            </Field>
            <Field label="Current City">
              <input name="city" value={form.city} onChange={update} placeholder="e.g. Layyah" autoComplete="address-level2" />
            </Field>
            <Field label="Preferred Branch" required>
              <select name="branch" value={form.branch} onChange={update} required>
                <option value="">Select branch</option>
                {branches.map((branch) => <option key={branch.id} value={branch.id}>{branch.name}</option>)}
              </select>
            </Field>
            <Field label="Room Type" required>
              <select name="roomType" value={form.roomType} onChange={update} required>
                <option value="">Select room type</option>
                {roomTypes.map((room) => <option key={room}>{room}</option>)}
              </select>
            </Field>
            <Field label="Preferred Visit Date" required>
              <input name="visitDate" value={form.visitDate} onChange={update} type="date" min={minDate} required />
            </Field>
            <Field label="Preferred Visit Time" required>
              <select name="visitTime" value={form.visitTime} onChange={update} required>
                <option value="">Select time slot</option>
                {visitTimes.map((time) => <option key={time}>{time}</option>)}
              </select>
            </Field>
            <Field label="Resident Type" required>
              <select name="residentType" value={form.residentType} onChange={update} required>
                <option>Student</option>
                <option>Professional</option>
                <option>Job Seeker</option>
                <option>Other</option>
              </select>
            </Field>
            <Field label="Expected Move-in Date">
              <input name="moveInDate" value={form.moveInDate} onChange={update} type="date" min={minDate} />
            </Field>
            <Field label="Requirements / Questions" required className="inspection-field--wide">
              <textarea name="message" value={form.message} onChange={update} placeholder="Tell us about your preferred room, budget, stay duration, or any questions..." required />
            </Field>
            <Field label="Additional Notes" className="inspection-field--wide">
              <textarea name="notes" value={form.notes} onChange={update} placeholder="Mention any special requirement (optional)" />
            </Field>
          </div>

          {error && <p className="inspection-error" role="alert">{error}</p>}

          <div className="inspection-submit-wrap">
            <button type="submit" className="inspection-submit">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7A8.38 8.38 0 014 11.5a8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8z" /></svg>
              Send Inspection Request on WhatsApp
            </button>
            <p>WhatsApp will open with your completed request. Review it and tap Send.</p>
          </div>
        </form>
      </section>
    </div>
  )
}
