import { useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { CheckCircle2, XCircle, Shield, RotateCcw, Home } from 'lucide-react'

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
  animationDelay: '8s',
  pointerEvents: 'none',
}

import React from 'react'

export default function ResultPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const isCitizen: boolean | undefined = location.state?.isCitizen

  useEffect(() => {
    if (isCitizen === undefined) {
      navigate('/', { replace: true })
    }
  }, [isCitizen, navigate])

  if (isCitizen === undefined) return null

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden" style={pageStyle}>
      {/* Decorative layer */}
      <div style={shineStyle} aria-hidden="true" />
      <div className="absolute border border-white/8 rounded-full pointer-events-none" style={{ top: '10%', right: '6%', width: 100, height: 100, animation: 'float-slow 10s ease-in-out infinite' }} aria-hidden="true" />
      <div className="absolute border border-white/6 rounded-full pointer-events-none" style={{ bottom: '20%', left: '5%', width: 70, height: 70, animation: 'float-med 7s ease-in-out infinite', animationDelay: '3s' }} aria-hidden="true" />
      <div className="absolute border border-white/5 rounded-full pointer-events-none" style={{ top: '55%', right: '10%', width: 48, height: 48, animation: 'float-slow 9s ease-in-out infinite', animationDelay: '1s' }} aria-hidden="true" />

      {/* Header — frosted glass */}
      <header
        className="relative z-10 px-4 py-4 text-white"
        style={{ background: 'rgba(0,25,45,0.45)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}
      >
        <div className="max-w-sm mx-auto flex items-center gap-2">
          <Shield size={18} strokeWidth={1.5} aria-hidden="true" />
          <span className="font-bold tracking-tight">VeriCase</span>
        </div>
      </header>

      {/* Main */}
      <main className="relative z-10 flex-1 flex flex-col justify-center px-6 py-12">
        <div className="max-w-sm mx-auto w-full">
          <div className="bg-white rounded-3xl p-8 shadow-2xl">
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

          <p className="mt-6 text-xs text-center leading-relaxed px-4" style={{ color: 'rgba(255,255,255,0.38)' }}>
            Demonstration mode — no case data has been collected or stored.
            Not affiliated with any U.S. government agency.
          </p>
        </div>
      </main>
    </div>
  )
}
