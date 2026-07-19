import { useState } from 'react'
import { IconInstagram, IconMail, IconWhatsApp } from './AdminIcons'
import ConsultationModal from './ConsultationModal'
import styles from './Footer.module.css'

export default function Footer() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        {/* Brand block */}
        <div className={styles.brand}>
          <div className={styles.monogram}>TM</div>
          <p className={styles.name}>Thalita Medeiros</p>
          <p className={styles.sub}>Brazilian Hair Specialist in Melbourne</p>
          <div className={styles.icons}>
            <a
              href="https://instagram.com/thalita.medeiros.hair"
              target="_blank"
              rel="noreferrer"
              className={styles.iconLink}
              aria-label="Instagram"
            >
              <IconInstagram size={18} />
            </a>
            <a
              href="mailto:hello@thalitamedeiros.com.au"
              className={styles.iconLink}
              aria-label="Email"
            >
              <IconMail size={18} />
            </a>
            <a
              href="https://wa.me/61450442869"
              target="_blank"
              rel="noreferrer"
              className={styles.iconLink}
              aria-label="WhatsApp"
            >
              <IconWhatsApp size={18} />
            </a>
          </div>
          <p className={styles.copy}>
            &copy; {new Date().getFullYear()} Thalita Medeiros. All rights reserved.
          </p>
        </div>

        {/* CTA block */}
        <div className={styles.cta}>
          <button className={styles.consultBtn} onClick={() => setModalOpen(true)}>
            Free Consultation
          </button>
        </div>
      </div>

      <ConsultationModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </footer>
  )
}
