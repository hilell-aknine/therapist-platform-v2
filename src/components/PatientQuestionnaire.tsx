import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Heart, ArrowLeft, ArrowRight, Check, Lock, User,
  Users, MessageSquare, FileSignature, HandHeart,
  Video, Building, ArrowLeftRight, Minus, Plus,
  Stethoscope, Brain, ChevronDown,
} from 'lucide-react'
import { supabase } from '../lib/supabase'

// ==========================================
// Types
// ==========================================
interface SiblingDetail {
  name: string
  relationship: string
}

interface FormData {
  full_name: string
  phone: string
  email: string
  birth_date: string
  gender: string
  city: string
  marital_status: string
  occupation: string
  military_service: string
  military_role: string
  social_network: string
  social_username: string
  main_reason: string
  mother_name: string
  mother_relationship: string
  father_name: string
  father_relationship: string
  siblings_count: number
  siblings_details: SiblingDetail[]
  early_memory: string
  open_space: string
  previous_therapy_history: string
  why_now: string
  fears: string
  expectations: string
  chronic_issues: string
  medications: string
  other_treatment: string
  other_treatment_details: string
  therapy_type: string
  therapist_gender_preference: string
}

const emptyForm: FormData = {
  full_name: '', phone: '', email: '', birth_date: '', gender: '',
  city: '', marital_status: '', occupation: '', military_service: '',
  military_role: '', social_network: '', social_username: '', main_reason: '',
  mother_name: '', mother_relationship: '', father_name: '', father_relationship: '',
  siblings_count: 0, siblings_details: [], early_memory: '', open_space: '',
  previous_therapy_history: '', why_now: '', fears: '', expectations: '',
  chronic_issues: '', medications: '', other_treatment: '', other_treatment_details: '',
  therapy_type: '', therapist_gender_preference: 'any',
}

const STEP_LABELS = ['סינון והיכרות', 'דינמיקה משפחתית', 'ציפיות ורפואי', 'התחייבות']

