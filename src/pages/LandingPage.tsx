import React, { useState, useEffect, useRef } from 'react'
import { Shield, ClipboardCheck, Zap, Users, ChevronRight, WifiOff } from 'lucide-react'
import { useOnlineStatus } from '../useOnlineStatus'

const DEMO_QUESTIONS = [
  {
    text: 'Where was the person born?',
    answers: ['In the 50 states or D.C.', 'In a U.S. territory or possession', 'Abroad'],
    result: 'Likely Citizen at Birth',
    citation: '8 U.S.C. § 1401(a)',
    reasoning: 'Birth within the United States generally confers citizenship at birth under the Fourteenth Amendment.',
  },
  {
    text: 'Were both parents U.S. citizens at the time of birth?',
    answers: ['Yes', 'No, only one parent'],
    result: 'Citizen at Birth',
    citation: '8 U.S.C. § 1401(c)',
    reasoning: 'A child born abroad to two U.S.-citizen parents acquires citizenship at birth if either parent had a prior U.S. residence.',
  },
  {
    text: 'Has the person served honorably in the U.S. armed forces?',
    answers: ['Yes', 'No'],
    result: 'Naturalization Eligible',
    citation: '8 U.S.C. § 1439(a)',
    reasoning: 'Honorable wartime or peacetime service can waive standard residency requirements for naturalization.',
  },
  {
    text: 'Is the person a Lawful Permanent Resident (green card holder)?',
    answers: ['Yes (LPR)', 'No'],
    result: 'Naturalization Track',
    citation: '8 U.S.C. § 1427(a)',
    reasoning: 'Five years of continuous LPR residence is generally required before filing for naturalization.',
  },
  {
    text: 'Has the person ever performed an expatriating act under 8 U.S.C. § 1481(a)?',
    answers: ['No expatriating act', 'Foreign naturalization / oath / military', 'Formal renunciation or treason'],
    result: 'Citizenship Retained',
    citation: '8 U.S.C. § 1481(a)',
    reasoning: 'Absent specific intent to relinquish nationality, citizenship is presumed retained.',
  },
]

const heroStyle: React.CSSProperties = {
  background: 'linear-gradient(-45deg, #04200f, #115c2c, #082c16, #0d4a24)',
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

// Decorative diagonal flowchart-inspired background
function BranchingBackground() {
  type Pt = [number, number]

  const root: Pt = [700, 50]
  const l1: Pt[] = [[200, 195], [700, 195], [1200, 195]]
  const l2: Pt[] = [[80, 345], [320, 345], [580, 345], [820, 345], [1080, 345], [1320, 345]]
  const l3: Pt[] = [
    [30, 490], [130, 490], [260, 490], [380, 490],
    [520, 490], [640, 490], [760, 490], [880, 490],
    [1020, 490], [1140, 490], [1260, 490], [1380, 490],
  ]
  const l4: Pt[] = [
    [30, 630], [170, 630], [300, 630], [440, 630],
    [560, 630], [680, 630], [800, 630],
    [1000, 630], [1140, 630], [1300, 630],
  ]
  const l5: Pt[] = [[100, 770], [370, 770], [730, 770], [900, 770], [1220, 770]]

  const edges: [Pt, Pt][] = [
    [root, l1[0]], [root, l1[1]], [root, l1[2]],
    [l1[0], l2[0]], [l1[0], l2[1]],
    [l1[1], l2[2]], [l1[1], l2[3]],
    [l1[2], l2[4]], [l1[2], l2[5]],
    [l2[0], l3[0]], [l2[0], l3[1]],
    [l2[1], l3[2]], [l2[1], l3[3]],
    [l2[2], l3[4]], [l2[2], l3[5]],
    [l2[3], l3[6]], [l2[3], l3[7]],
    [l2[4], l3[8]], [l2[4], l3[9]],
    [l2[5], l3[10]], [l2[5], l3[11]],
    [l3[0], l4[0]],
    [l3[1], l4[0]], [l3[1], l4[1]],
    [l3[2], l4[1]], [l3[2], l4[2]],
    [l3[3], l4[2]], [l3[3], l4[3]],
    [l3[4], l4[3]], [l3[4], l4[4]],
    [l3[5], l4[4]], [l3[5], l4[5]],
    [l3[6], l4[5]], [l3[6], l4[6]],
    [l3[7], l4[6]],
    [l3[8], l4[7]],
    [l3[9], l4[7]], [l3[9], l4[8]],
    [l3[10], l4[8]], [l3[10], l4[9]],
    [l3[11], l4[9]],
    [l4[0], l5[0]], [l4[1], l5[0]],
    [l4[2], l5[1]], [l4[3], l5[1]],
    [l4[4], l5[2]], [l4[5], l5[2]],
    [l4[6], l5[3]], [l4[7], l5[3]],
    [l4[8], l5[4]], [l4[9], l5[4]],
  ]

  function diamond(cx: number, cy: number, w: number, h: number) {
    return `${cx},${cy - h} ${cx + w},${cy} ${cx},${cy + h} ${cx - w},${cy}`
  }

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1400 870"
      preserveAspectRatio="xMidYMid slice"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        opacity: 0.05,
        transform: 'rotate(-20deg) scale(1.45)',
        transformOrigin: '60% 32%',
        overflow: 'visible',
      }}
    >
      <g stroke="white" strokeWidth="0.9" strokeLinecap="round" fill="white">
        {edges.map(([a, b], i) => (
          <line key={`e${i}`} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} fill="none" />
        ))}
        <polygon points={diamond(root[0], root[1], 22, 15)} fillOpacity="0.8" />
        {l1.map(([x, y], i) => (
          <rect key={`l1${i}`} x={x - 22} y={y - 13} width="44" height="26" rx="4" fillOpacity="0.6" />
        ))}
        {l2.map(([x, y], i) => (
          <polygon key={`l2${i}`} points={diamond(x, y, 16, 11)} fillOpacity="0.5" />
        ))}
        {l3.map(([x, y], i) => (
          <circle key={`l3${i}`} cx={x} cy={y} r="7" fillOpacity="0.45" />
        ))}
        {l4.map(([x, y], i) => (
          <circle key={`l4${i}`} cx={x} cy={y} r="6" fillOpacity="0.38" />
        ))}
        {l5.map(([x, y], i) => (
          <circle key={`l5${i}`} cx={x} cy={y} r="5" fillOpacity="0.3" />
        ))}
      </g>
    </svg>
  )
}

