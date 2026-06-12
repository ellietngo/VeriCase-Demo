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
      <header className="bg-cbp-navy text-white px-4 py-4">
        <div className="max-w-sm mx-auto flex items-center gap-3">
          <Link
            to="/"
            className="p-2 -ml-2 rounded-xl hover:bg-white/10 transition-colors
              focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label="Back to home"
          >
            <ArrowLeft size={20} aria-hidden="true" />
          </Link>
          <div className="flex items-center gap-2">
            <Shield size={18} strokeWidth={1.5} aria-hidden="true" />
            <span className="font-bold tracking-tight">VeriCase</span>
          </div>
        </div>
      </header>

      {/* Progress bar — full width, no padding */}
      <div style={{ height: 3, background: 'rgba(0,65,106,0.12)' }}>
        <div
          style={{
            height: '100%',
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #00416A, #1a5c30)',
            transition: 'width 700ms ease-in-out',
          }}
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Interview progress"
        />
      </div>

      {/* Main */}
      <main className="flex-1 flex flex-col justify-center px-6 py-10">
        <div className="max-w-sm mx-auto w-full">
          <div
            className="bg-white rounded-3xl overflow-hidden"
            style={{ boxShadow: '0 4px 28px rgba(0,65,106,0.10)' }}
          >
            {/* Gradient accent strip */}
            <div
              className="h-1.5"
              style={{ background: 'linear-gradient(90deg, #00416A, #1a5c30)' }}
              aria-hidden="true"
            />

            <div className="p-7">
              <span className="inline-block text-xs font-semibold uppercase tracking-[0.18em] text-cbp-blue mb-4">
                Question {questionNum}
              </span>

              <h1 className="text-2xl font-extrabold text-[#222222] leading-tight mb-3">
                {question.text}
              </h1>

              <p className="text-sm text-[#555555] leading-relaxed mb-8">
                {question.sub}
              </p>

              <div className="space-y-3" role="group" aria-label="Answer options">
                {question.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleChoice(opt.next as NextStep)}
                    className="w-full py-5 px-5 rounded-2xl text-left flex items-center gap-3
                      active:scale-[0.98] transition-all duration-150
                      focus:outline-none focus:ring-4"
                    style={
                      i === 0
                        ? { background: '#00416A', color: 'white' }
                        : { background: '#F6F6F6', border: '1.5px solid #EEEEEE' }
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

          <p className="mt-6 text-xs text-[#999999] text-center leading-relaxed">
            Demonstration mode — no case data is collected or stored.
          </p>
        </div>
      </main>
    </div>
  )
}
