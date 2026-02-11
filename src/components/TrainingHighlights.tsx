import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Award, HandHeart, Briefcase, ArrowLeft } from 'lucide-react'

const highlights = [
  {
    icon: Award,
    title: 'הסמכה בינלאומית',
    description:
      'תעודת NLP Practitioner ו-Master Practitioner מוכרת בינלאומית שפותחת דלתות בארץ ובעולם',
  },
  {
    icon: HandHeart,
    title: 'ליווי אישי צמוד',
    description:
      'מנטורינג אחד-על-אחד, סופרוויז׳ן מקצועי ותמיכה רציפה לאורך כל תקופת ההכשרה',
  },
  {
    icon: Briefcase,
    title: 'כלים מעשיים לעבודה',
    description:
      'לא רק תיאוריה — תרגול מעשי, כלים ישימים ושיטות שתוכלו ליישם כבר מהיום הראשון',
  },
]

export default function TrainingHighlights() {
  return (
    <section className="py-24 px-4" id="training-highlights">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <span className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gold">
            <span className="h-px w-5 bg-gold/40" />
            למה ללמוד אצלנו
            <span className="h-px w-5 bg-gold/40" />
          </span>
          <h2 className="font-['Frank_Ruhl_Libre',serif] text-2xl font-bold text-frost-white md:text-4xl">
            ההכשרה שתשנה לכם את הקריירה
          </h2>
          <p className="mt-2 text-sm text-frost-white/50">
            תוכנית מקצועית שנבנתה כדי להפוך אתכם למטפלים מוסמכים ובטוחים בעצמכם
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {highlights.map((item, i) => {
            const Icon = item.icon
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.15 + i * 0.12 }}
                whileHover={{ y: -6 }}
                className="group relative overflow-hidden rounded-2xl border border-frost-white/[0.06] bg-white/[0.04] p-7 text-center backdrop-blur-sm transition-all hover:border-gold/20 hover:bg-white/[0.07]"
              >
                {/* Gold top line */}
                <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-l from-gold to-warm-gold opacity-60 transition-all group-hover:opacity-100" />

                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gold/10 text-gold transition-transform group-hover:scale-105 group-hover:-rotate-3">
                  <Icon size={28} />
                </div>

                <h3 className="mb-2 font-['Frank_Ruhl_Libre',serif] text-lg font-bold text-frost-white">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-frost-white/50">
                  {item.description}
                </p>
              </motion.div>
            )
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-10 text-center"
        >
          <Link
            to="/training"
            className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-l from-gold to-warm-gold px-7 py-3.5 text-base font-bold text-deep-petrol shadow-lg shadow-gold/20 transition-all hover:shadow-xl hover:shadow-gold/30 hover:brightness-110"
          >
            לכל הפרטים על ההכשרה
            <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
