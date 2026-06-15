import React from 'react'
import { CheckCircle2, XCircle, Shield, RotateCcw, Home } from 'lucide-react'
import { type ResultState } from '../App'

const pageStyle: React.CSSProperties = {
  background: 'linear-gradient(-45deg, #064e3b, #052e16, #065f46, #14532d)',
  backgroundSize: '400% 400%',
  animation: 'hero-gradient 14s ease infinite',
}

const shineStyle: React.CSSProperties = {
  position: 'absolute',
  top: 0, left: 0,
  width: '140px', height: '100%',
  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.03), transparent)',
  animation: 'hero-shine 20s ease-in-out infinite',
  animationDelay: '8s',
  pointerEvents: 'none',
}

export default function ResultPage({
  result,
  onNewCase,
  onHome,
}: {
  result: ResultState
  onNewCase: () => void
  onHome: () => void
}) {
  const isCitizen = result.outcome.outcome === 'CITIZEN'

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden" style={pageStyle}>
      <div style={shineStyle} aria-hidden="true" />

      {/* Header */}
      <header
        className="relative z-10 px-4 py-4 text-white"
        style={{ background: 'rgba(0,25,15,0.45)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}
      >
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield size={18} strokeWidth={1.5} aria-hidden="true" />
            <div>
              <span className="font-bold tracking-tight">VeriCase</span>
              <p className="text-[9px] uppercase tracking-[0.25em] text-white/40 mt-0.5">MetaPhase</p>
            </div>
          </div>
          <div className="hidden sm:block text-right">
            <p className="text-[9px] uppercase tracking-[0.2em] text-white/40">Session</p>
            <p className="text-xs font-semibold text-white/65 tracking-wide">Determination</p>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="relative z-10 flex-1 flex flex-col justify-center px-4 py-12 md:px-8 md:py-16">
        <div className="w-full max-w-sm mx-auto md:max-w-2xl">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            {/* Accent strip */}
            <div
              className="h-1.5"
              style={{
                background: isCitizen
                  ? 'linear-gradient(90deg, #065f46, #16a34a)'
                  : 'linear-gradient(90deg, #00416A, #1460AA)',
              }}
              aria-hidden="true"
            />

            <div className="p-8 md:p-10 md:grid md:grid-cols-[auto_1fr] md:gap-10 md:items-start">
              {/* Icon */}
              <div className="flex justify-center mb-6 md:mb-0">
                {isCitizen ? (
                  <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: '#dcfce7' }}>
                    <CheckCircle2 size={44} strokeWidth={1.5} style={{ color: '#065f46' }} aria-hidden="true" />
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-full bg-[#EDF3F9] flex items-center justify-center">
                    <XCircle size={44} className="text-cbp-blue" strokeWidth={1.5} aria-hidden="true" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#808080] text-center md:text-left mb-2">
                  Determination Complete
                </p>

                <h1 className="text-2xl md:text-3xl font-extrabold text-[#222] text-center md:text-left mb-3">
                  {isCitizen ? 'U.S. Citizen' : 'Not a U.S. Citizen'}
                </h1>

                <div className="flex justify-center md:justify-start mb-4">
                  <span
                    className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-1.5 rounded-full"
                    style={
                      isCitizen
                        ? { background: '#dcfce7', color: '#065f46' }
                        : { background: '#EDF3F9', color: '#1460AA' }
                    }
                  >
                    <span className="text-[8px]" aria-hidden="true">●</span>
                    {result.outcome.title}
                  </span>
                </div>

                <p className="text-xs text-[#999] italic text-center md:text-left mb-5">
                  {result.outcome.citation}
                </p>

                <p className="text-sm md:text-base text-[#555] text-center md:text-left leading-relaxed mb-5">
                  {isCitizen
                    ? 'Based on the answers provided, this person appears to be a U.S. citizen. This determination is for demonstration purposes only and is not legal advice.'
                    : 'Based on the answers provided, this person does not appear to be a U.S. citizen. For information about citizenship and naturalization pathways, visit USCIS.gov.'}
                </p>

                {!isCitizen && (
                  <div className="flex justify-center md:justify-start mb-5">
                    <a href="https://www.uscis.gov/citizenship" target="_blank" rel="noopener noreferrer"
                      className="text-sm font-medium hover:underline" style={{ color: '#065f46' }}>
                      Learn about U.S. Citizenship →
                    </a>
                  </div>
                )}

                <div className="border-t border-[#EEE] pt-5 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={onNewCase}
                    className="flex-1 flex items-center justify-center gap-2 border-2 border-[#EEE]
                      text-[#333] font-semibold py-3 rounded-2xl
                      hover:border-green-700 hover:text-green-700 transition-colors
                      focus:outline-none focus:ring-4 focus:ring-green-700/20"
                  >
                    <RotateCcw size={16} aria-hidden="true" />
                    New Case
                  </button>
                  <button
                    onClick={onHome}
                    className="flex-1 flex items-center justify-center gap-2 text-white
                      font-semibold py-3 rounded-2xl transition-colors
                      focus:outline-none focus:ring-4 focus:ring-green-900/30"
                    style={{ background: '#065f46' }}
                  >
                    <Home size={16} aria-hidden="true" />
                    Back to Home
                  </button>
                </div>
              </div>
            </div>
          </div>

          <p className="mt-6 text-xs text-center leading-relaxed px-4" style={{ color: 'rgba(255,255,255,0.38)' }}>
            Demonstration mode — no case data has been collected or stored.
            built by{' '}
            <a href="https://metaphase.tech" target="_blank" rel="noopener noreferrer"
              className="font-semibold hover:underline" style={{ color: '#fb923c' }}>
              MetaPhase
            </a>
            . Not affiliated with any U.S. government agency.
          </p>
        </div>
      </main>
    </div>
  )
}
