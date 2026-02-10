import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

interface Stat {
  target: number
  suffix: string
  label: string
}

const stats: Stat[] = [
  { target: 500, suffix: '+', label: 'בוגרים' },
  { target: 12, suffix: '', label: 'שנות ניסיון' },
  { target: 98, suffix: '%', label: 'שביעות רצון' },
]

function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const animated = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true
          const duration = 2000
          const start = performance.now()

          function tick(now: number) {
            const progress = Math.min((now - start) / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setCount(Math.floor(target * eased))
            if (progress < 1) requestAnimationFrame(tick)
            else setCount(target)
          }

          requestAnimationFrame(tick)
        }
      },
      { threshold: 0.3 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [target])

  return (
    <div ref={ref} className="font-['Frank_Ruhl_Libre',serif] text-5xl font-extrabold leading-none text-frost-white md:text-6xl">
      {count}
      {suffix && <span className="text-3xl font-bold text-gold md:text-4xl">{suffix}</span>}
    </div>
  )
}

export default function StatsStrip() {
  return (
    <section className="border-y border-white/[0.06] bg-deep-petrol/80 py-12 backdrop-blur-sm">
      <div className="mx-auto grid max-w-3xl grid-cols-1 gap-8 px-6 sm:grid-cols-3">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.15 }}
            className="relative text-center"
          >
            <AnimatedCounter target={stat.target} suffix={stat.suffix} />
            <p className="mt-1 text-sm font-medium text-frost-white/50">{stat.label}</p>

            {/* Divider — hidden on last item and on mobile */}
            {i < stats.length - 1 && (
              <div className="absolute top-[15%] bottom-[15%] left-0 hidden w-px bg-white/[0.08] sm:block" />
            )}
          </motion.div>
        ))}
      </div>
    </section>
  )
}
