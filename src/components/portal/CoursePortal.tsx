import { useState, useEffect, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight, ChevronDown, ChevronLeft, ChevronRight,
  Play, Check, BookOpen, FileText, Menu, X,
  GraduationCap,
} from 'lucide-react'
import { allCourses, getAllLessons, getAdjacentLessons, type Lesson, type Module } from '../../data/courses'

// ==========================================
// Progress helpers (localStorage)
// ==========================================
function getCompleted(): Set<string> {
  try {
    const raw = localStorage.getItem('completedLessons')
    return new Set(raw ? JSON.parse(raw) : [])
  } catch { return new Set() }
}

function toggleCompleted(id: string): Set<string> {
  const set = getCompleted()
  if (set.has(id)) set.delete(id)
  else set.add(id)
  localStorage.setItem('completedLessons', JSON.stringify([...set]))
  return new Set(set)
}

// ==========================================
// Transcript loader
// ==========================================
interface TranscriptLesson {
  id: string
  title: string
  duration: string
  transcript: string
}

interface TranscriptModule {
  id: number
  title: string
  lessons: TranscriptLesson[]
}

async function loadTranscript(lessonId: string): Promise<string | null> {
  try {
    const res = await fetch('/data/nlp-course-transcripts.json')
    const modules: TranscriptModule[] = await res.json()
    for (const mod of modules) {
      for (const lesson of mod.lessons) {
        if (lesson.id === lessonId) return lesson.transcript
      }
    }
    return null
  } catch { return null }
}

