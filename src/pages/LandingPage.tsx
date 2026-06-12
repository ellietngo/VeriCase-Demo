import { Link } from 'react-router-dom'
import { Shield, ClipboardCheck, Zap, Users, ChevronDown } from 'lucide-react'

const heroStyle: React.CSSProperties = {
  background: 'linear-gradient(-45deg, #00416A, #1a5c30, #003456, #0f4a23)',
  backgroundSize: '400% 400%',
  animation: 'hero-gradient 14s ease infinite',
}

const shineStyle: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '140px',
  height: '100%',
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
        {/* Shine sweep */}
        <div style={shineStyle} aria-hidden="true" />

        {/* Floating decorative circles */}
        <div
          className="absolute border border-white/8 rounded-full"
          style={{ top: '14%', right: '6%', width: 130, height: 130, animation: 'float-slow 9s ease-in-out infinite' }}
          aria-hidden="true"
        />
        <div
          className="absolute border border-white/6 rounded-full"
          style={{ bottom: '22%', left: '4%', width: 90, height: 90, animation: 'float-med 7s ease-in-out infinite', animationDelay: '2s' }}
          aria-hidden="true"
        />
        <div
          className="absolute rounded-full bg-white/4 border border-white/8"
          style={{ top: '38%', left: '8%', width: 44, height: 44, animation: 'float-slow 11s ease-in-out infinite', animationDelay: '4s' }}
          aria-hidden="true"
        />
        <div
          className="absolute border border-white/5 rounded-full"
          style={{ top: '60%', right: '12%', width: 60, height: 60, animation: 'float-med 8s ease-in-out infinite', animationDelay: '1s' }}
          aria-hidden="true"
        />

        {/* Content */}
        <span className="text-xs font-semibold uppercase tracking-[0.22em] text-white/45 mb-10 select-none">
          A MetaPhase Demo
        </span>

        {/* Shield with pulsing rings */}
        <div className="relative mb-8" style={{ width: 96, height: 96 }} aria-hidden="true">
          <div
            className="absolute rounded-3xl border border-white/15"
            style={{ inset: -10, animation: 'pulse-out 3.5s ease-out infinite' }}
          />
          <div
            className="absolute rounded-3xl border border-white/8"
            style={{ inset: -20, animation: 'pulse-out 3.5s ease-out infinite', animationDelay: '1.2s' }}
          />
          <div
            className="w-24 h-24 rounded-3xl flex items-center justify-center border border-white/20"
            style={{ background: 'rgba(255,255,255,0.11)', backdropFilter: 'blur(8px)' }}
          >
            <Shield size={46} strokeWidth={1.5} />
          </div>
        </div>

        <h1 className="text-6xl font-extrabold tracking-tight text-center mb-4 leading-none">
          VeriCase
        </h1>

        <p className="text-xl text-white/75 text-center max-w-xs leading-relaxed mb-3">
          Citizenship verification,<br />built for the field.
        </p>
        <p className="text-sm text-white/45 text-center max-w-xs leading-relaxed mb-12">
          Fast, evidence-based determinations for Border Patrol officers.
        </p>

        <Link
          to="/verify"
          className="bg-white text-cbp-navy font-bold text-lg px-10 py-4 rounded-full shadow-xl
            hover:bg-white/90 active:scale-95 transition-all duration-200
            focus:outline-none focus:ring-4 focus:ring-white/50"
        >
          Begin Case
        </Link>

        <div className="absolute bottom-8 flex flex-col items-center gap-1.5 text-white/25 select-none" aria-hidden="true">
          <span className="text-xs uppercase tracking-widest">Learn more</span>
          <ChevronDown size={16} className="animate-bounce" />
        </div>
      </section>

      {/* Features */}
      <section className="bg-white px-6 py-16" aria-labelledby="features-heading">
        <div className="max-w-sm mx-auto">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cbp-blue text-center mb-3">
            Built for Operations
          </p>
          <h2 id="features-heading" className="text-3xl font-extrabold text-[#222222] text-center mb-12">
            How It Works
          </h2>

          <div className="space-y-10">
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

          <div className="mt-14 text-center">
            <Link
              to="/verify"
              className="inline-block bg-cbp-navy text-white font-semibold text-base px-8 py-4 rounded-full
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
        <div className="max-w-sm mx-auto">
          <div className="flex items-center gap-2 mb-3" aria-hidden="true">
            <Shield size={14} className="text-cbp-navy" strokeWidth={2} />
            <span className="font-bold text-sm text-cbp-navy tracking-tight">VeriCase</span>
          </div>

          <p className="text-xs text-[#555555] leading-relaxed mb-8">
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
                <span className="text-sm text-[#AAAAAA]">
                  Verification History — coming soon
                </span>
              </li>
            </ul>
          </nav>
        </div>
      </footer>
    </div>
  )
}

function FeatureRow({
  icon,
  iconBg,
  title,
  description,
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
        <p className="text-sm text-[#555555] leading-relaxed">{description}</p>
      </div>
    </div>
  )
}
