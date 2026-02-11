import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Users,
  UserCheck,
  MessageSquare,
  Heart,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  XCircle,
  Link2,
  Loader2,
  LogOut,
  Phone,
  Mail,
  MapPin,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import StatCard from '../../components/dashboard/StatCard'
import StatusBadge from '../../components/dashboard/StatusBadge'
import Modal from '../../components/dashboard/Modal'
import type { Therapist, Patient, ContactRequest } from '../../types/database'

type View = 'therapists' | 'patients' | 'leads'

const viewConfig: Record<View, { label: string; icon: typeof Users }> = {
  therapists: { label: 'מטפלים', icon: UserCheck },
  patients: { label: 'מטופלים', icon: Users },
  leads: { label: 'לידים', icon: MessageSquare },
}

export default function AdminDashboard() {
  const { profile, signOut } = useAuth()
  const [activeView, setActiveView] = useState<View>('therapists')
  const [loading, setLoading] = useState(true)

  // Data
  const [therapists, setTherapists] = useState<Therapist[]>([])
  const [patients, setPatients] = useState<Patient[]>([])
  const [leads, setLeads] = useState<ContactRequest[]>([])

  // Filters
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  // Modals
  const [selectedTherapist, setSelectedTherapist] = useState<Therapist | null>(null)
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [matchingPatient, setMatchingPatient] = useState<Patient | null>(null)
  const [matchTherapistId, setMatchTherapistId] = useState('')

  useEffect(() => {
    loadAll()
  }, [])

  async function loadAll() {
    setLoading(true)
    const [thRes, pRes, lRes] = await Promise.all([
      supabase.from('therapists').select('*').order('created_at', { ascending: false }),
      supabase.from('patients').select('*').order('created_at', { ascending: false }),
      supabase.from('contact_requests').select('*').order('created_at', { ascending: false }),
    ])
    if (thRes.data) setTherapists(thRes.data as Therapist[])
    if (pRes.data) setPatients(pRes.data as Patient[])
    if (lRes.data) setLeads(lRes.data as ContactRequest[])
    setLoading(false)
  }

  // Filter helpers
  function filterBySearch<T extends { full_name: string; email: string }>(items: T[]) {
    if (!search.trim()) return items
    const q = search.trim().toLowerCase()
    return items.filter((i) => i.full_name.toLowerCase().includes(q) || i.email.toLowerCase().includes(q))
  }

  function filterByStatus<T extends { status: string }>(items: T[]) {
    if (statusFilter === 'all') return items
    return items.filter((i) => i.status === statusFilter)
  }

  const filteredTherapists = filterByStatus(filterBySearch(therapists))
  const filteredPatients = filterByStatus(filterBySearch(patients))
  const filteredLeads = filterByStatus(filterBySearch(leads))

  const activeTherapists = therapists.filter((t) => t.status === 'active')
  const activeMatches = patients.filter((p) => p.therapist_id)

  // Actions
  async function updateTherapistStatus(id: string, status: 'active' | 'inactive') {
    await supabase.from('therapists').update({ status }).eq('id', id)
    setTherapists((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)))
    setSelectedTherapist(null)
  }

  async function matchPatientToTherapist() {
    if (!matchingPatient || !matchTherapistId) return
    await supabase
      .from('patients')
      .update({ therapist_id: matchTherapistId, status: 'matched' })
      .eq('id', matchingPatient.id)
    setPatients((prev) =>
      prev.map((p) =>
        p.id === matchingPatient.id ? { ...p, therapist_id: matchTherapistId, status: 'matched' as const } : p
      )
    )
    setMatchingPatient(null)
    setMatchTherapistId('')
  }

  // Status options per view
  const statusOptions: Record<View, { value: string; label: string }[]> = {
    therapists: [
      { value: 'all', label: 'הכל' },
      { value: 'pending', label: 'ממתין' },
      { value: 'active', label: 'פעיל' },
      { value: 'inactive', label: 'לא פעיל' },
    ],
    patients: [
      { value: 'all', label: 'הכל' },
      { value: 'pending', label: 'ממתין' },
      { value: 'matched', label: 'הותאם' },
      { value: 'in_treatment', label: 'בטיפול' },
      { value: 'completed', label: 'הושלם' },
    ],
    leads: [
      { value: 'all', label: 'הכל' },
      { value: 'new', label: 'חדש' },
      { value: 'contacted', label: 'נוצר קשר' },
      { value: 'converted', label: 'הומר' },
    ],
  }

  // Reset filters when switching views
  function switchView(v: View) {
    setActiveView(v)
    setSearch('')
    setStatusFilter('all')
  }

  if (loading) {
    return (
      <div dir="rtl" className="flex min-h-screen items-center justify-center bg-gradient-to-b from-deep-petrol to-[#002a32]">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    )
  }

  return (
    <div dir="rtl" className="flex min-h-screen bg-gradient-to-b from-deep-petrol to-[#002a32]">
      {/* Sidebar */}
      <aside className="fixed top-0 right-0 bottom-0 flex w-[220px] flex-col border-l border-frost-white/[0.06] bg-deep-petrol/95 backdrop-blur-xl">
        {/* Logo */}
        <div className="flex items-center gap-2 border-b border-frost-white/[0.06] px-5 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-gold to-warm-gold shadow-md shadow-gold/20">
            <Heart className="h-4 w-4 text-deep-petrol" fill="currentColor" />
          </div>
          <span className="font-['Frank_Ruhl_Libre',serif] text-sm font-bold text-frost-white">
            ניהול <span className="text-gold">ראשי</span>
          </span>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 py-4">
          {(Object.keys(viewConfig) as View[]).map((key) => {
            const { label, icon: Icon } = viewConfig[key]
            const isActive = activeView === key
            const count =
              key === 'therapists' ? therapists.length : key === 'patients' ? patients.length : leads.length
            return (
              <button
                key={key}
                onClick={() => switchView(key)}
                className={`mb-1 flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition-all ${
                  isActive
                    ? 'bg-gold/10 font-semibold text-gold'
                    : 'text-frost-white/50 hover:bg-white/[0.04] hover:text-frost-white/80'
                }`}
              >
                <Icon size={17} />
                {label}
                <span className="mr-auto rounded-full bg-white/[0.06] px-2 py-0.5 text-xs">{count}</span>
              </button>
            )
          })}
        </nav>

        {/* User + logout */}
        <div className="border-t border-frost-white/[0.06] px-4 py-3">
          <p className="mb-2 truncate text-xs text-frost-white/40">{profile?.email}</p>
          <button
            onClick={signOut}
            className="flex w-full items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs text-frost-white/40 transition-colors hover:bg-white/[0.04] hover:text-frost-white/70"
          >
            <LogOut size={13} />
            התנתקות
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="mr-[220px] flex-1 p-6">
        {/* Stats row */}
        <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatCard icon={UserCheck} label="מטפלים" value={therapists.length} color="aqua" />
          <StatCard icon={Users} label="מטופלים" value={patients.length} color="white" />
          <StatCard icon={MessageSquare} label="לידים" value={leads.length} color="teal" />
          <StatCard icon={Heart} label="שיבוצים פעילים" value={activeMatches.length} color="gold" />
        </div>

        {/* Search + filter bar */}
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute top-1/2 right-3 -translate-y-1/2 text-frost-white/30" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="חיפוש לפי שם או אימייל..."
              className="w-full rounded-xl border border-frost-white/[0.08] bg-white/[0.04] py-2.5 pr-10 pl-4 text-sm text-frost-white placeholder:text-frost-white/30 transition-all focus:border-dusty-aqua/40 focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-frost-white/30" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-frost-white/[0.08] bg-white/[0.04] px-3 py-2.5 text-sm text-frost-white/70 focus:border-dusty-aqua/40 focus:outline-none"
            >
              {statusOptions[activeView].map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-deep-petrol">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* TABLE: Therapists */}
        {activeView === 'therapists' && (
          <motion.div
            key="therapists"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-frost-white/[0.06] bg-white/[0.04] p-5 backdrop-blur-sm"
          >
            <h3 className="mb-4 font-['Frank_Ruhl_Libre',serif] text-lg font-bold text-frost-white">
              מטפלים ({filteredTherapists.length})
            </h3>
            {filteredTherapists.length === 0 ? (
              <p className="py-8 text-center text-frost-white/40">אין תוצאות</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-right text-sm">
                  <thead>
                    <tr className="border-b border-frost-white/[0.06] text-frost-white/40">
                      <th className="pb-3 font-medium">שם</th>
                      <th className="pb-3 font-medium">אימייל</th>
                      <th className="pb-3 font-medium">עיר</th>
                      <th className="pb-3 font-medium">התמחות</th>
                      <th className="pb-3 font-medium">סטטוס</th>
                      <th className="pb-3 font-medium"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTherapists.map((t) => (
                      <tr key={t.id} className="border-b border-frost-white/[0.03] hover:bg-white/[0.02]">
                        <td className="py-3 text-frost-white">{t.full_name}</td>
                        <td className="py-3 text-frost-white/50" dir="ltr">{t.email}</td>
                        <td className="py-3 text-frost-white/50">{t.city}</td>
                        <td className="py-3 text-frost-white/50">{t.specialization || '—'}</td>
                        <td className="py-3"><StatusBadge status={t.status} /></td>
                        <td className="py-3">
                          <button
                            onClick={() => setSelectedTherapist(t)}
                            className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-dusty-aqua hover:bg-dusty-aqua/10"
                          >
                            <Eye size={14} /> פרטים
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        )}

        {/* TABLE: Patients */}
        {activeView === 'patients' && (
          <motion.div
            key="patients"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-frost-white/[0.06] bg-white/[0.04] p-5 backdrop-blur-sm"
          >
            <h3 className="mb-4 font-['Frank_Ruhl_Libre',serif] text-lg font-bold text-frost-white">
              מטופלים ({filteredPatients.length})
            </h3>
            {filteredPatients.length === 0 ? (
              <p className="py-8 text-center text-frost-white/40">אין תוצאות</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-right text-sm">
                  <thead>
                    <tr className="border-b border-frost-white/[0.06] text-frost-white/40">
                      <th className="pb-3 font-medium">שם</th>
                      <th className="pb-3 font-medium">אימייל</th>
                      <th className="pb-3 font-medium">עיר</th>
                      <th className="pb-3 font-medium">סטטוס</th>
                      <th className="pb-3 font-medium">מטפל</th>
                      <th className="pb-3 font-medium"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPatients.map((p) => {
                      const assignedTherapist = therapists.find((t) => t.id === p.therapist_id)
                      return (
                        <tr key={p.id} className="border-b border-frost-white/[0.03] hover:bg-white/[0.02]">
                          <td className="py-3 text-frost-white">{p.full_name}</td>
                          <td className="py-3 text-frost-white/50" dir="ltr">{p.email}</td>
                          <td className="py-3 text-frost-white/50">{p.city}</td>
                          <td className="py-3"><StatusBadge status={p.status} /></td>
                          <td className="py-3 text-frost-white/50">{assignedTherapist?.full_name || '—'}</td>
                          <td className="py-3">
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => setSelectedPatient(p)}
                                className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-dusty-aqua hover:bg-dusty-aqua/10"
                              >
                                <Eye size={14} /> פרטים
                              </button>
                              {!p.therapist_id && (
                                <button
                                  onClick={() => { setMatchingPatient(p); setMatchTherapistId('') }}
                                  className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-gold hover:bg-gold/10"
                                >
                                  <Link2 size={14} /> שיבוץ
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        )}

        {/* TABLE: Leads */}
        {activeView === 'leads' && (
          <motion.div
            key="leads"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-frost-white/[0.06] bg-white/[0.04] p-5 backdrop-blur-sm"
          >
            <h3 className="mb-4 font-['Frank_Ruhl_Libre',serif] text-lg font-bold text-frost-white">
              לידים ({filteredLeads.length})
            </h3>
            {filteredLeads.length === 0 ? (
              <p className="py-8 text-center text-frost-white/40">אין תוצאות</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-right text-sm">
                  <thead>
                    <tr className="border-b border-frost-white/[0.06] text-frost-white/40">
                      <th className="pb-3 font-medium">שם</th>
                      <th className="pb-3 font-medium">אימייל</th>
                      <th className="pb-3 font-medium">טלפון</th>
                      <th className="pb-3 font-medium">מקור</th>
                      <th className="pb-3 font-medium">סטטוס</th>
                      <th className="pb-3 font-medium">תאריך</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLeads.map((l) => (
                      <tr key={l.id} className="border-b border-frost-white/[0.03] hover:bg-white/[0.02]">
                        <td className="py-3 text-frost-white">{l.full_name}</td>
                        <td className="py-3 text-frost-white/50" dir="ltr">{l.email}</td>
                        <td className="py-3 text-frost-white/50" dir="ltr">{l.phone}</td>
                        <td className="py-3 text-frost-white/50">{l.source || '—'}</td>
                        <td className="py-3"><StatusBadge status={l.status} /></td>
                        <td className="py-3 text-frost-white/40">
                          {new Date(l.created_at).toLocaleDateString('he-IL')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        )}
      </main>

      {/* MODAL: Therapist Detail */}
      <Modal
        open={!!selectedTherapist}
        onClose={() => setSelectedTherapist(null)}
        title={`פרטי מטפל — ${selectedTherapist?.full_name || ''}`}
      >
        {selectedTherapist && (
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-frost-white/40">אימייל</span>
                <p className="text-frost-white/80" dir="ltr">{selectedTherapist.email}</p>
              </div>
              <div>
                <span className="text-frost-white/40">טלפון</span>
                <p className="text-frost-white/80" dir="ltr">{selectedTherapist.phone}</p>
              </div>
              <div>
                <span className="text-frost-white/40">עיר</span>
                <p className="text-frost-white/80">{selectedTherapist.city}</p>
              </div>
              <div>
                <span className="text-frost-white/40">התמחות</span>
                <p className="text-frost-white/80">{selectedTherapist.specialization || '—'}</p>
              </div>
              <div>
                <span className="text-frost-white/40">סטטוס</span>
                <p><StatusBadge status={selectedTherapist.status} /></p>
              </div>
              <div>
                <span className="text-frost-white/40">הצטרפות</span>
                <p className="text-frost-white/80">
                  {new Date(selectedTherapist.created_at).toLocaleDateString('he-IL')}
                </p>
              </div>
            </div>
            {selectedTherapist.bio && (
              <div className="rounded-xl bg-white/[0.03] p-3">
                <span className="text-frost-white/40">אודות</span>
                <p className="mt-1 text-frost-white/60">{selectedTherapist.bio}</p>
              </div>
            )}

            {/* Approve / Reject */}
            <div className="flex gap-3 border-t border-frost-white/[0.06] pt-4">
              {selectedTherapist.status !== 'active' && (
                <button
                  onClick={() => updateTherapistStatus(selectedTherapist.id, 'active')}
                  className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-emerald-500"
                >
                  <CheckCircle2 size={15} /> אישור
                </button>
              )}
              {selectedTherapist.status !== 'inactive' && (
                <button
                  onClick={() => updateTherapistStatus(selectedTherapist.id, 'inactive')}
                  className="flex items-center gap-1.5 rounded-xl bg-red-600/80 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-red-500"
                >
                  <XCircle size={15} /> דחייה
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* MODAL: Patient Detail */}
      <Modal
        open={!!selectedPatient}
        onClose={() => setSelectedPatient(null)}
        title={`פרטי מטופל — ${selectedPatient?.full_name || ''}`}
        wide
      >
        {selectedPatient && (
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
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
              <div>
                <span className="text-frost-white/40">מטפל</span>
                <p className="text-frost-white/80">
                  {therapists.find((t) => t.id === selectedPatient.therapist_id)?.full_name || '—'}
                </p>
              </div>
              <div>
                <span className="text-frost-white/40">תאריך הגשה</span>
                <p className="text-frost-white/80">
                  {new Date(selectedPatient.created_at).toLocaleDateString('he-IL')}
                </p>
              </div>
            </div>

            {selectedPatient.questionnaire && (
              <div className="rounded-xl border border-frost-white/[0.06] bg-white/[0.03] p-4">
                <h4 className="mb-2 font-semibold text-frost-white/60">נתוני שאלון</h4>
                <pre className="max-h-60 overflow-auto text-xs text-frost-white/50" dir="ltr">
                  {JSON.stringify(selectedPatient.questionnaire, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* MODAL: Match Patient to Therapist */}
      <Modal
        open={!!matchingPatient}
        onClose={() => setMatchingPatient(null)}
        title={`שיבוץ מטפל ל${matchingPatient?.full_name || ''}`}
      >
        {matchingPatient && (
          <div className="space-y-5">
            <p className="text-sm text-frost-white/60">
              בחרו מטפל פעיל לשיבוץ:
            </p>
            <select
              value={matchTherapistId}
              onChange={(e) => setMatchTherapistId(e.target.value)}
              className="w-full rounded-xl border border-frost-white/[0.08] bg-white/[0.06] px-4 py-3 text-sm text-frost-white focus:border-dusty-aqua/50 focus:outline-none"
            >
              <option value="" className="bg-deep-petrol">— בחרו מטפל —</option>
              {activeTherapists.map((t) => (
                <option key={t.id} value={t.id} className="bg-deep-petrol">
                  {t.full_name} — {t.city} ({t.specialization || 'כללי'})
                </option>
              ))}
            </select>

            <button
              onClick={matchPatientToTherapist}
              disabled={!matchTherapistId}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-gold to-warm-gold py-3 text-sm font-bold text-deep-petrol transition-all hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Link2 size={16} />
              שיבוץ
            </button>
          </div>
        )}
      </Modal>
    </div>
  )
}
