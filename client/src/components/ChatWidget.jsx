import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'
import styles from './ChatWidget.module.css'

const STRINGS = {
  en: {
    greeting: "Hi! I'm here to help you book your perfect treatment or answer any questions.",
    prompt: 'How can I help you today?',
    book: 'Book an Appointment',
    services: 'View Services & Prices',
    whatsapp: 'Chat on WhatsApp',
    contact: 'Contact & Location',
    reply_book: "Great! Head to our contact page to request a booking — I'll confirm within 24 hours.",
    reply_services: "I'll take you to our full services list right now!",
    reply_whatsapp: "Opening WhatsApp — see you there!",
    reply_contact: "Taking you to our contact page now.",
    ariaOpen: 'Open chat',
    ariaClose: 'Close chat',
    title: 'TM Beauty',
    subtitle: 'Typically replies instantly',
  },
  pt: {
    greeting: 'Olá! Estou aqui para ajudar você a agendar o tratamento perfeito ou responder dúvidas.',
    prompt: 'Como posso te ajudar hoje?',
    book: 'Agendar um Horário',
    services: 'Ver Serviços & Preços',
    whatsapp: 'Conversar no WhatsApp',
    contact: 'Contato & Localização',
    reply_book: 'Ótimo! Acesse nossa página de contato para solicitar um horário — confirmo em até 24h.',
    reply_services: 'Vou te levar para a lista completa de serviços agora!',
    reply_whatsapp: 'Abrindo WhatsApp — até já!',
    reply_contact: 'Indo para a página de contato agora.',
    ariaOpen: 'Abrir chat',
    ariaClose: 'Fechar chat',
    title: 'TM Beauty',
    subtitle: 'Responde rapidamente',
  },
  fr: {
    greeting: 'Bonjour! Je suis là pour vous aider à réserver votre traitement ou répondre à vos questions.',
    prompt: "Comment puis-je vous aider aujourd'hui?",
    book: 'Prendre Rendez-vous',
    services: 'Voir Nos Services',
    whatsapp: 'Chatter sur WhatsApp',
    contact: 'Contact & Localisation',
    reply_book: "Super! Rendez-vous sur notre page contact pour demander un créneau.",
    reply_services: 'Je vous emmène vers notre liste de services!',
    reply_whatsapp: 'Ouverture de WhatsApp — à tout de suite!',
    reply_contact: 'Je vous emmène sur la page contact.',
    ariaOpen: 'Ouvrir le chat',
    ariaClose: 'Fermer le chat',
    title: 'TM Beauty',
    subtitle: 'Répond rapidement',
  },
  es: {
    greeting: '¡Hola! Estoy aquí para ayudarte a reservar tu tratamiento perfecto o responder tus dudas.',
    prompt: '¿Cómo puedo ayudarte hoy?',
    book: 'Reservar una Cita',
    services: 'Ver Servicios & Precios',
    whatsapp: 'Chatear por WhatsApp',
    contact: 'Contacto & Ubicación',
    reply_book: '¡Genial! Ve a nuestra página de contacto para solicitar una cita — confirmo en 24h.',
    reply_services: '¡Te llevo a la lista completa de servicios ahora!',
    reply_whatsapp: 'Abriendo WhatsApp — ¡hasta pronto!',
    reply_contact: 'Yendo a la página de contacto ahora.',
    ariaOpen: 'Abrir chat',
    ariaClose: 'Cerrar chat',
    title: 'TM Beauty',
    subtitle: 'Responde rápidamente',
  },
}

const WA_NUMBER = '61400000000'

export default function ChatWidget() {
  const { lang } = useLanguage()
  const navigate = useNavigate()
  const s = STRINGS[lang] || STRINGS.en

  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [showActions, setShowActions] = useState(true)
  const [pulsed, setPulsed] = useState(false)

  // Greet on first open
  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([
        { from: 'bot', text: s.greeting },
        { from: 'bot', text: s.prompt },
      ])
      setShowActions(true)
    }
  }, [open])

  // Pulse the button after 4s to draw attention
  useEffect(() => {
    const t = setTimeout(() => setPulsed(true), 4000)
    return () => clearTimeout(t)
  }, [])

  // Reset when language changes
  useEffect(() => {
    if (open) {
      setMessages([
        { from: 'bot', text: (STRINGS[lang] || STRINGS.en).greeting },
        { from: 'bot', text: (STRINGS[lang] || STRINGS.en).prompt },
      ])
    }
  }, [lang])

  const addMessage = (userText, botReply, action) => {
    setShowActions(false)
    setMessages(prev => [
      ...prev,
      { from: 'user', text: userText },
      { from: 'bot', text: botReply },
    ])
    if (action) {
      setTimeout(() => {
        action()
        setOpen(false)
        setMessages([])
        setShowActions(true)
      }, 900)
    }
  }

  const handleBook = () =>
    addMessage(s.book, s.reply_book, () => navigate('/contato'))

  const handleServices = () =>
    addMessage(s.services, s.reply_services, () => navigate('/servicos'))

  const handleWhatsApp = () =>
    addMessage(s.whatsapp, s.reply_whatsapp, () =>
      window.open(`https://wa.me/${WA_NUMBER}`, '_blank')
    )

  const handleContact = () =>
    addMessage(s.contact, s.reply_contact, () => navigate('/contato'))

  return (
    <div className={styles.root}>
      {/* Chat panel */}
      {open && (
        <div className={styles.panel} role="dialog" aria-label="Chat">
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.headerAvatar}>TM</div>
            <div className={styles.headerInfo}>
              <span className={styles.headerName}>{s.title}</span>
              <span className={styles.headerStatus}>
                <span className={styles.statusDot} />
                {s.subtitle}
              </span>
            </div>
            <button
              className={styles.closeBtn}
              onClick={() => setOpen(false)}
              aria-label={s.ariaClose}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className={styles.body}>
            {messages.map((msg, i) => (
              <div key={i} className={`${styles.bubble} ${msg.from === 'user' ? styles.bubbleUser : styles.bubbleBot}`}>
                {msg.from === 'bot' && <span className={styles.botAvatar}>T</span>}
                <p className={styles.bubbleText}>{msg.text}</p>
              </div>
            ))}

            {/* Quick actions */}
            {showActions && (
              <div className={styles.actions}>
                <button className={styles.actionBtn} onClick={handleBook}>
                  <CalendarIcon /> {s.book}
                </button>
                <button className={styles.actionBtn} onClick={handleServices}>
                  <ScissorsIcon /> {s.services}
                </button>
                <button className={styles.actionBtn} onClick={handleWhatsApp}>
                  <WhatsAppIcon /> {s.whatsapp}
                </button>
                <button className={styles.actionBtn} onClick={handleContact}>
                  <PinIcon /> {s.contact}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* FAB button */}
      <button
        className={`${styles.fab} ${pulsed && !open ? styles.fabPulse : ''}`}
        onClick={() => setOpen(v => !v)}
        aria-label={open ? s.ariaClose : s.ariaOpen}
      >
        {open ? <CloseIcon /> : <ChatIcon />}
        {!open && <span className={styles.fabBadge} aria-hidden="true" />}
      </button>
    </div>
  )
}

/* ── Inline SVG icons (no external dependency) ─────────────────────────────── */

function ChatIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  )
}

function ScissorsIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/>
    </svg>
  )
}

function WhatsAppIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
    </svg>
  )
}

function PinIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  )
}
