import React from 'react'
import { Shield, ClipboardCheck, Zap, Users, ChevronRight, WifiOff } from 'lucide-react'
import { useOnlineStatus } from '../useOnlineStatus'

const heroStyle: React.CSSProperties = {
  background: 'linear-gradient(-45deg, #14532d, #0d4a24, #166534, #1a7a3e)',
  backgroundSize: '400% 400%',
  animation: 'hero-gradient 14s ease infinite',
}

const shineStyle: React.CSSProperties = {
  position: 'absolute',
  top: 0, left: 0,
  width: '140px', height: '100%',
  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.03), transparent)',
  animation: 'hero-shine 20s ease-in-out infinite',
  animationDelay: '6s',
  pointerEvents: 'none',
}

const gradientTextStyle: React.CSSProperties = {
  background: 'linear-gradient(90deg, #4ade80, #86efac, #ffffff, #86efac, #4ade80)',
  backgroundSize: '200% auto',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  animation: 'gradient-text 6s linear infinite',
}

export default function LandingPage({ onStart }: { onStart: () => void }) {
  const online = useOnlineStatus()

  return (
    <div>
      {/* Hero */}
      <section
        className="relative min-h-screen flex flex-col px-6 py-20 text-white overflow-hidden"
        style={heroStyle}
        aria-label="Hero"
      >
        <div style={shineStyle} aria-hidden="true" />

        {/* Top bar */}
        <div className="relative z-10 w-full max-w-6xl mx-auto flex items-center justify-between mb-16">
          <div className="flex items-center gap-2">
            <Shield size={18} strokeWidth={1.5} className="text-green-300" aria-hidden="true" />
            <span className="font-bold tracking-tight text-white text-base">VeriCase</span>
          </div>
          <div className="flex items-center gap-3">
            {/* Online status indicator */}
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold"
              style={
                online
                  ? { background: 'rgba(74,222,128,0.12)', border: '1px solid rgba(74,222,128,0.25)', color: '#86efac' }
                  : { background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.4)' }
              }
            >
              {online ? (
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" style={{ animation: 'pulse-out 2.5s ease-out infinite' }} />
              ) : (
                <WifiOff size={10} aria-hidden="true" />
              )}
              {online ? 'Online' : 'Offline'}
            </div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40 select-none">
              A MetaPhase Demo
            </span>
          </div>
        </div>

        {/* Hero content */}
        <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col items-center lg:flex-row lg:items-center lg:gap-20 flex-1">

          {/* Left: text */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left flex-1 min-w-0">
            {/* Shield — mobile/tablet only */}
            <div className="relative mb-8 w-20 h-20 lg:hidden" aria-hidden="true">
              <div className="absolute rounded-3xl border border-white/15" style={{ inset: -10, animation: 'pulse-out 3.5s ease-out infinite' }} />
              <div className="absolute rounded-3xl border border-white/8"  style={{ inset: -20, animation: 'pulse-out 3.5s ease-out infinite', animationDelay: '1.2s' }} />
              <div className="w-full h-full rounded-3xl flex items-center justify-center border border-white/20" style={{ background: 'rgba(255,255,255,0.11)', backdropFilter: 'blur(8px)' }}>
                <Shield size={38} strokeWidth={1.5} />
              </div>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight leading-none mb-5 lg:mb-6">
              <span className="block text-white/80">Citizenship eligibility,</span>
              <span className="block" style={gradientTextStyle}>clarified.</span>
            </h1>

            <p className="text-sm md:text-base text-white/65 max-w-xs lg:max-w-sm leading-relaxed mb-10">
              A one-question-at-a-time flow across 4,223 legal paths. Every answer
              cites controlling statute or case law.
            </p>

            <button
              onClick={onStart}
              className="bg-white font-bold text-lg px-10 py-4 rounded-full shadow-xl
                hover:bg-white/90 active:scale-95 transition-all duration-200
                focus:outline-none focus:ring-4 focus:ring-white/40"
              style={{ color: '#14532d' }}
            >
              Begin Determination
            </button>

            {/* Offline notice — only shown when offline */}
            {!online && (
              <div
                className="flex items-center gap-2 mt-3 px-4 py-2 rounded-full text-xs font-semibold"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.5)' }}
              >
                <WifiOff size={12} aria-hidden="true" />
                Offline — determination available, location context unavailable
              </div>
            )}
          </div>

          {/* Right: demo card — desktop only */}
          <div className="hidden lg:block w-[400px] xl:w-[440px] flex-shrink-0">
            <div
              className="rounded-3xl p-6"
              style={{
                background: 'rgba(255,255,255,0.07)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.14)',
                boxShadow: '0 24px 48px rgba(0,0,0,0.22)',
              }}
            >
              {/* Header row */}
              <div className="flex items-center justify-between mb-5">
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/40 select-none">
                  Example
                </span>
                <span
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full"
                  style={{ background: 'rgba(74,222,128,0.18)', color: '#86efac' }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" aria-hidden="true" />
                  Live Preview
                </span>
              </div>

              {/* Example question */}
              <div
                className="rounded-2xl p-4 mb-4"
                style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.1)' }}
                aria-hidden="true"
              >
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/40">Question 1</span>
                <p className="text-base font-extrabold text-white leading-snug mt-1.5 mb-4">
                  Was the person born in the United States or its territories?
                </p>
                <div className="space-y-2 pointer-events-none select-none">
                  <div
                    className="flex items-center justify-between px-4 py-3 rounded-xl"
                    style={{ background: 'rgba(255,255,255,0.92)' }}
                  >
                    <span className="text-sm font-semibold" style={{ color: '#14532d' }}>Yes</span>
                    <ChevronRight size={14} style={{ color: '#14532d', opacity: 0.5 }} />
                  </div>
                  <div
                    className="flex items-center justify-between px-4 py-3 rounded-xl"
                    style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
                  >
                    <span className="text-sm font-semibold text-white/65">No</span>
                    <ChevronRight size={14} style={{ color: 'rgba(255,255,255,0.3)' }} />
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div aria-hidden="true">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/40">Progress</span>
                  <span className="text-[10px] font-bold text-white/40">7%</span>
                </div>
                <div className="w-full rounded-full overflow-hidden" style={{ height: 7, background: 'rgba(255,255,255,0.12)' }}>
                  <div
                    style={{
                      height: '100%',
                      width: '7%',
                      background: 'linear-gradient(90deg, #166534, #4ade80)',
                      borderRadius: 9999,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white px-6 py-16 md:py-24" aria-labelledby="features-heading">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cbp-emerald text-center mb-3">
            Built for Operations
          </p>
          <h2 id="features-heading" className="text-3xl md:text-4xl font-extrabold text-[#222] text-center mb-12 md:mb-16">
            How It Works
          </h2>
          <div className="grid gap-10 md:grid-cols-3 md:gap-8 lg:gap-12">
            <FeatureRow
              icon={<ClipboardCheck size={22} strokeWidth={2} style={{ color: '#065f46' }} />}
              iconBg="#dcfce7"
              title="Guided Case Review"
              description="47 questions across every citizenship pathway — birth, territory, naturalization, derivation, loss, and re-acquisition."
            />
            <FeatureRow
              icon={<Zap size={22} strokeWidth={2} style={{ color: '#14532d' }} />}
              iconBg="#dcfce7"
              title="4,223 Legal Paths"
              description="A proven total function: every path terminates in CITIZEN or NOT A CITIZEN, each citing controlling statute or case law."
            />
            <FeatureRow
              icon={<Users size={22} strokeWidth={2} style={{ color: '#334155' }} />}
              iconBg="#f1f5f9"
              title="Full Audit Trail"
              description="Every answer is recorded in sequence, giving a defensible step-by-step record of the determination."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#F6F6F6] border-t border-[#EEE] px-6 py-12">
        <div className="max-w-5xl mx-auto md:flex md:gap-16 md:items-start">
          <div className="mb-8 md:mb-0 md:flex-1">
            <div className="flex items-center gap-2 mb-3">
              <Shield size={14} strokeWidth={2} style={{ color: '#065f46' }} />
              <span className="font-bold text-sm tracking-tight" style={{ color: '#065f46' }}>VeriCase</span>
            </div>
            <p className="text-xs text-[#444] leading-relaxed max-w-xs">
              built by{' '}
              <a href="https://metaphase.tech" target="_blank" rel="noopener noreferrer"
                className="font-semibold hover:underline" style={{ color: '#f97316' }}>
                MetaPhase
              </a>
              . Location context powered by{' '}
              <a href="https://geoborder.metaphase.tech" target="_blank" rel="noopener noreferrer"
                className="font-semibold hover:underline" style={{ color: '#16a34a' }}>
                GeoBorder
              </a>
              . Not affiliated with or endorsed by DHS, CBP, USCIS, or any U.S. government agency.
              Educational use only — not legal advice. No data is collected or stored.
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#333] mb-4">More Information</p>
            <nav aria-label="More information links">
              <ul className="space-y-3">
                <li><a href="https://www.uscis.gov/citizenship" target="_blank" rel="noopener noreferrer" className="text-sm hover:underline" style={{ color: '#065f46' }}>U.S. Citizenship Overview →</a></li>
                <li><a href="https://www.uscis.gov/citizenship/learn-about-citizenship" target="_blank" rel="noopener noreferrer" className="text-sm hover:underline" style={{ color: '#065f46' }}>Certificate of Citizenship →</a></li>
              </ul>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureRow({ icon, iconBg, title, description }: { icon: React.ReactNode; iconBg: string; title: string; description: string }) {
  return (
    <div className="flex gap-5">
      <div className="flex-shrink-0 w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: iconBg }}>{icon}</div>
      <div>
        <h3 className="font-bold text-[#222] mb-1">{title}</h3>
        <p className="text-sm text-[#444] leading-relaxed">{description}</p>
      </div>
    </div>
  )
}
