import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import type { User, Session } from '@supabase/supabase-js'
import type { Profile, UserRole } from '../types/database'

interface AuthContextType {
  user: User | null
  profile: Profile | null
  loading: boolean
  legalConsent: boolean
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
  refreshLegalConsent: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const LEGAL_VERSION = '1.0'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [legalConsent, setLegalConsent] = useState(false)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  async function fetchProfile(userId: string) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    if (data) setProfile(data as Profile)
    return data as Profile | null
  }

  async function checkLegalConsent(userId: string) {
    const { data } = await supabase
      .from('legal_consents')
      .select('id')
      .eq('user_id', userId)
      .eq('version', LEGAL_VERSION)
      .limit(1)
    const hasConsent = !!(data && data.length > 0)
    setLegalConsent(hasConsent)
    return hasConsent
  }

  async function refreshProfile() {
    if (user) await fetchProfile(user.id)
  }

  async function refreshLegalConsent() {
    if (user) await checkLegalConsent(user.id)
  }

  useEffect(() => {
    let mounted = true

    async function init() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!mounted) return

      if (session?.user) {
        setUser(session.user)
        await fetchProfile(session.user.id)
        await checkLegalConsent(session.user.id)
      }
      setLoading(false)
    }

    init()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event: string, session: Session | null) => {
        if (!mounted) return
        if (session?.user) {
          setUser(session.user)
          await fetchProfile(session.user.id)
          await checkLegalConsent(session.user.id)
        } else {
          setUser(null)
          setProfile(null)
          setLegalConsent(false)
        }
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { error: error.message }
    return { error: null }
  }

  async function signOut() {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
    setLegalConsent(false)
    navigate('/')
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, legalConsent, signIn, signOut, refreshProfile, refreshLegalConsent }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export function getDashboardPath(role: UserRole | undefined): string {
  switch (role) {
    case 'admin': return '/dashboard/admin'
    case 'therapist': return '/dashboard/therapist'
    case 'patient': return '/dashboard/patient'
    default: return '/'
  }
}
