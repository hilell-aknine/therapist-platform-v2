import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Heart,
  Brain,
  Shield,
  Sparkles,
  Mail,
  ArrowLeft,
  CheckCircle2,
  Users,
  BookOpen,
  Calendar,
} from 'lucide-react'
import './App.css'

const features = [
  {
    icon: Users,
    title: 'קהילה מקצועית',
    description: 'התחברו למטפלים מובילים, שתפו ידע והתפתחו יחד',
  },
  {
    icon: BookOpen,
    title: 'תוכן מקצועי',
    description: 'מאמרים, קורסים וכלים מעשיים להתפתחות מקצועית',
  },
  {
    icon: Calendar,
    title: 'ניהול פרקטיקה',
    description: 'כלים חכמים לניהול לקוחות, תורים ומעקב טיפולי',
  },
  {
    icon: Shield,
    title: 'חשיפה ונראות',
    description: 'פרופיל מקצועי שמחבר אתכם ללקוחות הנכונים',
  },
]

const floatingIcons = [
  { icon: Heart, x: '10%', y: '20%', delay: 0, duration: 6 },
  { icon: Brain, x: '85%', y: '15%', delay: 1, duration: 7 },
  { icon: Shield, x: '75%', y: '70%', delay: 2, duration: 5 },
  { icon: Sparkles, x: '15%', y: '75%', delay: 0.5, duration: 8 },
  { icon: Heart, x: '50%', y: '85%', delay: 1.5, duration: 6 },
  { icon: Brain, x: '90%', y: '45%', delay: 3, duration: 7 },
]

function App() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubmitted(true)
      setEmail('')
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-bl from-deep-petrol via-muted-teal to-deep-petrol font-['Heebo',sans-serif]">
      {/* Animated background orbs */}
      <div className="pointer-events-none absolute inset-0">
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

      {/* Main content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-12">
        {/* Logo / Brand */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="mb-6 flex items-center gap-3"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-gold to-warm-gold shadow-lg shadow-gold/20">
            <Heart className="h-7 w-7 text-white" fill="white" />
          </div>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-4 text-center font-['Frank_Ruhl_Libre',serif] text-5xl font-bold leading-tight tracking-tight text-frost-white md:text-7xl"
        >
          בית המטפלים
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-2 text-center text-xl font-light text-dusty-aqua md:text-2xl"
        >
          הבית המקצועי שלך
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mb-12 max-w-lg text-center text-base leading-relaxed text-frost-white/60"
        >
          הפלטפורמה המקצועית הראשונה בישראל שנבנתה במיוחד עבור מטפלים.
          <br />
          קהילה, כלים, תוכן והשראה - הכל במקום אחד.
        </motion.p>

        {/* Feature Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mb-14 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-2"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.15 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="group cursor-default rounded-2xl border border-frost-white/10 bg-white/[0.05] p-5 backdrop-blur-sm transition-colors hover:border-gold/30 hover:bg-white/[0.08]"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gold/10 text-gold transition-colors group-hover:bg-gold/20">
                  <Icon size={20} />
                </div>
                <h3 className="mb-1 text-base font-semibold text-frost-white">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-frost-white/50">
                  {feature.description}
                </p>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Coming Soon Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 1.4 }}
          className="mb-6"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-2 text-sm font-medium text-gold">
            <Sparkles size={14} />
            בקרוב אצלכם
            <Sparkles size={14} />
          </span>
        </motion.div>

        {/* Email Signup */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.6 }}
          className="w-full max-w-md"
        >
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                className="flex gap-2"
                exit={{ opacity: 0, y: -10 }}
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="השאירו מייל ונעדכן אתכם ראשונים"
                  required
                  className="flex-1 rounded-xl border border-frost-white/20 bg-white/10 px-4 py-3 text-sm text-frost-white placeholder-frost-white/40 outline-none backdrop-blur-sm transition-all focus:border-gold/50 focus:ring-2 focus:ring-gold/20"
                  dir="rtl"
                />
                <button
                  type="submit"
                  className="flex shrink-0 items-center gap-2 rounded-xl bg-gradient-to-l from-gold to-warm-gold px-5 py-3 text-sm font-semibold text-deep-petrol shadow-lg shadow-gold/20 transition-all hover:shadow-xl hover:shadow-gold/30 hover:brightness-110 active:scale-[0.98]"
                >
                  עדכנו אותי
                  <ArrowLeft size={16} />
                </button>
              </motion.form>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-center gap-2 rounded-xl border border-green-500/30 bg-green-500/10 py-3 text-green-400"
              >
                <CheckCircle2 size={20} />
                <span className="text-sm font-medium">
                  תודה! נעדכן אתכם ברגע שנעלה לאוויר
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 2 }}
          className="mt-16 text-center text-xs text-frost-white/30"
        >
          &copy; {new Date().getFullYear()} בית המטפלים. כל הזכויות שמורות.
        </motion.p>
      </div>
    </div>
  )
}

export default App
