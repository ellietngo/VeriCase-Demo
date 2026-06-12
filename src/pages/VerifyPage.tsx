import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Shield, ArrowLeft, ChevronRight, Check } from 'lucide-react'

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

const QUESTION_ORDER: QuestionId[] = ['q1', 'q2', 'q3']
const MAX_STEPS = QUESTION_ORDER.length

export default function VerifyPage() {
  const navigate = useNavigate()
  const [currentQ, setCurrentQ] = useState<QuestionId>('q1')
  const [step, setStep] = useState(1)

  const question = QUESTIONS[currentQ]

  const handleChoice = (next: NextStep) => {
    if (next === 'citizen' || next === 'non-citizen') {
      navigate('/result', { state: { isCitizen: next === 'citizen', steps: step } })
    } else {
      setCurrentQ(next as QuestionId)
      setStep(s => s + 1)
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: 'linear-gradient(160deg, #ECF1F4 0%, #e2ebe4 100%)' }}
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

      {/* Progress bar */}
      <div className="bg-white border-b border-[#EEEEEE] px-6 py-4">
        <div className="max-w-sm mx-auto">
          <div className="flex items-center">
            {QUESTION_ORDER.map((_, i) => (
              <React.Fragment key={i}>
                {i > 0 && (
                  <div
                    className="flex-1 h-0.5 mx-2 transition-colors duration-500"
                    style={{ background: i < step ? '#00416A' : '#EEEEEE' }}
                  />
                )}
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 transition-all duration-300"
                  style={{
                    background: i + 1 < step ? '#008000' : i + 1 === step ? '#00416A' : '#F6F6F6',
                    color: i + 1 <= step ? 'white' : '#AAAAAA',
                    border: i + 1 > step ? '1px solid #EEEEEE' : 'none',
                    boxShadow: i + 1 === step ? '0 0 0 3px rgba(0,65,106,0.15)' : 'none',
                  }}
                  aria-current={i + 1 === step ? 'step' : undefined}
                >
                  {i + 1 < step ? <Check size={14} aria-hidden="true" /> : i + 1}
                </div>
              </React.Fragment>
            ))}
          </div>
          <p className="text-xs text-[#AAAAAA] mt-2.5">
            Subject interview · Step {step} of {MAX_STEPS}
          </p>
        </div>
      </div>

      {/* Main */}
      <main className="flex-1 flex flex-col justify-center px-6 py-10">
        <div className="max-w-sm mx-auto w-full">
          <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-[#E8E8E8]">
            {/* Gradient accent strip */}
            <div
              className="h-1.5"
              style={{ background: 'linear-gradient(90deg, #00416A, #1a5c30)' }}
              aria-hidden="true"
            />

            <div className="p-7">
              <span className="inline-block text-xs font-semibold uppercase tracking-[0.18em] text-cbp-blue mb-4">
                Question {step}
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
                    className="w-full py-5 px-5 rounded-2xl text-left flex items-center gap-3 active:scale-[0.98] transition-all duration-150 focus:outline-none focus:ring-4"
                    style={
                      i === 0
                        ? { background: '#00416A', color: 'white' }
                        : { background: '#F6F6F6', border: '1.5px solid #EEEEEE' }
                    }
                  >
                    <div className="flex-1">
                      <div className="font-semibold text-base leading-snug">
                        {opt.label}
                      </div>
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

          <p className="mt-6 text-xs text-[#AAAAAA] text-center leading-relaxed">
            Demonstration mode — no case data is collected or stored.
          </p>
        </div>
      </main>
    </div>
  )
}
