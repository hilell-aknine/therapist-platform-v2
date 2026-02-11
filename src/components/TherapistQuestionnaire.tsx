import { useState, useEffect, useRef, type FormEvent, type UIEvent } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Heart,
  IdCard,
  Lightbulb,
  ClipboardCheck,
  FileSignature,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Lock,
  Loader2,
  Eraser,
  MessageCircle,
  Home,
  Target,
  GraduationCap,
  Award,
  Pen,
} from 'lucide-react'
import { supabase } from '../lib/supabase'

/* ------------------------------------------------------------------ */
/*  DATA                                                               */
/* ------------------------------------------------------------------ */

const STORAGE_KEY = 'therapist_form_data'

const targetPopulationOptions = [
  { value: 'soldiers', label: 'חיילים בשירות סדיר' },
  { value: 'reservists', label: 'מילואימניקים' },
  { value: 'families', label: 'משפחות לוחמים' },
  { value: 'bereaved', label: 'משפחות שכולות' },
  { value: 'youth', label: 'נוער וצעירים' },
  { value: 'general', label: 'אוכלוסייה כללית' },
]

const specializationOptions = [
  { value: 'trauma', label: 'טראומה ו-PTSD' },
  { value: 'anxiety', label: 'חרדה ומתח' },
  { value: 'depression', label: 'דיכאון ומצבי רוח' },
  { value: 'relationships', label: 'זוגיות ויחסים' },
  { value: 'grief', label: 'אובדן ואבל' },
  { value: 'stress', label: 'ניהול לחץ ושחיקה' },
  { value: 'self_esteem', label: 'ביטחון עצמי ודימוי עצמי' },
  { value: 'life_transitions', label: 'מעברי חיים ושינויים' },
]

const academicOptions = [
  { value: 'psychology_ba', label: 'תואר ראשון בפסיכולוגיה' },
  { value: 'psychology_ma', label: 'תואר שני בפסיכולוגיה' },
  { value: 'social_work_ba', label: 'תואר ראשון בעבודה סוציאלית' },
  { value: 'social_work_ma', label: 'תואר שני בעבודה סוציאלית' },
  { value: 'clinical_psychologist', label: 'פסיכולוג/ית קליני/ת מוסמך/ת' },
  { value: 'psychiatrist', label: 'פסיכיאטר/ית' },
  { value: 'other_academic', label: 'תואר אקדמי אחר' },
  { value: 'no_academic', label: 'ללא תואר אקדמי' },
]

const classicMethodOptions = [
  { value: 'cbt', label: 'CBT - קוגניטיבי התנהגותי' },
  { value: 'psychodynamic', label: 'פסיכודינמי / פסיכואנליטי' },
  { value: 'emdr', label: 'EMDR' },
  { value: 'dbt', label: 'DBT - דיאלקטי התנהגותי' },
  { value: 'gestalt', label: 'גשטלט' },
  { value: 'existential', label: 'אקזיסטנציאלי / הומניסטי' },
  { value: 'family_therapy', label: 'טיפול משפחתי / זוגי' },
  { value: 'art_therapy', label: 'טיפול באמצעות אמנות' },
  { value: 'psychodrama', label: 'פסיכודרמה' },
  { value: 'trauma_focused', label: 'התמחות בטראומה' },
]

const coachingOptions = [
  { value: 'coaching', label: 'קואצ\'ינג / אימון אישי' },
  { value: 'nlp', label: 'NLP' },
]

const holisticOptions = [
  { value: 'mindfulness', label: 'מיינדפולנס / מדיטציה' },
  { value: 'rebirthing', label: 'ריברסינג / נשימה מעגלית' },
  { value: 'sound_healing', label: 'סאונד הילינג' },
  { value: 'somatic', label: 'סומטי / עבודת גוף' },
  { value: 'yoga_therapy', label: 'יוגה טיפולית' },
  { value: 'other_holistic', label: 'אחר' },
]

const nlpLevelOptions = [
  { value: '', label: 'בחר רמה' },
  { value: 'practitioner', label: 'פרקטישנר' },
  { value: 'master', label: 'מאסטר פרקטישנר' },
  { value: 'trainer', label: 'טריינר' },
]

