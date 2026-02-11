import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import CoursesPage from './pages/CoursesPage'
import TrainingPage from './pages/TrainingPage'
import SocialInitiativePage from './pages/SocialInitiativePage'
import CoursePortal from './components/portal/CoursePortal'
import PatientApplyPage from './pages/PatientApplyPage'
import TherapistApplyPage from './pages/TherapistApplyPage'
import LoginPage from './pages/LoginPage'
import LegalGatePage from './pages/LegalGatePage'
import ProtectedRoute from './components/auth/ProtectedRoute'
import PatientDashboard from './pages/dashboard/PatientDashboard'
import TherapistDashboard from './pages/dashboard/TherapistDashboard'
import AdminDashboard from './pages/dashboard/AdminDashboard'
import './App.css'

function App() {
  return (
    <Routes>
      {/* Public pages with shared layout */}
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/training" element={<TrainingPage />} />
        <Route path="/social-initiative" element={<SocialInitiativePage />} />
      </Route>

      {/* Standalone public pages */}
      <Route path="/course/:slug" element={<CoursePortal />} />
      <Route path="/patient-apply" element={<PatientApplyPage />} />
      <Route path="/therapist-apply" element={<TherapistApplyPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/legal-gate" element={<LegalGatePage />} />

      {/* Protected dashboards */}
      <Route element={<ProtectedRoute allowedRoles={['patient']} requireLegalConsent />}>
        <Route path="/dashboard/patient" element={<PatientDashboard />} />
      </Route>
      <Route element={<ProtectedRoute allowedRoles={['therapist']} requireLegalConsent />}>
        <Route path="/dashboard/therapist" element={<TherapistDashboard />} />
      </Route>
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route path="/dashboard/admin" element={<AdminDashboard />} />
      </Route>
    </Routes>
  )
}

export default App
