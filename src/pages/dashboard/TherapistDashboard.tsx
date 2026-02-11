import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Users,
  UserCheck,
  CheckCircle2,
  Star,
  ClipboardList,
  Shield,
  GraduationCap,
  Activity,
  Eye,
  MapPin,
  Phone,
  Mail,
  Loader2,
} from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import DashboardShell from '../../components/dashboard/DashboardShell'
import StatCard from '../../components/dashboard/StatCard'
import StatusBadge from '../../components/dashboard/StatusBadge'
import Modal from '../../components/dashboard/Modal'
import type { Therapist, Patient } from '../../types/database'

const pendingSteps = [
  { icon: ClipboardList, label: 'הרשמה', description: 'הפרטים שלך נשלחו' },
  { icon: Shield, label: 'אישור', description: 'הבקשה בבדיקה' },
  { icon: GraduationCap, label: 'הכשרה', description: 'הכשרה מקצועית' },
  { icon: Activity, label: 'פעיל', description: 'מוכן לקבל מטופלים' },
]

export default function TherapistDashboard() {
  const { user } = useAuth()
  const [therapist, setTherapist] = useState<Therapist | null>(null)
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)

  useEffect(() => {
    async function load() {
      if (!user) return

      // Get therapist record
      const { data: thData } = await supabase
        .from('therapists')
        .select('*')
        .eq('email', user.email)
        .single()

      if (thData) {
        const th = thData as Therapist
        setTherapist(th)

        // If active, load patients
        if (th.status === 'active') {
          const { data: pData } = await supabase
            .from('patients')
            .select('*')
            .eq('therapist_id', th.id)
            .order('created_at', { ascending: false })
          if (pData) setPatients(pData as Patient[])
        }
      }
      setLoading(false)
    }
    load()
  }, [user])

  if (loading) {
    return (
      <DashboardShell title="לוח בקרה - מטפל">
        <div className="flex min-h-[400px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-gold" />
        </div>
      </DashboardShell>
    )
  }

  const isActive = therapist?.status === 'active'

  const activePatients = patients.filter((p) => p.status === 'in_treatment')
  const completedPatients = patients.filter((p) => p.status === 'completed')

  return (
    <DashboardShell title="לוח בקרה - מטפל">
      {/* PENDING STATE */}
      {(!therapist || !isActive) && (
        <div className="mx-auto max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 text-center"
          >
            <h2 className="font-['Frank_Ruhl_Libre',serif] text-2xl font-bold text-frost-white">
              שלום, <span className="text-gold">{therapist?.full_name || 'מטפל/ת'}</span>
            </h2>
            <p className="mt-2 text-frost-white/50">הבקשה שלך בבדיקה — נעדכן אותך ברגע שתאושר</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="rounded-2xl border border-frost-white/[0.06] bg-white/[0.04] p-8 backdrop-blur-sm"
          >
            <div className="flex items-start justify-between gap-2">
              {pendingSteps.map((step, i) => {
                const Icon = step.icon
                const stepIndex = therapist?.status === 'pending' ? 1 : 0
                const isCompleted = i < stepIndex
                const isCurrent = i === stepIndex
                return (
                  <div key={step.label} className="flex flex-1 flex-col items-center text-center">
                    <div
                      className={`mb-3 flex h-14 w-14 items-center justify-center rounded-full ${
                        isCompleted
                          ? 'bg-gradient-to-br from-gold to-warm-gold shadow-lg shadow-gold/25'
                          : isCurrent
                          ? 'border-2 border-gold bg-gold/10'
                          : 'border-2 border-frost-white/10 bg-white/[0.03]'
                      }`}
                    >
                      <Icon
                        size={22}
                        className={
                          isCompleted
                            ? 'text-deep-petrol'
                            : isCurrent
                            ? 'text-gold'
                            : 'text-frost-white/30'
                        }
                      />
                    </div>
                    <span className={`text-sm font-semibold ${isCompleted || isCurrent ? 'text-frost-white' : 'text-frost-white/30'}`}>
                      {step.label}
                    </span>
                    <span className="mt-1 text-xs text-frost-white/40">{step.description}</span>
                  </div>
                )
              })}
            </div>
          </motion.div>
        </div>
      )}

      {/* ACTIVE STATE */}
      {isActive && (
        <>
          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4"
          >
            <StatCard icon={Users} label="סה״כ מטופלים" value={patients.length} color="white" />
            <StatCard icon={UserCheck} label="בטיפול פעיל" value={activePatients.length} color="aqua" />
            <StatCard icon={CheckCircle2} label="טיפולים שהושלמו" value={completedPatients.length} color="teal" />
            <StatCard icon={Star} label="דירוג" value="–" color="gold" />
          </motion.div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Patient list */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl border border-frost-white/[0.06] bg-white/[0.04] p-5 backdrop-blur-sm lg:col-span-2"
            >
              <h3 className="mb-4 font-['Frank_Ruhl_Libre',serif] text-lg font-bold text-frost-white">
                המטופלים שלי
              </h3>

              {patients.length === 0 ? (
                <p className="py-8 text-center text-frost-white/40">אין מטופלים עדיין</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-sm">
                    <thead>
                      <tr className="border-b border-frost-white/[0.06] text-frost-white/40">
                        <th className="pb-3 font-medium">שם</th>
                        <th className="pb-3 font-medium">עיר</th>
                        <th className="pb-3 font-medium">סטטוס</th>
                        <th className="pb-3 font-medium">תאריך</th>
                        <th className="pb-3 font-medium"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {patients.map((p) => (
                        <tr
                          key={p.id}
                          className="border-b border-frost-white/[0.03] transition-colors hover:bg-white/[0.02]"
                        >
                          <td className="py-3 text-frost-white">{p.full_name}</td>
                          <td className="py-3 text-frost-white/60">{p.city}</td>
                          <td className="py-3"><StatusBadge status={p.status} /></td>
                          <td className="py-3 text-frost-white/40">
                            {new Date(p.created_at).toLocaleDateString('he-IL')}
                          </td>
                          <td className="py-3">
                            <button
                              onClick={() => setSelectedPatient(p)}
                              className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-dusty-aqua transition-colors hover:bg-dusty-aqua/10"
                            >
                              <Eye size={14} />
                              פרטים
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>

            {/* Profile sidebar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl border border-frost-white/[0.06] bg-white/[0.04] p-5 backdrop-blur-sm"
            >
              <h3 className="mb-4 font-['Frank_Ruhl_Libre',serif] text-lg font-bold text-frost-white">
                הפרופיל שלי
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-frost-white/60">
                  <UserCheck size={15} className="text-dusty-aqua" />
                  <span>{therapist.full_name}</span>
                </div>
                <div className="flex items-center gap-2 text-frost-white/60">
                  <Mail size={15} className="text-dusty-aqua" />
                  <span dir="ltr">{therapist.email}</span>
                </div>
                {therapist.phone && (
                  <div className="flex items-center gap-2 text-frost-white/60">
                    <Phone size={15} className="text-dusty-aqua" />
                    <span dir="ltr">{therapist.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-frost-white/60">
                  <MapPin size={15} className="text-dusty-aqua" />
                  <span>{therapist.city}</span>
                </div>
                {therapist.specialization && (
                  <div className="mt-4 rounded-xl bg-dusty-aqua/10 px-4 py-3">
                    <span className="text-xs text-frost-white/40">התמחות</span>
                    <p className="mt-1 text-frost-white/70">{therapist.specialization}</p>
                  </div>
                )}
                {therapist.bio && (
                  <div className="mt-3 rounded-xl bg-white/[0.03] px-4 py-3">
                    <span className="text-xs text-frost-white/40">אודות</span>
                    <p className="mt-1 text-frost-white/60">{therapist.bio}</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Patient detail modal */}
          <Modal
            open={!!selectedPatient}
            onClose={() => setSelectedPatient(null)}
            title={`פרטי מטופל — ${selectedPatient?.full_name || ''}`}
          >
            {selectedPatient && (
              <div className="space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-frost-white/40">אימייל</span>
                    <p className="text-frost-white/80" dir="ltr">{selectedPatient.email}</p>
                  </div>
                  <div>
                    <span className="text-frost-white/40">טלפון</span>
                    <p className="text-frost-white/80" dir="ltr">{selectedPatient.phone}</p>
                  </div>
                  <div>
                    <span className="text-frost-white/40">עיר</span>
                    <p className="text-frost-white/80">{selectedPatient.city}</p>
                  </div>
                  <div>
                    <span className="text-frost-white/40">סטטוס</span>
                    <p><StatusBadge status={selectedPatient.status} /></p>
                  </div>
                </div>

                {selectedPatient.questionnaire && (
                  <div className="mt-4 rounded-xl border border-frost-white/[0.06] bg-white/[0.03] p-4">
                    <h4 className="mb-2 font-semibold text-frost-white/60">נתוני שאלון</h4>
                    <pre className="max-h-60 overflow-auto text-xs text-frost-white/50" dir="ltr">
                      {JSON.stringify(selectedPatient.questionnaire, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </Modal>
        </>
      )}
    </DashboardShell>
  )
}
