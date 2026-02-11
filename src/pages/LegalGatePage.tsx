import { useState, useRef, type UIEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Shield, CheckCircle2, Loader2, ScrollText } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth, getDashboardPath } from '../contexts/AuthContext'

const LEGAL_VERSION = '1.0'

const legalSections = [
  {
    title: '1. הגדרות',
    content: `"האתר" – אתר בית המטפלים המופעל על ידי הלל עקנין. "המשתמש" – כל אדם הנכנס לאתר ו/או משתמש בשירותיו. "השירותים" – שירותי תיווך בין מטופלים למטפלים, הכשרות, קורסים ותוכן מקצועי.`,
  },
  {
    title: '2. קבלת התנאים',
    content: `השימוש באתר ובשירותים מותנה בהסכמתך לתנאי שימוש אלה. אם אינך מסכים לתנאים אלה, אינך רשאי להשתמש באתר. המשך השימוש באתר מהווה הסכמה לתנאים אלה כפי שיתעדכנו מעת לעת.`,
  },
  {
    title: '3. הגנת הפרטיות',
    content: `אנו מחויבים להגנה על פרטיותך. המידע האישי שנאסף באתר, לרבות שם, טלפון, דוא"ל ופרטי בריאות, ישמש אך ורק לצורך מתן השירותים ולא יועבר לצד שלישי ללא הסכמתך. המידע מאוחסן בשרתים מאובטחים ומוגנים בהצפנה.`,
  },
  {
    title: '4. שימוש בשירותים',
    content: `השירותים מסופקים "כמות שהם" (AS IS). האתר אינו מהווה תחליף לייעוץ רפואי או טיפול מקצועי. התאמת מטפל נעשית על בסיס המידע שסופק ואינה מהווה המלצה רפואית. האחריות על קבלת החלטות טיפוליות היא על המשתמש בלבד.`,
  },
  {
    title: '5. סודיות ואתיקה',
    content: `כל המידע שנמסר במסגרת התהליך הטיפולי חסוי לחלוטין. המטפלים מחויבים לכללי האתיקה המקצועית של האיגוד שלהם. הפרת סודיות עלולה לגרור הפסקת שירות ופעולות משפטיות.`,
  },
  {
    title: '6. קניין רוחני',
    content: `כל התכנים באתר, לרבות טקסטים, עיצובים, לוגואים, תמונות, סרטונים וקוד, הם רכושו הבלעדי של בית המטפלים. אין להעתיק, לשכפל, להפיץ או לעשות שימוש מסחרי בתכנים ללא אישור מראש ובכתב.`,
  },
  {
    title: '7. הגבלת אחריות',
    content: `האתר אינו אחראי לנזקים ישירים או עקיפים הנובעים מהשימוש בשירותים. אנו עושים מאמץ סביר להבטיח את זמינות ואמינות השירותים, אך אין ביכולתנו להבטיח שירות רציף וללא תקלות.`,
  },
  {
    title: '8. שינויים ועדכונים',
    content: `אנו שומרים לעצמנו את הזכות לשנות תנאים אלה בכל עת. שינויים מהותיים יפורסמו באתר ו/או ישלחו בהודעה אישית. המשך השימוש לאחר שינוי התנאים מהווה הסכמה לתנאים המעודכנים. תנאים אלה כפופים לדין הישראלי וסמכות השיפוט הבלעדית נתונה לבתי המשפט בישראל.`,
  },
]

export default function LegalGatePage() {
  const [scrolledToBottom, setScrolledToBottom] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const { user, profile, refreshLegalConsent } = useAuth()
  const navigate = useNavigate()

  function handleScroll(e: UIEvent<HTMLDivElement>) {
    const el = e.currentTarget
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 30
    if (atBottom && !scrolledToBottom) setScrolledToBottom(true)
  }

  async function handleAgree() {
    if (!user || !agreed) return
    setSubmitting(true)

    // Get IP address
    let ipAddress = 'unknown'
    try {
      const res = await fetch('https://api.ipify.org?format=json')
      const data = await res.json()
      ipAddress = data.ip
    } catch {
      // continue with unknown IP
    }

    const { error } = await supabase.from('legal_consents').insert({
      user_id: user.id,
      version: LEGAL_VERSION,
      ip_address: ipAddress,
      user_agent: navigator.userAgent,
      signed_at: new Date().toISOString(),
    })

    setSubmitting(false)

    if (error) {
      alert('אירעה שגיאה בשמירת ההסכמה. נסו שנית.')
      return
    }

    await refreshLegalConsent()
    navigate(getDashboardPath(profile?.role))
  }

  return (
    <div dir="rtl" className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-deep-petrol to-[#002a32] px-4 py-10">
      {/* Decorative */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-dusty-aqua/8 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-gold/6 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-2xl"
      >
        <div className="rounded-3xl border border-frost-white/[0.08] bg-white/[0.04] p-8 shadow-2xl backdrop-blur-xl">
          {/* Header */}
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-gold to-warm-gold shadow-lg shadow-gold/25">
              <Shield className="h-8 w-8 text-deep-petrol" />
            </div>
            <h1 className="font-['Frank_Ruhl_Libre',serif] text-2xl font-bold text-frost-white md:text-3xl">
              תנאי שימוש ומדיניות פרטיות
            </h1>
            <p className="mt-2 text-sm text-frost-white/50">
              נא לקרוא בעיון את התנאים הבאים לפני המשך השימוש במערכת
            </p>
          </div>

          {/* Scroll indicator */}
          {!scrolledToBottom && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-3 flex items-center justify-center gap-2 text-xs text-dusty-aqua"
            >
              <ScrollText size={14} />
              גללו עד למטה כדי לאשר
            </motion.div>
          )}

          {/* Scrollable terms */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="mb-6 max-h-[380px] overflow-y-auto rounded-2xl border border-frost-white/[0.06] bg-deep-petrol/60 p-6 text-sm leading-relaxed text-frost-white/70 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-frost-white/10"
          >
            {legalSections.map((section) => (
              <div key={section.title} className="mb-5 last:mb-0">
                <h3 className="mb-2 font-['Frank_Ruhl_Libre',serif] text-base font-semibold text-frost-white">
                  {section.title}
                </h3>
                <p>{section.content}</p>
              </div>
            ))}
          </div>

          {/* Checkbox */}
          <div className="mb-6">
            <label
              className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-all ${
                scrolledToBottom
                  ? 'border-dusty-aqua/30 bg-dusty-aqua/5 hover:bg-dusty-aqua/10'
                  : 'pointer-events-none border-frost-white/[0.06] opacity-40'
              }`}
            >
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                disabled={!scrolledToBottom}
                className="mt-0.5 h-5 w-5 rounded accent-gold"
              />
              <span className="text-sm text-frost-white/80">
                קראתי והבנתי את תנאי השימוש ומדיניות הפרטיות, ואני מסכים/ה להם.
              </span>
            </label>
          </div>

          {/* Submit */}
          <button
            onClick={handleAgree}
            disabled={!agreed || submitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-gold to-warm-gold py-3.5 text-base font-bold text-deep-petrol shadow-lg shadow-gold/20 transition-all hover:shadow-xl hover:shadow-gold/30 hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <CheckCircle2 size={18} />
                אני מאשר/ת והמשך
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  )
}