const legalText = `הסכם הצטרפות, קוד אתי וכתב שיפוי – למטפל/ת

1. מעמד המטפל: מתנדב עצמאי (Independent Volunteer)
1.1 העדר יחסי עובד-מעביד: אני מצהיר/ה כי פעילותי באתר הינה התנדבותית כספק שירות עצמאי. לא יתקיימו ביני ובין האתר יחסי עובד-מעביד מכל סוג שהוא.
1.2 תואר מותר לשימוש: בכל פרסום חיצוני הקשור לפרויקט, ניתן להשתמש בתואר "מטפל/ת שותף/ת בפרויקט מטפל לכל אחד" בלבד.

2. אחריות מקצועית, חוקית ופיזית
2.1 אחריות מקצועית מלאה: כל אחריות על התהליך הטיפולי, לרבות אבחון, בחירת שיטת הטיפול ותוצאותיו, חלה עלי באופן בלעדי.
2.2 חובת הדיווח (Mandatory Reporting): ידוע לי כי חלה עלי חובת דיווח על כל מקרה של סכנה לחיים, פגיעה בקטינים או חסרי ישע. אני מתחייב/ת לפעול בהתאם לחקיקה הישראלית.
2.3 אחריות למקום הטיפול: האחריות לבטיחות ולתנאים במקום הטיפול הינה עלי בלבד. האתר אינו אחראי לנזקים שייגרמו כתוצאה מתנאי המקום.
2.4 הדרכה מקצועית: מומלץ לקיים סופרוויז'ן מקצועי. במידת הצורך, מטפל/ת שותף/ת מוכן/ה לעמוד לרשותי.

3. שמירת רשומות ומחיקת מידע
3.1 מדיניות מחיקה: רישומי מטופלים יימחקו מהמערכת תוך 90 יום מסיום הטיפול. לאחר מחיקה, לא יישמר כל מידע מזהה.
3.2 חובת תיעוד עצמאית: עלי לשמור תיעוד מקצועי באופן עצמאי בהתאם לסטנדרטים המקובלים.

4. חופש פעולה מסחרי וטיפולי
4.1 המשך התקשרות: אין מניעה להמשיך טיפול באופן פרטי עם מטופלים שהופנו דרך הפרויקט, לאחר סיום המסגרת ההתנדבותית.
4.2 קבלת מקורבים: ניתן לטפל גם במקורבים (בני משפחה, חברים) ובלבד שהדבר נעשה בשקיפות.
4.3 סיום התקשרות: ניתן לסיים את ההתנדבות בכל עת, בהתראה סבירה של 30 יום.

5. מדיניות השעיה ובירור
במקרה של תלונות או חשש לפגיעה, יתקיים תהליך בירור הוגן. הפרויקט שומר לעצמו את הזכות להשעות מטפל/ת עד לבירור הסופי.

6. ביטוח ושיפוי
6.1 ביטוח: מומלץ בחום להחזיק ביטוח אחריות מקצועית בתוקף.
6.2 שיפוי (Indemnification): אני מתחייב/ת לשפות את האתר ומפעיליו בגין כל תביעה, נזק, הפסד או הוצאה שינבעו מפעולותיי הטיפוליות.

לפני שחותמים:
הפרויקט הזה נועד לאנשים שרוצים לעבור תהליכי טיפול וריפוי. אדם שיכנס לתהליך שהוא לא באמת זקוק לעזרה הזו - יקח את מקומו של אדם אחר שכן צריך. אנחנו לא רוצים שתוכיחו לנו את מצבכם הכלכלי. אנחנו סומכים עליכם ועל המוסר הנשמתי שלכם.`

const stepsMeta = [
  { icon: IdCard, label: 'פרופיל מקצועי' },
  { icon: Heart, label: 'עומק ומניע' },
  { icon: ClipboardCheck, label: 'בריאות והתחייבות' },
  { icon: FileSignature, label: 'הסכם וחתימה' },
]

/* ------------------------------------------------------------------ */
/*  HELPERS                                                            */
/* ------------------------------------------------------------------ */

function loadSaved(): Record<string, unknown> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch { return {} }
}

function save(data: Record<string, unknown>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

function toggleArray(arr: string[], val: string): string[] {
  return arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]
}

/* ------------------------------------------------------------------ */
/*  SUB-COMPONENTS                                                     */
/* ------------------------------------------------------------------ */

function CheckboxGrid({
  options,
  selected,
  onChange,
}: {
  options: { value: string; label: string }[]
  selected: string[]
  onChange: (v: string[]) => void
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {options.map((opt) => {
        const checked = selected.includes(opt.value)
        return (
          <label
            key={opt.value}
            className={`flex cursor-pointer items-center gap-2 rounded-xl border p-3 text-sm transition-all ${
              checked
                ? 'border-dusty-aqua/40 bg-dusty-aqua/10 text-frost-white'
                : 'border-frost-white/[0.06] bg-white/[0.02] text-frost-white/60 hover:bg-white/[0.04]'
            }`}
          >
            <input
              type="checkbox"
              checked={checked}
              onChange={() => onChange(toggleArray(selected, opt.value))}
              className="h-4 w-4 rounded accent-dusty-aqua"
            />
            {opt.label}
          </label>
        )
      })}
    </div>
  )
}

function RadioCards({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string; desc: string }[]
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {options.map((opt) => {
        const checked = value === opt.value
        return (
          <label
            key={opt.value}
            className={`flex cursor-pointer flex-col items-center gap-1 rounded-xl border p-4 text-center transition-all ${
              checked
                ? 'border-gold/40 bg-gold/10 shadow-md shadow-gold/10'
                : 'border-frost-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04]'
            }`}
          >
            <input
              type="radio"
              checked={checked}
              onChange={() => onChange(opt.value)}
              className="sr-only"
            />
            <span className={`text-base font-semibold ${checked ? 'text-gold' : 'text-frost-white'}`}>
              {opt.label}
            </span>
            <span className="text-xs text-frost-white/40">{opt.desc}</span>
          </label>
        )
      })}
    </div>
  )
}