// Apple-style scroll reveal: fades + rises into place the first time it enters
// the viewport, then leaves it alone. No scroll listeners — IntersectionObserver only.
function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2, rootMargin: '0px 0px -40px 0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(32px)',
        transition: `opacity 800ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, transform 800ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </div>
  )
}

export default function LandingPage({ onStart }: { onStart: () => void }) {
  const online = useOnlineStatus()
  const [hoveredAnswer, setHoveredAnswer] = useState<number | null>(null)
  // One random question per page load — stays put for the session, changes on refresh
  const [demo] = useState(() => DEMO_QUESTIONS[Math.floor(Math.random() * DEMO_QUESTIONS.length)])
  // Most determinations resolve in well under 75 questions (often ~7), so the demo
  // progress bar randomizes per page load within a "mostly there" range rather than
  // implying a long slog — picked once on mount, stays put for the session.
  const [demoProgress] = useState(() => Math.floor(Math.random() * (92 - 58 + 1)) + 58)

  return (
    <div>
      {/* Hero */}
      <section
        className="relative min-h-screen flex flex-col px-6 py-20 text-white overflow-hidden"
        style={heroStyle}
        aria-label="Hero"
      >
        <div style={shineStyle} aria-hidden="true" />
        <BranchingBackground />

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
              by MetaPhase
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

            <p className="text-sm md:text-base text-white/80 max-w-xs lg:max-w-sm leading-relaxed mb-10">
              A guided, one-question-at-a-time engine across 8,649 legal pathways —
              every determination cites controlling statute or case law.
            </p>

            <button
              onClick={onStart}
              className="bg-white font-bold text-lg px-10 py-4 rounded-full shadow-xl
                hover:bg-white/90 active:scale-95 transition-all duration-200
                focus:outline-none focus:ring-4 focus:ring-white/40"
              style={{ color: '#0a4731' }}
            >
              Run Determination
            </button>

            {/* Trust signals */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-2.5 gap-y-1 mt-5 text-[11px] font-semibold text-white/45">
              <span>75 guided questions</span>
              <span aria-hidden="true">·</span>
              <span>8,649 legal pathways</span>
              <span aria-hidden="true">·</span>
              <span>100% cited determinations</span>
            </div>

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

              {/* Example question — one random pick per page load */}
              <style>{`
                @keyframes demo-fade {
                  from { opacity: 0; transform: translateY(6px); }
                  to   { opacity: 1; transform: translateY(0); }
                }
                .demo-fade { animation: demo-fade 450ms cubic-bezier(0.22, 1, 0.36, 1) both; }
              `}</style>
              <div
                className="demo-fade rounded-2xl p-4 mb-4"
                style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/40">Sample Question</span>
                <p className="text-base font-extrabold text-white leading-snug mt-1.5 mb-4" style={{ minHeight: '3rem' }}>
                  {demo.text}
                </p>
                <div className="space-y-2 mb-3" style={{ minHeight: '160px' }}>
                  {demo.answers.map((answer, i) => (
                    <div
                      key={answer}
                      className="flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer"
                      style={{
                        background: hoveredAnswer === i
                          ? 'rgba(255,255,255,0.96)'
                          : i === 0
                          ? 'rgba(255,255,255,0.88)'
                          : 'rgba(255,255,255,0.07)',
                        border: i !== 0 ? '1px solid rgba(255,255,255,0.12)' : 'none',
                        transform: hoveredAnswer === i ? 'translateX(3px)' : 'translateX(0)',
                        transition: 'background 300ms ease, transform 200ms ease',
                      }}
                      onMouseEnter={() => setHoveredAnswer(i)}
                      onMouseLeave={() => setHoveredAnswer(null)}
                    >
                      <span
                        className="text-sm font-semibold"
                        style={{
                          color: hoveredAnswer === i || i === 0 ? '#0a4731' : 'rgba(255,255,255,0.6)',
                          transition: 'color 300ms ease',
                        }}
                      >
                        {answer}
                      </span>
                      <ChevronRight
                        size={14}
                        style={{
                          color: hoveredAnswer === i || i === 0 ? '#0a4731' : 'rgba(255,255,255,0.25)',
                          opacity: hoveredAnswer === i ? 0.7 : 0.4,
                          transition: 'color 300ms ease, opacity 300ms ease',
                        }}
                      />
                    </div>
                  ))}
                </div>

                {/* Authority panel — the actual proof point: every answer cites controlling law */}
                <div
                  className="rounded-xl p-3"
                  style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.18)' }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[9px] font-bold uppercase tracking-[0.2em]" style={{ color: '#fbbf24' }}>
                      Authority
                    </span>
                    <span className="text-[10px] font-semibold text-white/45">{demo.result}</span>
                  </div>
                  <p className="text-xs font-bold mb-1" style={{ color: '#fcd34d' }}>{demo.citation}</p>
                  <p className="text-[11px] leading-snug text-white/55">{demo.reasoning}</p>
                </div>
              </div>

              {/* Progress bar */}
              <div aria-hidden="true">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/40">Progress</span>
                  <span className="text-[10px] font-bold text-white/40">{demoProgress}%</span>
                </div>
                <div className="w-full rounded-full overflow-hidden" style={{ height: 7, background: 'rgba(255,255,255,0.12)' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${demoProgress}%`,
                      background: 'linear-gradient(90deg, #166534, #4ade80)',
                      borderRadius: 9999,
                      transition: 'width 600ms cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        className="px-6 py-16 md:py-24"
        style={{ background: 'linear-gradient(180deg, #fafafa 0%, #ffffff 100%)' }}
        aria-labelledby="features-heading"
      >
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cbp-emerald text-center mb-3">
              Built for Operations
            </p>
            <h2 id="features-heading" className="text-3xl md:text-4xl font-extrabold text-[#222] text-center mb-12 md:mb-16">
              How It Works
            </h2>
          </Reveal>
          <div className="grid gap-6 md:grid-cols-3">
            <Reveal delay={0}>
              <FeatureCard
                icon={<ClipboardCheck size={24} strokeWidth={1.8} style={{ color: '#065f46' }} />}
                accent="#065f46"
                title="Guided Case Review"
                description="75 questions across every citizenship pathway — birth, territory, adoption, naturalization, derivation, loss, re-acquisition, and current immigration status."
              />
            </Reveal>
            <Reveal delay={120}>
              <FeatureCard
                icon={<Zap size={24} strokeWidth={1.8} style={{ color: '#b45309' }} />}
                accent="#b45309"
                title="8,649 Legal Paths"
                description="A proven total function: every path terminates in CITIZEN or NOT A CITIZEN, each citing controlling statute or case law."
              />
            </Reveal>
            <Reveal delay={240}>
              <FeatureCard
                icon={<Users size={24} strokeWidth={1.8} style={{ color: '#334155' }} />}
                accent="#334155"
                title="Full Audit Trail"
                description="Every answer is recorded in sequence, giving a defensible step-by-step record of the determination."
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#F6F6F6] border-t border-[#EEE] px-6 py-12">
        <Reveal className="max-w-5xl mx-auto md:flex md:gap-16 md:items-start">
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
                <li><a href="https://www.uscis.gov/citizenship" target="_blank" rel="noopener noreferrer" className="text-sm hover:underline" style={{ color: '#334155' }}>U.S. Citizenship Overview →</a></li>
                <li><a href="https://www.uscis.gov/citizenship/learn-about-citizenship" target="_blank" rel="noopener noreferrer" className="text-sm hover:underline" style={{ color: '#334155' }}>Certificate of Citizenship →</a></li>
              </ul>
            </nav>
          </div>
        </Reveal>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, accent, title, description }: { icon: React.ReactNode; accent: string; title: string; description: string }) {
  return (
    <div className="flex flex-col gap-4">
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: accent + '14' }}
      >
        {icon}
      </div>
      <div>
        <h3 className="font-bold text-[#111] mb-2 text-base">{title}</h3>
        <p className="text-sm text-[#555] leading-relaxed">{description}</p>
      </div>
    </div>
  )
}
