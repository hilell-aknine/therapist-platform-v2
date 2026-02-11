const statusStyles: Record<string, string> = {
  pending: 'bg-yellow-500/15 text-yellow-300',
  active: 'bg-emerald-500/15 text-emerald-300',
  inactive: 'bg-gray-500/15 text-gray-400',
  matched: 'bg-blue-500/15 text-blue-300',
  in_treatment: 'bg-emerald-500/15 text-emerald-300',
  completed: 'bg-purple-500/15 text-purple-300',
  new: 'bg-cyan-500/15 text-cyan-300',
  contacted: 'bg-yellow-500/15 text-yellow-300',
  converted: 'bg-emerald-500/15 text-emerald-300',
}

const statusLabels: Record<string, string> = {
  pending: 'ממתין',
  active: 'פעיל',
  inactive: 'לא פעיל',
  matched: 'הותאם',
  in_treatment: 'בטיפול',
  completed: 'הושלם',
  new: 'חדש',
  contacted: 'נוצר קשר',
  converted: 'הומר',
}

interface Props {
  status: string
}

export default function StatusBadge({ status }: Props) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[status] || 'bg-gray-500/15 text-gray-400'}`}>
      {statusLabels[status] || status}
    </span>
  )
}
