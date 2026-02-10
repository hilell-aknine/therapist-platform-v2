import { motion } from 'framer-motion'

export default function MissionQuote() {
  return (
    <section className="relative overflow-hidden py-24 px-4" id="mission">
      {/* Radial background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-[70%] h-full w-[60%] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgba(47,133,146,0.15)_0%,transparent_60%)]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="relative mx-auto max-w-3xl"
      >
        {/* Quote mark */}
        <span
          className="pointer-events-none absolute -top-10 right-0 select-none font-['Frank_Ruhl_Libre',serif] text-[8rem] leading-none text-gold/15"
          aria-hidden="true"
        >
          ״
        </span>

        <p className="relative font-['Frank_Ruhl_Libre',serif] text-xl font-medium leading-[1.7] text-frost-white md:text-2xl lg:text-3xl">
          אנחנו מכשירים את{' '}
          <span className="text-gold">הדור הבא של המטפלים</span> — עם כלים
          מעשיים, ליווי אישי והסמכה בינלאומית.
        </p>

        {/* Divider */}
        <div className="my-6 h-0.5 w-12 bg-gold/50" />

        <p className="max-w-2xl text-base leading-relaxed text-frost-white/70">
          ההכשרה שלנו משלבת ידע תיאורטי עמוק עם תרגול מעשי אינטנסיבי, כך
          שתסיימו מוכנים לעבוד עם לקוחות ביום שאחרי הלימודים.
        </p>
      </motion.div>
    </section>
  )
}
