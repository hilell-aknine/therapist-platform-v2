import { motion } from 'framer-motion'
import {
  HandHeart,
  ClipboardList,
  UserCheck,
  Heart,
  CheckCircle2,
  Lock,
  ArrowLeft,
} from 'lucide-react'

const trustItems = [
  { icon: CheckCircle2, text: 'ללא עלות' },
  { icon: CheckCircle2, text: 'מטפלים מוסמכים' },
  { icon: CheckCircle2, text: 'פריסה ארצית' },
  { icon: CheckCircle2, text: 'דיסקרטיות מלאה' },
]

const steps = [
  {
    number: 1,
    icon: ClipboardList,
    title: 'מלאו שאלון קצר',
    description: 'כמה שאלות פשוטות שיעזרו לנו להבין את הצרכים שלכם',
  },
  {
    number: 2,
    icon: UserCheck,
    title: 'נתאים לכם מטפל',
    description: 'מטפל מקצועי ומנוסה שמתאים בדיוק לצרכים שלכם',
  },
  {
    number: 3,
    icon: Heart,
    title: 'צאו לדרך חדשה',
    description: 'התחילו תהליך טיפולי משמעותי לריפוי וצמיחה',
  },
]

export default function SocialInitiative() {
  return (
    <section className="relative overflow-hidden py-24 px-4" id="social-initiative">
      {/* Background accent */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 right-0 left-0 h-px bg-gradient-to-l from-transparent via-gold/20 to-transparent" />
        <div className="absolute bottom-0 right-0 left-0 h-px bg-gradient-to-l from-transparent via-gold/20 to-transparent" />
      </div>

      {/* Section Hero */}
      <div className="mx-auto max-w-3xl text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-gold to-warm-gold shadow-xl shadow-gold/25"
        >
          <HandHeart className="h-9 w-9 text-deep-petrol" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mb-4 font-['Frank_Ruhl_Libre',serif] text-3xl font-bold text-frost-white md:text-5xl"
        >
          טיפול נפשי הוא{' '}
          <span className="bg-gradient-to-l from-gold to-light-gold bg-clip-text text-transparent">
            זכות בסיסית
          </span>
          ,
          <br />
          לא מותרות.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mx-auto mb-8 max-w-xl text-lg leading-relaxed text-frost-white/70"
        >
          מיזם חברתי המחבר בין מטפלים מוסמכים לאנשים הזקוקים לסיוע —{' '}
          <strong className="text-frost-white">ב-100% מימון מלא שלנו.</strong>
        </motion.p>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="mb-16 flex flex-wrap items-center justify-center gap-x-6 gap-y-3"
        >
          {trustItems.map((item) => {
            const Icon = item.icon
            return (
              <span
                key={item.text}
                className="flex items-center gap-1.5 text-sm text-frost-white/60"
              >
                <Icon size={15} className="text-gold" />
                {item.text}
              </span>
            )
          })}
        </motion.div>
      </div>

      {/* How it works */}
      <div className="mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center"
        >
          <span className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-dusty-aqua">
            <span className="h-px w-5 bg-dusty-aqua/40" />
            איך זה עובד?
            <span className="h-px w-5 bg-dusty-aqua/40" />
          </span>
          <h3 className="font-['Frank_Ruhl_Libre',serif] text-2xl font-bold text-frost-white">
            תהליך פשוט ומהיר
          </h3>
          <p className="mt-1 text-sm text-frost-white/50">
            בשלושה צעדים פשוטים תתחילו את המסע שלכם לריפוי
          </p>
        </motion.div>

        {/* Explanation box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-10 rounded-2xl border border-gold/20 bg-deep-petrol/60 p-6 text-center backdrop-blur-sm"
        >
          <h4 className="mb-2 font-['Frank_Ruhl_Libre',serif] text-base font-semibold text-gold">
            המיזם מיועד למי שאין לו יכולת כלכלית לטיפול פרטי
          </h4>
          <p className="text-sm leading-relaxed text-frost-white/70">
            אנחנו דואגים לכל העלויות — המטפלים, המקום, הליווי. אתם דואגים להחלים ולהתקדם. זה הכל.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.12 }}
                whileHover={{ y: -4 }}
                className="group relative rounded-2xl border border-frost-white/[0.06] bg-white/[0.04] p-6 pt-9 text-center backdrop-blur-sm transition-all hover:border-dusty-aqua/20 hover:bg-white/[0.07]"
              >
                {/* Step number */}
                <div className="absolute -top-4 right-1/2 flex h-9 w-9 translate-x-1/2 items-center justify-center rounded-full bg-gradient-to-br from-gold to-warm-gold font-['Frank_Ruhl_Libre',serif] text-sm font-extrabold text-deep-petrol shadow-md shadow-gold/20">
                  {step.number}
                </div>

                <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-dusty-aqua/10 text-dusty-aqua transition-transform group-hover:scale-105 group-hover:-rotate-3">
                  <Icon size={28} />
                </div>

                <h4 className="mb-1 font-['Frank_Ruhl_Libre',serif] text-base font-semibold text-frost-white">
                  {step.title}
                </h4>
                <p className="text-sm leading-relaxed text-frost-white/50">{step.description}</p>
              </motion.div>
            )
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-10 text-center"
        >
          <a
            href="#register"
            className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-l from-gold to-warm-gold px-7 py-3.5 text-base font-bold text-deep-petrol shadow-lg shadow-gold/20 transition-all hover:shadow-xl hover:shadow-gold/30 hover:brightness-110"
          >
            לבדיקת זכאות והתאמת מטפל
            <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
          </a>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-frost-white/40">
            <Lock size={12} />
            כל המידע נשמר בסודיות מוחלטת
          </p>
        </motion.div>
      </div>
    </section>
  )
}