function YesNo({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="flex gap-3">
      {[
        { v: 'no', label: 'לא' },
        { v: 'yes', label: 'כן' },
      ].map((opt) => (
        <label
          key={opt.v}
          className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border py-3 text-sm font-medium transition-all ${
            value === opt.v
              ? 'border-dusty-aqua/40 bg-dusty-aqua/10 text-dusty-aqua'
              : 'border-frost-white/[0.06] bg-white/[0.02] text-frost-white/50 hover:bg-white/[0.04]'
          }`}
        >
          <input
            type="radio"
            checked={value === opt.v}
            onChange={() => onChange(opt.v)}
            className="sr-only"
          />
          {opt.label}
        </label>
      ))}
    </div>
  )
}

function Toast({ message, visible }: { message: string; visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          className="fixed top-4 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-red-500/90 px-5 py-3 text-sm font-medium text-white shadow-lg backdrop-blur-sm"
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ------------------------------------------------------------------ */
/*  MAIN COMPONENT                                                     */
/* ------------------------------------------------------------------ */

export default function TherapistQuestionnaire() {
  const [step, setStep] = useState(0)
  const [toast, setToast] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  // Step 1 fields
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [gender, setGender] = useState('')
  const [city, setCity] = useState('')
  const [targetPopulation, setTargetPopulation] = useState<string[]>([])
  const [specialization, setSpecialization] = useState<string[]>([])
  const [academicDegree, setAcademicDegree] = useState<string[]>([])
  const [licenseNumber, setLicenseNumber] = useState('')
  const [practiceStartYear, setPracticeStartYear] = useState('')
  const [therapyMethods, setTherapyMethods] = useState<string[]>([])
  const [nlpLevel, setNlpLevel] = useState('')
  const [educationDetails, setEducationDetails] = useState('')
  const [totalPatients, setTotalPatients] = useState('')
  const [activePatients, setActivePatients] = useState('')
  const [socialLink, setSocialLink] = useState('')

  // Step 2 fields
  const [qWhy, setQWhy] = useState('')
  const [qJoin, setQJoin] = useState('')
  const [qExperience, setQExperience] = useState('')
  const [qCaseStudy, setQCaseStudy] = useState('')
  const [qChallenges, setQChallenges] = useState('')

  // Step 3 fields
  const [hasMedical, setHasMedical] = useState('no')
  const [medicalDetails, setMedicalDetails] = useState('')
  const [takesMeds, setTakesMeds] = useState('no')
  const [inTherapy, setInTherapy] = useState('no')
  const [monthlyHours, setMonthlyHours] = useState('')
  const [commitmentDuration, setCommitmentDuration] = useState('')
  const [therapyMode, setTherapyMode] = useState('')

  // Step 4 fields
  const [scrolledTerms, setScrolledTerms] = useState(false)
  const [hasInsurance, setHasInsurance] = useState(false)
  const [acceptsResponsibility, setAcceptsResponsibility] = useState(false)
  const [waiverConfirmed, setWaiverConfirmed] = useState(false)
  const [hasSignature, setHasSignature] = useState(false)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const drawingRef = useRef(false)

  // Load saved data on mount
  useEffect(() => {
    const d = loadSaved() as Record<string, string | string[]>
    if (d.full_name) setFullName(d.full_name as string)
    if (d.phone) setPhone(d.phone as string)
    if (d.email) setEmail(d.email as string)
    if (d.birth_date) setBirthDate(d.birth_date as string)
    if (d.gender) setGender(d.gender as string)
    if (d.city) setCity(d.city as string)
    if (d.target_population) setTargetPopulation(d.target_population as string[])
    if (d.specialization) setSpecialization(d.specialization as string[])
    if (d.academic_degree) setAcademicDegree(d.academic_degree as string[])
    if (d.license_number) setLicenseNumber(d.license_number as string)
    if (d.practice_start_year) setPracticeStartYear(d.practice_start_year as string)
    if (d.therapy_methods) setTherapyMethods(d.therapy_methods as string[])
    if (d.nlp_level) setNlpLevel(d.nlp_level as string)
    if (d.education_details) setEducationDetails(d.education_details as string)
    if (d.total_patients) setTotalPatients(d.total_patients as string)
    if (d.active_patients) setActivePatients(d.active_patients as string)
    if (d.social_link) setSocialLink(d.social_link as string)
    if (d.q_why) setQWhy(d.q_why as string)
    if (d.q_join) setQJoin(d.q_join as string)
    if (d.q_experience) setQExperience(d.q_experience as string)
    if (d.q_case_study) setQCaseStudy(d.q_case_study as string)
    if (d.q_challenges) setQChallenges(d.q_challenges as string)
    if (d.has_medical) setHasMedical(d.has_medical as string)
    if (d.medical_details) setMedicalDetails(d.medical_details as string)
    if (d.takes_meds) setTakesMeds(d.takes_meds as string)
    if (d.in_therapy) setInTherapy(d.in_therapy as string)
    if (d.monthly_hours) setMonthlyHours(d.monthly_hours as string)
    if (d.commitment_duration) setCommitmentDuration(d.commitment_duration as string)
    if (d.therapy_mode) setTherapyMode(d.therapy_mode as string)
  }, [])

  // Save all fields whenever they change
  useEffect(() => {
    if (step === 0) return
    save({
      full_name: fullName, phone, email, birth_date: birthDate, gender, city,
      target_population: targetPopulation, specialization, academic_degree: academicDegree,
      license_number: licenseNumber, practice_start_year: practiceStartYear,
      therapy_methods: therapyMethods, nlp_level: nlpLevel, education_details: educationDetails,
      total_patients: totalPatients, active_patients: activePatients, social_link: socialLink,
      q_why: qWhy, q_join: qJoin, q_experience: qExperience, q_case_study: qCaseStudy, q_challenges: qChallenges,
      has_medical: hasMedical, medical_details: medicalDetails, takes_meds: takesMeds, in_therapy: inTherapy,
      monthly_hours: monthlyHours, commitment_duration: commitmentDuration, therapy_mode: therapyMode,
    })
  }, [step, fullName, phone, email, birthDate, gender, city, targetPopulation, specialization,
    academicDegree, licenseNumber, practiceStartYear, therapyMethods, nlpLevel, educationDetails,
    totalPatients, activePatients, socialLink, qWhy, qJoin, qExperience, qCaseStudy, qChallenges,
    hasMedical, medicalDetails, takesMeds, inTherapy, monthlyHours, commitmentDuration, therapyMode])

  // Signature canvas setup
  useEffect(() => {
    if (step !== 4) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = canvas.offsetWidth * 2
    canvas.height = 300
    ctx.scale(2, 2)
    ctx.strokeStyle = '#E8F1F2'
    ctx.lineWidth = 2
    ctx.lineCap = 'round'

    function getPos(e: MouseEvent | TouchEvent) {
      const rect = canvas!.getBoundingClientRect()
      const t = 'touches' in e ? e.touches[0] : e
      return { x: t.clientX - rect.left, y: t.clientY - rect.top }
    }

    function onDown(e: MouseEvent | TouchEvent) {
      e.preventDefault()
      drawingRef.current = true
      const { x, y } = getPos(e)
      ctx!.beginPath()
      ctx!.moveTo(x, y)
    }
    function onMove(e: MouseEvent | TouchEvent) {
      if (!drawingRef.current) return
      e.preventDefault()
      const { x, y } = getPos(e)
      ctx!.lineTo(x, y)
      ctx!.stroke()
      setHasSignature(true)
    }
    function onUp() { drawingRef.current = false }

    canvas.addEventListener('mousedown', onDown)
    canvas.addEventListener('mousemove', onMove)
    canvas.addEventListener('mouseup', onUp)
    canvas.addEventListener('mouseleave', onUp)
    canvas.addEventListener('touchstart', onDown, { passive: false })
    canvas.addEventListener('touchmove', onMove, { passive: false })
    canvas.addEventListener('touchend', onUp)

    return () => {
      canvas.removeEventListener('mousedown', onDown)
      canvas.removeEventListener('mousemove', onMove)
      canvas.removeEventListener('mouseup', onUp)
      canvas.removeEventListener('mouseleave', onUp)
      canvas.removeEventListener('touchstart', onDown)
      canvas.removeEventListener('touchmove', onMove)
      canvas.removeEventListener('touchend', onUp)
    }
  }, [step])

  function clearSignature() {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setHasSignature(false)
  }

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  function validateStep1(): boolean {
    if (!fullName.trim()) { showToast('נא למלא שם מלא'); return false }
    if (!phone.trim()) { showToast('נא למלא טלפון'); return false }
    if (!email.trim()) { showToast('נא למלא אימייל'); return false }
    if (!practiceStartYear) { showToast('נא למלא שנת תחילת עיסוק'); return false }
    if (targetPopulation.length === 0) { showToast('נא לבחור לפחות אוכלוסייה אחת'); return false }
    if (specialization.length === 0) { showToast('נא לבחור לפחות תחום התמחות אחד'); return false }
    return true
  }

  function validateStep2(): boolean {
    if (!qWhy.trim()) { showToast('נא לענות על שאלת ה"למה"'); return false }
    if (!qJoin.trim()) { showToast('נא לענות למה הצטרפת לפרויקט'); return false }
    return true
  }

  function validateStep3(): boolean {
    if (!monthlyHours) { showToast('נא לבחור שעות חודשיות'); return false }
    if (!commitmentDuration) { showToast('נא לבחור תקופת התחייבות'); return false }
    if (!therapyMode) { showToast('נא לבחור אופן טיפול'); return false }
    return true
  }

  function next() {
    if (step === 1 && !validateStep1()) return
    if (step === 2 && !validateStep2()) return
    if (step === 3 && !validateStep3()) return
    setStep((s) => s + 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function back() {
    setStep((s) => s - 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleTermsScroll(e: UIEvent<HTMLDivElement>) {
    const el = e.currentTarget
    if (el.scrollHeight - el.scrollTop - el.clientHeight < 20) {
      setScrolledTerms(true)
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!hasInsurance || !acceptsResponsibility || !waiverConfirmed) {
      showToast('נא לאשר את כל התנאים')
      return
    }
    if (!hasSignature) {
      showToast('נא לחתום')
      return
    }

    setSubmitting(true)

    const signatureData = canvasRef.current?.toDataURL('image/png') || ''
    const currentYear = new Date().getFullYear()
    const experienceYears = practiceStartYear ? currentYear - parseInt(practiceStartYear) : 0

    const worksOnline = therapyMode === 'zoom' || therapyMode === 'hybrid'
    const worksInPerson = therapyMode === 'clinic' || therapyMode === 'hybrid'

    const payload = {
      full_name: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      city: city.trim(),
      birth_date: birthDate || null,
      gender: gender || null,
      specialization: specialization.join(', '),
      experience_years: experienceYears,
      license_number: licenseNumber.trim() || null,
      education_details: educationDetails.trim() || null,
      social_link: socialLink.trim() || null,
      works_online: worksOnline,
      works_in_person: worksInPerson,
      available_hours_per_week: monthlyHours ? Math.round(parseInt(monthlyHours) / 4) : null,
      signature_data: signatureData,
      status: 'pending',
      terms_confirmed: true,
      documents_verified: false,
      questionnaire: {
        target_population: targetPopulation,
        specializations: specialization,
        academic_degrees: academicDegree,
        therapy_methods: therapyMethods,
        nlp_level: nlpLevel || null,
        practice_start_year: practiceStartYear,
        total_patients_estimate: totalPatients ? parseInt(totalPatients) : null,
        current_active_patients: activePatients ? parseInt(activePatients) : null,
        why_profession: qWhy,
        why_join: qJoin,
        experience: qExperience,
        case_study: qCaseStudy,
        challenges: qChallenges,
        health: {
          has_medical_issues: hasMedical === 'yes',
          medical_issues_details: medicalDetails,
          takes_psychiatric_meds: takesMeds === 'yes',
          in_personal_therapy: inTherapy === 'yes',
        },
        commitment: {
          monthly_hours: monthlyHours,
          duration: commitmentDuration,
          therapy_mode: therapyMode,
        },
        legal: {
          has_insurance: hasInsurance,
          accepts_responsibility: acceptsResponsibility,
          waiver_confirmed: waiverConfirmed,
          scrolled_terms: scrolledTerms,
          signed_at: new Date().toISOString(),
        },
      },
    }

    const { error } = await supabase.from('therapists').insert(payload)
    setSubmitting(false)

    if (error) {
      showToast('שגיאה בשליחה: ' + error.message)
      return
    }

    localStorage.removeItem(STORAGE_KEY)
    setDone(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  /* ------------------------------------------------------------------ */
  /*  RENDER                                                             */
  /* ------------------------------------------------------------------ */

  if (done) {
    return (
      <div dir="rtl" className="flex min-h-screen items-center justify-center bg-gradient-to-b from-deep-petrol to-[#002a32] px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md text-center"
        >
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/25">
            <CheckCircle2 className="h-10 w-10 text-white" />
          </div>
          <h2 className="mb-3 font-['Frank_Ruhl_Libre',serif] text-3xl font-bold text-frost-white">
            הבקשה נשלחה בהצלחה!
          </h2>
          <p className="mb-6 text-frost-white/60">
            פרטיך התקבלו. אנו נבחן את הבקשה ונחזור אליך בהקדם לאישור הצטרפות לקהילה.
          </p>
          <p className="mb-6 text-sm text-frost-white/40">
            כעת יש לשלוח את המסמכים לאימות:
          </p>
          <div className="flex flex-col gap-3">
            <a
              href="https://wa.me/972000000000?text=%D7%A9%D7%9C%D7%95%D7%9D%2C%20%D7%90%D7%A0%D7%99%20%D7%A8%D7%95%D7%A6%D7%94%20%D7%9C%D7%A9%D7%9C%D7%95%D7%97%20%D7%9E%D7%A1%D7%9E%D7%9B%D7%99%D7%9D%20%D7%9C%D7%90%D7%99%D7%9E%D7%95%D7%AA"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3.5 text-base font-semibold text-white transition-all hover:bg-emerald-500"
            >
              <MessageCircle size={20} />
              שלח מסמכים בוואטסאפ
            </a>
            <Link
              to="/"
              className="flex items-center justify-center gap-2 rounded-xl border border-frost-white/10 px-5 py-3 text-sm text-frost-white/60 transition-colors hover:bg-white/[0.04]"
            >
              <Home size={16} />
              חזרה לדף הבית
            </Link>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-b from-deep-petrol to-[#002a32]">
      <Toast message={toast} visible={!!toast} />

      {/* Header */}
      <header className="bg-gradient-to-l from-deep-petrol via-muted-teal/30 to-deep-petrol py-5 text-center">
        <Link to="/" className="mb-2 inline-flex items-center gap-2">
          <Heart className="h-5 w-5 text-gold" fill="currentColor" />
          <span className="font-['Frank_Ruhl_Libre',serif] text-base font-bold text-frost-white">
            מטפל לכל אחד
          </span>
        </Link>
        <p className="text-sm text-frost-white/50">הצטרפות למאגר המטפלים</p>
      </header>

      {/* Progress bar — visible from step 1 */}
      {step >= 1 && (
        <div className="mx-auto flex max-w-md items-center justify-center gap-2 px-4 py-4">
          {stepsMeta.map((s, i) => {
            const stepNum = i + 1
            const isCompleted = step > stepNum
            const isActive = step === stepNum
            return (
              <div key={s.label} className="flex flex-1 flex-col items-center gap-1">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-all ${
                    isCompleted
                      ? 'bg-gradient-to-br from-gold to-warm-gold text-deep-petrol'
                      : isActive
                      ? 'border-2 border-gold bg-gold/10 text-gold'
                      : 'border border-frost-white/10 bg-white/[0.03] text-frost-white/30'
                  }`}
                >
                  {isCompleted ? '✓' : stepNum}
                </div>
                <span className={`text-[10px] ${isActive || isCompleted ? 'text-frost-white/70' : 'text-frost-white/30'}`}>
                  {s.label}
                </span>
              </div>
            )
          })}
        </div>
      )}

      {/* Content */}
      <div className="mx-auto max-w-2xl px-4 pb-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
          >
            {/* ========== STEP 0: INTRO ========== */}
            {step === 0 && (
              <div className="mt-8 text-center">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-gold to-warm-gold shadow-xl shadow-gold/25"
                >
                  <Heart className="h-9 w-9 text-deep-petrol" />
                </motion.div>
                <h1 className="mb-4 font-['Frank_Ruhl_Libre',serif] text-3xl font-bold text-frost-white md:text-4xl">
                  רוצה להפיץ את האור?
                </h1>
                <p className="mx-auto mb-6 max-w-md text-frost-white/60">
                  הצטרף לצוות של מטפלים מקצועיים שמאמינים שטיפול נפשי הוא זכות בסיסית. התהליך קצר ופשוט.
                </p>

                <div className="mx-auto mb-8 grid max-w-sm grid-cols-2 gap-3 text-sm">
                  {stepsMeta.map((s, i) => {
                    const Icon = s.icon
                    return (
                      <div
                        key={s.label}
                        className="flex items-center gap-2 rounded-xl border border-frost-white/[0.06] bg-white/[0.03] p-3 text-frost-white/60"
                      >
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gold/10 text-xs font-bold text-gold">
                          {i + 1}
                        </span>
                        {s.label}
                      </div>
                    )
                  })}
                </div>

                <p className="mb-6 text-xs text-frost-white/30">כ-10 דקות למילוי מלא</p>

                <button
                  onClick={next}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-l from-gold to-warm-gold px-8 py-3.5 text-base font-bold text-deep-petrol shadow-lg shadow-gold/20 transition-all hover:shadow-xl hover:brightness-110"
                >
                  התחל תהליך הצטרפות
                  <ArrowLeft size={18} />
                </button>

                <div className="mt-4">
                  <Link to="/" className="text-sm text-frost-white/30 hover:text-frost-white/50">
                    חזרה לאתר
                  </Link>
                </div>
              </div>
            )}

            {/* ========== STEP 1: PROFESSIONAL PROFILE ========== */}
            {step === 1 && (
              <div className="space-y-6">
                <SectionHeader icon={IdCard} title="פרופיל מקצועי" subtitle="נתחיל בפרטים הבסיסיים והרקע המקצועי שלך" />

                <InfoBox text="כל המידע שתמסור/י ישמר בסודיות מלאה ומשמש אך ורק להתאמת מטופלים." />

                {/* Personal details */}
                <div className="space-y-4">
                  <Field label="שם מלא *" value={fullName} onChange={setFullName} placeholder="שם פרטי ומשפחה" />
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="טלפון *" value={phone} onChange={setPhone} placeholder="050-0000000" type="tel" />
                    <Field label="אימייל *" value={email} onChange={setEmail} placeholder="your@email.com" type="email" dir="ltr" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="תאריך לידה" value={birthDate} onChange={setBirthDate} type="date" />
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-frost-white/70">מגדר</label>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="w-full rounded-xl border-2 border-frost-white/10 bg-white/[0.06] px-4 py-3 text-sm text-frost-white focus:border-dusty-aqua/50 focus:outline-none"
                      >
                        <option value="" className="bg-deep-petrol">בחר/י</option>
                        <option value="male" className="bg-deep-petrol">זכר</option>
                        <option value="female" className="bg-deep-petrol">נקבה</option>
                        <option value="other" className="bg-deep-petrol">אחר</option>
                      </select>
                    </div>
                  </div>
                  <Field label="עיר מגורים" value={city} onChange={setCity} placeholder="תל אביב" />
                </div>

                {/* Target Population */}
                <Divider icon={Target} text="התמחות ואוכלוסיית יעד" />
                <div>
                  <label className="mb-2 block text-sm font-medium text-frost-white/70">
                    באילו אוכלוסיות את/ה מתמחה? (ניתן לבחור מספר) *
                  </label>
                  <CheckboxGrid options={targetPopulationOptions} selected={targetPopulation} onChange={setTargetPopulation} />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-frost-white/70">
                    תחומי התמחות עיקריים (ניתן לבחור מספר) *
                  </label>
                  <CheckboxGrid options={specializationOptions} selected={specialization} onChange={setSpecialization} />
                </div>

                {/* Academic */}
                <Divider icon={GraduationCap} text="השכלה אקדמית" />
                <div>
                  <label className="mb-2 block text-sm font-medium text-frost-white/70">
                    תארים אקדמיים (סמן/י את כל הרלוונטיים)
                  </label>
                  <CheckboxGrid options={academicOptions} selected={academicDegree} onChange={setAcademicDegree} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="מספר רישיון (אם יש)" value={licenseNumber} onChange={setLicenseNumber} placeholder="אופציונלי" />
                  <Field label="שנת תחילת עיסוק *" value={practiceStartYear} onChange={setPracticeStartYear} placeholder="2015" type="number" />
                </div>

                {/* Therapy Methods */}
                <Divider icon={Award} text="הכשרות וגישות טיפוליות" />
                <div>
                  <label className="mb-2 block text-sm font-medium text-frost-white/70">
                    גישות פסיכותרפיות קלאסיות
                  </label>
                  <CheckboxGrid options={classicMethodOptions} selected={therapyMethods} onChange={setTherapyMethods} />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-frost-white/70">קואצ'ינג ו-NLP</label>
                  <CheckboxGrid options={coachingOptions} selected={therapyMethods} onChange={setTherapyMethods} />
                  {therapyMethods.includes('nlp') && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-2">
                      <select
                        value={nlpLevel}
                        onChange={(e) => setNlpLevel(e.target.value)}
                        className="w-full rounded-xl border-2 border-frost-white/10 bg-white/[0.06] px-4 py-3 text-sm text-frost-white focus:border-dusty-aqua/50 focus:outline-none"
                      >
                        {nlpLevelOptions.map((opt) => (
                          <option key={opt.value} value={opt.value} className="bg-deep-petrol">{opt.label}</option>
                        ))}
                      </select>
                    </motion.div>
                  )}
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-frost-white/70">גישות גוף-נפש והוליסטיות</label>
                  <CheckboxGrid options={holisticOptions} selected={therapyMethods} onChange={setTherapyMethods} />
                </div>

                <Field label="פירוט נוסף על ההכשרות" value={educationDetails} onChange={setEducationDetails} placeholder="מכונים, קורסים, התמחויות מיוחדות..." multiline />
                <div className="grid grid-cols-2 gap-4">
                  <Field label="כמה מטופלים עברו אצלך?" value={totalPatients} onChange={setTotalPatients} placeholder="100" type="number" />
                  <Field label="מטופלים פעילים כיום" value={activePatients} onChange={setActivePatients} placeholder="10" type="number" />
                </div>
                <Field label="נוכחות דיגיטלית (לינקדאין, אתר)" value={socialLink} onChange={setSocialLink} placeholder="https://linkedin.com/in/..." dir="ltr" />

                <NavButtons onNext={next} />
              </div>
            )}

            {/* ========== STEP 2: DEPTH & MOTIVATION ========== */}
            {step === 2 && (
              <div className="space-y-6">
                <SectionHeader icon={Heart} title="עומק ומניע" subtitle="נשמח להכיר אותך קצת יותר לעומק" />

                <InfoBox text="השאלות הבאות עוזרות לנו להכיר אותך טוב יותר ולהתאים לך מטופלים בצורה מיטבית." icon="lightbulb" />

                <QuestionCard number={1} title="ה&quot;למה&quot; שלך" label="למה בחרת במקצוע הטיפול? מהו הדבר שאת/ה הכי אוהב/ת במקצוע? *" value={qWhy} onChange={setQWhy} placeholder="ספר/י לנו על המוטיבציה שלך, מה מניע אותך..." />
                <QuestionCard number={2} title="הטריגר" label="למה בחרת להצטרף לפרויקט 'מטפל לכל אחד' דווקא עכשיו? *" value={qJoin} onChange={setQJoin} placeholder="מה הביא אותך אלינו? מה את/ה מקווה לתרום ולקבל?" />
                <QuestionCard number={3} title="ניסיון מעשי" label="ספר/י בהרחבה על הניסיון שלך" value={qExperience} onChange={setQExperience} placeholder="תאר/י את הניסיון המקצועי שלך בקליניקה..." hint="סוגי מטופלים, תחומי התמחות, הצלחות מיוחדות" />
                <QuestionCard number={4} title="Case Study" label="תאר/י בקצרה מקרה מורכב מהקליניקה ואיך התמודדת איתו" value={qCaseStudy} onChange={setQCaseStudy} placeholder="מה היה האתגר? איזו גישה בחרת? מה למדת?" hint="ללא פרטים מזהים" />
                <QuestionCard number={5} title="אתגרים" label="מהם האתגרים הגדולים שלך כמטפל/ת?" value={qChallenges} onChange={setQChallenges} placeholder="אתגרים מקצועיים, רגשיים, לוגיסטיים..." />

                <NavButtons onBack={back} onNext={next} />
              </div>
            )}

            {/* ========== STEP 3: HEALTH & COMMITMENT ========== */}
            {step === 3 && (
              <div className="space-y-6">
                <SectionHeader icon={ClipboardCheck} title="בריאות והתחייבות" subtitle="כמה שאלות קצרות לפני שנתקדם להסכם" />

                <Divider icon={Heart} text="הצהרת בריאות" />
                <InfoBox text="המידע הבא נשמר בסודיות מוחלטת ומשמש רק להתאמה מיטבית." />

                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-frost-white/70">
                      האם ישנן בעיות רפואיות המונעות ממך מתן טיפול?
                    </label>
                    <YesNo value={hasMedical} onChange={setHasMedical} />
                    {hasMedical === 'yes' && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-3">
                        <textarea
                          value={medicalDetails}
                          onChange={(e) => setMedicalDetails(e.target.value)}
                          placeholder="תיאור הבעיה הרפואית..."
                          rows={3}
                          className="w-full rounded-xl border-2 border-frost-white/10 bg-white/[0.06] px-4 py-3 text-sm text-frost-white placeholder:text-frost-white/30 focus:border-dusty-aqua/50 focus:outline-none"
                        />
                      </motion.div>
                    )}
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-frost-white/70">
                      האם את/ה נוטל/ת תרופות פסיכיאטריות?
                    </label>
                    <YesNo value={takesMeds} onChange={setTakesMeds} />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-frost-white/70">
                      האם את/ה נמצא/ת בטיפול בעצמך?
                    </label>
                    <YesNo value={inTherapy} onChange={setInTherapy} />
                  </div>
                </div>

                <Divider icon={ClipboardCheck} text="התחייבות לפרויקט" />

                <div>
                  <label className="mb-2 block text-sm font-medium text-frost-white/70">
                    כמה שעות טיפול בחודש תוכל/י להקדיש? *
                  </label>
                  <RadioCards
                    options={[
                      { value: '10', label: '10 שעות', desc: 'מינימום' },
                      { value: '15', label: '15 שעות', desc: 'מומלץ' },
                      { value: '20', label: '20+ שעות', desc: 'מקסימום' },
                    ]}
                    value={monthlyHours}
                    onChange={setMonthlyHours}
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-frost-white/70">תקופת התחייבות *</label>
                  <select
                    value={commitmentDuration}
                    onChange={(e) => setCommitmentDuration(e.target.value)}
                    className="w-full rounded-xl border-2 border-frost-white/10 bg-white/[0.06] px-4 py-3 text-sm text-frost-white focus:border-dusty-aqua/50 focus:outline-none"
                  >
                    <option value="" className="bg-deep-petrol">בחר/י...</option>
                    <option value="6" className="bg-deep-petrol">6 חודשים (מינימום)</option>
                    <option value="12" className="bg-deep-petrol">שנה</option>
                    <option value="24" className="bg-deep-petrol">שנתיים</option>
                    <option value="unlimited" className="bg-deep-petrol">ללא הגבלה</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-frost-white/70">אופן הטיפול המועדף *</label>
                  <RadioCards
                    options={[
                      { value: 'zoom', label: 'זום', desc: 'טיפול מרחוק' },
                      { value: 'clinic', label: 'קליניקה', desc: 'פנים אל פנים' },
                      { value: 'hybrid', label: 'משולב', desc: 'גמיש' },
                    ]}
                    value={therapyMode}
                    onChange={setTherapyMode}
                  />
                </div>

                <NavButtons onBack={back} onNext={next} nextLabel="המשך לחתימה" />
              </div>
            )}

            {/* ========== STEP 4: AGREEMENT & SIGNATURE ========== */}
            {step === 4 && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <SectionHeader icon={FileSignature} title="הסכם הצטרפות" subtitle="נא לקרוא את ההסכם בעיון לפני חתימה" />

                {/* Scrollable terms */}
                {!scrolledTerms && (
                  <p className="flex items-center justify-center gap-2 text-xs text-dusty-aqua animate-pulse">
                    <ArrowLeft size={14} className="rotate-90" />
                    גלול/י למטה כדי לקרוא את כל ההסכם ולאפשר חתימה
                  </p>
                )}

                <div
                  onScroll={handleTermsScroll}
                  className="max-h-[350px] overflow-y-auto rounded-2xl border border-frost-white/[0.06] bg-deep-petrol/60 p-6 text-sm leading-relaxed text-frost-white/60 whitespace-pre-line"
                >
                  {legalText}
                </div>

                {/* Checkboxes — locked until scrolled */}
                <div className={`space-y-3 transition-all ${scrolledTerms ? '' : 'pointer-events-none opacity-40'}`}>
                  <LegalCheckbox
                    checked={hasInsurance}
                    onChange={setHasInsurance}
                    label="אני מאשר/ת שיש ברשותי ביטוח אחריות מקצועית בתוקף *"
                  />
                  <LegalCheckbox
                    checked={acceptsResponsibility}
                    onChange={setAcceptsResponsibility}
                    label="אני מבין/ה שכל האחריות המקצועית, החוקית (דיווח) והתיעודית היא עלי בלבד *"
                  />
                  <LegalCheckbox
                    checked={waiverConfirmed}
                    onChange={setWaiverConfirmed}
                    label="אני משחרר/ת את האתר מכל אחריות לטיפול או לתוצאותיו *"
                  />
                </div>

                {/* Signature */}
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-medium text-frost-white/70">
                    <Pen size={14} className="text-gold" />
                    חתימה דיגיטלית *
                  </label>
                  <div className="relative overflow-hidden rounded-2xl border-2 border-dashed border-frost-white/10 bg-white/[0.03]">
                    <canvas
                      ref={canvasRef}
                      className="h-[150px] w-full cursor-crosshair touch-none"
                    />
                    {!hasSignature && (
                      <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-frost-white/20">
                        <Pen size={20} className="ml-2" />
                        חתום/י כאן
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={clearSignature}
                    className="mt-2 flex items-center gap-1 text-xs text-frost-white/40 hover:text-frost-white/60"
                  >
                    <Eraser size={13} />
                    נקה חתימה
                  </button>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={submitting || !hasInsurance || !acceptsResponsibility || !waiverConfirmed || !hasSignature}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-gold to-warm-gold py-3.5 text-base font-bold text-deep-petrol shadow-lg shadow-gold/20 transition-all hover:shadow-xl hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      שליחת הבקשה
                      <ArrowLeft size={18} />
                    </>
                  )}
                </button>

                <p className="flex items-center justify-center gap-1.5 text-xs text-frost-white/30">
                  <Lock size={12} />
                  כל המידע נשמר בסודיות מוחלטת
                </p>

                <div className="text-center">
                  <button type="button" onClick={back} className="text-sm text-frost-white/30 hover:text-frost-white/50">
                    <ArrowRight size={14} className="ml-1 inline" />
                    חזרה לשלב הקודם
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  SMALL HELPER COMPONENTS                                            */
/* ------------------------------------------------------------------ */

function SectionHeader({ icon: Icon, title, subtitle }: { icon: typeof Heart; title: string; subtitle: string }) {
  return (
    <div className="pt-4 text-center">
      <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-gold to-warm-gold shadow-lg shadow-gold/25">
        <Icon className="h-6 w-6 text-deep-petrol" />
      </div>
      <h2 className="font-['Frank_Ruhl_Libre',serif] text-2xl font-bold text-frost-white">{title}</h2>
      <p className="mt-1 text-sm text-frost-white/50">{subtitle}</p>
    </div>
  )
}

function InfoBox({ text, icon }: { text: string; icon?: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-dusty-aqua/20 bg-dusty-aqua/5 p-4 text-sm text-frost-white/60">
      {icon === 'lightbulb' ? <Lightbulb size={18} className="mt-0.5 flex-shrink-0 text-gold" /> : <Lock size={16} className="mt-0.5 flex-shrink-0 text-dusty-aqua" />}
      {text}
    </div>
  )
}

function Divider({ icon: Icon, text }: { icon: typeof Heart; text: string }) {
  return (
    <div className="flex items-center gap-3 pt-2">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold/10">
        <Icon size={16} className="text-gold" />
      </div>
      <span className="text-sm font-semibold text-frost-white/80">{text}</span>
      <div className="h-px flex-1 bg-frost-white/[0.06]" />
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  multiline,
  dir,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
  multiline?: boolean
  dir?: string
}) {
  const cls = 'w-full rounded-xl border-2 border-frost-white/10 bg-white/[0.06] px-4 py-3 text-sm text-frost-white placeholder:text-frost-white/30 transition-all focus:border-dusty-aqua/50 focus:outline-none'
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-frost-white/70">{label}</label>
      {multiline ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={3} className={cls} dir={dir} />
      ) : (
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={cls} dir={dir} />
      )}
    </div>
  )
}

