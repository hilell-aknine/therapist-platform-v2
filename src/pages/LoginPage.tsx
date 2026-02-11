import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, LogIn, ArrowRight, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react'
import { useAuth, getDashboardPath } from '../contexts/AuthContext'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { signIn, legalConsent, profile } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')

    if (!email.trim() || !password.trim()) {
      setError('נא למלא אימייל וסיסמה')
      return
    }

    setSubmitting(true)
    const { error: err } = await signIn(email, password)
    setSubmitting(false)

    if (err) {
      setError('אימייל או סיסמה שגויים')
      return
    }

    // After signIn, the auth state updates. We need to wait a tick for profile/consent to load
    // The navigate will happen once the auth state has settled
    setTimeout(() => {
      // Re-read from the latest state via a fresh check
      // For simplicity, redirect to legal gate if no consent, otherwise dashboard
      if (!legalConsent) {
        navigate('/legal-gate')
      } else {
        navigate(getDashboardPath(profile?.role))
      }
    }, 500)
  }

  return (
    <div dir="rtl" className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-deep-petrol to-[#002a32] px-4">
      {/* Decorative orbs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-dusty-aqua/8 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-gold/6 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md"
      >
        {/* Card */}
        <div className="rounded-3xl border border-frost-white/[0.08] bg-white/[0.04] p-8 shadow-2xl backdrop-blur-xl">
          {/* Logo */}
          <div className="mb-8 text-center">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-gold to-warm-gold shadow-md shadow-gold/20">
                <Heart className="h-6 w-6 text-deep-petrol" fill="currentColor" />
              </div>
              <span className="font-['Frank_Ruhl_Libre',serif] text-xl font-bold text-frost-white">
                בית <span className="text-gold">המטפלים</span>
              </span>
            </Link>
            <p className="mt-3 text-sm text-frost-white/50">כניסה למערכת הניהול</p>
          </div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 flex items-center gap-2 rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-300"
            >
              <AlertCircle size={16} />
              {error}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-frost-white/70">אימייל</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                dir="ltr"
                className="w-full rounded-xl border-2 border-frost-white/10 bg-white/[0.06] px-4 py-3 text-frost-white placeholder:text-frost-white/30 transition-all focus:border-dusty-aqua/50 focus:outline-none focus:ring-2 focus:ring-dusty-aqua/20"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-frost-white/70">סיסמה</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  dir="ltr"
                  className="w-full rounded-xl border-2 border-frost-white/10 bg-white/[0.06] px-4 py-3 pl-12 text-frost-white placeholder:text-frost-white/30 transition-all focus:border-dusty-aqua/50 focus:outline-none focus:ring-2 focus:ring-dusty-aqua/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute top-1/2 left-3 -translate-y-1/2 text-frost-white/40 hover:text-frost-white/70 transition-colors"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-gold to-warm-gold py-3.5 text-base font-bold text-deep-petrol shadow-lg shadow-gold/20 transition-all hover:shadow-xl hover:shadow-gold/30 hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <LogIn size={18} />
                  כניסה
                </>
              )}
            </button>
          </form>
        </div>

        {/* Back link */}
        <div className="mt-6 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-frost-white/40 transition-colors hover:text-frost-white/70"
          >
            <ArrowRight size={14} />
            חזרה לאתר
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
