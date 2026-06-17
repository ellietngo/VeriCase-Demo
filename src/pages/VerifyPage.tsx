import { useState, useCallback, useEffect, useRef } from 'react'
import { ArrowLeft, ChevronRight, Check, MapPin, AlertTriangle, WifiOff, Menu, X } from 'lucide-react'
import { useOnlineStatus } from '../useOnlineStatus'
import rulesJson from '../engine/citizenship_rules.json'
import { type Rules, type QuestionNode, type AnswerValue, type OutcomeNode, type Step } from '../engine/engine'
import { type ResultState } from '../App'
import { type GeoData } from '../geo'
import GovBanner from '../components/GovBanner'
import TorchLogo from '../components/TorchLogo'

const rules = rulesJson as unknown as Rules

// Count distinct outcome paths reachable from a node (memoized)
const _pathMemo = new Map<string, number>()
function countPaths(nodeId: string): number {
  const cached = _pathMemo.get(nodeId)
  if (cached !== undefined) return cached
  const node = rules.nodes[nodeId]
  if (!node) return 0
  if (node.kind === 'outcome') { _pathMemo.set(nodeId, 1); return 1 }
  const total = node.answers.reduce((sum, a) => sum + countPaths(a.next), 0)
  _pathMemo.set(nodeId, total)
  return total
}
const TOTAL_PATHS = countPaths(rules.start)

