import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Infinity as InfinityIcon,
  Brain,
  Video,
  Users,
  Award,
  UsersRound,
  Bot,
  HandHeart,
  Heart,
  Star,
  ChevronDown,
  Send,
  ArrowLeft,
} from 'lucide-react'

const features = [
  { icon: InfinityIcon, title: 'גישה לשנה לכל התכנים', description: 'גישה מלאה לכל חומרי הלימוד, סרטונים והקלטות למשך שנה שלמה' },
  { icon: Brain, title: 'תכני NLP מקיפים', description: 'כל הטכניקות והכלים שתצטרכו כדי להתחיל לטפל באנשים' },
  { icon: Video, title: '2 מפגשי זום בחודש', description: 'מפגשים חיים עם תרגול, שאלות ותשובות וליווי צמוד' },
  { icon: Users, title: 'מפגש פרונטלי חודשי', description: 'מפגש פיזי אחד בחודש לתרגול מעשי ויצירת קשרים' },
  { icon: Award, title: '2 הסמכות בינלאומיות', description: 'NLP Practitioner + Master Practitioner עם תעודות מוכרות' },
  { icon: UsersRound, title: 'קהילת מטפלים תומכת', description: 'גישה לקהילת בוגרים פעילה לנטוורקינג ותמיכה מקצועית' },
  { icon: Bot, title: 'כלי AI לתרגול', description: 'גישה לכלי בינה מלאכותית מתקדמים לתרגול ושיפור המיומנויות' },
  { icon: HandHeart, title: 'ליווי אישי', description: 'מנטורינג אישי לאורך כל ההכשרה ותמיכה בתחילת הקריירה' },
  { icon: Heart, title: 'התנדבות במיזם החברתי', description: 'אפשרות לצבור ניסיון מעשי דרך התנדבות במיזם שלנו' },
]

const testimonials = [
  {
    name: 'יוסי כ.',
    text: 'ההכשרה שינתה לי את החיים. תוך כמה חודשים כבר התחלתי לקבל מטופלים והיום אני מתפרנס מזה בצורה מלאה.',
  },
  {
    name: 'מיכל ש.',
    text: 'הגישה המעשית של התוכנית מדהימה. לא רק למדתי תיאוריה, אלא יצאתי עם כלים אמיתיים שעובדים.',
  },
  {
    name: 'דני ר.',
    text: 'הליווי האישי והקהילה התומכת עשו את כל ההבדל. תמיד היה מישהו לענות על שאלות ולעזור.',
  },
]

const faqs = [
  {
    question: 'אין לי ניסיון קודם בטיפול - זה מתאים לי?',
    answer:
      'בהחלט! התוכנית מתחילה מהיסודות ומתאימה גם למי שאין לו רקע קודם. אנחנו מלווים אותך צעד אחר צעד, מהמושגים הבסיסיים ועד לטכניקות מתקדמות. רבים מהבוגרים המצליחים שלנו הגיעו ללא ניסיון קודם.',
  },
  {
    question: 'האם אוכל לעבוד במקביל ללימודים?',
    answer:
      'כן, התוכנית תוכננה במיוחד לאנשים עובדים. כל התכנים זמינים להקלטה, המפגשים בזום בערבים, והמפגש הפרונטלי פעם בחודש. אתה יכול ללמוד בקצב שלך ובזמנים שנוחים לך.',
  },
  {
    question: 'מה קורה אם אני לא מרוצה מהתוכנית?',
    answer:
      'אנחנו מאמינים בתוכנית שלנו ורוצים שתצליח. אם בחודש הראשון תרגיש שזה לא מתאים לך, נחזיר לך את הכסף במלואו. בנוסף, צוות התמיכה שלנו זמין לכל שאלה או בעיה לאורך כל הדרך.',
  },
]

