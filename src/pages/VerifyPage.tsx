import { Link, useNavigate } from 'react-router-dom'
import { Shield, ArrowLeft } from 'lucide-react'

export default function VerifyPage() {
  const navigate = useNavigate()

  const handleAnswer = (isCitizen: boolean) => {
    navigate('/result', { state: { isCitizen } })
  }

  return (
    <div className="min-h-screen flex flex-col bg-cbp-tint">
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

      {/* Main */}
      <main className="flex-1 flex flex-col justify-center px-6 py-12">
        <div className="max-w-sm mx-auto w-full">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cbp-blue mb-4">
            Subject Interview
          </p>

          <h1 className="text-3xl font-extrabold text-[#222222] leading-tight mb-3">
            Are you a United States citizen?
          </h1>

          <p className="text-sm text-[#555555] leading-relaxed mb-10">
            Record the subject's verbal response to proceed with the determination.
          </p>

          <div className="space-y-4" role="group" aria-labelledby="question-heading">
            <button
              onClick={() => handleAnswer(true)}
              className="w-full bg-cbp-navy text-white font-semibold py-5 px-6 rounded-2xl text-left
                hover:bg-[#003558] active:scale-[0.98] transition-all duration-150
                focus:outline-none focus:ring-4 focus:ring-cbp-navy/40"
            >
              <span className="block text-lg">Yes, I am a U.S. Citizen</span>
              <span className="block text-sm text-white/60 font-normal mt-0.5">
                Subject verbally confirmed citizenship
              </span>
            </button>

            <button
              onClick={() => handleAnswer(false)}
              className="w-full bg-white text-[#333333] font-semibold py-5 px-6 rounded-2xl text-left
                border-2 border-[#EEEEEE] hover:border-[#AAAAAA] active:scale-[0.98] transition-all duration-150
                focus:outline-none focus:ring-4 focus:ring-cbp-navy/20"
            >
              <span className="block text-lg">No, I am not a U.S. Citizen</span>
              <span className="block text-sm text-[#808080] font-normal mt-0.5">
                Subject verbally denied citizenship
              </span>
            </button>
          </div>

          <p className="mt-8 text-xs text-[#AAAAAA] text-center leading-relaxed">
            Demonstration mode — no case data is collected or stored.
          </p>
        </div>
      </main>
    </div>
  )
}
