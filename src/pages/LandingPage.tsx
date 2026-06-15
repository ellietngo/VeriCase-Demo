import React, { useState } from 'react'
import { Shield, ClipboardCheck, Zap, Users, ChevronRight, WifiOff } from 'lucide-react'
import { useOnlineStatus } from '../useOnlineStatus'

const DEMO_QUESTIONS = [
  {
    label: 'Question 1',
    text: 'Where was the person born?',
    answers: ['In the 50 states or D.C.', 'In a U.S. territory or possession', 'Abroad'],
  },
  {
    label: 'Question 2',
    text: 'Were both parents U.S. citizens at the time of birth?',
    answers: ['Yes', 'No, only one parent'],
  },
  {
    label: 'Question 3',
    text: 'Has the person served honorably in the U.S. armed forces?',
    answers: ['Yes', 'No'],
  },
  {
    label: 'Question 4',
    text: 'Is the person a Lawful Permanent Resident (green card holder)?',
    answers: ['Yes (LPR)', 'No'],
  },
  {
    label: 'Question 5',
    text: 'Has the person ever performed an expatriating act under 8 U.S.C. § 1481(a)?',
    answers: ['No expatriating act', 'Foreign naturalization / oath / military', 'Formal renunciation or treason'],
  },
]

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
  const l5: Pt[] = [[100, 770], [370, 770], [620, 770], [900, 770], [1220, 770]]

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
        {/* Root — diamond */}
        <polygon points={diamond(root[0], root[1], 22, 15)} fillOpacity="0.8" />
        {/* L1 — rectangles */}
        {l1.map(([x, y], i) => (
          <rect key={`l1${i}`} x={x - 22} y={y - 13} width="44" height="26" rx="4" fillOpacity="0.6" />
        ))}
        {/* L2 — diamonds */}
        {l2.map(([x, y], i) => (
          <polygon key={`l2${i}`} points={diamond(x, y, 16, 11)} fillOpacity="0.5" />
        ))}
        {/* L3 — circles */}
        {l3.map(([x, y], i) => (
          <circle key={`l3${i}`} cx={x} cy={y} r="7" fillOpacity="0.45" />
        ))}
        {/* L4 — circles */}
        {l4.map(([x, y], i) => (
          <circle key={`l4${i}`} cx={x} cy={y} r="6" fillOpacity="0.38" />
        ))}
        {/* L5 — circles */}
        {l5.map(([x, y], i) => (
          <circle key={`l5${i}`} cx={x} cy={y} r="5" fillOpacity="0.3" />
        ))}
      </g>
    </svg>
  )
}

export default function LandingPage({ onStart }: { onStart: () => void }) {
  const online = useOnlineStatus()
  const [hoveredAnswer, setHoveredAnswer] = useState<number | null>(null)
  // Pick a random question once on mount — changes each page refresh
  const [demo] = useState(() => DEMO_QUESTIONS[Math.floor(Math.random() * DEMO_QUESTIONS.length)])

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

              {/* Example question — rotates every 4s */}
              <div
                className="rounded-2xl p-4 mb-4"
                style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/40">{demo.label}</span>
                <p className="text-base font-extrabold text-white leading-snug mt-1.5 mb-4" style={{ minHeight: '3rem' }}>
                  {demo.text}
                </p>
                <div className="space-y-2">
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
                          color: hoveredAnswer === i || i === 0 ? '#14532d' : 'rgba(255,255,255,0.6)',
                          transition: 'color 300ms ease',
                        }}
                      >
                        {answer}
                      </span>
                      <ChevronRight
                        size={14}
                        style={{
                          color: hoveredAnswer === i || i === 0 ? '#14532d' : 'rgba(255,255,255,0.25)',
                          opacity: hoveredAnswer === i ? 0.7 : 0.4,
                          transition: 'color 300ms ease, opacity 300ms ease',
                        }}
                      />
                    </div>
                  ))}
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
