import { useCallback, useState } from 'react'
import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'
import FloatingActions from '../common/FloatingActions.jsx'
import ScrollManager from '../common/ScrollManager.jsx'
import ScrollProgress from '../common/ScrollProgress.jsx'
import BookInspectionModal from '../inspection/BookInspectionModal.jsx'

export default function Layout({ children }) {
  const [inspectionOpen, setInspectionOpen] = useState(false)
  const closeInspection = useCallback(() => setInspectionOpen(false), [])

  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      <ScrollManager />
      <ScrollProgress />
      <Navbar onBookInspection={() => setInspectionOpen(true)} />
      <main className="flex-1">{children}</main>
      <Footer />
      <FloatingActions onBookInspection={() => setInspectionOpen(true)} />
      <BookInspectionModal open={inspectionOpen} onClose={closeInspection} />
    </div>
  )
}