export default function VerifyPage({
  onResult,
  onBack,
  geo,
  startNodeId,
}: {
  onResult: (r: ResultState) => void
  onBack: () => void
  geo: GeoData | null
  startNodeId?: string
}) {
  const [history, setHistory] = useState<Step[]>([])
  const [current, setCurrent] = useState<{ nodeId: string; node: QuestionNode }>(() => {
    const id = startNodeId ?? rules.start
    const n = rules.nodes[id]
    return { nodeId: id, node: n as QuestionNode }
  })
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const pathsRemaining = countPaths(current.nodeId)
  const progressPct = Math.round((1 - pathsRemaining / TOTAL_PATHS) * 100)
  const pathsLabel = pathsRemaining === 1 ? '1 path remaining' : `~${pathsRemaining.toLocaleString()} paths remaining`
  const questionNum = history.length + 1

  // Push a browser history entry per question answer so back button works
  const handleAnswer = useCallback(
    (value: AnswerValue, label: string) => {
      const match = current.node.answers.find((a) => a.value === value)
      if (!match) return

      const newStep = { nodeId: current.nodeId, node: current.node, chosenValue: value, chosenLabel: label }
      const newHistory = [...history, newStep]
      setHistory(newHistory)

      const next = rules.nodes[match.next]
      if (next.kind === 'outcome') {
        onResult({ outcome: next as OutcomeNode, nodeId: match.next, history: newHistory })
      } else {
        window.history.pushState({ historyLen: newHistory.length }, '', '#/verify')
        setCurrent({ nodeId: match.next, node: next as QuestionNode })
      }
    },
    [current, history, onResult]
  )

  const handleBack = useCallback(() => {
    if (history.length === 0) { onBack(); return }
    const prev = history[history.length - 1]
    setHistory((h) => h.slice(0, -1))
    setCurrent({ nodeId: prev.nodeId, node: prev.node })
  }, [history, onBack])

  // Browser back/forward — pop state triggers handleBack
  useEffect(() => {
    const onPopState = () => handleBack()
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [handleBack])

  // Close hamburger menu on outside click
  useEffect(() => {
    if (!menuOpen) return
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [menuOpen])

  const [hoveredAnswer, setHoveredAnswer] = useState<number | null>(null)
  const isBoolean = current.node.answer_type === 'boolean'
  const online = useOnlineStatus()
  const activeGeo = online ? geo : null

  const jurisdictionLabel = activeGeo
    ? [activeGeo.county, activeGeo.state].filter(Boolean).join(', ') || activeGeo.state || null
    : null
  const districtLabel = activeGeo?.federalJudicialDistrict ?? null

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: 'linear-gradient(160deg, #eef5f1 0%, #e4ede8 60%, #dce8e2 100%)' }}
    >
      <GovBanner />

      {/* Header */}
      <header
        className="text-white px-4 py-4"
        style={{ background: 'linear-gradient(135deg, #052e16 0%, #065f46 55%, #064e3b 100%)' }}
      >
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 rounded-xl hover:bg-white/10 px-2 py-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label="Go to home"
          >
            <TorchLogo size={18} className="text-white" />
            <div className="text-left">
              <div className="font-bold tracking-tight text-sm">VeriCase</div>
              <p className="text-[9px] uppercase tracking-[0.25em] text-white/40 mt-0.5">by MetaPhase</p>
            </div>
          </button>

          <div className="flex items-center gap-3">
            {jurisdictionLabel && (
              <div
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold"
                style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.18)', color: 'rgba(255,255,255,0.75)' }}
                title={districtLabel ? `Federal District: ${districtLabel}` : undefined}
              >
                <MapPin size={11} aria-hidden="true" style={{ color: '#86efac' }} />
                {jurisdictionLabel}
                {districtLabel && <span className="text-white/40 font-normal ml-1">· {districtLabel}</span>}
              </div>
            )}

            {!online && !jurisdictionLabel && (
              <div
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.35)' }}
              >
                <WifiOff size={10} aria-hidden="true" />
                Offline — location unavailable
              </div>
            )}

            <div
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold"
              style={
                online
                  ? { background: 'rgba(74,222,128,0.12)', border: '1px solid rgba(74,222,128,0.25)', color: '#86efac' }
                  : { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.35)' }
              }
            >
              {online ? (
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" style={{ animation: 'pulse-out 2.5s ease-out infinite' }} />
              ) : (
                <WifiOff size={10} aria-hidden="true" />
              )}
              {online ? 'Online' : 'Offline'}
            </div>

            {/* Hamburger — mobile only */}
            <div className="relative sm:hidden" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className="p-2 rounded-xl hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
                aria-label="Menu"
              >
                {menuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
              {menuOpen && (
                <div
                  className="absolute right-0 top-full mt-2 w-44 rounded-2xl overflow-hidden z-50"
                  style={{ background: '#052e16', border: '1px solid rgba(255,255,255,0.12)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}
                >
                  <button onClick={() => { setMenuOpen(false); onBack() }}
                    className="w-full text-left px-4 py-3 text-sm font-semibold text-white/80 hover:bg-white/10 transition-colors">
                    Home
                  </button>
                  <button onClick={() => { setMenuOpen(false); window.location.hash = '#/verify' }}
                    className="w-full text-left px-4 py-3 text-sm font-semibold text-white/80 hover:bg-white/10 transition-colors">
                    New Case
                  </button>
                  <a href="#terms"
                    className="block px-4 py-3 text-sm text-white/50 hover:bg-white/10 transition-colors">
                    Terms of Use
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {activeGeo?.inRooseveltReservation && (
          <div className="max-w-5xl mx-auto mt-2 px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2"
            style={{ background: 'rgba(251,146,60,0.18)', border: '1px solid rgba(251,146,60,0.35)', color: '#fed7aa' }}>
            <AlertTriangle size={13} className="flex-shrink-0" style={{ color: '#fb923c' }} />
            Completing this determination within the Roosevelt Reservation (federal border zone) — enhanced CBP enforcement authority applies.
          </div>
        )}

        {activeGeo?.inTribalTrustLand && (
          <div className="max-w-5xl mx-auto mt-2 px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2"
            style={{ background: 'rgba(251,191,36,0.12)', border: '1px solid rgba(251,191,36,0.25)', color: '#fde68a' }}>
            <AlertTriangle size={13} className="flex-shrink-0" style={{ color: '#fbbf24' }} />
            Completing this determination on {activeGeo.tribalName ? `${activeGeo.tribalName} trust land` : 'tribal trust land'} — tribal enrollment may affect jurisdictional considerations.
          </div>
        )}
      </header>

      {/* Progress bar */}
      <div className="px-4 pt-5 pb-4 md:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#5a7a6a]">
              {startNodeId ? 'Immigration Status Check' : 'Guided Interview'}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#5a7a6a]">{pathsLabel}</span>
          </div>
          <div className="w-full rounded-full overflow-hidden" style={{ height: 12, background: '#b8d4c8' }}>
            <div
              style={{
                height: '100%',
                width: `${progressPct}%`,
                background: 'linear-gradient(90deg, #065f46, #16a34a)',
                transition: 'width 750ms cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                overflow: 'hidden',
              }}
              role="progressbar"
              aria-valuenow={progressPct}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Interview progress: ${pathsLabel}`}
            >
              <div aria-hidden="true" style={{
                position: 'absolute', top: 0, bottom: 0, width: '40%',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)',
                animation: 'progress-shimmer 3.5s linear infinite', animationDelay: '0.8s',
              }} />
            </div>
          </div>
        </div>
      </div>

      {/* Main */}
      <main className="flex-1 flex flex-col justify-center px-4 py-4 md:px-8 md:py-8">
        <div className="w-full max-w-5xl mx-auto">
          <div className="md:grid md:grid-cols-[1fr_260px] md:gap-5 md:items-start">

            {/* Question card */}
            <style>{`
              @keyframes question-in {
                from { opacity: 0; transform: translateY(14px); }
                to   { opacity: 1; transform: translateY(0); }
              }
              .question-in { animation: question-in 300ms cubic-bezier(0.22, 1, 0.36, 1) both; }
            `}</style>
            <div className="bg-white rounded-3xl overflow-hidden" style={{ boxShadow: '0 4px 32px rgba(6,95,70,0.10)' }}>
              <div className="h-1.5" style={{ background: 'linear-gradient(90deg, #065f46, #16a34a)' }} aria-hidden="true" />
              <div key={current.nodeId} className="question-in p-5 md:p-8">
                <div className="flex items-center mb-3">
                  <span className="inline-block text-[10px] md:text-xs font-bold uppercase tracking-[0.18em] text-[#7a8a96]">
                    Question {questionNum}
                  </span>
                </div>

                <h1 className="text-xl md:text-2xl font-extrabold text-[#111] leading-tight mb-2">
                  {current.node.prompt}
                </h1>

                {current.node.explanation && (
                  <p className="text-sm md:text-base text-[#555] leading-relaxed mb-4">
                    {current.node.explanation}
                  </p>
                )}

                <p className="text-xs text-[#aaa] italic mb-6">{current.node.citation}</p>

                <div className="space-y-3" role="group" aria-label="Answer options">
                  {current.node.answers.map((opt, i) => {
                    const isPrimary = isBoolean && i === 0
                    const isHovered = hoveredAnswer === i
                    return (
                      <button
                        key={String(opt.value)}
                        onClick={() => handleAnswer(opt.value, opt.label)}
                        onMouseEnter={() => setHoveredAnswer(i)}
                        onMouseLeave={() => setHoveredAnswer(null)}
                        className="w-full py-4 px-4 md:py-5 md:px-5 rounded-2xl text-left flex items-center gap-3
                          active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-green-800/20"
                        style={{
                          background: isPrimary ? (isHovered ? '#054f3a' : '#065f46') : (isHovered ? '#ECEEF1' : '#F5F6F8'),
                          border: isPrimary ? 'none' : '1.5px solid #E4E8EC',
                          color: isPrimary ? 'white' : '#222',
                          transform: isHovered ? 'translateX(3px)' : 'translateX(0)',
                          transition: 'background 220ms ease, transform 180ms ease, border-color 220ms ease',
                        }}
                      >
                        <div className="flex-1">
                          <div className="font-semibold text-base leading-snug">{opt.label}</div>
                        </div>
                        <ChevronRight size={18} aria-hidden="true" style={{
                          color: isPrimary ? 'rgba(255,255,255,0.5)' : '#AAAAAA',
                          flexShrink: 0,
                          transform: isHovered ? 'translateX(2px)' : 'translateX(0)',
                          transition: 'transform 180ms ease',
                        }} />
                      </button>
                    )
                  })}
                </div>

                <div className="mt-5 pt-4 border-t border-[#f0f0f0]">
                  <button
                    onClick={handleBack}
                    className="flex items-center gap-1.5 text-sm font-medium text-[#888] hover:text-[#333] transition-colors focus:outline-none focus:ring-2 focus:ring-green-700/20 rounded-lg px-1 py-0.5"
                    aria-label="Go back"
                  >
                    <ArrowLeft size={15} aria-hidden="true" />
                    {history.length === 0 ? (startNodeId ? 'Back to result' : 'Back to home') : 'Previous question'}
                  </button>
                </div>
              </div>
            </div>

            {/* Interview Trail — desktop only */}
            <aside className="hidden md:block" aria-label="Interview trail">
              <div className="bg-white rounded-3xl p-5" style={{ boxShadow: '0 4px 32px rgba(6,95,70,0.10)' }}>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#7a8a96] mb-5">Interview Trail</p>
                <div className="relative">
                  <div className="absolute left-[8px] top-4 bottom-0 w-px bg-[#e4e8ec]" aria-hidden="true" />
                  <div className="space-y-5">
                    <div className="flex gap-3 items-start">
                      <div className="relative z-10 w-[18px] h-[18px] rounded-full flex-shrink-0 flex items-center justify-center mt-0.5" style={{ background: '#065f46' }}>
                        <div className="w-2 h-2 rounded-full bg-white" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#222]">Case opened</p>
                        <p className="text-xs text-[#999] mt-0.5">{jurisdictionLabel ?? 'Interview in progress'}</p>
                      </div>
                    </div>
                    {history.map((step, i) => (
                      <div key={i} className="flex gap-3 items-start">
                        <div className="relative z-10 w-[18px] h-[18px] rounded-full bg-[#5a7a6a] flex-shrink-0 flex items-center justify-center mt-0.5">
                          <Check size={10} className="text-white" strokeWidth={3} aria-hidden="true" />
                        </div>
                        <div>
                          <p className="text-xs text-[#888] leading-snug">{step.node.prompt.length > 60 ? step.node.prompt.slice(0, 60) + '…' : step.node.prompt}</p>
                          <p className="text-sm font-semibold text-[#333] mt-0.5">{step.chosenLabel}</p>
                        </div>
                      </div>
                    ))}
                    <div className="flex gap-3 items-start">
                      <div className="relative z-10 w-[18px] h-[18px] rounded-full border-2 bg-white flex-shrink-0 flex items-center justify-center mt-0.5" style={{ borderColor: '#16a34a' }}>
                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#16a34a' }} />
                      </div>
                      <div>
                        <p className="text-xs text-[#888]">Question {questionNum}</p>
                        <p className="text-sm font-medium text-[#555] mt-0.5">Awaiting response…</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </aside>

          </div>

          {/* Footer — desktop */}
          <p className="hidden md:block mt-4 text-xs text-[#6a8a76] text-center leading-relaxed">
            Built by{' '}
            <a href="https://metaphase.tech" target="_blank" rel="noopener noreferrer"
              className="font-semibold hover:underline" style={{ color: '#f97316' }}>MetaPhase</a>
            {activeGeo && (
              <> · location by{' '}
                <a href="https://geoborder.metaphase.tech" target="_blank" rel="noopener noreferrer"
                  className="font-semibold hover:underline" style={{ color: '#16a34a' }}>GeoBorder</a>
              </>
            )}
            {' '}·{' '}
            <a href="#terms" className="hover:underline text-[#6a8a76]">Terms of Use</a>
          </p>
        </div>
      </main>
    </div>
  )
}
