import { useState, useCallback } from 'react'
import rulesJson from './engine/citizenship_rules.json'
import {
  type Rules,
  type QuestionNode,
  type AnswerValue,
  type OutcomeNode,
} from './engine/engine'

const rules = rulesJson as unknown as Rules

type Step = { nodeId: string; node: QuestionNode }
type Result = { id: string; node: OutcomeNode }

// ── Shared footer ─────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="py-5 text-center text-sm">
      <span className="text-gray-400">built by </span>
      <a
        href="https://metaphase.tech"
        target="_blank"
        rel="noopener noreferrer"
        className="font-semibold"
        style={{ color: '#f97316' }}
      >
        MetaPhase
      </a>
    </footer>
  )
}

// ── Engine page ───────────────────────────────────────────────────────────────
function EnginePage({ onBack }: { onBack: () => void }) {
  const [history, setHistory] = useState<Step[]>([])
  const [current, setCurrent] = useState<Step | null>(() => {
    const n = rules.nodes[rules.start]
    return n.kind === 'question' ? { nodeId: rules.start, node: n as QuestionNode } : null
  })
  const [result, setResult] = useState<Result | null>(null)
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({})

  const handleAnswer = useCallback(
    (value: AnswerValue) => {
      if (!current) return
      const newAnswers = { ...answers, [current.nodeId]: value }
      setAnswers(newAnswers)
      setHistory((h) => [...h, current])
      const match = current.node.answers.find((a) => a.value === value)
      if (!match) return
      const next = rules.nodes[match.next]
      if (next.kind === 'outcome') {
        setResult({ id: match.next, node: next as OutcomeNode })
        setCurrent(null)
      } else {
        setCurrent({ nodeId: match.next, node: next as QuestionNode })
      }
    },
    [current, answers]
  )

  const handleBack = useCallback(() => {
    if (!history.length) return
    const prev = history[history.length - 1]
    const newAnswers = { ...answers }
    delete newAnswers[prev.nodeId]
    setAnswers(newAnswers)
    setHistory((h) => h.slice(0, -1))
    setCurrent(prev)
    setResult(null)
  }, [history, answers])

  const handleReset = useCallback(() => {
    setHistory([])
    setAnswers({})
    setResult(null)
    const n = rules.nodes[rules.start]
    if (n.kind === 'question') setCurrent({ nodeId: rules.start, node: n as QuestionNode })
  }, [])

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top bar */}
      <header className="border-b border-gray-100 px-8 py-4 flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back
        </button>
        <span className="text-sm font-medium" style={{ color: '#0f1f4b' }}>VeriCase</span>
        <span className="text-xs text-gray-400 font-mono">{history.length} answered</span>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-xl">

          {/* Progress */}
          {!result && (
            <div className="mb-8">
              <div className="flex justify-between text-xs text-gray-400 mb-2">
                <span>Progress</span>
                <span>{history.length} answered</span>
              </div>
              <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min((history.length / 12) * 100, 90)}%`,
                    background: 'linear-gradient(90deg, #0f1f4b, #1e3a8a)',
                  }}
                />
              </div>
            </div>
          )}

          {/* Question */}
          {current && !result && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
              <p className="text-xs font-mono text-gray-300 mb-4">{current.nodeId}</p>
              <h2 className="text-xl font-semibold text-gray-900 mb-2 leading-snug">
                {current.node.prompt}
              </h2>
              {current.node.explanation && (
                <p className="text-sm text-gray-500 mb-4">{current.node.explanation}</p>
              )}
              <p className="text-xs text-gray-300 italic mb-8">{current.node.citation}</p>

              <div className="flex flex-col gap-3">
                {current.node.answers.map((a) => (
                  <button
                    key={String(a.value)}
                    onClick={() => handleAnswer(a.value)}
                    className="text-left px-5 py-3.5 rounded-xl border border-gray-200 text-sm text-gray-700 font-medium hover:border-blue-900 hover:bg-blue-50 transition-all duration-150"
                  >
                    {a.label}
                  </button>
                ))}
              </div>

              {history.length > 0 && (
                <button
                  onClick={handleBack}
                  className="mt-6 text-sm text-gray-400 hover:text-gray-600 transition-colors"
                >
                  ← Previous question
                </button>
              )}
            </div>
          )}

          {/* Result */}
          {result && (
            <div
              className="rounded-2xl p-8 text-white"
              style={{
                background:
                  result.node.outcome === 'CITIZEN'
                    ? 'linear-gradient(135deg, #0f1f4b 0%, #1e3a8a 100%)'
                    : 'linear-gradient(135deg, #1f2937 0%, #374151 100%)',
              }}
            >
              <p className="text-xs font-mono text-white/40 mb-4">{result.id}</p>
              <p className="text-xs font-semibold uppercase tracking-widest text-white/50 mb-2">Determination</p>
              <h2 className="text-3xl font-bold mb-3">
                {result.node.outcome === 'CITIZEN' ? '✓ U.S. Citizen' : '✗ Not a U.S. Citizen'}
              </h2>
              <p className="text-base text-white/80 mb-1">{result.node.title}</p>
              <p className="text-xs text-white/40 italic">{result.node.citation}</p>
              <button
                onClick={handleReset}
                className="mt-8 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-sm font-medium text-white transition-colors"
              >
                Start new determination
              </button>
            </div>
          )}

          {/* Audit trail */}
          {history.length > 0 && (
            <div className="mt-6 rounded-xl border border-gray-100 bg-gray-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-300 mb-3">
                Audit trail
              </p>
              <ol className="space-y-2">
                {history.map((step, i) => {
                  const chosen = step.node.answers.find((a) => a.value === answers[step.nodeId])
                  return (
                    <li key={i} className="flex gap-3 text-sm">
                      <span className="font-mono text-gray-300 w-16 shrink-0">{step.nodeId}</span>
                      <span className="text-gray-500">{chosen?.label}</span>
                    </li>
                  )
                })}
                {result && (
                  <li className="flex gap-3 text-sm font-semibold">
                    <span className="font-mono text-gray-300 w-16 shrink-0">{result.id}</span>
                    <span style={{ color: '#0f1f4b' }}>{result.node.outcome}</span>
                  </li>
                )}
              </ol>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}

// ── Landing page ──────────────────────────────────────────────────────────────
function LandingPage({ onStart }: { onStart: () => void }) {
  return (
    <>
      <style>{`
        @keyframes gradient-shift {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .gradient-text {
          background: linear-gradient(270deg, #0f1f4b, #1e3a8a, #2563eb, #1e3a8a, #0f1f4b);
          background-size: 300% 300%;
          animation: gradient-shift 6s ease infinite;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .cta-btn {
          position: relative;
          background: linear-gradient(135deg, #0f1f4b 0%, #1e3a8a 100%);
          box-shadow: 0 4px 24px rgba(15, 31, 75, 0.35), 0 1px 4px rgba(15, 31, 75, 0.2);
          border-radius: 9999px;
          transition: box-shadow 0.2s ease, transform 0.15s ease;
        }
        .cta-btn:hover {
          box-shadow: 0 8px 36px rgba(15, 31, 75, 0.45), 0 2px 8px rgba(15, 31, 75, 0.25);
          transform: translateY(-1px) scale(1.02);
        }
        .cta-btn:active {
          transform: translateY(0) scale(0.98);
          box-shadow: 0 2px 12px rgba(15, 31, 75, 0.3);
        }
      `}</style>

      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
        <div className="flex-1 flex flex-col items-center justify-center max-w-2xl w-full text-center">

          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-8">
            VeriCase · Citizenship Determination
          </p>

          <h1 className="text-6xl font-bold leading-tight mb-6">
            <span className="gradient-text">Citizenship eligibility,</span>
            <br />
            <span className="text-gray-900">clarified.</span>
          </h1>

          <p className="text-lg text-gray-500 mb-12 max-w-md mx-auto leading-relaxed">
            Answer a few questions. The rules engine checks your situation against
            4,223 legal paths and tells you where you stand — every step cites
            controlling statute or case law.
          </p>

          <button onClick={onStart} className="cta-btn inline-flex items-center gap-3 px-8 py-4 text-white text-base font-semibold">
            Start determination
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M4 9h10M9 4l5 5-5 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <p className="mt-10 text-xs text-gray-300">
            Educational use only · Not legal advice · 47 questions · 15 outcomes
          </p>
        </div>

        <Footer />
      </div>
    </>
  )
}

// ── Root ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState<'landing' | 'engine'>('landing')
  return page === 'landing'
    ? <LandingPage onStart={() => setPage('engine')} />
    : <EnginePage onBack={() => setPage('landing')} />
}
