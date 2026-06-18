import { useState } from 'react'
import { ChevronDown, Lock } from 'lucide-react'

export default function GovBanner() {
  const [open, setOpen] = useState(false)

  return (
    <div style={{ background: '#1b2a3b', color: 'rgba(255,255,255,0.75)', fontSize: 12 }}>
      {/* Collapsed bar */}
      <div className="px-4 py-1.5 flex items-center justify-between max-w-screen-xl mx-auto">
        <span className="flex items-center gap-2 font-medium">
          <span aria-hidden="true" style={{ fontSize: 14 }}>🇺🇸</span>
          A secure web application for U.S. citizenship determination guidance.
        </span>
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-1 font-semibold text-[11px] hover:underline focus:outline-none focus:ring-2 focus:ring-white/30 rounded"
          style={{ color: '#93c5fd' }}
          aria-expanded={open}
          aria-controls="gov-banner-panel"
        >
          Here&apos;s how you know
          <ChevronDown
            size={12}
            aria-hidden="true"
            style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 200ms ease' }}
          />
        </button>
      </div>

      {/* Expanded panel */}
      {open && (
        <div
          id="gov-banner-panel"
          className="border-t px-4 py-5 max-w-screen-xl mx-auto grid sm:grid-cols-2 gap-5"
          style={{ borderColor: 'rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.25)' }}
        >
          <div className="flex gap-3">
            <span style={{ fontSize: 20 }} aria-hidden="true">🏛️</span>
            <div>
              <p className="font-semibold text-white mb-0.5">Built by MetaPhase</p>
              <p style={{ color: 'rgba(255,255,255,0.55)', lineHeight: 1.5 }}>
                VeriCase walks through U.S. citizenship and naturalization law one question
                at a time, citing the controlling statute or case law at every step.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Lock size={18} className="flex-shrink-0 mt-0.5" style={{ color: '#93c5fd' }} aria-hidden="true" />
            <div>
              <p className="font-semibold text-white mb-0.5">Secure https:// connection</p>
              <p style={{ color: 'rgba(255,255,255,0.55)', lineHeight: 1.5 }}>
                A lock icon or <strong className="text-white/80">https://</strong> means you&apos;re connected securely.
                Every VeriCase page requires HTTPS, with traffic encrypted in transit using TLS.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
