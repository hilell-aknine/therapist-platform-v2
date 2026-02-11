import type { LucideIcon } from 'lucide-react'

interface Props {
  icon: LucideIcon
  label: string
  value: string | number
  color?: 'gold' | 'aqua' | 'teal' | 'white'
}

const colorMap = {
  gold: 'from-gold/20 to-warm-gold/10 text-gold',
  aqua: 'from-dusty-aqua/20 to-dusty-aqua/10 text-dusty-aqua',
  teal: 'from-muted-teal/20 to-muted-teal/10 text-muted-teal',
  white: 'from-frost-white/10 to-frost-white/5 text-frost-white',
}

export default function StatCard({ icon: Icon, label, value, color = 'gold' }: Props) {
  return (
    <div className="rounded-2xl border border-frost-white/[0.06] bg-white/[0.04] p-5 backdrop-blur-sm">
      <div className="mb-3 flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${colorMap[color]}`}>
          <Icon size={20} />
        </div>
        <span className="text-sm text-frost-white/50">{label}</span>
      </div>
      <p className="font-['Frank_Ruhl_Libre',serif] text-3xl font-bold text-frost-white">{value}</p>
    </div>
  )
}
