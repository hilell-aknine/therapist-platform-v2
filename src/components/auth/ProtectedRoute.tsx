import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import type { UserRole } from '../../types/database'
import { Loader2 } from 'lucide-react'

interface Props {
  allowedRoles: UserRole[]
  requireLegalConsent?: boolean
}

export default function ProtectedRoute({ allowedRoles, requireLegalConsent = false }: Props) {
  const { user, profile, loading, legalConsent } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-deep-petrol to-[#002a32]">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />

  if (requireLegalConsent && !legalConsent) return <Navigate to="/legal-gate" replace />

  if (profile && !allowedRoles.includes(profile.role)) return <Navigate to="/" replace />

  return <Outlet />
}
