import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, Brain, Shield, Sparkles } from 'lucide-react'
import Navbar from './Navbar'
import Footer from './Footer'

const floatingIcons = [
  { icon: Heart, x: '10%', y: '20%', delay: 0, duration: 6 },
  { icon: Brain, x: '85%', y: '15%', delay: 1, duration: 7 },
  { icon: Shield, x: '75%', y: '70%', delay: 2, duration: 5 },
  { icon: Sparkles, x: '15%', y: '75%', delay: 0.5, duration: 8 },
  { icon: Heart, x: '50%', y: '85%', delay: 1.5, duration: 6 },
  { icon: Brain, x: '90%', y: '45%', delay: 3, duration: 7 },
]

function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      // Retry until element is rendered (up to 1s)
      let attempts = 0
      const interval = setInterval(() => {
        const el = document.querySelector(hash)
        if (el) {
          clearInterval(interval)
          el.scrollIntoView({ behavior: 'smooth' })
        } else if (++attempts >= 20) {
          clearInterval(interval)
        }
      }, 50)
      return () => clearInterval(interval)
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])

  return null
}

export default function Layout() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-bl from-deep-petrol via-muted-teal to-deep-petrol font-['Heebo',sans-serif]">
      <ScrollToTop />
      <Navbar />

      {/* Animated background orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-[-20%] right-[-10%] h-[600px] w-[600px] rounded-full bg-dusty-aqua/20 blur-[120px]"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-[-20%] left-[-10%] h-[500px] w-[500px] rounded-full bg-gold/10 blur-[100px]"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-[40%] left-[40%] h-[300px] w-[300px] rounded-full bg-dusty-aqua/10 blur-[80px]"
          animate={{ x: [0, 50, 0], y: [0, -30, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Floating icons */}
      {floatingIcons.map((item, i) => {
        const Icon = item.icon
        return (
          <motion.div
            key={i}
            className="pointer-events-none absolute text-frost-white/[0.07]"
            style={{ left: item.x, top: item.y }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: item.duration,
              repeat: Infinity,
              delay: item.delay,
              ease: 'easeInOut',
            }}
          >
            <Icon size={48} />
          </motion.div>
        )
      })}

      {/* Page content */}
      <div className="relative z-10">
        <Outlet />
      </div>

      <Footer />
    </div>
  )
}