// ==========================================
// Main Component
// ==========================================
export default function CoursePortal() {
  const { slug } = useParams<{ slug: string }>()
  const course = slug ? allCourses[slug] : null

  const [currentLessonId, setCurrentLessonId] = useState<string>('')
  const [completed, setCompleted] = useState<Set<string>>(getCompleted)
  const [expandedModules, setExpandedModules] = useState<Set<number>>(new Set([1]))
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'video' | 'transcript'>('video')
  const [transcript, setTranscript] = useState<string | null>(null)
  const [loadingTranscript, setLoadingTranscript] = useState(false)

  // Initialize first lesson
  useEffect(() => {
    if (course && !currentLessonId) {
      setCurrentLessonId(course.modules[0].lessons[0].id)
    }
  }, [course, currentLessonId])

  // Load transcript when switching lessons
  useEffect(() => {
    if (!currentLessonId || !course) return
    setLoadingTranscript(true)
    loadTranscript(currentLessonId).then(t => {
      setTranscript(t)
      setLoadingTranscript(false)
    })
  }, [currentLessonId, course])

  // Scroll to top on lesson change
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [currentLessonId])

  const selectLesson = useCallback((lessonId: string) => {
    setCurrentLessonId(lessonId)
    setActiveTab('video')
    setSidebarOpen(false)
  }, [])

  const handleComplete = useCallback(() => {
    if (!currentLessonId) return
    setCompleted(toggleCompleted(currentLessonId))
  }, [currentLessonId])

  const toggleModule = useCallback((moduleId: number) => {
    setExpandedModules(prev => {
      const next = new Set(prev)
      if (next.has(moduleId)) next.delete(moduleId)
      else next.add(moduleId)
      return next
    })
  }, [])

  if (!course) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-deep-petrol font-['Heebo',sans-serif]">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-frost-white">הקורס לא נמצא</h1>
          <Link to="/" className="text-gold hover:underline">חזרה לדף הבית</Link>
        </div>
      </div>
    )
  }

  const allLessons = getAllLessons(course)
  const totalLessons = allLessons.length
  const completedCount = allLessons.filter(l => completed.has(l.id)).length
  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0
  const { prev, next } = currentLessonId ? getAdjacentLessons(course, currentLessonId) : { prev: null, next: null }
  const currentLesson = allLessons.find(l => l.id === currentLessonId)

  // Find which module current lesson belongs to
  const currentModuleId = course.modules.find(m => m.lessons.some(l => l.id === currentLessonId))?.id

  return (
    <div className="flex min-h-screen bg-[#001E24] font-['Heebo',sans-serif]">
      {/* ===== SIDEBAR ===== */}
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <aside
        className={`fixed top-0 right-0 z-50 flex h-full w-[320px] flex-col border-l border-white/[0.06] bg-[#001A20] transition-transform duration-300 md:relative md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'
        }`}
      >
        {/* Sidebar header */}
        <div className="border-b border-white/[0.06] p-5">
          <div className="mb-3 flex items-center justify-between">
            <Link to="/" className="group flex items-center gap-2 text-frost-white/70 transition-colors hover:text-gold">
              <ArrowRight size={18} />
              <span className="text-sm">חזרה לאתר</span>
            </Link>
            <button onClick={() => setSidebarOpen(false)} className="text-frost-white/50 md:hidden">
              <X size={20} />
            </button>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-gold to-warm-gold">
              <GraduationCap size={18} className="text-deep-petrol" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-frost-white">{course.title}</h2>
              <p className="text-xs text-frost-white/40">{totalLessons} שיעורים · {course.modules.length} מודולים</p>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="border-b border-white/[0.06] px-5 py-3">
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="text-frost-white/50">התקדמות</span>
            <span className="font-semibold text-gold">{progressPercent}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full bg-gradient-to-l from-gold to-warm-gold"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <p className="mt-1 text-[11px] text-frost-white/30">{completedCount} מתוך {totalLessons} שיעורים הושלמו</p>
        </div>

        {/* Module list */}
        <div className="flex-1 overflow-y-auto">
          {course.modules.map((mod) => (
            <ModuleAccordion
              key={mod.id}
              module={mod}
              expanded={expandedModules.has(mod.id)}
              onToggle={() => toggleModule(mod.id)}
              currentLessonId={currentLessonId}
              completed={completed}
              onSelectLesson={selectLesson}
              isCurrentModule={mod.id === currentModuleId}
            />
          ))}
        </div>
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <main className="flex-1 overflow-y-auto">
        {/* Top bar */}
        <div className="sticky top-0 z-30 flex items-center justify-between border-b border-white/[0.06] bg-[#001E24]/95 px-4 py-3 backdrop-blur-xl md:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-frost-white/60 transition-colors hover:bg-white/10 md:hidden"
            >
              <Menu size={20} />
            </button>
            <div>
              <p className="text-xs text-frost-white/40">
                {course.modules.find(m => m.lessons.some(l => l.id === currentLessonId))?.title}
              </p>
              <h3 className="text-sm font-semibold text-frost-white">{currentLesson?.title}</h3>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => prev && selectLesson(prev.id)}
              disabled={!prev}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-frost-white/50 transition-colors hover:bg-white/10 disabled:opacity-20"
            >
              <ChevronRight size={18} />
            </button>
            <button
              onClick={() => next && selectLesson(next.id)}
              disabled={!next}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-frost-white/50 transition-colors hover:bg-white/10 disabled:opacity-20"
            >
              <ChevronLeft size={18} />
            </button>
          </div>
        </div>

        {/* Video + content area */}
        <div className="mx-auto max-w-4xl px-4 py-6 md:px-8">
          {/* Video player */}
          <div className="mb-6 overflow-hidden rounded-2xl border border-white/[0.06] bg-black shadow-2xl">
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              {currentLessonId && !currentLessonId.startsWith('master-') ? (
                <iframe
                  key={currentLessonId}
                  src={`https://www.youtube.com/embed/${currentLessonId}?rel=0&modestbranding=1`}
                  title={currentLesson?.title}
                  className="absolute inset-0 h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-deep-petrol/50">
                  <div className="text-center">
                    <Play size={48} className="mx-auto mb-3 text-gold/50" />
                    <p className="text-frost-white/40">הסרטון יהיה זמין בקרוב</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Lesson info + actions */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-frost-white">{currentLesson?.title}</h2>
              <p className="text-sm text-frost-white/40">{currentLesson?.duration} דקות</p>
            </div>
            <button
              onClick={handleComplete}
              className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all ${
                completed.has(currentLessonId)
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'bg-gradient-to-l from-gold to-warm-gold text-deep-petrol hover:brightness-110'
              }`}
            >
              <Check size={16} />
              {completed.has(currentLessonId) ? 'הושלם!' : 'סמן כהושלם'}
            </button>
          </div>

          {/* Tabs */}
          <div className="mb-4 flex gap-1 rounded-xl border border-white/[0.06] bg-white/[0.03] p-1">
            <TabButton active={activeTab === 'video'} onClick={() => setActiveTab('video')} icon={<Play size={14} />} label="שיעור" />
            <TabButton active={activeTab === 'transcript'} onClick={() => setActiveTab('transcript')} icon={<FileText size={14} />} label="תמלול" />
          </div>

          {/* Tab content */}
          <AnimatePresence mode="wait">
            {activeTab === 'video' && (
              <motion.div
                key="video"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <BookOpen size={20} className="text-gold" />
                  <h3 className="text-lg font-bold text-frost-white">על השיעור</h3>
                </div>
                <p className="text-sm leading-relaxed text-frost-white/60">
                  שיעור זה הוא חלק ממודול "{course.modules.find(m => m.lessons.some(l => l.id === currentLessonId))?.title}".
                  צפו בסרטון ולחצו "סמן כהושלם" כשסיימתם.
                </p>

                {/* Navigation buttons */}
                <div className="mt-6 flex gap-3">
                  {prev && (
                    <button
                      onClick={() => selectLesson(prev.id)}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] py-3 text-sm text-frost-white/60 transition-all hover:border-gold/20 hover:text-frost-white"
                    >
                      <ChevronRight size={16} />
                      {prev.title}
                    </button>
                  )}
                  {next && (
                    <button
                      onClick={() => selectLesson(next.id)}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gold/20 bg-gold/5 py-3 text-sm text-gold transition-all hover:bg-gold/10"
                    >
                      {next.title}
                      <ChevronLeft size={16} />
                    </button>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'transcript' && (
              <motion.div
                key="transcript"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <FileText size={20} className="text-gold" />
                  <h3 className="text-lg font-bold text-frost-white">תמלול השיעור</h3>
                </div>
                {loadingTranscript ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold/20 border-t-gold" />
                  </div>
                ) : transcript ? (
                  <div className="max-h-[60vh] overflow-y-auto rounded-xl bg-white/[0.02] p-4">
                    <p className="whitespace-pre-wrap text-sm leading-[2] text-frost-white/70">
                      {transcript}
                    </p>
                  </div>
                ) : (
                  <p className="py-8 text-center text-sm text-frost-white/30">
                    אין תמלול זמין לשיעור זה
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}

// ==========================================
// Sub-components
// ==========================================

function TabButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2.5 text-sm font-medium transition-all ${
        active
          ? 'bg-white/[0.08] text-gold shadow-sm'
          : 'text-frost-white/40 hover:text-frost-white/60'
      }`}
    >
      {icon}
      {label}
    </button>
  )
}

