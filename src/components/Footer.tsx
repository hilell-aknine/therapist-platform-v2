import { Heart } from 'lucide-react'

const footerLinks = [
  { label: 'הכשרת מטפלים', href: '#training' },
  { label: 'הכשרות', href: '#courses' },
  { label: 'מי אנחנו', href: '#about' },
  { label: 'המיזם החברתי', href: '#social-initiative' },
]

const socialLinks = [
  { label: 'Facebook', href: '#', icon: 'f' },
  { label: 'Instagram', href: '#', icon: 'in' },
  { label: 'WhatsApp', href: '#', icon: 'wa' },
]

export default function Footer() {
  return (
    <footer className="relative border-t border-white/[0.06] bg-[#002A32]">
      {/* Quote strip */}
      <div className="border-b border-white/[0.04] py-8 text-center">
        <p className="font-['Frank_Ruhl_Libre',serif] text-lg font-medium tracking-wide text-frost-white/40 italic">
          "המקום בו טיפול פוגש שליחות"
        </p>
      </div>

      <div className="mx-auto max-w-6xl px-5 py-10">
        <div className="flex flex-col items-center gap-8 md:flex-row md:items-start md:justify-between">
          {/* Brand */}
          <div className="text-center md:text-right">
            <a href="#home" className="mb-3 inline-flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-gold to-warm-gold">
                <Heart className="h-4 w-4 text-deep-petrol" fill="currentColor" />
              </div>
              <span className="font-['Frank_Ruhl_Libre',serif] text-base font-bold text-frost-white">
                בית <span className="text-gold">המטפלים</span>
              </span>
            </a>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-frost-white/40">
              הפלטפורמה המקצועית הראשונה בישראל שנבנתה במיוחד עבור מטפלים
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-col items-center gap-1 md:items-start">
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-widest text-frost-white/30">
              לימודים
            </h4>
            {footerLinks.map((link) => (
              <a
                key={link.href + link.label}
                href={link.href}
                className="py-1 text-sm text-frost-white/50 transition-colors hover:text-frost-white"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Social */}
          <div className="flex flex-col items-center gap-3 md:items-start">
            <h4 className="mb-1 text-xs font-semibold uppercase tracking-widest text-frost-white/30">
              עקבו אחרינו
            </h4>
            <div className="flex gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-frost-white/10 text-xs font-bold text-frost-white/40 transition-all hover:border-gold/30 hover:text-gold"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/[0.04] py-5 text-center">
        <p className="text-xs text-frost-white/25">
          &copy; {new Date().getFullYear()} בית המטפלים. כל הזכויות שמורות.
        </p>
      </div>
    </footer>
  )
}
