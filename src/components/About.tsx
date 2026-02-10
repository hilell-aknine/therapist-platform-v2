import { motion } from 'framer-motion'
import { Heart, Target, HandHeart, Award, Users } from 'lucide-react'

const vmCards = [
  {
    icon: Heart,
    title: 'החזון שלנו',
    description:
      'אנחנו מאמינים שכל אדם זכאי לגישה לטיפול נפשי איכותי, ללא קשר למצבו הכלכלי. אנחנו חולמים על עולם שבו כל מי שזקוק לעזרה יכול לקבל אותה — ושכל מי שרוצה לעזור יכול להכשיר את עצמו לכך.',
  },
  {
    icon: Target,
    title: 'המשימה שלנו',
    description:
      'להכשיר מטפלים מקצועיים ברמה הגבוהה ביותר, להנגיש ידע טיפולי לכל מי שמעוניין, ולחבר בין מטפלים מתנדבים לאנשים שזקוקים לעזרה — הכל תחת קורת גג אחת.',
  },
]

const values = [
  {
    icon: HandHeart,
    title: 'נגישות',
    description:
      'טיפול נפשי הוא זכות בסיסית. אנחנו עובדים כל יום כדי להפוך אותו לנגיש יותר לכולם.',
  },
  {
    icon: Award,
    title: 'מקצועיות',
    description:
      'לא מתפשרים על הרמה. הכשרה מקצועית עם הסמכה בינלאומית וסטנדרטים גבוהים.',
  },
  {
    icon: Users,
    title: 'קהילה',
    description:
      'מאמינים בכוח של קהילה. מטפלים שתומכים אחד בשני ובוגרים שממשיכים לגדול ביחד.',
  },
]

export default function About() {
  return (
    <>
      {/* Vision & Mission */}
      <section className="py-24 px-4" id="about">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-12 text-center"
          >
            <span className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gold">
              <span className="h-px w-5 bg-gold/40" />
              הכוח המניע שלנו
              <span className="h-px w-5 bg-gold/40" />
            </span>
            <h2 className="font-['Frank_Ruhl_Libre',serif] text-2xl font-bold text-frost-white md:text-4xl">
              חזון ומשימה
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {vmCards.map((card, i) => {
              const Icon = card.icon
              return (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.15 + i * 0.12 }}
                  whileHover={{ y: -4 }}
                  className="group relative overflow-hidden rounded-2xl border border-frost-white/[0.06] bg-white/[0.04] p-7 backdrop-blur-sm transition-all hover:border-gold/20 hover:bg-white/[0.07]"
                >
                  {/* Gold top line */}
                  <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-l from-gold to-warm-gold" />

                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gold/10 text-gold">
                    <Icon size={24} />
                  </div>

                  <h3 className="mb-2 font-['Frank_Ruhl_Libre',serif] text-xl font-bold text-frost-white">
                    {card.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-frost-white/60">
                    {card.description}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="relative overflow-hidden py-24 px-4">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 right-0 left-0 h-px bg-gradient-to-l from-transparent via-gold/20 to-transparent" />
          <div className="absolute bottom-0 right-0 left-0 h-px bg-gradient-to-l from-transparent via-gold/20 to-transparent" />
        </div>

        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-12 text-center"
          >
            <span className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-dusty-aqua">
              <span className="h-px w-5 bg-dusty-aqua/40" />
              מה מנחה אותנו
              <span className="h-px w-5 bg-dusty-aqua/40" />
            </span>
            <h2 className="font-['Frank_Ruhl_Libre',serif] text-2xl font-bold text-frost-white md:text-4xl">
              הערכים שלנו
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {values.map((value, i) => {
              const Icon = value.icon
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.15 + i * 0.12 }}
                  whileHover={{ y: -4 }}
                  className="group rounded-2xl border border-frost-white/[0.06] bg-white/[0.04] p-6 text-center backdrop-blur-sm transition-all hover:border-dusty-aqua/20 hover:bg-white/[0.07]"
                >
                  <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full border border-gold/15 bg-gold/10 text-gold">
                    <Icon size={26} />
                  </div>
                  <h3 className="mb-1 font-['Frank_Ruhl_Libre',serif] text-lg font-semibold text-frost-white">
                    {value.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-frost-white/60">
                    {value.description}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Approach Quote */}
      <section className="py-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl"
        >
          <div className="relative rounded-2xl border border-frost-white/[0.06] bg-white/[0.04] p-8 text-center backdrop-blur-sm md:p-10">
            <span
              className="pointer-events-none absolute -top-4 right-4 select-none font-['Frank_Ruhl_Libre',serif] text-[6rem] leading-none text-gold/15"
              aria-hidden="true"
            >
              ״
            </span>
            <p className="relative font-['Frank_Ruhl_Libre',serif] text-lg font-medium leading-[1.7] text-frost-white md:text-xl">
              השילוב הייחודי שלנו בין{' '}
              <span className="text-gold">הכשרה מקצועית</span> ברמה הגבוהה
              ביותר לבין <span className="text-gold">המיזם החברתי</span> יוצר
              מערכת אקולוגית שלמה — מטפלים שמתפתחים מקצועית תוך כדי תרומה
              לקהילה.
            </p>
          </div>
        </motion.div>
      </section>
    </>
  )
}
