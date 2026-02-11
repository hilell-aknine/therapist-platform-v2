import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  ClipboardList,
  UserCheck,
  Heart,
  Phone,
  MapPin,
  Stethoscope,
  Loader2,
  MessageCircle,
} from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import DashboardShell from '../../components/dashboard/DashboardShell'
import type { Patient, Therapist } from '../../types/database'

const steps = [
  { icon: ClipboardList, label: 'הגשת בקשה', description: 'הבקשה שלך התקבלה בהצלחה' },
  { icon: UserCheck, label: 'התאמת מטפל', description: 'אנחנו מחפשים מטפל שמתאים לך' },
  { icon: Heart, label: 'תחילת טיפול', description: 'הגיע הזמן להתחיל את המסע' },
]

function getActiveStep(status: string): number {
  switch (status) {
    case 'pending': return 0
    case 'matched': return 1
    case 'in_treatment': return 2
    case 'completed': return 2
    default: return 0
  }
}

export default function PatientDashboard() {
  const { user } = useAuth()
  const [patient, setPatient] = useState<Patient | null>(null)
  const [therapist, setTherapist] = useState<Therapist | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      if (!user) return

      const { data } = await supabase
        .from('patients')
        .select('*')
        .eq('email', user.email)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (data) {
        setPatient(data as Patient)

        if (data.therapist_id) {
          const { data: thData } = await supabase
            .from('therapists')
            .select('*')
            .eq('id', data.therapist_id)
            .single()
          if (thData) setTherapist(thData as Therapist)
        }
      }
      setLoading(false)
    }
    load()
  }, [user])

  if (loading) {
    return (
      <DashboardShell title="לוח בקרה - מטופל">
        <div className="flex min-h-[400px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-gold" />
        </div>
      </DashboardShell>
    )
  }

  const activeStep = patient ? getActiveStep(patient.status) : 0

  return (
    <DashboardShell title="לוח בקרה - מטופל">
      <div className="mx-auto max-w-2xl">
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h2 className="font-['Frank_Ruhl_Libre',serif] text-2xl font-bold text-frost-white md:text-3xl">
            שלום, <span className="text-gold">{patient?.full_name || 'אורח'}</span>
          </h2>
          <p className="mt-2 text-frost-white/50">כאן תוכלו לעקוב אחרי התקדמות הבקשה שלכם</p>
        </motion.div>

        {/* Progress steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-8 rounded-2xl border border-frost-white/[0.06] bg-white/[0.04] p-6 backdrop-blur-sm"
        >
          <h3 className="mb-6 text-center text-sm font-medium text-frost-white/50">סטטוס הבקשה</h3>
          <div className="flex items-start justify-between gap-2">
            {steps.map((step, i) => {
              const Icon = step.icon
              const isCompleted = i < activeStep
              const isActive = i === activeStep
              return (
                <div key={step.label} className="flex flex-1 flex-col items-center text-center">
                  {/* Circle */}
                  <div
                    className={`relative mb-3 flex h-14 w-14 items-center justify-center rounded-full transition-all ${
                      isCompleted
                        ? 'bg-gradient-to-br from-gold to-warm-gold shadow-lg shadow-gold/25'
                        : isActive
                        ? 'border-2 border-gold bg-gold/10 shadow-lg shadow-gold/15'
                        : 'border-2 border-frost-white/10 bg-white/[0.03]'
                    }`}
                  >
                    <Icon
                      size={22}
                      className={
                        isCompleted
                          ? 'text-deep-petrol'
                          : isActive
                          ? 'text-gold'
                          : 'text-frost-white/30'
                      }
                    />
                    {isCompleted && (
                      <div className="absolute -top-1 -left-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400 text-[10px] font-bold text-white">
                        ✓
                      </div>
                    )}
                  </div>

                  <span
                    className={`text-sm font-semibold ${
                      isCompleted || isActive ? 'text-frost-white' : 'text-frost-white/30'
                    }`}
                  >
                    {step.label}
                  </span>
                  <span className="mt-1 text-xs text-frost-white/40">{step.description}</span>

                  {/* Connector line (between items, not after last) */}
                  {i < steps.length - 1 && (
                    <div className="absolute" />
                  )}
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* Therapist card (when matched) */}
        {therapist && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl border border-gold/20 bg-white/[0.04] p-6 backdrop-blur-sm"
          >
            <h3 className="mb-4 font-['Frank_Ruhl_Libre',serif] text-lg font-bold text-frost-white">
              המטפל/ת שלך
            </h3>

            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-dusty-aqua/20 to-muted-teal/20">
                <UserCheck className="h-7 w-7 text-dusty-aqua" />
              </div>

              <div className="flex-1">
                <p className="text-lg font-semibold text-frost-white">{therapist.full_name}</p>
                <div className="mt-2 flex flex-wrap gap-3 text-sm text-frost-white/50">
                  <span className="flex items-center gap-1">
                    <Stethoscope size={14} className="text-dusty-aqua" />
                    {therapist.specialization || 'מטפל/ת'}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin size={14} className="text-dusty-aqua" />
                    {therapist.city}
                  </span>
                  {therapist.phone && (
                    <span className="flex items-center gap-1">
                      <Phone size={14} className="text-dusty-aqua" />
                      {therapist.phone}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* WhatsApp CTA */}
            {therapist.phone && (
              <a
                href={`https://wa.me/972${therapist.phone.replace(/^0/, '').replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-emerald-500"
              >
                <MessageCircle size={18} />
                שלחו הודעה בוואטסאפ
              </a>
            )}
          </motion.div>
        )}

        {/* No patient record */}
        {!patient && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-2xl border border-frost-white/[0.06] bg-white/[0.04] p-8 text-center backdrop-blur-sm"
          >
            <p className="text-frost-white/50">לא נמצאה בקשה פעילה עבורך.</p>
          </motion.div>
        )}
      </div>
    </DashboardShell>
  )
}
