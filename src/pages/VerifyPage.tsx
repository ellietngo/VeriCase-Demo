import { useState, useCallback } from 'react'
import { Shield, ArrowLeft, ChevronRight, Check } from 'lucide-react'
import rulesJson from '../engine/citizenship_rules.json'
import { type Rules, type QuestionNode, type AnswerValue, type OutcomeNode } from '../engine/engine'
import { type ResultState } from '../App'

const rules = rulesJson as unknown as Rules

type Step = { nodeId: string; node: QuestionNode; chosenValue: AnswerValue; chosenLabel: string }

const MAX_STEPS = 14

export default function VerifyPage({
  onResult,
  onBack,
}: {
  onResult: (r: ResultState) => void
  onBack: () => void
}) {
  const [history, setHistory] = useState<Step[]>([])
  const [current, setCurrent] = useState<{ nodeId: string; node: QuestionNode }>(() => {
    const n = rules.nodes[rules.start]
    return { nodeId: rules.start, node: n as QuestionNode }
  })

  const progress = Math.min(Math.round((history.length / MAX_STEPS) * 100), 95)
  const questionNum = history.length + 1

  const handleAnswer = useCallback(
    (value: AnswerValue, label: string) => {
      const match = current.node.answers.find((a) => a.value === value)
      if (!match) return

      setHistory((h) => [...h, { nodeId: current.nodeId, node: current.node, chosenValue: value, chosenLabel: label }])

      const next = rules.nodes[match.next]
      if (next.kind === 'outcome') {
        onResult({ outcome: next as OutcomeNode, nodeId: match.next })
      } else {
        setCurrent({ nodeId: match.next, node: next as QuestionNode })
      }
    },
    [current, onResult]
  )

  const handleBack = useCallback(() => {
    if (history.length === 0) { onBack(); return }
    const prev = history[history.length - 1]
    setHistory((h) => h.slice(0, -1))
    setCurrent({ nodeId: prev.nodeId, node: prev.node })
  }, [history, onBack])

  const isBoolean = current.node.answer_type === 'boolean'

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundImage: [
          'radial-gradient(circle, rgba(6,95,70,0.06) 1px, transparent 1px)',
          'linear-gradient(160deg, #e8f5f0 0%, #d4e8e0 100%)',
        ].join(', '),
        backgroundSize: '28px 28px, 100% 100%',
      }}
    >
      {/* Header — logo only, clickable to go home */}
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
            <Shield size={18} strokeWidth={1.5} aria-hidden="true" />
            <div className="text-left">
              <div className="font-bold tracking-tight text-sm">VeriCase</div>
              <p className="text-[9px] uppercase tracking-[0.25em] text-white/40 mt-0.5">
                by{' '}
                <a
                  href="https://metaphase.tech"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="hover:text-white/70 transition-colors"
                  style={{ color: 'rgba(251,146,60,0.8)' }}
                >
                  MetaPhase
                </a>
              </p>
            </div>
          </button>
          <div className="hidden sm:block text-right">
            <p className="text-[9px] uppercase tracking-[0.2em] text-white/40">Session</p>
            <p className="text-xs font-semibold text-white/65 tracking-wide">Guided Intake</p>
          </div>
        </div>
      </header>

      {/* Progress bar */}
      <div className="px-4 pt-5 pb-4 md:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#5a7a6a]">Guided Interview</span>
            <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#5a7a6a]">{progress}% Complete</span>
          </div>
          <div className="w-full rounded-full overflow-hidden" style={{ height: 12, background: '#b8d4c8' }}>
            <div
              style={{
                height: '100%',
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #065f46, #16a34a)',
                transition: 'width 750ms cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                overflow: 'hidden',
              }}
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Interview progress"
            >
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  top: 0, bottom: 0,
                  width: '40%',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)',
                  animation: 'progress-shimmer 3.5s linear infinite',
                  animationDelay: '0.8s',
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main */}
      <main className="flex-1 flex flex-col justify-center px-4 py-4 md:px-8 md:py-8">
        <div className="w-full max-w-5xl mx-auto">
          <div className="md:grid md:grid-cols-[1fr_260px] md:gap-5 md:items-start">

            {/* Question card */}
            <div className="bg-white rounded-3xl overflow-hidden" style={{ boxShadow: '0 4px 32px rgba(6,95,70,0.10)' }}>
              <div className="h-1.5" style={{ background: 'linear-gradient(90deg, #065f46, #16a34a)' }} aria-hidden="true" />
              <div className="p-5 md:p-8">
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-block text-[10px] md:text-xs font-bold uppercase tracking-[0.18em] text-[#7a8a96]">
                    Question {questionNum}
                  </span>
                  <span className="font-mono text-[10px] text-[#bbb]">{current.nodeId}</span>
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
                    return (
                      <button
                        key={String(opt.value)}
                        onClick={() => handleAnswer(opt.value, opt.label)}
                        className="w-full py-4 px-4 md:py-5 md:px-5 rounded-2xl text-left flex items-center gap-3
                          active:scale-[0.98] transition-all duration-150 focus:outline-none focus:ring-4 focus:ring-green-800/20"
                        style={
                          isPrimary
                            ? { background: '#065f46', color: 'white' }
                            : { background: '#F5F6F8', border: '1.5px solid #E4E8EC', color: '#222' }
                        }
                      >
                        <div className="flex-1">
                          <div className="font-semibold text-base leading-snug">{opt.label}</div>
                        </div>
                        <ChevronRight
                          size={18}
                          aria-hidden="true"
                          style={{ color: isPrimary ? 'rgba(255,255,255,0.5)' : '#AAAAAA', flexShrink: 0 }}
                        />
                      </button>
                    )
                  })}
                </div>

                {/* Back button inside the card */}
                <div className="mt-5 pt-4 border-t border-[#f0f0f0]">
                  <button
                    onClick={handleBack}
                    className="flex items-center gap-1.5 text-sm font-medium text-[#888] hover:text-[#333] transition-colors focus:outline-none focus:ring-2 focus:ring-green-700/20 rounded-lg px-1 py-0.5"
                    aria-label="Go back"
                  >
                    <ArrowLeft size={15} aria-hidden="true" />
                    {history.length === 0 ? 'Back to home' : 'Previous question'}
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
                        <p className="text-xs text-[#999] mt-0.5">Interview in progress</p>
                      </div>
                    </div>

                    {history.map((step, i) => (
                      <div key={i} className="flex gap-3 items-start">
                        <div className="relative z-10 w-[18px] h-[18px] rounded-full bg-cbp-slate flex-shrink-0 flex items-center justify-center mt-0.5">
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

          <p className="mt-4 text-xs text-[#6a8a76] text-center leading-relaxed">
            Demonstration mode — no case data is collected or stored. Built by{' '}
            <a
              href="https://metaphase.tech"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold hover:underline"
              style={{ color: '#f97316' }}
            >
              MetaPhase
            </a>
            .
          </p>
        </div>
      </main>
    </div>
  )
}
