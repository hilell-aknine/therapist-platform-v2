import type { ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

interface Props {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  wide?: boolean
}

export default function Modal({ open, onClose, title, children, wide }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25 }}
            className={`fixed inset-x-4 top-[10%] z-50 mx-auto max-h-[80vh] overflow-y-auto rounded-2xl border border-frost-white/[0.08] bg-[#003540] p-6 shadow-2xl ${
              wide ? 'max-w-3xl' : 'max-w-lg'
            }`}
          >
            {/* Header */}
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-['Frank_Ruhl_Libre',serif] text-lg font-bold text-frost-white">{title}</h2>
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-frost-white/40 transition-colors hover:bg-white/[0.06] hover:text-frost-white"
              >
                <X size={18} />
              </button>
            </div>

            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
