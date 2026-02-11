export type UserRole = 'admin' | 'therapist' | 'patient' | 'student_lead'

export interface Profile {
  id: string
  email: string
  full_name: string
  role: UserRole
  avatar_url?: string
  phone?: string
  created_at: string
}

export interface LegalConsent {
  id: string
  user_id: string
  version: string
  ip_address: string
  user_agent: string
  signed_at: string
}

export interface Therapist {
  id: string
  user_id?: string
  full_name: string
  email: string
  phone: string
  specialization: string
  city: string
  status: 'pending' | 'active' | 'inactive'
  bio?: string
  avatar_url?: string
  created_at: string
}

export interface Patient {
  id: string
  full_name: string
  email: string
  phone: string
  city: string
  status: 'pending' | 'matched' | 'in_treatment' | 'completed'
  therapist_id?: string
  therapist?: Therapist
  questionnaire?: Record<string, unknown>
  signature_data?: string
  created_at: string
}

export interface ContactRequest {
  id: string
  full_name: string
  email: string
  phone: string
  message?: string
  source?: string
  status: 'new' | 'contacted' | 'converted'
  created_at: string
}
