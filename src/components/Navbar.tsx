import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { Heart, Menu, X, LogIn, LayoutDashboard, LogOut } from 'lucide-react'
import { useAuth, getDashboardPath } from '../contexts/AuthContext'

const navLinks = [
  { label: 'דף הבית', to: '/' },
  { label: 'מי אנחנו', to: '/about' },
  { label: 'הכשרות', to: '/courses' },
  { label: 'הכשרת מטפלים', to: '/training' },
  { label: 'המיזם החברתי', to: '/social-initiative' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { pathname } = useLocation()
  const { user, profile, signOut } = useAuth()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  return (
    <>
      <nav
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'border-b border-white/[0.06] bg-deep-petrol/95 py-3 shadow-lg shadow-black/10 backdrop-blur-xl'
            : 'bg-deep-petrol/70 py-4 backdrop-blur-md'
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5">
          {/* Logo — Right side (RTL) */}
          <Link to="/" className="group flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-gold to-warm-gold shadow-md shadow-gold/20 transition-transform group-hover:-rotate-3 group-hover:scale-105">
              <Heart className="h-5 w-5 text-deep-petrol" fill="currentColor" />
            </div>
            <span className="font-['Frank_Ruhl_Libre',serif] text-lg font-bold text-frost-white">
              בית <span className="text-gold">המטפלים</span>
            </span>
          </Link>

          {/* Center links — Desktop */}
          <ul className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className={`group relative text-sm font-medium transition-colors hover:text-white ${
                    pathname === link.to ? 'text-gold' : 'text-frost-white/80'
                  }`}
                >
                  {link.label}
                  <span className="absolute -bottom-1 right-0 h-[1.5px] w-0 bg-gold transition-all duration-300 group-hover:w-full" />
                </Link>
              </li>
            ))}
          </ul>

          {/* Auth buttons — Left side (RTL) + hamburger */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Link
                  to={getDashboardPath(profile?.role)}
                  className="hidden items-center gap-1.5 rounded-lg bg-gradient-to-l from-gold to-warm-gold px-4 py-2 text-sm font-semibold text-deep-petrol transition-all hover:brightness-110 md:flex"
                >
                  <LayoutDashboard size={15} />
                  לוח בקרה
                </Link>
                <button
                  onClick={signOut}
                  className="hidden items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-frost-white/50 transition-colors hover:bg-white/[0.06] hover:text-frost-white md:flex"
                >
                  <LogOut size={15} />
                  יציאה
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/training#register"
                  className="hidden items-center gap-2 rounded-lg bg-gradient-to-l from-gold to-warm-gold px-4 py-2 text-sm font-semibold text-deep-petrol transition-all hover:brightness-110 md:flex"
                >
                  להרשמה להכשרה
                </Link>
                <Link
                  to="/login"
                  className="hidden items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-frost-white/50 transition-colors hover:bg-white/[0.06] hover:text-frost-white md:flex"
                >
                  <LogIn size={15} />
                  כניסה
                </Link>
              </>
            )}

            {/* Hamburger — Mobile */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-lg text-frost-white transition-colors hover:bg-white/10 md:hidden"
              aria-label="תפריט"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />

            {/* Slide-in panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-[280px] border-l border-white/[0.06] bg-deep-petrol shadow-2xl"
            >
              <div className="flex flex-col gap-1 px-6 pt-20">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.to}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.07 }}
                  >
                    <Link
                      to={link.to}
                      onClick={() => setMobileOpen(false)}
                      className={`block rounded-lg px-3 py-3 text-base font-medium transition-colors hover:bg-white/[0.06] hover:text-gold ${
                        pathname === link.to ? 'text-gold' : 'text-frost-white'
                      }`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 }}
                  className="mt-6 border-t border-white/[0.08] pt-6 space-y-3"
                >
                  {user ? (
                    <>
                      <Link
                        to={getDashboardPath(profile?.role)}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-gold to-warm-gold px-5 py-3 text-sm font-semibold text-deep-petrol transition-all hover:brightness-110"
                      >
                        <LayoutDashboard size={16} />
                        לוח בקרה
                      </Link>
                      <button
                        onClick={() => { setMobileOpen(false); signOut() }}
                        className="flex w-full items-center justify-center gap-2 rounded-xl border border-frost-white/10 px-5 py-3 text-sm text-frost-white/60 transition-colors hover:bg-white/[0.04]"
                      >
                        <LogOut size={16} />
                        יציאה
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/training#register"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-gold to-warm-gold px-5 py-3 text-sm font-semibold text-deep-petrol transition-all hover:brightness-110"
                      >
                        להרשמה להכשרה
                      </Link>
                      <Link
                        to="/login"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center justify-center gap-2 rounded-xl border border-frost-white/10 px-5 py-3 text-sm text-frost-white/60 transition-colors hover:bg-white/[0.04]"
                      >
                        <LogIn size={16} />
                        כניסה למערכת
                      </Link>
                    </>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
