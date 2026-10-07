import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getSupabase } from '../../lib/supabaseClient'
import { useSession } from '../../context/AdminAuth'
import styles from './PageCommon.module.css'

let pendingCallback = null

export default function AuthCallback() {
  const { loginWithGoogle } = useSession()
  const navigate = useNavigate()
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    if (!pendingCallback) {
      pendingCallback = (async () => {
        const supabase = await getSupabase()
        const params = new URLSearchParams(window.location.search)
        const code = params.get('code')
        let accessToken = null

        if (code) {
          const { data, error: exchErr } = await supabase.auth.exchangeCodeForSession(code)
          if (exchErr) throw exchErr
          accessToken = data.session?.access_token
        } else {
          const { data, error: sessErr } = await supabase.auth.getSession()
          if (sessErr) throw sessErr
          accessToken = data.session?.access_token
        }

        if (!accessToken) throw new Error('Google did not return a session.')
        const result = await loginWithGoogle(accessToken)
        await supabase.auth.signOut({ scope: 'local' }).catch(() => {})
        return result
      })()
    }

    pendingCallback
      .then((result) => {
        if (!cancelled) {
          navigate(result.role === 'customer' ? '/profile' : '/', { replace: true })
        }
      })
      .catch((err) => {
        pendingCallback = null
        if (!cancelled) setError(err.message || 'Google sign-in failed.')
      })

    return () => { cancelled = true }
  }, [loginWithGoogle, navigate])

  return (
    <div>
      <section className={styles.pageHero}>
        <div className={styles.pageHeroContent}>
          <p className={styles.eyebrow}>Account</p>
          <h1 className={styles.pageTitle}>{error ? 'Sign-in failed' : 'Signing you in…'}</h1>
          <p className={styles.pageSubtitle}>
            {error || 'Connecting your Google account.'}
          </p>
        </div>
      </section>
    </div>
  )
}
