import { createContext, useContext, useState, useCallback } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ChatWidget from '../components/ChatWidget'
import ConsultationModal from '../components/ConsultationModal'

export const ConsultationContext = createContext(null)

export function useConsultation() {
  return useContext(ConsultationContext)
}

export default function PublicLayout() {
  const { pathname } = useLocation()
  const [showModal, setShowModal] = useState(false)

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
      <Footer />
      <ChatWidget />
      {showModal && <ConsultationModal onClose={closeConsultation} />}
    </ConsultationContext.Provider>
  )
}