function ModuleAccordion({
  module,
  expanded,
  onToggle,
  currentLessonId,
  completed,
  onSelectLesson,
  isCurrentModule,
}: {
  module: Module
  expanded: boolean
  onToggle: () => void
  currentLessonId: string
  completed: Set<string>
  onSelectLesson: (id: string) => void
  isCurrentModule: boolean
}) {
  const moduleCompleted = module.lessons.filter(l => completed.has(l.id)).length
  const moduleTotal = module.lessons.length
  const allDone = moduleCompleted === moduleTotal

  return (
    <div className="border-b border-white/[0.04]">
      <button
        onClick={onToggle}
        className={`flex w-full items-center justify-between px-5 py-3.5 transition-colors hover:bg-white/[0.03] ${
          isCurrentModule ? 'bg-white/[0.04]' : ''
        }`}
      >
        <div className="flex items-center gap-3 text-right">
          <div className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold ${
            allDone
              ? 'bg-green-500/20 text-green-400'
              : isCurrentModule
              ? 'bg-gold/20 text-gold'
              : 'bg-white/[0.06] text-frost-white/40'
          }`}>
            {allDone ? <Check size={14} /> : module.id}
          </div>
          <div>
            <p className={`text-sm font-medium ${isCurrentModule ? 'text-frost-white' : 'text-frost-white/70'}`}>
              {module.title}
            </p>
            <p className="text-[11px] text-frost-white/30">{moduleCompleted}/{moduleTotal} שיעורים</p>
          </div>
        </div>
        <ChevronDown
          size={16}
          className={`text-frost-white/30 transition-transform ${expanded ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pb-2">
              {module.lessons.map((lesson, idx) => (
                <LessonItem
                  key={lesson.id}
                  lesson={lesson}
                  index={idx + 1}
                  isCurrent={lesson.id === currentLessonId}
                  isCompleted={completed.has(lesson.id)}
                  onClick={() => onSelectLesson(lesson.id)}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function LessonItem({
  lesson,
  index,
  isCurrent,
  isCompleted,
  onClick,
}: {
  lesson: Lesson
  index: number
  isCurrent: boolean
  isCompleted: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 px-5 py-2.5 text-right transition-all hover:bg-white/[0.04] ${
        isCurrent ? 'bg-gold/[0.08] border-r-2 border-gold' : ''
      }`}
    >
      <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
        isCompleted
          ? 'bg-green-500/20 text-green-400'
          : isCurrent
          ? 'bg-gold/20 text-gold'
          : 'bg-white/[0.06] text-frost-white/30'
      }`}>
        {isCompleted ? <Check size={12} /> : isCurrent ? <Play size={10} fill="currentColor" /> : index}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`truncate text-[13px] ${
          isCurrent ? 'font-semibold text-gold' : 'text-frost-white/60'
        }`}>
          {lesson.title}
        </p>
      </div>
      <span className="shrink-0 text-[11px] text-frost-white/25">{lesson.duration}</span>
    </button>
  )
}
