import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Brain,
  Crown,
  MessageCircleHeart,
  BookOpen,
  Clock,
  ArrowLeft,
  Lock,
  Sparkles,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface Course {
  slug: string
  title: string
  description: string
  icon: LucideIcon
  status: 'open' | 'coming_soon' | 'locked'
  lessonCount: number
  durationText: string
  price?: string
}

const courses: Course[] = [
  {
    slug: 'nlp-practitioner',
    title: 'יסודות ה-NLP',
    description:
      'למדו את עולם ה-NLP מאפס — מהי תכנות עצבי-לשוני, איך המוח עובד, ואיך אפשר להשתמש בזה בחיים. קורס חינמי ומלא, פתוח לכולם.',
    icon: Brain,
    status: 'open',
    lessonCount: 51,
    durationText: '7 מודולים · 51 שיעורים',
  },
  {
    slug: 'nlp-master',
    title: 'NLP מתקדם — מאסטר',
    description:
      'העמקה ברמה אחרת: עבודה עם טראומה, שינוי אמונות מגבילות ודפוסים עמוקים. קורס בלעדי לתלמידי ההכשרה.',
    icon: Crown,
    status: 'locked',
    lessonCount: 0,
    durationText: 'לתלמידי ההכשרה בלבד',
    price: '₪8,500',
  },
  {
    slug: 'emotional-messaging',
    title: 'תקשורת רגשית ושכנוע',
    description:
      'איך ליצור מסרים שנוגעים באנשים ומניעים לפעולה — בטיפול, בשיווק ובחיים. קורס בלעדי לתלמידי ההכשרה.',
    icon: MessageCircleHeart,
    status: 'locked',
    lessonCount: 0,
    durationText: 'לתלמידי ההכשרה בלבד',
  },
]

const statusConfig = {
  open: {
    label: 'חינמי ופתוח',
    badgeClass: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
    btnClass:
      'bg-gradient-to-l from-gold to-warm-gold text-deep-petrol shadow-lg shadow-gold/20 hover:shadow-xl hover:shadow-gold/30 hover:brightness-110',
    btnText: 'להתחיל ללמוד',
  },
  coming_soon: {
    label: 'בקרוב',
    badgeClass: 'border-gold/30 bg-gold/10 text-gold',
    btnClass:
      'border border-frost-white/10 bg-white/[0.05] text-frost-white/40 cursor-default',
    btnText: 'בקרוב...',
  },
  locked: {
    label: 'לתלמידי ההכשרה',
    badgeClass: 'border-frost-white/10 bg-white/[0.04] text-frost-white/40',
    btnClass:
      'border border-frost-white/10 bg-white/[0.05] text-frost-white/50 hover:border-gold/30 hover:text-gold',
    btnText: 'לפרטים על ההכשרה',
  },
}

export default function CoursesGrid() {
  return (
    <section className="px-4 py-20" id="courses">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-12 text-center"
      >
        <span className="mb-3 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-gold">
          <span className="h-px w-6 bg-gold/40" />
          הקורסים שלנו
          <span className="h-px w-6 bg-gold/40" />
        </span>
        <h2 className="mb-3 font-['Frank_Ruhl_Libre',serif] text-3xl font-bold text-frost-white md:text-4xl">
          ה<span className="bg-gradient-to-l from-gold to-light-gold bg-clip-text text-transparent">קורסים</span> שלנו
        </h2>
        <p className="mx-auto max-w-lg text-base text-frost-white/60">
          קורסים חינמיים ופתוחים ללמידה עצמית — וקורסים מתקדמים בלעדיים לתלמידי ההכשרה
        </p>
      </motion.div>

      {/* Cards Grid */}
      <div className="mx-auto grid max-w-4xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((course, index) => {
          const Icon = course.icon
          const config = statusConfig[course.status]
          const isLocked = course.status === 'locked'
          const isOpen = course.status === 'open'

          return (
            <motion.div
              key={course.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              whileHover={!isLocked ? { y: -6 } : { y: -2 }}
              className={`group relative flex flex-col items-center overflow-hidden rounded-2xl border p-7 text-center backdrop-blur-sm transition-all ${
                isOpen
                  ? 'border-gold/20 bg-white/[0.06] hover:border-gold/40 hover:bg-white/[0.09]'
                  : isLocked
                    ? 'border-frost-white/[0.06] bg-white/[0.03] opacity-70'
                    : 'border-frost-white/10 bg-white/[0.05]'
              }`}
            >
              {/* Gold top line for open courses */}
              {isOpen && (
                <div className="absolute top-0 right-0 left-0 h-[3px] bg-gradient-to-l from-gold to-warm-gold" />
              )}

              {/* Icon */}
              <div
                className={`mb-4 flex h-[72px] w-[72px] items-center justify-center rounded-2xl transition-transform group-hover:scale-105 group-hover:-rotate-3 ${
                  isOpen
                    ? 'bg-gold/10 text-gold'
                    : isLocked
                      ? 'bg-white/[0.04] text-frost-white/30'
                      : 'bg-dusty-aqua/12 text-dusty-aqua'
                }`}
              >
                <Icon size={32} />
              </div>

              {/* Status Badge */}
              <span
                className={`mb-3 inline-flex items-center gap-1.5 rounded-md border px-3 py-1 text-xs font-semibold ${config.badgeClass}`}
              >
                {isLocked ? <Lock size={12} /> : isOpen ? <Sparkles size={12} /> : <Clock size={12} />}
                {config.label}
              </span>

              {/* Title */}
              <h3
                className={`mb-2 font-['Frank_Ruhl_Libre',serif] text-xl font-bold ${
                  isOpen ? 'text-gold' : 'text-frost-white'
                }`}
              >
                {course.title}
              </h3>

              {/* Description */}
              <p className="mb-4 flex-1 text-sm leading-relaxed text-frost-white/60">
                {course.description}
              </p>

              {/* Meta */}
              <div className="mb-5 flex items-center gap-2 text-xs text-dusty-aqua">
                <BookOpen size={14} />
                {course.durationText}
              </div>

              {/* CTA Button */}
              {isOpen ? (
                <Link
                  to={`/course/${course.slug}`}
                  className={`flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all active:scale-[0.98] ${config.btnClass}`}
                >
                  {config.btnText}
                  <ArrowLeft size={16} />
                </Link>
              ) : (
                <Link
                  to={isLocked && course.slug === 'nlp-master' ? `/course/${course.slug}` : '/training'}
                  className={`flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all active:scale-[0.98] ${config.btnClass}`}
                >
                  {config.btnText}
                  {isLocked && <ArrowLeft size={16} />}
                </Link>
              )}
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
