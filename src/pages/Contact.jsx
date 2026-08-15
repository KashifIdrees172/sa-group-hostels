import ContactForm from '../components/common/ContactForm.jsx'
import SocialLinks from '../components/common/SocialLinks.jsx'
import MapEmbed from '../components/common/MapEmbed.jsx'
import { contactOffice } from '../assets/images/index.js'

const contactEmails = [
  { title: 'Reception / Head Office', email: 'reception@sagrouphostels.com', icon: '🏢' },
  { title: 'Bookings & Reservations', email: 'bookings@sagrouphostels.com', icon: '🛏️' },
  { title: 'General Enquiries', email: 'info@sagrouphostels.com', icon: 'ℹ️' },
]

export default function Contact() {
  return (
    <main className="page-enter">
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-[.9fr_1.1fr] gap-12 items-start">
          <div>
            <p className="section-eyebrow !text-left">Contact us</p>
            <h1 className="text-3xl md:text-5xl font-bold text-navy mb-4">Get in Touch</h1>
            <p className="text-charcoal/70 mb-7 leading-7">
              Contact the right team directly or send an inquiry through WhatsApp.
            </p>

            <div className="aspect-[16/10] rounded-2xl overflow-hidden bg-navy/10 shadow-lg mb-7">
              <img src={contactOffice} alt="SA Group of Hostels reception office" className="w-full h-full object-cover" />
            </div>

            <div className="space-y-3 text-sm text-charcoal/80">
              <a href="https://wa.me/923193815068" target="_blank" rel="noopener noreferrer" className="contact-row">
                <span>📱</span><div><small>Call or WhatsApp</small><b>0319-3815068</b></div>
              </a>
              {contactEmails.map((item) => (
                <a key={item.email} href={`mailto:${item.email}`} className="contact-row">
                  <span>{item.icon}</span><div><small>{item.title}</small><b>{item.email}</b></div>
                </a>
              ))}
              <div className="contact-row">
                <span>📍</span><div><small>Default office location</small><b>Thokar Niaz Baig, Lahore</b></div>
              </div>
            </div>

            <div className="mt-6"><SocialLinks /></div>
          </div>

          <div className="bg-white rounded-3xl border border-navy/10 shadow-xl shadow-navy/5 p-6 md:p-8">
            <ContactForm />
          </div>
        </div>

        <section className="mt-14">
          <div className="mb-5">
            <p className="section-eyebrow !text-left">Find us</p>
            <h2 className="text-2xl md:text-3xl font-bold text-navy">Default Google Map</h2>
            <p className="text-charcoal/60 mt-2">
              This map displays Thokar Niaz Baig, Lahore until you provide the exact hostel pin.
            </p>
          </div>
          <MapEmbed heightClass="h-[420px]" />
        </section>
      </section>
    </main>
  )
}
