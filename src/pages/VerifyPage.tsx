import React, { useState } from 'react'
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

const pageStyle: React.CSSProperties = {
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
  animationDelay: '3s',
  pointerEvents: 'none',
}

export default function VerifyPage() {
  const navigate = useNavigate()
  const [currentQ, setCurrentQ] = useState<QuestionId>('q1')
  const [questionNum, setQuestionNum] = useState(1)

  const question = QUESTIONS[currentQ]

  const handleChoice = (next: NextStep) => {
    if (next === 'citizen' || next === 'non-citizen') {
      navigate('/result', { state: { isCitizen: next === 'citizen' } })
    } else {
      setCurrentQ(next as QuestionId)
      setQuestionNum(n => n + 1)
    }
  }

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden" style={pageStyle}>
      {/* Decorative layer */}
      <div style={shineStyle} aria-hidden="true" />
      <div className="absolute border border-white/8 rounded-full pointer-events-none" style={{ top: '8%', right: '5%', width: 110, height: 110, animation: 'float-slow 9s ease-in-out infinite' }} aria-hidden="true" />
      <div className="absolute border border-white/6 rounded-full pointer-events-none" style={{ bottom: '18%', left: '4%', width: 78, height: 78, animation: 'float-med 7s ease-in-out infinite', animationDelay: '2s' }} aria-hidden="true" />
      <div className="absolute rounded-full border border-white/6 pointer-events-none" style={{ top: '48%', left: '7%', width: 40, height: 40, animation: 'float-slow 11s ease-in-out infinite', animationDelay: '5s' }} aria-hidden="true" />
      <div className="absolute border border-white/5 rounded-full pointer-events-none" style={{ top: '68%', right: '8%', width: 54, height: 54, animation: 'float-med 8s ease-in-out infinite', animationDelay: '3s' }} aria-hidden="true" />

      {/* Header — frosted glass */}
      <header
        className="relative z-10 px-4 py-4 text-white"
        style={{ background: 'rgba(0,25,45,0.45)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}
      >
        <div className="max-w-sm mx-auto flex items-center gap-3">
          <Link
            to="/"
            className="p-2 -ml-2 rounded-xl hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
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

      {/* Main */}
      <main className="relative z-10 flex-1 flex flex-col justify-center px-6 py-10">
        <div className="max-w-sm mx-auto w-full">
          <div className="bg-white rounded-3xl overflow-hidden shadow-2xl">
            {/* Gradient accent strip */}
            <div className="h-1.5" style={{ background: 'linear-gradient(90deg, #00416A, #1a5c30)' }} aria-hidden="true" />

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
                    className="w-full py-5 px-5 rounded-2xl text-left flex items-center gap-3 active:scale-[0.98] transition-all duration-150 focus:outline-none focus:ring-4"
                    style={
                      i === 0
                        ? { background: '#00416A', color: 'white' }
                        : { background: '#F6F6F6', border: '1.5px solid #EEEEEE' }
                    }
                  >
                    <div className="flex-1">
                      <div className="font-semibold text-base leading-snug">{opt.label}</div>
                      <div className="text-sm font-normal mt-0.5" style={{ color: i === 0 ? 'rgba(255,255,255,0.58)' : '#808080' }}>
                        {opt.sub}
                      </div>
                    </div>
                    <ChevronRight size={18} aria-hidden="true" style={{ color: i === 0 ? 'rgba(255,255,255,0.5)' : '#AAAAAA', flexShrink: 0 }} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <p className="mt-6 text-xs text-center leading-relaxed" style={{ color: 'rgba(255,255,255,0.38)' }}>
            Demonstration mode — no case data is collected or stored.
          </p>
        </div>
      </main>
    </div>
  )
}
