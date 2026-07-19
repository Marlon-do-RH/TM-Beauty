import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ChatWidget from '../components/ChatWidget'

export default function PublicLayout() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: '72px' }}>
        <Outlet />
      </main>
      <Footer />
      <ChatWidget />
    </>
  )
}
