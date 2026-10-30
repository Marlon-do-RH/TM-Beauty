import { createContext, useContext, useState, useCallback } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ChatWidget from '../components/ChatWidget'
import ConsultationModal from '../components/ConsultationModal'
import WelcomeOffer from '../components/WelcomeOffer'

export const ConsultationContext = createContext(null)

export function useConsultation() {
  return useContext(ConsultationContext)
}

export default function PublicLayout() {
  const { pathname } = useLocation()
  const [showModal, setShowModal] = useState(false)
  const isBooking = pathname === '/booking' || pathname === '/agendar'

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])

  const openConsultation = useCallback(() => setShowModal(true), [])
  const closeConsultation = useCallback(() => setShowModal(false), [])

  return (
    <ConsultationContext.Provider value={openConsultation}>
      <Navbar />
      <main style={{ paddingTop: '72px' }}>
        <Outlet />
      </main>
      {!isBooking && <Footer />}
      {!isBooking && <ChatWidget />}
      {showModal && <ConsultationModal onClose={closeConsultation} />}
      {!isBooking && <WelcomeOffer />}
    </ConsultationContext.Provider>
  )
}