export default function TrainingProgram() {
  const [openFaq, setOpenFaq] = useState(0)
  const [formData, setFormData] = useState({ name: '', phone: '' })
  const [formSubmitted, setFormSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.name && formData.phone) {
      setFormSubmitted(true)
      setFormData({ name: '', phone: '' })
    }
  }

  return (
    <>
      {/* Features */}
      <section className="py-24 px-4" id="training">
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
              מה כלול בתוכנית
              <span className="h-px w-5 bg-gold/40" />
            </span>
            <h2 className="font-['Frank_Ruhl_Libre',serif] text-2xl font-bold text-frost-white md:text-4xl">
              מה אתם מקבלים?
            </h2>
            <p className="mt-2 text-sm text-frost-white/50">
              תוכנית הכשרה מקיפה ל-12 חודשים שתהפוך אתכם למטפלים מקצועיים
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feat, i) => {
              const Icon = feat.icon
              return (
                <motion.div
                  key={feat.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.08 * i }}
                  whileHover={{ y: -4 }}
                  className="group rounded-2xl border border-frost-white/[0.06] bg-white/[0.04] p-5 text-center backdrop-blur-sm transition-all hover:border-gold/20 hover:bg-white/[0.07]"
                >
                  <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gold/10 text-gold transition-transform group-hover:scale-105 group-hover:-rotate-3">
                    <Icon size={24} />
                  </div>
                  <h3 className="mb-1 font-['Frank_Ruhl_Libre',serif] text-base font-semibold text-frost-white">
                    {feat.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-frost-white/50">
                    {feat.description}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative overflow-hidden py-24 px-4">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 right-0 left-0 h-px bg-gradient-to-l from-transparent via-gold/20 to-transparent" />
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
              מה אומרים הבוגרים
              <span className="h-px w-5 bg-dusty-aqua/40" />
            </span>
            <h2 className="font-['Frank_Ruhl_Libre',serif] text-2xl font-bold text-frost-white md:text-4xl">
              סיפורי הצלחה
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.15 + i * 0.12 }}
                className="rounded-2xl border border-frost-white/[0.06] bg-white/[0.04] p-6 text-center backdrop-blur-sm"
              >
                {/* Avatar */}
                <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full border-2 border-gold/20 bg-gold/10 text-gold">
                  <Users size={24} />
                </div>

                {/* Stars */}
                <div className="mb-3 flex justify-center gap-0.5 text-gold">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} size={14} fill="currentColor" />
                  ))}
                </div>

                <p className="mb-3 text-sm font-light leading-relaxed text-frost-white/80 italic">
                  &ldquo;{t.text}&rdquo;
                </p>
                <p className="text-sm font-semibold text-gold">{t.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-4" id="faq">
        <div className="mx-auto max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-12 text-center"
          >
            <span className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gold">
              <span className="h-px w-5 bg-gold/40" />
              שאלות נפוצות
              <span className="h-px w-5 bg-gold/40" />
            </span>
            <h2 className="font-['Frank_Ruhl_Libre',serif] text-2xl font-bold text-frost-white md:text-4xl">
              יש לכם שאלות?
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="space-y-3"
          >
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-xl border border-frost-white/[0.06] bg-white/[0.04] backdrop-blur-sm"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                  className="flex w-full items-center justify-between px-5 py-4 text-right transition-colors hover:bg-white/[0.03]"
                >
                  <span className="text-sm font-semibold text-frost-white">
                    {faq.question}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`shrink-0 text-gold transition-transform duration-300 ${
                      openFaq === i ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-4 text-sm leading-relaxed text-frost-white/60">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Registration */}
      <section className="relative overflow-hidden py-24 px-4" id="register">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 right-0 left-0 h-px bg-gradient-to-l from-transparent via-gold/20 to-transparent" />
        </div>

        <div className="mx-auto max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-10 text-center"
          >
            <span className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gold">
              <span className="h-px w-5 bg-gold/40" />
              הרשמה להכשרה
              <span className="h-px w-5 bg-gold/40" />
            </span>
            <h2 className="font-['Frank_Ruhl_Libre',serif] text-2xl font-bold text-frost-white md:text-4xl">
              מוכנים להתחיל?
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="rounded-2xl border border-gold/20 bg-deep-petrol/60 p-8 backdrop-blur-sm"
          >
            {/* Price */}
            <div className="mb-6 border-b border-frost-white/[0.08] pb-6 text-center">
              <p className="text-sm text-frost-white/50">מחיר התוכנית המלאה</p>
              <p className="font-['Frank_Ruhl_Libre',serif] text-5xl font-extrabold text-gold">
                ₪8,500
              </p>
              <p className="mt-1 text-xs text-frost-white/40">
                אפשרות לתשלומים נוחים
              </p>
            </div>

            <AnimatePresence mode="wait">
              {!formSubmitted ? (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <div>
                    <label className="mb-1 block text-sm font-medium text-frost-white/70">
                      שם מלא
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="הכניסו את שמכם המלא"
                      required
                      dir="rtl"
                      className="w-full rounded-xl border border-frost-white/15 bg-white/[0.06] px-4 py-3 text-sm text-frost-white placeholder-frost-white/30 outline-none transition-all focus:border-gold/50 focus:ring-2 focus:ring-gold/20"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-frost-white/70">
                      טלפון
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      placeholder="050-0000000"
                      required
                      dir="rtl"
                      className="w-full rounded-xl border border-frost-white/15 bg-white/[0.06] px-4 py-3 text-sm text-frost-white placeholder-frost-white/30 outline-none transition-all focus:border-gold/50 focus:ring-2 focus:ring-gold/20"
                    />
                  </div>
                  <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-gold to-warm-gold py-3.5 text-base font-bold text-deep-petrol shadow-lg shadow-gold/20 transition-all hover:shadow-xl hover:shadow-gold/30 hover:brightness-110 active:scale-[0.98]"
                  >
                    <Send size={16} />
                    שלחו פרטים
                  </button>
                  <p className="text-center text-xs text-frost-white/30">
                    נחזור אליכם תוך 24 שעות עם כל הפרטים
                  </p>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center gap-3 py-6 text-center"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500/15 text-green-400">
                    <Award size={24} />
                  </div>
                  <p className="text-base font-semibold text-frost-white">
                    תודה! נחזור אליכם בהקדם
                  </p>
                  <p className="text-sm text-frost-white/50">
                    צוות ההכשרה שלנו יצור איתכם קשר תוך 24 שעות
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.06)_0%,transparent_60%)]" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative mx-auto max-w-2xl text-center"
        >
          <h2 className="mb-3 font-['Frank_Ruhl_Libre',serif] text-2xl font-bold text-frost-white md:text-3xl">
            רוצים להיות{' '}
            <span className="text-gold">חלק מהסיפור?</span>
          </h2>
          <p className="mb-8 text-sm text-frost-white/60">
            הצטרפו להכשרה המקצועית שלנו או התחילו ללמוד בחינם — הדלת תמיד
            פתוחה
          </p>
          <a
            href="#register"
            className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-l from-gold to-warm-gold px-7 py-3.5 text-base font-bold text-deep-petrol shadow-lg shadow-gold/20 transition-all hover:shadow-xl hover:shadow-gold/30 hover:brightness-110"
          >
            להרשמה להכשרה
            <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
          </a>
        </motion.div>
      </section>
    </>
  )
}
