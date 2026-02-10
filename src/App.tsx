import { Routes, Route } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, Brain, Shield, Sparkles } from 'lucide-react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import StatsStrip from './components/StatsStrip'
import TrainingHighlights from './components/TrainingHighlights'
import MissionQuote from './components/MissionQuote'
import CoursesGrid from './components/CoursesGrid'
import About from './components/About'
import TrainingProgram from './components/TrainingProgram'
import SocialInitiative from './components/SocialInitiative'
import Footer from './components/Footer'
import CoursePortal from './components/portal/CoursePortal'
import './App.css'

const floatingIcons = [
  { icon: Heart, x: '10%', y: '20%', delay: 0, duration: 6 },
  { icon: Brain, x: '85%', y: '15%', delay: 1, duration: 7 },
  { icon: Shield, x: '75%', y: '70%', delay: 2, duration: 5 },
  { icon: Sparkles, x: '15%', y: '75%', delay: 0.5, duration: 8 },
  { icon: Heart, x: '50%', y: '85%', delay: 1.5, duration: 6 },
  { icon: Brain, x: '90%', y: '45%', delay: 3, duration: 7 },
]

function HomePage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-bl from-deep-petrol via-muted-teal to-deep-petrol font-['Heebo',sans-serif]">
      <Navbar />

      {/* Animated background orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-[-20%] right-[-10%] h-[600px] w-[600px] rounded-full bg-dusty-aqua/20 blur-[120px]"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-[-20%] left-[-10%] h-[500px] w-[500px] rounded-full bg-gold/10 blur-[100px]"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-[40%] left-[40%] h-[300px] w-[300px] rounded-full bg-dusty-aqua/10 blur-[80px]"
          animate={{ x: [0, 50, 0], y: [0, -30, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Floating icons */}
      {floatingIcons.map((item, i) => {
        const Icon = item.icon
        return (
          <motion.div
            key={i}
            className="pointer-events-none absolute text-frost-white/[0.07]"
            style={{ left: item.x, top: item.y }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: item.duration,
              repeat: Infinity,
              delay: item.delay,
              ease: 'easeInOut',
            }}
          >
            <Icon size={48} />
          </motion.div>
        )
      })}

      {/* Page Sections */}
      <div className="relative z-10">
        <div className="flex flex-col items-center px-4 pt-24 pb-12">
          <Hero />
        </div>
        <StatsStrip />
        <TrainingHighlights />
        <MissionQuote />
        <div className="flex flex-col items-center px-4 py-12">
          <CoursesGrid />
        </div>
        <About />
        <TrainingProgram />
        <SocialInitiative />
      </div>

      <Footer />
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/course/:slug" element={<CoursePortal />} />
    </Routes>
  )
}

export default App
