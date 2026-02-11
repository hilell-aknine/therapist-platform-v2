import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Heart, LogOut } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

interface Props {
  title: string
  children: ReactNode
}

export default function DashboardShell({ title, children }: Props) {
  const { profile, signOut } = useAuth()

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-b from-deep-petrol to-[#002a32]">
      {/* Top bar */}
      <header className="border-b border-frost-white/[0.06] bg-deep-petrol/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-gold to-warm-gold shadow-md shadow-gold/20">
                <Heart className="h-4 w-4 text-deep-petrol" fill="currentColor" />
              </div>
              <span className="hidden font-['Frank_Ruhl_Libre',serif] text-base font-bold text-frost-white sm:inline">
                בית <span className="text-gold">המטפלים</span>
              </span>
            </Link>
            <span className="h-5 w-px bg-frost-white/10" />
            <h1 className="text-sm font-medium text-frost-white/70">{title}</h1>
          </div>

          <div className="flex items-center gap-4">
            {profile && (
              <span className="hidden text-sm text-frost-white/50 sm:inline">
                שלום, <span className="text-frost-white/80">{profile.full_name || profile.email}</span>
              </span>
            )}
            <button
              onClick={signOut}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-frost-white/50 transition-colors hover:bg-white/[0.06] hover:text-frost-white/80"
            >
              <LogOut size={15} />
              <span className="hidden sm:inline">התנתקות</span>
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-7xl px-5 py-8">
        {children}
      </main>
    </div>
  )
}