function QuestionCard({
  number,
  title,
  label,
  value,
  onChange,
  placeholder,
  hint,
}: {
  number: number
  title: string
  label: string
  value: string
  onChange: (v: string) => void
  placeholder: string
  hint?: string
}) {
  return (
    <div className="rounded-2xl border border-frost-white/[0.06] bg-white/[0.03] p-5">
      <div className="mb-3 flex items-center gap-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-gold to-warm-gold text-sm font-bold text-deep-petrol">
          {number}
        </span>
        <h3 className="font-['Frank_Ruhl_Libre',serif] text-base font-semibold text-frost-white">{title}</h3>
      </div>
      <label className="mb-1 block text-sm text-frost-white/70">{label}</label>
      {hint && <p className="mb-2 text-xs text-frost-white/40">{hint}</p>}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={4}
        className="w-full rounded-xl border-2 border-frost-white/10 bg-white/[0.06] px-4 py-3 text-sm text-frost-white placeholder:text-frost-white/30 transition-all focus:border-dusty-aqua/50 focus:outline-none"
      />
    </div>
  )
}

function LegalCheckbox({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-all ${
      checked ? 'border-dusty-aqua/30 bg-dusty-aqua/5' : 'border-frost-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04]'
    }`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-5 w-5 rounded accent-gold"
      />
      <span className="text-sm text-frost-white/70">{label}</span>
    </label>
  )
}

function NavButtons({
  onBack,
  onNext,
  nextLabel = 'המשך לשלב הבא',
}: {
  onBack?: () => void
  onNext: () => void
  nextLabel?: string
}) {
  return (
    <div className="flex items-center gap-3 pt-4">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 rounded-xl border border-frost-white/10 px-5 py-3 text-sm text-frost-white/50 transition-colors hover:bg-white/[0.04]"
        >
          <ArrowRight size={16} />
          חזרה
        </button>
      )}
      <button
        type="button"
        onClick={onNext}
        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-gold to-warm-gold py-3 text-sm font-bold text-deep-petrol shadow-lg shadow-gold/20 transition-all hover:shadow-xl hover:brightness-110"
      >
        {nextLabel}
        <ArrowLeft size={16} />
      </button>
    </div>
  )
}
