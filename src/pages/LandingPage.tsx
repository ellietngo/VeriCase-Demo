import React from 'react'
import { Link } from 'react-router-dom'
import { Shield, ClipboardCheck, Zap, Users, ChevronDown, ChevronRight } from 'lucide-react'

const heroStyle: React.CSSProperties = {
  background: 'linear-gradient(-45deg, #00416A, #1a5c30, #003456, #0f4a23)',
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

export default function LandingPage() {
  return (
    <div>
      {/* Hero */}
      <section
        className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20 text-white overflow-hidden"
        style={heroStyle}
        aria-label="Hero"
      >
        <div style={shineStyle} aria-hidden="true" />

        {/* Two-column layout on large screens */}
        <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col items-center lg:flex-row lg:items-center lg:gap-20">

          {/* ── Left: text content ── */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left flex-1 min-w-0">
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-white/65 mb-8 select-none">
              A MetaPhase Demo
            </span>

            {/* Shield — shown on mobile/tablet, hidden on desktop where card takes over */}
            <div className="relative mb-8 w-24 h-24 lg:hidden" aria-hidden="true">
              <div
                className="absolute rounded-3xl border border-white/15"
                style={{ inset: -10, animation: 'pulse-out 3.5s ease-out infinite' }}
              />
              <div
                className="absolute rounded-3xl border border-white/8"
                style={{ inset: -20, animation: 'pulse-out 3.5s ease-out infinite', animationDelay: '1.2s' }}
              />
              <div
                className="w-full h-full rounded-3xl flex items-center justify-center border border-white/20"
                style={{ background: 'rgba(255,255,255,0.11)', backdropFilter: 'blur(8px)' }}
              >
                <Shield size={46} strokeWidth={1.5} />
              </div>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight leading-none mb-5 lg:mb-6">
              <span className="block text-white/85">Guided interview.</span>
              <span className="block text-white">Instant determination.</span>
            </h1>

            <p className="text-sm md:text-base text-white/75 max-w-xs lg:max-w-sm leading-relaxed mb-10">
              Fast, evidence-based citizenship verification for Border Patrol officers —
              one question at a time, every time.
            </p>

            <Link
              to="/verify"
              className="bg-white text-cbp-navy font-bold text-lg px-10 py-4 rounded-full shadow-xl
                hover:bg-white/90 active:scale-95 transition-all duration-200
                focus:outline-none focus:ring-4 focus:ring-white/50"
            >
              Begin Case
            </Link>
          </div>

          {/* ── Right: live demo preview card (desktop only) ── */}
          <div className="hidden lg:block w-[480px] xl:w-[520px] flex-shrink-0">
            <div
              className="rounded-3xl p-7"
              style={{
                background: 'rgba(255,255,255,0.07)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.16)',
                boxShadow: '0 24px 48px rgba(0,0,0,0.18)',
              }}
            >
              {/* Card header */}
              <div className="flex items-start justify-between mb-5">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.2em] text-white/55 mb-1">
                    Live Example
                  </p>
                  <p className="text-xl font-extrabold text-white">Citizenship Intake</p>
                </div>
                <span
                  className="flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-full flex-shrink-0"
                  style={{ background: 'rgba(0,160,0,0.22)', color: '#4ade80' }}
                >
                  <span className="text-[8px]" aria-hidden="true">●</span> Active
                </span>
              </div>

              {/* Mini question preview — static, non-interactive */}
              <div
                className="rounded-2xl p-5 mb-5"
                style={{
                  background: 'rgba(0,30,60,0.5)',
                  backdropFilter: 'blur(6px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
                aria-hidden="true"
              >
                <span className="text-sm font-bold uppercase tracking-[0.18em] text-white/50">
                  Question 1
                </span>
                <p className="text-lg font-extrabold text-white leading-snug mt-1.5 mb-4">
                  Are you a United States citizen?
                </p>
                <div className="space-y-2.5 pointer-events-none select-none">
                  <div
                    className="flex items-center gap-3 px-4 py-3 rounded-xl"
                    style={{ background: 'rgba(255,255,255,0.92)' }}
                  >
                    <span className="text-base font-semibold text-[#00416A] flex-1">Yes, I am a U.S. Citizen</span>
                    <ChevronRight size={16} style={{ color: '#00416A', opacity: 0.5 }} className="flex-shrink-0" aria-hidden="true" />
                  </div>
                  <div
                    className="flex items-center gap-3 px-4 py-3 rounded-xl"
                    style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.14)' }}
                  >
                    <span className="text-base font-semibold text-white/70 flex-1">No, I am not a U.S. Citizen</span>
                    <ChevronRight size={16} style={{ color: 'rgba(255,255,255,0.35)' }} className="flex-shrink-0" aria-hidden="true" />
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold uppercase tracking-[0.18em] text-white/55">
                    Guided Interview
                  </span>
                  <span className="text-sm font-bold uppercase tracking-[0.12em] text-white/55">
                    22% Complete
                  </span>
                </div>
                <div
                  className="w-full rounded-full overflow-hidden"
                  style={{ height: 10, background: 'rgba(255,255,255,0.18)' }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: '22%',
                      background: 'linear-gradient(90deg, #00416A, #1460AA)',
                      borderRadius: 9999,
                    }}
                  />
                </div>
              </div>

              {/* Feature chips */}
              <div className="grid grid-cols-3 gap-2">
                {['Guided flow', 'Auto-routing', 'Instant result'].map(chip => (
                  <div
                    key={chip}
                    className="text-center text-sm font-semibold px-3 py-2.5 rounded-xl"
                    style={{ background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.8)' }}
                  >
                    {chip}
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        <div className="absolute bottom-8 flex flex-col items-center gap-1.5 text-white/25 select-none" aria-hidden="true">
          <span className="text-xs uppercase tracking-widest">Learn more</span>
          <ChevronDown size={16} className="animate-bounce" />
        </div>
      </section>

      {/* Features */}
      <section className="bg-white px-6 py-16 md:py-24" aria-labelledby="features-heading">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cbp-blue text-center mb-3">
            Built for Operations
          </p>
          <h2 id="features-heading" className="text-3xl md:text-4xl font-extrabold text-[#222222] text-center mb-12 md:mb-16">
            How It Works
          </h2>

          <div className="grid gap-10 md:grid-cols-3 md:gap-8 lg:gap-12">
            <FeatureRow
              icon={<ClipboardCheck size={22} strokeWidth={2} className="text-cbp-green" />}
              iconBg="bg-cbp-tint-green"
              title="Guided Case Review"
              description="A structured verification workflow walks officers through applicable citizenship pathways and legal criteria."
            />
            <FeatureRow
              icon={<Zap size={22} strokeWidth={2} className="text-cbp-blue" />}
              iconBg="bg-cbp-tint"
              title="Instant Determination"
              description="Citizenship status is resolved immediately from officer inputs — no processing delay, no waiting."
            />
            <FeatureRow
              icon={<Users size={22} strokeWidth={2} className="text-cbp-green" />}
              iconBg="bg-cbp-tint-green"
              title="Officer-Focused Design"
              description="Designed for the pace of border operations. Clear, decisive, and built around the officer's workflow."
            />
          </div>

          <div className="mt-14 md:mt-20 text-center">
            <Link
              to="/verify"
              className="inline-block bg-cbp-navy text-white font-semibold text-base md:text-lg px-8 py-4 md:px-12 md:py-5 rounded-full
                hover:bg-[#003558] active:scale-95 transition-all duration-200
                focus:outline-none focus:ring-4 focus:ring-cbp-navy/30"
            >
              Start Verification
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#F6F6F6] border-t border-[#EEEEEE] px-6 py-12">
        <div className="max-w-5xl mx-auto md:flex md:gap-16 md:items-start">
          <div className="mb-8 md:mb-0 md:flex-1">
            <div className="flex items-center gap-2 mb-3" aria-hidden="true">
              <Shield size={14} className="text-cbp-navy" strokeWidth={2} />
              <span className="font-bold text-sm text-cbp-navy tracking-tight">VeriCase</span>
            </div>
            <p className="text-xs text-[#444444] leading-relaxed max-w-xs">
              A demonstration product by{' '}
              <a
                href="https://metaphase.tech"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold hover:underline focus:outline-none focus:underline"
                style={{ color: '#E86820' }}
              >
                MetaPhase
              </a>
              . Not affiliated with or endorsed by DHS, CBP, USCIS, or any U.S. government agency.
              No data is collected or stored.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#333333] mb-4">
              More Information
            </p>
            <nav aria-label="More information links">
              <ul className="space-y-3">
                <li>
                  <a
                    href="https://www.uscis.gov/citizenship"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-cbp-blue hover:underline focus:outline-none focus:underline"
                  >
                    U.S. Citizenship Overview →
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.uscis.gov/citizenship/learn-about-citizenship"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-cbp-blue hover:underline focus:outline-none focus:underline"
                  >
                    Certificate of Citizenship →
                  </a>
                </li>
                <li>
                  <span className="text-sm text-[#888888]">Verification History — coming soon</span>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureRow({
  icon, iconBg, title, description,
}: {
  icon: React.ReactNode
  iconBg: string
  title: string
  description: string
}) {
  return (
    <div className="flex gap-5">
      <div className={`flex-shrink-0 w-11 h-11 rounded-2xl ${iconBg} flex items-center justify-center`}>
        {icon}
      </div>
      <div>
        <h3 className="font-bold text-[#222222] mb-1">{title}</h3>
        <p className="text-sm text-[#444444] leading-relaxed">{description}</p>
      </div>
    </div>
  )
}
