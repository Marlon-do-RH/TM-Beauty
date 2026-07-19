import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { LanguageProvider } from './i18n/LanguageContext'
import PublicLayout from './layouts/PublicLayout'
import AdminLayout from './layouts/AdminLayout'
import LoginPage from './pages/LoginPage'

import Home from './pages/public/Home'
import SobreThalita from './pages/public/SobreThalita'
import Servicos from './pages/public/Servicos'
import AntesDepois from './pages/public/AntesDepois'
import OStudio from './pages/public/OStudio'
import Produtos from './pages/public/Produtos'
import Avaliacoes from './pages/public/Avaliacoes'
import FAQ from './pages/public/FAQ'
import Contato from './pages/public/Contato'

import AdminDashboard from './pages/admin/AdminDashboard'
import Appointments from './pages/admin/Appointments'
import ServicesCMS from './pages/admin/ServicesCMS'
import GalleryCMS from './pages/admin/GalleryCMS'
import FAQCMS from './pages/admin/FAQCMS'
import ContactInfo from './pages/admin/ContactInfo'
import MediaCMS from './pages/admin/MediaCMS'

import './index.css'

function App() {
  return (
    <LanguageProvider>
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/sobre" element={<SobreThalita />} />
          <Route path="/servicos" element={<Servicos />} />
          <Route path="/antes-depois" element={<AntesDepois />} />
          <Route path="/studio" element={<OStudio />} />
          <Route path="/produtos" element={<Produtos />} />
          <Route path="/avaliacoes" element={<Avaliacoes />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contato" element={<Contato />} />
        </Route>

        <Route path="/admin/login" element={<LoginPage />} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="services" element={<ServicesCMS />} />
          <Route path="gallery" element={<GalleryCMS />} />
          <Route path="media" element={<MediaCMS />} />
          <Route path="faq" element={<FAQCMS />} />
          <Route path="contact-info" element={<ContactInfo />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
    </LanguageProvider>
  )
}

export default App
