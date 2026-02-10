import { motion } from 'framer-motion'
import { ArrowLeft, Sparkles } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative flex min-h-[85vh] flex-col items-center justify-center px-4 py-20 text-center">
      {/* Decorative top sparkle */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mb-6"
      >
        <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-2 text-sm font-medium text-gold">
          <Sparkles size={14} />
          NLP Practitioner &amp; Master Practitioner
          <Sparkles size={14} />
        </span>
      </motion.div>

      {/* H1 — Main Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="mb-6 max-w-3xl font-['Frank_Ruhl_Libre',serif] text-5xl font-bold leading-tight text-frost-white md:text-7xl"
      >
        המקום בו טיפול
        <br />
        <span className="bg-gradient-to-l from-gold to-light-gold bg-clip-text text-transparent">
          פוגש שליחות
        </span>
      </motion.h1>

      {/* Sub-headline */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="mb-10 max-w-2xl text-lg leading-relaxed text-frost-white/70 md:text-xl"
      >
        הכשרה מקצועית ל-NLP Practitioner ו-Master Practitioner
        <br className="hidden sm:block" />
        עם הסמכה בינלאומית, ליווי אישי וכלים מעשיים
      </motion.p>

      {/* CTA Button */}
      <motion.a
        href="#register"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.9 }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        className="group flex items-center gap-3 rounded-2xl bg-gradient-to-l from-gold to-warm-gold px-8 py-4 text-lg font-bold text-deep-petrol shadow-xl shadow-gold/25 transition-shadow hover:shadow-2xl hover:shadow-gold/35"
      >
        להרשמה להכשרה
        <ArrowLeft
          size={20}
          className="transition-transform group-hover:-translate-x-1"
        />
      </motion.a>

      {/* Bottom decorative line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1, delay: 1.2, ease: 'easeOut' }}
        className="mt-16 h-px w-40 origin-center bg-gradient-to-l from-transparent via-gold/40 to-transparent"
      />
    </section>
  )
}