// ==========================================
// Toast Component
// ==========================================
function Toast({ message, type, visible }: { message: string; type: 'error' | 'success'; visible: boolean }) {
  return (
    <div
      className={`fixed bottom-8 left-1/2 z-50 -translate-x-1/2 rounded-xl px-6 py-3 font-medium text-white shadow-lg transition-all duration-300 ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0'
      } ${type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}
    >
      {message}
    </div>
  )
}

// ==========================================
// Progress Bar
// ==========================================
function ProgressBar({ currentStep }: { currentStep: number }) {
  return (
    <div className="bg-white px-4 py-6 shadow-sm">
      <div className="mx-auto flex max-w-md justify-center">
        {STEP_LABELS.map((label, i) => {
          const stepNum = i + 1
          const isCompleted = currentStep > stepNum
          const isActive = currentStep === stepNum
          return (
            <div key={label} className="relative flex flex-1 flex-col items-center">
              {i < STEP_LABELS.length - 1 && (
                <div
                  className={`absolute top-5 left-[-50%] z-[1] h-[3px] w-full ${
                    isCompleted ? 'bg-gold' : 'bg-gray-200'
                  }`}
                />
              )}
              <div
                className={`relative z-[2] flex h-10 w-10 items-center justify-center rounded-full border-[3px] text-sm font-semibold transition-all ${
                  isCompleted
                    ? 'border-gold bg-gold text-white'
                    : isActive
                    ? 'border-gold bg-white text-gold shadow-[0_0_0_4px_rgba(212,175,55,0.2)]'
                    : 'border-gray-200 bg-white text-gray-400'
                }`}
              >
                {isCompleted ? <Check size={16} /> : stepNum}
              </div>
              <span
                className={`mt-1.5 text-center text-[0.65rem] sm:text-xs ${
                  isActive ? 'font-semibold text-deep-petrol' : isCompleted ? 'text-gold' : 'text-gray-400'
                }`}
              >
                {label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ==========================================
// Main Component
// ==========================================
export default function PatientQuestionnaire() {
  const [currentStep, setCurrentStep] = useState(0)
  const [form, setForm] = useState<FormData>(emptyForm)
  const [toast, setToast] = useState({ message: '', type: 'error' as 'error' | 'success', visible: false })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  // Signature state
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [hasSignature, setHasSignature] = useState(false)
  const isDrawingRef = useRef(false)
  const lastPosRef = useRef({ x: 0, y: 0 })

  // Legal scroll state
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false)
  const [termsConfirmed, setTermsConfirmed] = useState(false)
  const [ageConfirmed, setAgeConfirmed] = useState(false)
  const [marketingConsent, setMarketingConsent] = useState(false)
  const moralBoxRef = useRef<HTMLDivElement>(null)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('patientForm')
      if (saved) {
        const parsed = JSON.parse(saved)
        setForm(prev => ({ ...prev, ...parsed }))
      }
    } catch { /* ignore */ }
  }, [])

  // Save to localStorage on form change
  useEffect(() => {
    localStorage.setItem('patientForm', JSON.stringify(form))
  }, [form])

  // Scroll to top on step change
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [currentStep])

  const showToast = useCallback((message: string, type: 'error' | 'success' = 'error') => {
    setToast({ message, type, visible: true })
    setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000)
  }, [])

  const updateField = useCallback((field: keyof FormData, value: FormData[keyof FormData]) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }, [])

  // ==========================================
  // Signature Canvas Logic
  // ==========================================
  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const container = canvas.parentElement
    if (!container) return
    const rect = container.getBoundingClientRect()
    canvas.width = rect.width
    canvas.height = 150
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.strokeStyle = '#1a1a2e'
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
  }, [])

  useEffect(() => {
    if (currentStep === 4) {
      setTimeout(setupCanvas, 100)
      const handleResize = () => setupCanvas()
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }
  }, [currentStep, setupCanvas])

  // Check if moral box needs scroll
  useEffect(() => {
    if (currentStep === 4 && moralBoxRef.current) {
      const box = moralBoxRef.current
      if (box.scrollHeight <= box.clientHeight) {
        setHasScrolledToBottom(true)
      }
    }
  }, [currentStep])

  const getCanvasCoords = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    const rect = canvas.getBoundingClientRect()
    if ('touches' in e) {
      return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top }
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    isDrawingRef.current = true
    const coords = getCanvasCoords(e)
    lastPosRef.current = coords
  }

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawingRef.current) return
    e.preventDefault()
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx) return
    const coords = getCanvasCoords(e)
    ctx.beginPath()
    ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y)
    ctx.lineTo(coords.x, coords.y)
    ctx.stroke()
    lastPosRef.current = coords
    if (!hasSignature) setHasSignature(true)
  }

  const stopDrawing = () => { isDrawingRef.current = false }

  const clearSignature = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
    setHasSignature(false)
  }

  // ==========================================
  // Step Navigation
  // ==========================================
  const goNext = () => {
    if (currentStep === 0) {
      setCurrentStep(1)
      return
    }
    if (currentStep === 1) {
      if (!form.full_name || form.full_name.length < 2) { showToast('יש להזין שם מלא'); return }
      if (!form.phone || form.phone.length < 9) { showToast('יש להזין מספר טלפון תקין'); return }
      if (!form.email || !form.email.includes('@')) { showToast('יש להזין כתובת אימייל תקינה'); return }
      if (!form.main_reason || form.main_reason.length < 10) { showToast('יש לתאר את סיבת הפנייה (לפחות 10 תווים)'); return }
      setCurrentStep(2)
      return
    }
    if (currentStep === 2) {
      if (!form.mother_relationship || form.mother_relationship.length < 5) { showToast('יש לתאר את הקשר עם האם'); return }
      if (!form.father_relationship || form.father_relationship.length < 5) { showToast('יש לתאר את הקשר עם האב'); return }
      setCurrentStep(3)
      return
    }
    if (currentStep === 3) {
      if (!form.therapy_type) { showToast('יש לבחור סוג טיפול מועדף'); return }
      setCurrentStep(4)
      return
    }
  }

  const goBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1)
  }

  // ==========================================
  // Submit
  // ==========================================
  const handleSubmit = async () => {
    if (!termsConfirmed || !ageConfirmed) { showToast('יש לאשר את כל ההצהרות'); return }
    if (!hasSignature) { showToast('יש לחתום בתיבת החתימה'); return }

    setSubmitting(true)
    try {
      const canvas = canvasRef.current
      const signatureData = canvas ? canvas.toDataURL('image/png') : ''

      const questionnaire = {
        main_reason: form.main_reason,
        previous_therapy_history: form.previous_therapy_history,
        expectations: form.expectations,
        why_now: form.why_now,
        fears: form.fears,
        medical_background: {
          chronic_issues: form.chronic_issues,
          medications: form.medications,
          other_treatment: form.other_treatment === 'yes',
          other_treatment_details: form.other_treatment_details,
        },
        family_dynamics: {
          mother_name: form.mother_name,
          mother_relationship: form.mother_relationship,
          father_name: form.father_name,
          father_relationship: form.father_relationship,
          siblings_count: form.siblings_count,
          siblings_details: form.siblings_details,
        },
        inner_world: {
          early_memory: form.early_memory,
          open_space: form.open_space,
        },
      }

      const data = {
        full_name: form.full_name,
        email: form.email,
        phone: form.phone,
        city: form.city || null,
        birth_date: form.birth_date || null,
        gender: form.gender || null,
        marital_status: form.marital_status || null,
        occupation: form.occupation || null,
        military_service: form.military_service || null,
        social_link: form.social_username ? `${form.social_network}:${form.social_username}` : null,
        therapy_type: form.therapy_type,
        therapist_gender_preference: form.therapist_gender_preference || 'any',
        questionnaire,
        signature_data: signatureData,
        legal_consent_date: new Date().toISOString(),
        status: 'new',
        marketing_consent: marketingConsent,
      }

      const { error } = await supabase.from('patients').insert(data)
      if (error) throw error

      localStorage.removeItem('patientForm')
      setSubmitted(true)
      showToast('הבקשה נשלחה בהצלחה!', 'success')
    } catch (error) {
      console.error('Error:', error)
      showToast('שגיאה בשליחת הטופס. נסה שוב.')
    } finally {
      setSubmitting(false)
    }
  }

  // ==========================================
  // Moral box scroll detection
  // ==========================================
  const handleMoralScroll = () => {
    const box = moralBoxRef.current
    if (!box || hasScrolledToBottom) return
    if (box.scrollTop + box.clientHeight >= box.scrollHeight - 10) {
      setHasScrolledToBottom(true)
    }
  }

  // ==========================================
  // Render
  // ==========================================
  return (
    <div className="min-h-screen bg-[#f8f9fa] font-['Heebo',sans-serif]">
      {/* Header */}
      <div className="bg-gradient-to-l from-deep-petrol to-dusty-aqua px-6 py-5 text-center text-white">
        <h1 className="mb-0.5 text-xl font-bold sm:text-2xl">מטפל לכל אחד</h1>
        <p className="text-sm text-white/90">בקשה לקבלת טיפול רגשי</p>
      </div>

      {/* Progress bar (steps 1-4, hidden on intro & success) */}
      {currentStep >= 1 && currentStep <= 4 && !submitted && (
        <ProgressBar currentStep={currentStep} />
      )}

      {/* Content */}
      <div className="mx-auto max-w-[700px] px-4 py-6 sm:py-8">
        <AnimatePresence mode="wait">
          {submitted ? (
            <SuccessView key="success" />
          ) : currentStep === 0 ? (
            <StepIntro key="intro" onContinue={goNext} />
          ) : currentStep === 1 ? (
            <Step1 key="step1" form={form} updateField={updateField} onNext={goNext} />
          ) : currentStep === 2 ? (
            <Step2 key="step2" form={form} updateField={updateField} onNext={goNext} onBack={goBack} />
          ) : currentStep === 3 ? (
            <Step3 key="step3" form={form} updateField={updateField} onNext={goNext} onBack={goBack} />
          ) : (
            <Step4
              key="step4"
              onBack={goBack}
              onSubmit={handleSubmit}
              submitting={submitting}
              canvasRef={canvasRef}
              hasSignature={hasSignature}
              startDrawing={startDrawing}
              draw={draw}
              stopDrawing={stopDrawing}
              clearSignature={clearSignature}
              moralBoxRef={moralBoxRef}
              handleMoralScroll={handleMoralScroll}
              hasScrolledToBottom={hasScrolledToBottom}
              termsConfirmed={termsConfirmed}
              setTermsConfirmed={setTermsConfirmed}
              ageConfirmed={ageConfirmed}
              setAgeConfirmed={setAgeConfirmed}
              marketingConsent={marketingConsent}
              setMarketingConsent={setMarketingConsent}
            />
          )}
        </AnimatePresence>
      </div>

      <Toast message={toast.message} type={toast.type} visible={toast.visible} />
    </div>
  )
}

// ==========================================
// Step 0 — Intro
// ==========================================
function StepIntro({ onContinue }: { onContinue: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
      className="rounded-2xl bg-white p-6 text-center shadow-lg sm:p-8"
    >
      <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-gold to-[#e6c65a]">
        <Heart className="h-8 w-8 text-white" />
      </div>

      <h2 className="mb-5 text-2xl font-bold text-deep-petrol">הפרויקט הזה בנוי על אמון</h2>

      <div className="mb-6 rounded-2xl bg-gradient-to-br from-dusty-aqua/[0.08] to-deep-petrol/[0.04] p-5 text-right leading-[1.9]">
        <p className="mb-3 text-[1.05rem]">
          הפרויקט הזה נועד לאנשים שרוצים לעבור תהליכי טיפול וריפוי{' '}
          <strong className="text-deep-petrol">שחווים קושי ואתגרים כלכליים.</strong>
        </p>
        <p className="mb-3 text-[1.05rem]">
          אדם שיכנס לתהליך שהוא לא באמת זקוק לעזרה הזו —{' '}
          <strong className="text-deep-petrol">יקח את מקומו של אדם אחר שכן צריך.</strong>
        </p>
        <p className="text-[1.05rem]">
          אנחנו לא רוצים שתוכיחו לנו את מצבכם הכלכלי.{' '}
          <strong className="text-deep-petrol">אנחנו סומכים עליכם ועל המוסר הנשמתי שלכם.</strong>
        </p>
      </div>

      <div className="mb-6 flex items-center justify-center gap-2 text-[0.95rem] font-medium text-gold">
        <HandHeart size={20} />
        <span>אנחנו כאן בשבילכם</span>
      </div>

      <button
        onClick={onContinue}
        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-l from-gold to-[#e6c65a] px-8 py-3 text-lg font-semibold text-deep-petrol shadow-lg shadow-gold/30 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-gold/40"
      >
        <ArrowLeft size={18} />
        אני מבין/ה, בואו נמשיך
      </button>

      <Link to="/" className="mt-4 block text-sm text-gray-500 hover:text-dusty-aqua">
        חזרה לדף הבית
      </Link>
    </motion.div>
  )
}

// ==========================================
// Step 1 — Personal Details + Screening
// ==========================================
function Step1({ form, updateField, onNext }: {
  form: FormData
  updateField: (field: keyof FormData, value: FormData[keyof FormData]) => void
  onNext: () => void
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
      <div className="rounded-2xl bg-white p-5 shadow-lg sm:p-8">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-gold to-[#e6c65a]">
            <User className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-xl font-bold text-deep-petrol">סינון והיכרות</h2>
          <p className="text-sm text-gray-500">נתחיל להכיר אותך</p>
        </div>

        <div className="mb-4 rounded-xl bg-gradient-to-br from-dusty-aqua/10 to-deep-petrol/5 p-3 text-sm leading-relaxed text-deep-petrol">
          <strong>פרויקט זה נועד לאנשים המעוניינים לעבור תהליך עומק וזקוקים לסיוע.</strong>
          <br />אנו מחברים בין מטופלים למטפלים איכותיים שמציעים טיפול מסובסד או בהתנדבות.
        </div>

        {/* Section: Personal Details */}
        <SectionTitle icon={<User size={16} />} text="פרטים אישיים" />

        <FormField label="שם מלא" required>
          <input type="text" value={form.full_name} onChange={e => updateField('full_name', e.target.value)} placeholder="שם פרטי ומשפחה" className="form-input" />
        </FormField>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <FormField label="טלפון" required>
            <input type="tel" value={form.phone} onChange={e => updateField('phone', e.target.value)} placeholder="050-0000000" className="form-input" />
          </FormField>
          <FormField label="אימייל" required>
            <input type="email" value={form.email} onChange={e => updateField('email', e.target.value)} placeholder="your@email.com" className="form-input" />
          </FormField>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <FormField label="תאריך לידה">
            <input type="date" value={form.birth_date} onChange={e => updateField('birth_date', e.target.value)} className="form-input" />
          </FormField>
          <FormField label="מגדר">
            <select value={form.gender} onChange={e => updateField('gender', e.target.value)} className="form-input">
              <option value="">בחר/י</option>
              <option value="male">זכר</option>
              <option value="female">נקבה</option>
              <option value="other">אחר</option>
            </select>
          </FormField>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <FormField label="עיר מגורים">
            <input type="text" value={form.city} onChange={e => updateField('city', e.target.value)} placeholder="תל אביב" className="form-input" />
          </FormField>
          <FormField label="מצב משפחתי">
            <select value={form.marital_status} onChange={e => updateField('marital_status', e.target.value)} className="form-input">
              <option value="">בחר/י</option>
              <option value="single">רווק/ה</option>
              <option value="married">נשוי/אה</option>
              <option value="divorced">גרוש/ה</option>
              <option value="widowed">אלמן/ה</option>
              <option value="relationship">בזוגיות</option>
            </select>
          </FormField>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <FormField label="תעסוקה">
            <input type="text" value={form.occupation} onChange={e => updateField('occupation', e.target.value)} placeholder="מקצוע / תפקיד" className="form-input" />
          </FormField>
          <FormField label="שירות צבאי/לאומי">
            <select value={form.military_service} onChange={e => updateField('military_service', e.target.value)} className="form-input">
              <option value="">בחר/י</option>
              <option value="idf">צה"ל</option>
              <option value="national">שירות לאומי</option>
              <option value="exempt">פטור</option>
              <option value="none">לא שירתתי</option>
            </select>
          </FormField>
        </div>

        <FormField label="תפקיד בצבא/שירות לאומי" hint="(אופציונלי)">
          <input type="text" value={form.military_role} onChange={e => updateField('military_role', e.target.value)} placeholder="לדוגמה: קצין חינוך, מדריכה, לוחם..." className="form-input" />
        </FormField>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <FormField label="רשת חברתית" hint="(אופציונלי)">
            <select value={form.social_network} onChange={e => updateField('social_network', e.target.value)} className="form-input">
              <option value="">בחר/י רשת</option>
              <option value="instagram">אינסטגרם</option>
              <option value="facebook">פייסבוק</option>
              <option value="linkedin">לינקדאין</option>
              <option value="tiktok">טיקטוק</option>
              <option value="other">אחר</option>
            </select>
          </FormField>
          <FormField label="שם משתמש ברשת">
            <input type="text" value={form.social_username} onChange={e => updateField('social_username', e.target.value)} placeholder="@username" className="form-input" />
          </FormField>
        </div>

        <div className="my-4 flex items-center gap-2 rounded-xl bg-gradient-to-br from-gold/15 to-gold/5 p-3 text-sm text-deep-petrol">
          <Lock size={16} className="shrink-0 text-gold" />
          <span>כל המידע שתמסור/י ישמר בסודיות מוחלטת</span>
        </div>

        {/* Section: Screening */}
        <SectionTitle icon={<MessageSquare size={16} />} text="שאלת סינון" />

        <FormField label="מה הסיבה העיקרית שבגינה הגעת אלינו?" required>
          <textarea value={form.main_reason} onChange={e => updateField('main_reason', e.target.value)} placeholder="ספר/י לנו מה מביא אותך לחפש טיפול כרגע..." className="form-input min-h-[100px] resize-y" />
        </FormField>

        <button onClick={onNext} className="btn-gold mt-2 w-full">
          המשך לשלב הבא
          <ArrowLeft size={16} />
        </button>
      </div>
    </motion.div>
  )
}

// ==========================================
// Step 2 — Family Dynamics
// ==========================================
function Step2({ form, updateField, onNext, onBack }: {
  form: FormData
  updateField: (field: keyof FormData, value: FormData[keyof FormData]) => void
  onNext: () => void
  onBack: () => void
}) {
  const changeSiblingsCount = (delta: number) => {
    const newCount = Math.max(0, Math.min(10, form.siblings_count + delta))
    updateField('siblings_count', newCount)
    // Trim or extend siblings_details
    const details = [...form.siblings_details]
    while (details.length < newCount) details.push({ name: '', relationship: '' })
    if (details.length > newCount) details.length = newCount
    updateField('siblings_details', details)
  }

  const updateSibling = (index: number, field: 'name' | 'relationship', value: string) => {
    const details = [...form.siblings_details]
    while (details.length <= index) details.push({ name: '', relationship: '' })
    details[index] = { ...details[index], [field]: value }
    updateField('siblings_details', details)
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
      {/* Parents Card */}
      <div className="mb-4 rounded-2xl bg-white p-5 shadow-lg sm:p-8">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-gold to-[#e6c65a]">
            <Users className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-xl font-bold text-deep-petrol">דינמיקה משפחתית</h2>
          <p className="text-sm text-gray-500">הבנת הרקע המשפחתי שלך תעזור לנו להתאים מטפל/ת</p>
        </div>

        <SectionTitle icon={<Users size={16} />} text="הורים" />

        {/* Mother */}
        <div className="mb-3 rounded-xl border-2 border-gray-200 bg-[#f8f9fa] p-4">
          <h4 className="mb-3 flex items-center gap-2 font-semibold text-deep-petrol">
            <User size={16} className="text-gold" /> האם
          </h4>
          <FormField label="שם האם">
            <input type="text" value={form.mother_name} onChange={e => updateField('mother_name', e.target.value)} placeholder="שם מלא" className="form-input" />
          </FormField>
          <FormField label="תאר/י את הקשר עם האם" required>
            <textarea value={form.mother_relationship} onChange={e => updateField('mother_relationship', e.target.value)} placeholder="ספר/י על הקשר שלך עם אמא שלך - קרוב, מרוחק, מורכב..." className="form-input min-h-[80px] resize-y" />
          </FormField>
        </div>

        {/* Father */}
        <div className="mb-3 rounded-xl border-2 border-gray-200 bg-[#f8f9fa] p-4">
          <h4 className="mb-3 flex items-center gap-2 font-semibold text-deep-petrol">
            <User size={16} className="text-gold" /> האב
          </h4>
          <FormField label="שם האב">
            <input type="text" value={form.father_name} onChange={e => updateField('father_name', e.target.value)} placeholder="שם מלא" className="form-input" />
          </FormField>
          <FormField label="תאר/י את הקשר עם האב" required>
            <textarea value={form.father_relationship} onChange={e => updateField('father_relationship', e.target.value)} placeholder="ספר/י על הקשר שלך עם אבא שלך - קרוב, מרוחק, מורכב..." className="form-input min-h-[80px] resize-y" />
          </FormField>
        </div>

        {/* Siblings */}
        <SectionTitle icon={<Users size={16} />} text="אחים ואחיות" />

        <div className="mb-3 flex items-center justify-between">
          <label className="font-medium">כמה אחים/אחיות יש לך?</label>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => changeSiblingsCount(-1)} className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-gray-200 bg-white text-dusty-aqua transition-all hover:border-dusty-aqua hover:bg-dusty-aqua hover:text-white">
              <Minus size={16} />
            </button>
            <span className="w-8 text-center text-lg font-semibold">{form.siblings_count}</span>
            <button type="button" onClick={() => changeSiblingsCount(1)} className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-gray-200 bg-white text-dusty-aqua transition-all hover:border-dusty-aqua hover:bg-dusty-aqua hover:text-white">
              <Plus size={16} />
            </button>
          </div>
        </div>

        {Array.from({ length: form.siblings_count }).map((_, i) => (
          <div key={i} className="mb-2 rounded-xl border-2 border-gray-200 bg-[#f8f9fa] p-3">
            <div className="mb-2 font-semibold text-gold">אח/אחות {i + 1}</div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <FormField label="שם">
                <input type="text" value={form.siblings_details[i]?.name || ''} onChange={e => updateSibling(i, 'name', e.target.value)} placeholder="שם" className="form-input" />
              </FormField>
              <FormField label="תיאור הקשר">
                <input type="text" value={form.siblings_details[i]?.relationship || ''} onChange={e => updateSibling(i, 'relationship', e.target.value)} placeholder="קרוב, מרוחק, מורכב..." className="form-input" />
              </FormField>
            </div>
          </div>
        ))}
      </div>

      {/* Inner World Card */}
      <div className="mb-4 rounded-2xl bg-white p-5 shadow-lg sm:p-8">
        <SectionTitle icon={<Brain size={16} />} text="עולם פנימי" />

        <FormField label="ספר/י לנו על האירוע הכי מוקדם שאת/ה זוכר/ת מחייך">
          <textarea value={form.early_memory} onChange={e => updateField('early_memory', e.target.value)} placeholder="זיכרון ראשון מהילדות - יכול להיות אירוע קטן או גדול..." className="form-input min-h-[80px] resize-y" />
        </FormField>

        <FormField label="מרחב פתוח - יש עוד משהו שהיית רוצה לשתף?">
          <textarea value={form.open_space} onChange={e => updateField('open_space', e.target.value)} placeholder="כל דבר שחשוב לך שנדע..." className="form-input min-h-[80px] resize-y" />
        </FormField>
      </div>

      <NavButtons onBack={onBack} onNext={onNext} nextLabel="המשך" />
    </motion.div>
  )
}

// ==========================================
// Step 3 — Expectations & Medical
// ==========================================
function Step3({ form, updateField, onNext, onBack }: {
  form: FormData
  updateField: (field: keyof FormData, value: FormData[keyof FormData]) => void
  onNext: () => void
  onBack: () => void
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
      {/* Expectations Card */}
      <div className="mb-4 rounded-2xl bg-white p-5 shadow-lg sm:p-8">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-gold to-[#e6c65a]">
            <MessageSquare className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-xl font-bold text-deep-petrol">תיאום ציפיות</h2>
          <p className="text-sm text-gray-500">כדי שנוכל להתאים לך את המטפל/ת הטוב/ה ביותר</p>
        </div>

        <SectionTitle icon={<ArrowRight size={16} />} text="ניסיון עבר" />

        <FormField label="האם עברת טיפול רגשי בעבר?">
          <textarea value={form.previous_therapy_history} onChange={e => updateField('previous_therapy_history', e.target.value)} placeholder="אם כן, ספר/י בקצרה על הניסיון - מה עבד, מה פחות..." className="form-input min-h-[80px] resize-y" />
        </FormField>

        <FormField label="למה דווקא עכשיו?" hint="(מה הטריגר לפנייה)">
          <textarea value={form.why_now} onChange={e => updateField('why_now', e.target.value)} placeholder="מה קרה שגרם לך לחפש עזרה דווקא בתקופה הזו?" className="form-input min-h-[80px] resize-y" />
        </FormField>

        <FormField label="האם יש לך חששות או פחדים לגבי הטיפול?">
          <textarea value={form.fears} onChange={e => updateField('fears', e.target.value)} placeholder="חששות, פחדים, חסמים..." className="form-input min-h-[80px] resize-y" />
        </FormField>

        <FormField label="מה את/ה מקווה להשיג מהטיפול?">
          <textarea value={form.expectations} onChange={e => updateField('expectations', e.target.value)} placeholder="מה היית רוצה שישתנה בחיים שלך?" className="form-input min-h-[80px] resize-y" />
        </FormField>
      </div>

      {/* Medical Card */}
      <div className="mb-4 rounded-2xl bg-white p-5 shadow-lg sm:p-8">
        <SectionTitle icon={<Stethoscope size={16} />} text="מידע רפואי" />

        <div className="mb-3 flex items-start gap-2 rounded-xl bg-gradient-to-br from-dusty-aqua/10 to-deep-petrol/5 p-3 text-sm">
          <Stethoscope size={18} className="mt-0.5 shrink-0 text-dusty-aqua" />
          <span>מידע זה חשוב להתאמת הטיפול. הכל נשמר בסודיות מלאה.</span>
        </div>

        <FormField label="האם יש לך מחלות כרוניות או בעיות בריאותיות?">
          <textarea value={form.chronic_issues} onChange={e => updateField('chronic_issues', e.target.value)} placeholder="אם כן, פרט/י..." className="form-input min-h-[60px] resize-y" />
        </FormField>

        <FormField label="האם את/ה נוטל/ת תרופות פסיכיאטריות או אחרות?">
          <input type="text" value={form.medications} onChange={e => updateField('medications', e.target.value)} placeholder="שמות תרופות (אם יש)" className="form-input" />
        </FormField>

        <FormField label="האם את/ה נמצא/ת בטיפול נפשי או רפואי נוסף כרגע?">
          <div className="flex flex-wrap gap-3">
            {['yes', 'no'].map(val => (
              <label
                key={val}
                className={`flex cursor-pointer items-center gap-2 rounded-lg border-2 px-4 py-2 transition-all ${
                  form.other_treatment === val ? 'border-gold bg-gold/10' : 'border-gray-200 bg-[#f8f9fa] hover:border-dusty-aqua'
                }`}
                onClick={() => {
                  updateField('other_treatment', val)
                  if (val === 'no') updateField('other_treatment_details', '')
                }}
              >
                <input type="radio" name="other_treatment" value={val} checked={form.other_treatment === val} onChange={() => {}} className="hidden" />
                <span>{val === 'yes' ? 'כן' : 'לא'}</span>
              </label>
            ))}
          </div>
          {form.other_treatment === 'yes' && (
            <textarea
              value={form.other_treatment_details}
              onChange={e => updateField('other_treatment_details', e.target.value)}
              placeholder="ספר/י לנו על הטיפול - איזה סוג טיפול, כמה זמן, תדירות..."
              className="form-input mt-3 min-h-[80px] resize-y"
            />
          )}
        </FormField>
      </div>

      {/* Preferences Card */}
      <div className="mb-4 rounded-2xl bg-white p-5 shadow-lg sm:p-8">
        <SectionTitle icon={<ArrowLeftRight size={16} />} text="העדפות לוגיסטיות" />

        <FormField label="סוג טיפול מועדף" required>
          <div className="flex flex-col gap-2">
            {[
              { value: 'online', icon: <Video size={18} />, title: 'זום (אונליין)', desc: 'טיפול מרחוק מהנוחות של הבית' },
              { value: 'in_person', icon: <Building size={18} />, title: 'פרונטלי', desc: 'פגישה פנים אל פנים בקליניקה' },
              { value: 'both', icon: <ArrowLeftRight size={18} />, title: 'גמיש', desc: 'שניהם מתאימים לי' },
            ].map(opt => (
              <OptionCard
                key={opt.value}
                selected={form.therapy_type === opt.value}
                onClick={() => updateField('therapy_type', opt.value)}
                icon={opt.icon}
                title={opt.title}
                description={opt.desc}
              />
            ))}
          </div>
        </FormField>

        <FormField label="העדפת מגדר המטפל/ת">
          <div className="flex flex-col gap-2">
            {[
              { value: 'any', icon: <Users size={18} />, title: 'לא משנה לי', desc: 'מתאים לי כל מטפל/ת' },
              { value: 'female', icon: <User size={18} />, title: 'מטפלת (אישה)', desc: 'אעדיף לקבל טיפול מאישה' },
              { value: 'male', icon: <User size={18} />, title: 'מטפל (גבר)', desc: 'אעדיף לקבל טיפול מגבר' },
            ].map(opt => (
              <OptionCard
                key={opt.value}
                selected={form.therapist_gender_preference === opt.value}
                onClick={() => updateField('therapist_gender_preference', opt.value)}
                icon={opt.icon}
                title={opt.title}
                description={opt.desc}
              />
            ))}
          </div>
        </FormField>
      </div>

      <NavButtons onBack={onBack} onNext={onNext} nextLabel="המשך לסיום" />
    </motion.div>
  )
}

// ==========================================
// Step 4 — Legal + Signature + Submit
// ==========================================
function Step4({
  onBack, onSubmit, submitting,
  canvasRef, hasSignature, startDrawing, draw, stopDrawing, clearSignature,
  moralBoxRef, handleMoralScroll, hasScrolledToBottom,
  termsConfirmed, setTermsConfirmed, ageConfirmed, setAgeConfirmed,
  marketingConsent, setMarketingConsent,
}: {
  onBack: () => void
  onSubmit: () => void
  submitting: boolean
  canvasRef: React.RefObject<HTMLCanvasElement | null>
  hasSignature: boolean
  startDrawing: (e: React.MouseEvent | React.TouchEvent) => void
  draw: (e: React.MouseEvent | React.TouchEvent) => void
  stopDrawing: () => void
  clearSignature: () => void
  moralBoxRef: React.RefObject<HTMLDivElement | null>
  handleMoralScroll: () => void
  hasScrolledToBottom: boolean
  termsConfirmed: boolean
  setTermsConfirmed: (v: boolean) => void
  ageConfirmed: boolean
  setAgeConfirmed: (v: boolean) => void
  marketingConsent: boolean
  setMarketingConsent: (v: boolean) => void
}) {
  const canSubmit = termsConfirmed && ageConfirmed && hasSignature && !submitting

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
      <div className="rounded-2xl bg-white p-5 shadow-lg sm:p-8">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-gold to-[#e6c65a]">
            <FileSignature className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-xl font-bold text-deep-petrol">התחייבות וחתימה</h2>
          <p className="text-sm text-gray-500">נא לקרוא ולאשר לפני השליחה</p>
        </div>

        {/* Legal Terms Box */}
        <div
          ref={moralBoxRef}
          onScroll={handleMoralScroll}
          className="mb-3 max-h-[350px] overflow-y-auto rounded-2xl border-2 border-dusty-aqua bg-gradient-to-br from-dusty-aqua/[0.08] to-deep-petrol/[0.04] p-5 text-sm leading-[1.9] [&::-webkit-scrollbar-thumb]:rounded [&::-webkit-scrollbar-thumb]:bg-dusty-aqua [&::-webkit-scrollbar-track]:rounded [&::-webkit-scrollbar-track]:bg-black/5 [&::-webkit-scrollbar]:w-1.5"
        >
          <h3 className="mb-3 flex items-center gap-2 text-lg font-bold text-deep-petrol">
            <FileSignature size={20} className="text-gold" />
            הסכם תנאי שימוש, כתב ויתור ושחרור מאחריות
          </h3>
          <p><strong>פלטפורמת "מטפל לכל אחד"</strong></p>
          <p className="mb-3 text-gray-500"><em>גרסה משפטית סופית (3.3) – כולל הגבלת זכאות חד-פעמית</em></p>
          <p className="mb-3">השימוש במערכת, מילוי השאלונים וקבלת פרטי קשר של מטפל מהווים הסכמה מלאה, בלתי חוזרת ומחייבת לכל התנאים המפורטים להלן.</p>

          <LegalSection num="1" title="הצהרת חירום והעדר מענה רפואי">
            <p><strong>1.1.</strong> הפלטפורמה אינה גוף רפואי: המערכת משמשת כלוח מודעות טכנולוגי בלבד.</p>
            <p><strong>1.2.</strong> השימוש בפלטפורמה אסור למי שנמצא במצב של מצוקה אקוטית, סכנת אובדנות, או מסוכנות.</p>
            <p><strong>1.3.</strong> הפלטפורמה לא תישא בשום אחריות לנזק עקב הסתמכות עליה במצב חירום. במקרים אלו: משטרה 100, מד"א 101, ער"ן 1201.</p>
          </LegalSection>

          <LegalSection num="2" title="כשירות משפטית וגיל">
            <p><strong>2.1.</strong> השירות מיועד אך ורק לבגירים מעל גיל 18.</p>
            <p><strong>2.2.</strong> המטופל מצהיר כי הוא בגיר, צלול בדעתו, וכשיר משפטית. חל איסור מוחלט על רישום קטינים.</p>
          </LegalSection>

          <LegalSection num="3" title='מהות השירות: "לוח מודעות"'>
            <p><strong>3.1.</strong> המטפלים בפלטפורמה הינם ספקים עצמאיים ומתנדבים. אין יחסי עובד-מעביד.</p>
            <p><strong>3.2.</strong> הפלטפורמה אינה בודקת את שיטות הטיפול. האחריות המקצועית חלה על המטפל בלבד.</p>
          </LegalSection>

          <LegalSection num="4" title="גבולות הטיפול ומוגנות">
            <p><strong>4.1.</strong> הטיפול מוגדר כשיחה בלבד. חל איסור מוחלט על מגע פיזי.</p>
            <p><strong>4.2.</strong> הקשר הינו מקצועי בלבד. כל הצעה רומנטית או מינית מהווה עבירה אתית חמורה.</p>
          </LegalSection>

          <LegalSection num="5" title="ויתור ושיפוי">
            <p><strong>5.1.</strong> המטופל מוותר ויתור סופי על כל טענה או תביעה כלפי הפלטפורמה ומנהליה.</p>
            <p><strong>5.2.</strong> כל טענה תופנה אך ורק כלפי המטפל האישי, ולא כלפי הפלטפורמה.</p>
          </LegalSection>

          <LegalSection num="6" title="פרטיות המידע">
            <p><strong>6.1.</strong> הרשומות נשמרות אך ורק אצל המטפל, והוא האחראי הבלעדי לאבטחתם.</p>
            <p><strong>6.2.</strong> למנהלי הפלטפורמה אין גישה לתיק הרפואי או לתוכן השיחות.</p>
          </LegalSection>

          <LegalSection num="7" title="אמיתות מידע וכללי התנהגות">
            <p><strong>7.1.</strong> המטופל מתחייב כי כל המידע שמסר הוא אמת, מלא ומדויק.</p>
            <p><strong>7.2.</strong> חל איסור מוחלט על הקלטה או צילום ללא אישור בכתב.</p>
            <p><strong>7.3.</strong> המטופל מתחייב לנהוג בכבוד. הפרה תגרור הרחקה מיידית.</p>
          </LegalSection>

          <LegalSection num="8" title='מודל "10 המפגשים"'>
            <p><strong>8.1.</strong> הזכאות חד-פעמית לכל משתמש.</p>
            <p><strong>8.2.</strong> עד 10 מפגשים ללא עלות.</p>
            <p><strong>8.3.</strong> למטפל אסור למכור שירותים במהלך הסדרה.</p>
            <p><strong>8.4.</strong> המשך טיפול בתשלום הוא התקשרות פרטית נפרדת.</p>
          </LegalSection>

          <LegalSection num="9" title="סמכות שיפוט">
            <p>על הסכם זה יחולו דיני מדינת ישראל. סמכות השיפוט הבלעדית מוקנית לבתי המשפט בעיר תל אביב-יפו.</p>
          </LegalSection>

          <hr className="my-6 border-t-2 border-gold" />
          <h4 className="mb-3 text-center font-semibold text-gold">לפני שחותמים</h4>
          <p className="text-center"><strong>הפרויקט הזה נועד לאנשים שרוצים לעבור תהליכי טיפול וריפוי שחווים קושי ואתגרים כלכליים.</strong></p>
          <p className="text-center"><strong>אדם שיכנס לתהליך שהוא לא באמת זקוק לעזרה הזו - יקח את מקומו של אדם אחר שכן צריך.</strong></p>
          <p className="text-center"><strong>אנחנו סומכים עליכם ועל המוסר הנשמתי שלכם.</strong></p>
        </div>

        {/* Scroll hint */}
        {!hasScrolledToBottom && (
          <div className="mb-4 flex animate-pulse items-center justify-center gap-2 rounded-lg border border-red-500 bg-red-50 p-2 text-sm text-red-500">
            <ChevronDown size={16} />
            <span>יש לגלול עד סוף התקנון כדי להמשיך</span>
          </div>
        )}

        {/* Checkboxes */}
        <CheckboxItem
          checked={termsConfirmed}
          onChange={setTermsConfirmed}
          disabled={!hasScrolledToBottom}
          label="אני מאשר/ת שקראתי והבנתי את הסכם תנאי השימוש המלא"
          required
        />
        <CheckboxItem
          checked={ageConfirmed}
          onChange={setAgeConfirmed}
          disabled={!hasScrolledToBottom}
          label="אני מצהיר/ה שאני מעל גיל 18"
          required
        />
        <CheckboxItem
          checked={marketingConsent}
          onChange={setMarketingConsent}
          disabled={false}
          label="במידה ואהיה מרוצה, אני מסכים/ה שתשתמשו בצורה אנונימית לחלוטין בהצלחות שלי כדי לקדם את הפרויקט"
        />

        {/* Signature */}
        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between">
            <label className="font-medium">חתימה דיגיטלית <span className="text-red-500">*</span></label>
            <button type="button" onClick={clearSignature} className="text-sm text-gray-500 underline hover:text-red-500">
              נקה חתימה
            </button>
          </div>
          <div className={`relative overflow-hidden rounded-xl border-2 border-dashed bg-white ${hasSignature ? '!border-solid !border-green-500' : 'border-gray-200'}`}>
            <canvas
              ref={canvasRef}
              className="h-[150px] w-full cursor-crosshair touch-none"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
            />
            {!hasSignature && (
              <span className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-sm text-gray-400">
                חתום/י כאן
              </span>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
          <button onClick={onBack} className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-gray-200 bg-white py-3 font-semibold transition-all hover:border-dusty-aqua hover:text-dusty-aqua">
            <ArrowRight size={16} />
            חזרה
          </button>
          <button
            onClick={onSubmit}
            disabled={!canSubmit}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-green-500 to-emerald-400 py-3 font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none disabled:hover:translate-y-0"
          >
            {submitting ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              <>
                <Check size={16} />
                שליחת הבקשה
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  )
}

// ==========================================
// Success View
// ==========================================
function SuccessView() {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
      <div className="rounded-2xl bg-white p-6 text-center shadow-lg sm:p-10">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-400"
        >
          <Check className="h-12 w-12 text-white" />
        </motion.div>

        <h2 className="mb-3 text-2xl font-bold text-deep-petrol">אנו שמחים מאוד על הצעד שעשית!</h2>
        <p className="mb-6 text-lg leading-relaxed text-gray-500">
          אנו נעשה הכל בשביל לעזור לך.
          <br />ברגע שנמצא את המטפל הכי מקצועי ומתאים עבורך, הוא ייצור איתך קשר בהקדם.
        </p>

        <div className="flex flex-col items-center gap-3">
          <a
            href="https://wa.me/972549116092?text=%D7%94%D7%99%D7%99%20%D7%94%D7%99%D7%9C%D7%9C%2C%20%D7%9E%D7%99%D7%9C%D7%90%D7%AA%D7%99%20%D7%90%D7%AA%20%D7%94%D7%98%D7%95%D7%A4%D7%A1%20%D7%95%D7%90%D7%A0%D7%99%20%D7%9E%D7%A6%D7%A4%D7%94%20%D7%9C%D7%A2%D7%91%D7%95%D7%93%20%D7%90%D7%99%D7%AA%D7%9B%D7%9D%20%F0%9F%92%9A"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-6 py-3 text-base font-semibold text-white transition-all hover:-translate-y-0.5 hover:shadow-lg"
          >
            שלח הודעה להילל בוואטסאפ
          </a>
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl bg-dusty-aqua px-6 py-3 text-base font-semibold text-white transition-all hover:bg-muted-teal"
          >
            חזרה לדף הבית
          </Link>
        </div>
      </div>
    </motion.div>
  )
}

// ==========================================
// Shared Sub-Components
// ==========================================

function SectionTitle({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <h3 className="mb-3 mt-5 flex items-center gap-2 border-b-2 border-gold pb-2 text-base font-semibold text-deep-petrol first:mt-0">
      <span className="text-gold">{icon}</span>
      {text}
    </h3>
  )
}

function FormField({ label, required, hint, children }: {
  label: string; required?: boolean; hint?: string; children: React.ReactNode
}) {
  return (
    <div className="mb-3">
      <label className="mb-1 block text-sm font-medium">
        {label}
        {required && <span className="text-red-500"> *</span>}
        {hint && <span className="mr-1 text-xs font-normal text-gray-400">{hint}</span>}
      </label>
      {children}
    </div>
  )
}

function OptionCard({ selected, onClick, icon, title, description }: {
  selected: boolean; onClick: () => void; icon: React.ReactNode; title: string; description: string
}) {
  return (
    <div
      onClick={onClick}
      className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-3 transition-all ${
        selected
          ? 'border-gold bg-gradient-to-br from-gold/10 to-gold/5'
          : 'border-gray-200 bg-[#f8f9fa] hover:border-dusty-aqua hover:bg-white'
      }`}
    >
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg shadow-sm ${
        selected ? 'bg-gold text-white' : 'bg-white text-dusty-aqua'
      }`}>
        {icon}
      </div>
      <div className="flex-1">
        <strong className="block text-sm text-deep-petrol">{title}</strong>
        <span className="text-xs text-gray-500">{description}</span>
      </div>
      <div className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all ${
        selected ? 'border-gold bg-gold text-white' : 'border-gray-200'
      }`}>
        {selected && <Check size={12} />}
      </div>
    </div>
  )
}

