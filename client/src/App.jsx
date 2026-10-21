import { useState, useCallback } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { LanguageProvider } from './i18n/LanguageContext'
import { AdminAuthProvider } from './context/AdminAuth'
import PublicLayout from './layouts/PublicLayout'
import AdminLayout from './layouts/AdminLayout'
import LoginPage from './pages/LoginPage'
import SplashScreen from './components/SplashScreen'

import Home from './pages/public/Home'
import SobreThalita from './pages/public/SobreThalita'
import Servicos from './pages/public/Servicos'
import AntesDepois from './pages/public/AntesDepois'
import Produtos from './pages/public/Produtos'
import Avaliacoes from './pages/public/Avaliacoes'
import FAQ from './pages/public/FAQ'
import Contato from './pages/public/Contato'
import Booking from './pages/public/Booking'

import AdminDashboard from './pages/admin/AdminDashboard'
import Appointments from './pages/admin/Appointments'
import ServicesCMS from './pages/admin/ServicesCMS'
import GalleryCMS from './pages/admin/GalleryCMS'
import FAQCMS from './pages/admin/FAQCMS'
import ContactInfo from './pages/admin/ContactInfo'
import MediaCMS from './pages/admin/MediaCMS'
import Consultations from './pages/admin/Consultations'

import './index.css'

const hasSeenSplash = () => {
  try { return !!sessionStorage.getItem('tm_splash') } catch { return false }
}

const markSplashSeen = () => {
  try { sessionStorage.setItem('tm_splash', '1') } catch {}
}

function Redirect({ to }) {
  const { search } = useLocation()
  return <Navigate to={`${to}${search}`} replace />
}

function App() {
  const [showSplash, setShowSplash] = useState(!hasSeenSplash())

  const handleSplashDone = useCallback(() => {
    markSplashSeen()
    setShowSplash(false)
  }, [])

  return (
    <LanguageProvider>
      {showSplash && <SplashScreen onDone={handleSplashDone} />}
      <BrowserRouter>
        <AdminAuthProvider>
          <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/aboutus" element={<SobreThalita />} />
            <Route path="/sobre" element={<Redirect to="/aboutus" />} />
            <Route path="/services" element={<Servicos />} />
            <Route path="/servicos" element={<Redirect to="/services" />} />
            <Route path="/before-after" element={<AntesDepois />} />
            <Route path="/antes-depois" element={<Redirect to="/before-after" />} />
            <Route path="/studio" element={<Redirect to="/aboutus" />} />
            <Route path="/products" element={<Produtos />} />
            <Route path="/produtos" element={<Redirect to="/products" />} />
            <Route path="/reviews" element={<Avaliacoes />} />
            <Route path="/avaliacoes" element={<Redirect to="/reviews" />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/contact" element={<Contato />} />
            <Route path="/contato" element={<Redirect to="/contact" />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/agendar" element={<Redirect to="/booking" />} />
            <Route path="/profile" element={<Navigate to="/" replace />} />
            <Route path="/auth/callback" element={<Navigate to="/" replace />} />
          </Route>

          <Route path="/admin/login" element={<LoginPage />} />

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="appointments" element={<Appointments />} />
            <Route path="consultations" element={<Consultations />} />
            <Route path="services" element={<ServicesCMS />} />
            <Route path="gallery" element={<GalleryCMS />} />
            <Route path="media" element={<MediaCMS />} />
            <Route path="faq" element={<FAQCMS />} />
            <Route path="contact-info" element={<ContactInfo />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AdminAuthProvider>
      </BrowserRouter>
    </LanguageProvider>
  )
}

export default App
