import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Heart, Menu, X } from 'lucide-react'

const navLinks = [
  { label: 'דף הבית', href: '#home' },
  { label: 'מי אנחנו', href: '#about' },
  { label: 'הכשרות', href: '#courses' },
  { label: 'הכשרת מטפלים', href: '#training' },
  { label: 'המיזם החברתי', href: '#social-initiative' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

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
              <li key={link.href}>
                <a
                  href={link.href}
                  className="group relative text-sm font-medium text-frost-white/80 transition-colors hover:text-white"
                >
                  {link.label}
                  <span className="absolute -bottom-1 right-0 h-[1.5px] w-0 bg-gold transition-all duration-300 group-hover:w-full" />
                </a>
              </li>
            ))}
          </ul>

          {/* Login button — Left side (RTL) + hamburger */}
          <div className="flex items-center gap-3">
            <a
              href="#register"
              className="hidden items-center gap-2 rounded-lg bg-gradient-to-l from-gold to-warm-gold px-4 py-2 text-sm font-semibold text-deep-petrol transition-all hover:brightness-110 md:flex"
            >
              להרשמה להכשרה
            </a>

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
                  <motion.a
                    key={link.href}
                    href={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.07 }}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg px-3 py-3 text-base font-medium text-frost-white transition-colors hover:bg-white/[0.06] hover:text-gold"
                  >
                    {link.label}
                  </motion.a>
                ))}

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 }}
                  className="mt-6 border-t border-white/[0.08] pt-6"
                >
                  <a
                    href="#register"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-gold to-warm-gold px-5 py-3 text-sm font-semibold text-deep-petrol transition-all hover:brightness-110"
                  >
                    להרשמה להכשרה
                  </a>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
