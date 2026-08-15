import { useState } from 'react'
import Button from './Button.jsx'
import branches from '../../data/branches.js'

const WHATSAPP_NUMBER = '923193815068'

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', phone: '', branch: '', message: '' })
  const [loading, setLoading] = useState(false)
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    const selectedBranch = branches.find((branch) => branch.id === form.branch)
    const message = [
      '🏠 *New Hostel Inquiry*',
      '',
      `👤 *Name:* ${form.name}`,
      `📱 *Phone:* ${form.phone}`,
      `🏢 *Preferred Branch:* ${selectedBranch?.name || 'Not selected'}`,
      `💬 *Message:* ${form.message || 'No additional message'}`,
      '',
      '_Sent from SA Group of Hostels website._',
    ].join('\n')
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer')
    window.setTimeout(() => setLoading(false), 400)
  }

  const field = 'w-full bg-cream/70 border border-navy/15 rounded-xl px-4 py-3 outline-none transition-all focus:bg-white focus:border-amber focus:ring-4 focus:ring-amber/10 placeholder:text-charcoal/30'
  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 md:p-8 border border-navy/10 shadow-xl shadow-navy/5 space-y-5">
      <div><p className="text-xs tracking-[.2em] uppercase text-amber-dark font-bold">Quick inquiry</p><h3 className="font-display font-bold text-navy text-xl mt-1">Plan your hostel visit</h3></div>
      <div className="grid sm:grid-cols-2 gap-4"><label className="text-sm font-medium text-navy">Full Name<input name="name" value={form.name} onChange={handleChange} required autoComplete="name" placeholder="Your name" className={`${field} mt-1.5`} /></label><label className="text-sm font-medium text-navy">Phone / WhatsApp<input name="phone" value={form.phone} onChange={handleChange} required type="tel" autoComplete="tel" placeholder="03xx xxxxxxx" className={`${field} mt-1.5`} /></label></div>
      <label className="block text-sm font-medium text-navy">Preferred Branch<select name="branch" value={form.branch} onChange={handleChange} className={`${field} mt-1.5`}><option value="">Select a branch</option>{branches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}</select></label>
      <label className="block text-sm font-medium text-navy">Message<textarea name="message" value={form.message} onChange={handleChange} rows={4} placeholder="Bed preference, move-in date, questions..." className={`${field} mt-1.5 resize-none`} /></label>
      <Button type="submit" variant="primary" disabled={loading} className="w-full">{loading ? <>Opening WhatsApp...</> : <>Send on WhatsApp <span>→</span></>}</Button>
      <p className="text-[11px] text-center text-charcoal/40">Your completed inquiry will open in WhatsApp for review before sending.</p>
    </form>
  )
}