function CheckboxItem({ checked, onChange, disabled, label, required }: {
  checked: boolean; onChange: (v: boolean) => void; disabled: boolean; label: string; required?: boolean
}) {
  return (
    <div
      className={`mb-2 flex cursor-pointer items-start gap-3 rounded-xl border-2 p-3 transition-all ${
        disabled ? 'pointer-events-none opacity-50' : ''
      } ${checked ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-[#f8f9fa] hover:border-dusty-aqua'}`}
      onClick={() => !disabled && onChange(!checked)}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={() => !disabled && onChange(!checked)}
        className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer accent-green-500"
      />
      <label className="cursor-pointer text-sm leading-relaxed">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
    </div>
  )
}

function NavButtons({ onBack, onNext, nextLabel }: { onBack: () => void; onNext: () => void; nextLabel: string }) {
  return (
    <div className="mt-2 flex flex-col-reverse gap-3 sm:flex-row">
      <button onClick={onBack} className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-gray-200 bg-white py-3 font-semibold transition-all hover:border-dusty-aqua hover:text-dusty-aqua">
        <ArrowRight size={16} />
        חזרה
      </button>
      <button onClick={onNext} className="btn-gold flex-1">
        {nextLabel}
        <ArrowLeft size={16} />
      </button>
    </div>
  )
}

function LegalSection({ num, title, children }: { num: string; title: string; children: React.ReactNode }) {
  return (
    <>
      <h4 className="mt-4 mb-2 text-sm font-bold text-deep-petrol first:mt-2">{num}. {title}</h4>
      <div className="space-y-1 text-sm">{children}</div>
    </>
  )
}
