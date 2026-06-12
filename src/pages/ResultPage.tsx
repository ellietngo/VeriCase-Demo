import React, { useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { CheckCircle2, XCircle, Shield, RotateCcw, Home, Check } from 'lucide-react'

const MAX_STEPS = 3

export default function ResultPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const isCitizen: boolean | undefined = location.state?.isCitizen
  const steps: number = location.state?.steps ?? 1

  useEffect(() => {
    if (isCitizen === undefined) {
      navigate('/', { replace: true })
    }
  }, [isCitizen, navigate])

  if (isCitizen === undefined) return null

  return (
    <div className="min-h-screen flex flex-col bg-cbp-tint">
      {/* Header */}
      <header className="bg-cbp-navy text-white px-4 py-4">
        <div className="max-w-sm mx-auto flex items-center gap-2">
          <Shield size={18} strokeWidth={1.5} aria-hidden="true" />
          <span className="font-bold tracking-tight">VeriCase</span>
        </div>
      </header>

      {/* Completed progress bar */}
      <div className="bg-white border-b border-[#EEEEEE] px-6 py-4">
        <div className="max-w-sm mx-auto">
          <div className="flex items-center">
            {Array.from({ length: MAX_STEPS }, (_, i) => (
              <React.Fragment key={i}>
                {i > 0 && (
                  <div
                    className="flex-1 h-0.5 mx-2"
                    style={{ background: i < steps ? '#008000' : '#EEEEEE' }}
                  />
                )}
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                  style={{
                    background: i + 1 <= steps ? '#008000' : '#F6F6F6',
                    color: i + 1 <= steps ? 'white' : '#AAAAAA',
                    border: i + 1 > steps ? '1px solid #EEEEEE' : 'none',
                  }}
                >
                  {i + 1 <= steps ? <Check size={14} aria-hidden="true" /> : i + 1}
                </div>
              </React.Fragment>
            ))}
          </div>
          <p className="text-xs text-[#AAAAAA] mt-2.5">Interview complete</p>
        </div>
      </div>

      {/* Main */}
      <main className="flex-1 flex flex-col justify-center px-6 py-12">
        <div className="max-w-sm mx-auto w-full">
          <div className="bg-white rounded-3xl p-8 shadow-sm">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              {isCitizen ? (
                <div className="w-20 h-20 rounded-full bg-[#ECF5EC] flex items-center justify-center">
                  <CheckCircle2 size={44} className="text-cbp-success" strokeWidth={1.5} aria-hidden="true" />
                </div>
              ) : (
                <div className="w-20 h-20 rounded-full bg-[#EDF3F9] flex items-center justify-center">
                  <XCircle size={44} className="text-cbp-blue" strokeWidth={1.5} aria-hidden="true" />
                </div>
              )}
            </div>

            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#808080] text-center mb-2">
              Determination Complete
            </p>

            <h1 className="text-2xl font-extrabold text-[#222222] text-center mb-4">
              {isCitizen ? 'Citizenship Confirmed' : 'Non-Citizen Status'}
            </h1>

            <div className="flex justify-center mb-6">
              <span
                className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-1.5 rounded-full"
                style={
                  isCitizen
                    ? { background: '#ECF5EC', color: '#008000' }
                    : { background: '#EDF3F9', color: '#1460AA' }
                }
              >
                <span className="text-[8px]" aria-hidden="true">●</span>
                {isCitizen ? 'U.S. Citizen' : 'Non-U.S. Citizen'}
              </span>
            </div>

            <p className="text-sm text-[#555555] text-center leading-relaxed mb-6">
              {isCitizen
                ? 'The subject has verbally indicated U.S. citizenship. This determination is for demonstration purposes only.'
                : 'The subject has verbally indicated non-U.S. citizenship. For information about citizenship and naturalization pathways, visit USCIS.gov.'}
            </p>

            {!isCitizen && (
              <a
                href="https://www.uscis.gov/citizenship"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center text-sm text-cbp-blue font-medium hover:underline mb-6 focus:outline-none focus:underline"
              >
                Learn about U.S. Citizenship →
              </a>
            )}

            <div className="border-t border-[#EEEEEE] pt-6 space-y-3">
              <button
                onClick={() => navigate('/verify')}
                className="w-full flex items-center justify-center gap-2 border-2 border-[#EEEEEE]
                  text-[#333333] font-semibold py-4 rounded-2xl
                  hover:border-cbp-navy hover:text-cbp-navy transition-colors
                  focus:outline-none focus:ring-4 focus:ring-cbp-navy/20"
              >
                <RotateCcw size={16} aria-hidden="true" />
                New Case
              </button>
              <Link
                to="/"
                className="flex items-center justify-center gap-2 bg-cbp-navy text-white
                  font-semibold py-4 rounded-2xl hover:bg-[#003558] transition-colors
                  focus:outline-none focus:ring-4 focus:ring-cbp-navy/30"
              >
                <Home size={16} aria-hidden="true" />
                Back to Home
              </Link>
            </div>
          </div>

          <p className="mt-6 text-xs text-[#AAAAAA] text-center leading-relaxed px-4">
            Demonstration mode — no case data has been collected or stored.
            Not affiliated with any U.S. government agency.
          </p>
        </div>
      </main>
    </div>
  )
}
