import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Shield, ArrowLeft, ChevronRight } from 'lucide-react'

const QUESTIONS = {
  q1: {
    text: 'Are you a United States citizen?',
    sub: 'Record the subject\'s verbal response to proceed.',
    options: [
      { label: 'Yes, I am a U.S. Citizen', sub: 'Subject verbally confirmed citizenship', next: 'q2' },
      { label: 'No, I am not a U.S. Citizen', sub: 'Subject verbally denied citizenship', next: 'non-citizen' },
    ],
  },
  q2: {
    text: 'Where were you born?',
    sub: 'Record the subject\'s stated country or territory of birth.',
    options: [
      { label: 'In the United States or a U.S. Territory', sub: 'Born a U.S. citizen by birthright', next: 'citizen' },
      { label: 'Outside the United States', sub: 'Born outside U.S. sovereign territory', next: 'q3' },
    ],
  },
  q3: {
    text: 'Have you been naturalized as a U.S. citizen?',
    sub: 'Confirm whether the subject has completed the naturalization process.',
    options: [
      { label: 'Yes, I am a naturalized citizen', sub: 'Subject claims a certificate of naturalization', next: 'citizen' },
      { label: 'No, I have not been naturalized', sub: 'Subject has not completed naturalization', next: 'non-citizen' },
    ],
  },
}

type QuestionId = keyof typeof QUESTIONS
type NextStep = QuestionId | 'citizen' | 'non-citizen'

const QUESTION_PROGRESS: Record<QuestionId, number> = {
  q1: 22,
  q2: 54,
  q3: 78,
}

export default function VerifyPage() {
  const navigate = useNavigate()
  const [currentQ, setCurrentQ] = useState<QuestionId>('q1')
  const [questionNum, setQuestionNum] = useState(1)

  const question = QUESTIONS[currentQ]
  const progress = QUESTION_PROGRESS[currentQ]

  const handleChoice = (next: NextStep) => {
    if (next === 'citizen' || next === 'non-citizen') {
      navigate('/result', { state: { isCitizen: next === 'citizen' } })
    } else {
      setCurrentQ(next as QuestionId)
      setQuestionNum(n => n + 1)
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: 'linear-gradient(160deg, #e8eef2 0%, #dfe9e2 100%)' }}
    >
      {/* Header */}
      <header
        className="text-white px-4 py-4"
        style={{ background: 'linear-gradient(135deg, #001e30 0%, #00416A 55%, #0a2a14 100%)' }}
      >
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="p-2 -ml-2 rounded-xl hover:bg-white/10 transition-colors
                focus:outline-none focus:ring-2 focus:ring-white/50"
              aria-label="Back to home"
            >
              <ArrowLeft size={20} aria-hidden="true" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <Shield size={18} strokeWidth={1.5} aria-hidden="true" />
                <span className="font-bold tracking-tight">VeriCase</span>
              </div>
              <p className="text-[9px] uppercase tracking-[0.25em] text-white/40 mt-0.5 ml-0.5">
                MetaPhase
              </p>
            </div>
          </div>

          <div className="hidden sm:block text-right">
            <p className="text-[9px] uppercase tracking-[0.2em] text-white/40">Session</p>
            <p className="text-xs font-semibold text-white/65 tracking-wide">Guided Intake</p>
          </div>
        </div>
      </header>

      {/* Progress bar — sits on page background */}
      <div className="px-4 pt-5 pb-4 md:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#7a8a96]">
              Guided Interview
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#7a8a96]">
              {progress}% Complete
            </span>
          </div>
          <div className="w-full rounded-full overflow-hidden" style={{ height: 12, background: '#cdd5dc' }}>
            <div
              style={{
                height: '100%',
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #00416A, #1460AA)',
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
          <div
            className="bg-white rounded-3xl overflow-hidden"
            style={{ boxShadow: '0 4px 32px rgba(0,65,106,0.11)' }}
          >
            {/* Gradient accent strip */}
            <div
              className="h-1.5"
              style={{ background: 'linear-gradient(90deg, #00416A, #1460AA)' }}
              aria-hidden="true"
            />

            {/* Card content — single column on mobile, two-column on desktop */}
            <div className="p-5 md:p-10 md:grid md:grid-cols-2 md:gap-12 md:items-start">

              {/* Question */}
              <div>
                <span className="inline-block text-[10px] md:text-xs font-bold uppercase tracking-[0.18em] text-[#7a8a96] mb-3">
                  Question {questionNum}
                </span>

                <h1 className="text-xl md:text-3xl font-extrabold text-[#111111] leading-tight mb-2 md:mb-4">
                  {question.text}
                </h1>

                <p className="text-sm md:text-base text-[#555555] leading-relaxed mb-5 md:mb-0">
                  {question.sub}
                </p>
              </div>

              {/* Answer buttons */}
              <div className="space-y-3" role="group" aria-label="Answer options">
                {question.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleChoice(opt.next as NextStep)}
                    className="w-full py-4 px-4 md:py-5 md:px-5 rounded-2xl text-left flex items-center gap-3
                      active:scale-[0.98] transition-all duration-150
                      focus:outline-none focus:ring-4"
                    style={
                      i === 0
                        ? { background: '#00416A', color: 'white' }
                        : { background: '#F5F6F8', border: '1.5px solid #E4E8EC' }
                    }
                  >
                    <div className="flex-1">
                      <div className="font-semibold text-base leading-snug">{opt.label}</div>
                      <div
                        className="text-sm font-normal mt-0.5"
                        style={{ color: i === 0 ? 'rgba(255,255,255,0.58)' : '#808080' }}
                      >
                        {opt.sub}
                      </div>
                    </div>
                    <ChevronRight
                      size={18}
                      aria-hidden="true"
                      style={{ color: i === 0 ? 'rgba(255,255,255,0.5)' : '#AAAAAA', flexShrink: 0 }}
                    />
                  </button>
                ))}
              </div>

            </div>
          </div>

          <p className="mt-4 text-xs text-[#9aabb8] text-center leading-relaxed">
            Demonstration mode — no case data is collected or stored.
          </p>
        </div>
      </main>
    </div>
  )
}
