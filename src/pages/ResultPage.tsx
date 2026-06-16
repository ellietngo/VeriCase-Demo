import React, { useState } from 'react'
import { CheckCircle2, XCircle, Shield, RotateCcw, Home, Anchor, Building2, AlertTriangle, Users, MapPin, WifiOff, ListChecks, ChevronDown, Compass } from 'lucide-react'
import { type ResultState } from '../App'
import { type GeoData } from '../geo'
import { useOnlineStatus } from '../useOnlineStatus'

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

// Outcomes reached via the immigration-status classifier (Q_STATUS) describe a
// *current status*, not a citizenship verdict in the adversarial sense — so they
// get their own headline/icon/copy instead of the generic "Not a U.S. Citizen" framing.
// The underlying engine still resolves every one of these to outcome: 'NOT_CITIZEN';
// this is presentation-only differentiation, no change to the rules engine.
const STATUS_OUTCOME_COPY: Record<string, { eyebrow: string; headline: string; body: string }> = {
  NO_NONIMM: {
    eyebrow: 'Status Check Complete',
    headline: 'Nonimmigrant Status',
    body: 'This person currently holds nonimmigrant status (such as a tourist, student, or work visa). On its own, nonimmigrant status does not lead toward lawful permanent residence or citizenship — a separate basis (such as employer sponsorship, family petition, or marriage to a U.S. citizen) would be needed to start that process.',
  },
  NO_UNDOC: {
    eyebrow: 'Status Check Complete',
    headline: 'No Current Lawful Status',
    body: 'This person does not currently hold any lawful immigration status. There is no direct path to citizenship without first obtaining a lawful basis to remain, such as an approved visa petition, asylum, or another form of relief. An immigration attorney can help identify what options, if any, may be available.',
  },
  NO_NAT_MARRIAGE: {
    eyebrow: 'Status Check Complete',
    headline: 'Marriage-Based Status Pending',
    body: 'This person is married to (or holds a marriage/fiancé-based visa tied to) a U.S. citizen, but has not yet been approved for lawful permanent residence. The marriage itself does not confer citizenship — naturalization eligibility begins only after the green card is approved.',
  },
}

function GeoCard({
  icon,
  label,
  name,
  detail,
  accentColor,
}: {
  icon: React.ReactNode
  label: string
  name: string
  detail: string
  accentColor: string
}) {
  return (
    <div
      className="flex items-start gap-3 rounded-2xl p-4"
      style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}
    >
      <div
        className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center mt-0.5"
        style={{ background: accentColor + '22' }}
      >
        <span style={{ color: accentColor }}>{icon}</span>
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/40 mb-0.5">{label}</p>
        <p className="text-sm font-semibold text-white leading-snug">{name}</p>
        <p className="text-xs text-white/50 mt-0.5">{detail}</p>
      </div>
    </div>
  )
}

export default function ResultPage({
  result,
  geo,
  onNewCase,
  onHome,
  onStatusCheck,
}: {
  result: ResultState
  geo: GeoData | null
  onNewCase: () => void
  onHome: () => void
  onStatusCheck: () => void
}) {
  const isCitizen = result.outcome.outcome === 'CITIZEN'
  const statusCopy = STATUS_OUTCOME_COPY[result.nodeId]
  const isStatusCheck = !!statusCopy
  const [showAudit, setShowAudit] = useState(false)
  const online = useOnlineStatus()
  const activeGeo = online ? geo : null   // never show stale location data when offline
  const hasGeoCards = activeGeo && (activeGeo.cbpPort || activeGeo.immigrationCourt || activeGeo.iceEro)

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
          <div className="flex items-center gap-3">
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold"
              style={
                online
                  ? { background: 'rgba(74,222,128,0.12)', border: '1px solid rgba(74,222,128,0.25)', color: '#86efac' }
                  : { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.35)' }
              }
            >
              {online ? (
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" style={{ animation: 'pulse-out 2.5s ease-out infinite' }} />
              ) : (
                <WifiOff size={10} aria-hidden="true" />
              )}
              {online ? 'Online' : 'Offline'}
            </div>
            <div className="hidden sm:block text-right">
              <p className="text-[9px] uppercase tracking-[0.2em] text-white/40">Session</p>
              <p className="text-xs font-semibold text-white/65 tracking-wide">Determination</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="relative z-10 flex-1 flex flex-col justify-center px-4 py-8 md:px-8">
        <div className="w-full max-w-5xl mx-auto">

          {/* Tribal trust land warning — full width above grid */}
          {activeGeo?.inTribalTrustLand && (
            <div
              className="mb-4 flex items-start gap-3 px-4 py-3 rounded-2xl text-sm font-medium"
              style={{ background: 'rgba(251,191,36,0.12)', border: '1px solid rgba(251,191,36,0.25)', color: '#fde68a' }}
            >
              <AlertTriangle size={16} className="flex-shrink-0 mt-0.5" style={{ color: '#fbbf24' }} />
              <span>
                Determination completed on {activeGeo.tribalName ? <strong>{activeGeo.tribalName}</strong> : 'tribal trust land'}.
                Tribal enrollment and federal Indian law may create overlapping jurisdictional considerations.
              </span>
            </div>
          )}

          {/* Side-by-side layout on md+ — always two columns if online (even while geo is loading) */}
          <div className={`flex flex-col ${hasGeoCards || online ? 'md:grid md:grid-cols-[1fr_300px] md:gap-5 md:items-start' : ''}`}>

            {/* Left — result card */}
            <style>{`
              @keyframes card-in {
                from { opacity: 0; transform: translateY(20px) scale(0.98); }
                to   { opacity: 1; transform: translateY(0) scale(1); }
              }
              .card-in { animation: card-in 400ms cubic-bezier(0.22, 1, 0.36, 1) both; }
            `}</style>
            <div className="card-in bg-white rounded-3xl shadow-2xl overflow-hidden">
              <div
                className="h-2"
                style={{
                  background: isStatusCheck
                    ? 'linear-gradient(90deg, #1d4ed8, #2563eb)'
                    : isCitizen
                      ? 'linear-gradient(90deg, #065f46, #16a34a)'
                      : 'linear-gradient(90deg, #b91c1c, #dc2626)',
                }}
                aria-hidden="true"
              />

              <div className="p-7 md:p-9">
                {/* Icon + headline */}
                <div className="flex flex-col gap-4 mb-6">
                  <div className="flex items-center gap-4">
                    {isStatusCheck ? (
                      <div className="flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: '#dbeafe' }}>
                        <Compass size={30} strokeWidth={1.5} style={{ color: '#1d4ed8' }} aria-hidden="true" />
                      </div>
                    ) : isCitizen ? (
                      <div className="flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: '#dcfce7' }}>
                        <CheckCircle2 size={30} strokeWidth={1.5} style={{ color: '#065f46' }} aria-hidden="true" />
                      </div>
                    ) : (
                      <div className="flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: '#fee2e2' }}>
                        <XCircle size={30} strokeWidth={1.5} style={{ color: '#dc2626' }} aria-hidden="true" />
                      </div>
                    )}
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#999]">
                      {isStatusCheck ? statusCopy.eyebrow : 'Determination Complete'}
                    </p>
                  </div>
                  <h1
                    className="text-4xl md:text-5xl font-extrabold leading-tight"
                    style={{ color: isStatusCheck ? '#1d4ed8' : isCitizen ? '#065f46' : '#b91c1c' }}
                  >
                    {isStatusCheck ? statusCopy.headline : isCitizen ? 'U.S. Citizen' : 'Not a U.S. Citizen'}
                  </h1>
                </div>

                {/* Badge */}
                <div className="mb-4">
                  <span
                    className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-1.5 rounded-full"
                    style={
                      isStatusCheck
                        ? { background: '#dbeafe', color: '#1d4ed8' }
                        : isCitizen
                          ? { background: '#dcfce7', color: '#065f46' }
                          : { background: '#fee2e2', color: '#dc2626' }
                    }
                  >
                    <span className="text-[8px]" aria-hidden="true">●</span>
                    {result.outcome.title}
                  </span>
                </div>

                <p className="text-xs text-[#999] italic mb-4">{result.outcome.citation}</p>

                <p className="text-sm text-[#555] leading-relaxed mb-4">
                  {isStatusCheck
                    ? statusCopy.body
                    : isCitizen
                      ? 'Based on the answers provided, this person appears to be a U.S. citizen. This determination is for demonstration purposes only and is not legal advice.'
                      : 'Based on the answers provided, this person does not appear to be a U.S. citizen. For information about citizenship and naturalization pathways, visit USCIS.gov.'}
                </p>

                {/* Congressional district chip — CITIZEN only */}
                {isCitizen && activeGeo?.congressionalDistrict && (
                  <div
                    className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-xl"
                    style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}
                  >
                    <Users size={12} style={{ color: '#16a34a' }} aria-hidden="true" />
                    <span className="text-xs font-semibold" style={{ color: '#15803d' }}>
                      Congressional District: {activeGeo.congressionalDistrict}
                    </span>
                  </div>
                )}

                {!isCitizen && (
                  <div className="mb-4">
                    <a href="https://www.uscis.gov/citizenship" target="_blank" rel="noopener noreferrer"
                      className="text-sm font-medium hover:underline" style={{ color: isStatusCheck ? '#1d4ed8' : '#dc2626' }}>
                      Learn about U.S. Citizenship →
                    </a>
                  </div>
                )}

                {/* Immigration status check — secondary wizard entry, NOT_CITIZEN only.
                    Distinct from citizenship: classifies current status (tourist, student,
                    work visa, marriage, undocumented) and what — if anything — leads toward
                    LPR status and eventual naturalization. Hidden when the result IS already
                    a status-check outcome, since re-offering the same wizard is circular. */}
                {!isCitizen && !isStatusCheck && (
                  <div
                    className="mb-4 flex items-start gap-3 rounded-2xl p-4"
                    style={{ background: '#eff6ff', border: '1px solid #bfdbfe' }}
                  >
                    <Compass size={18} className="flex-shrink-0 mt-0.5" style={{ color: '#2563eb' }} aria-hidden="true" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold" style={{ color: '#1d4ed8' }}>
                        Check current immigration status
                      </p>
                      <p className="text-xs mt-0.5 leading-relaxed" style={{ color: '#3b82f6' }}>
                        Not a citizen yet doesn't mean no current status. Run a short follow-up to classify
                        this person as a tourist, student, work-visa holder, marriage-based applicant, or
                        undocumented — and see whether that status opens any path toward lawful permanent
                        residence and, eventually, naturalization.
                      </p>
                      <button
                        onClick={onStatusCheck}
                        className="mt-3 inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl text-white transition-colors
                          hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-700/20"
                        style={{ background: '#2563eb' }}
                      >
                        <Compass size={14} aria-hidden="true" />
                        Check Immigration Status
                      </button>
                    </div>
                  </div>
                )}

                {/* Audit trail toggle */}
                {result.history.length > 0 && (
                  <div className="mb-4">
                    <button
                      onClick={() => setShowAudit((v) => !v)}
                      className="flex items-center gap-2 text-sm font-semibold rounded-xl px-3 py-2 transition-colors
                        focus:outline-none focus:ring-4 focus:ring-green-700/15"
                      style={{ background: '#f0fdf4', color: '#065f46', border: '1px solid #bbf7d0' }}
                      aria-expanded={showAudit}
                    >
                      <ListChecks size={15} aria-hidden="true" />
                      {showAudit
                        ? 'Hide Audit Trail'
                        : `View Audit Trail (${result.history.length} question${result.history.length === 1 ? '' : 's'})`}
                      <ChevronDown
                        size={14}
                        aria-hidden="true"
                        style={{ transform: showAudit ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 200ms ease' }}
                      />
                    </button>

                    {showAudit && (
                      <div className="mt-3 rounded-2xl p-4" style={{ background: '#fafafa', border: '1px solid #eee' }}>
                        <div className="relative">
                          <div className="absolute left-[8px] top-2 bottom-2 w-px bg-[#e4e8ec]" aria-hidden="true" />
                          <div className="space-y-4">
                            {result.history.map((step, i) => (
                              <div key={i} className="flex gap-3 items-start relative z-10">
                                <div
                                  className="w-[18px] h-[18px] rounded-full flex-shrink-0 flex items-center justify-center mt-0.5"
                                  style={{ background: '#065f46' }}
                                >
                                  <span className="text-white text-[10px] font-bold">{i + 1}</span>
                                </div>
                                <div className="min-w-0">
                                  <p className="text-xs text-[#999] leading-snug">{step.node.prompt}</p>
                                  <p className="text-sm font-semibold text-[#222] mt-0.5">{step.chosenLabel}</p>
                                  <p className="text-[11px] text-[#bbb] italic mt-0.5">{step.node.citation}</p>
                                </div>
                              </div>
                            ))}

                            <div className="flex gap-3 items-start relative z-10">
                              <div
                                className="w-[18px] h-[18px] rounded-full flex-shrink-0 flex items-center justify-center mt-0.5"
                                style={{ background: isCitizen ? '#16a34a' : '#dc2626' }}
                              >
                                {isCitizen ? (
                                  <CheckCircle2 size={11} className="text-white" aria-hidden="true" />
                                ) : (
                                  <XCircle size={11} className="text-white" aria-hidden="true" />
                                )}
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs text-[#999]">Final determination</p>
                                <p className="text-sm font-semibold mt-0.5" style={{ color: isCitizen ? '#065f46' : '#b91c1c' }}>
                                  {result.outcome.title}
                                </p>
                                <p className="text-[11px] text-[#bbb] italic mt-0.5">{result.outcome.citation}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
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

            {/* Right — geo context panel (cards when online + data, offline notice when not) */}
            {(hasGeoCards || online) && (
              <div className="mt-4 md:mt-0 flex flex-col gap-3">
                {/* Header row */}
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-1.5">
                    <MapPin size={11} style={{ color: '#4ade80' }} />
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/40">
                      Location Context
                    </p>
                  </div>
                  <a
                    href="https://geoborder.metaphase.tech"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] font-semibold hover:underline"
                    style={{ color: 'rgba(255,255,255,0.3)' }}
                  >
                    powered by <span style={{ color: '#4ade80' }}>GeoBorder</span>
                  </a>
                </div>

                {/* Offline notice */}
                {!online && (
                  <div
                    className="flex items-start gap-3 rounded-2xl p-4"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                  >
                    <WifiOff size={16} className="flex-shrink-0 mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }} />
                    <div>
                      <p className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.5)' }}>Location context unavailable</p>
                      <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>
                        Connect to the internet to enable GeoBorder jurisdiction data, nearest CBP port, and immigration court.
                      </p>
                    </div>
                  </div>
                )}

                {/* Jurisdiction summary pill */}
                {activeGeo && (activeGeo.county || activeGeo.state) && (
                  <div
                    className="flex items-center gap-2 px-4 py-3 rounded-2xl"
                    style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}
                  >
                    <MapPin size={14} style={{ color: '#86efac' }} aria-hidden="true" />
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/40 mb-0.5">Jurisdiction</p>
                      <p className="text-sm font-semibold text-white">
                        {[activeGeo.county, activeGeo.state].filter(Boolean).join(', ')}
                      </p>
                      {activeGeo.federalJudicialDistrict && (
                        <p className="text-xs text-white/50 mt-0.5">{activeGeo.federalJudicialDistrict}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* CBP Port — both outcomes */}
                {activeGeo?.cbpPort && (
                  <GeoCard
                    icon={<Anchor size={16} />}
                    label="Nearest CBP Port of Entry"
                    name={`${activeGeo.cbpPort.name}${activeGeo.cbpPort.portCode ? ` (Port ${activeGeo.cbpPort.portCode})` : ''}`}
                    detail={`${activeGeo.cbpPort.distanceMiles} mi ${activeGeo.cbpPort.cardinal}`}
                    accentColor="#86efac"
                  />
                )}

                {/* Immigration Court + ICE ERO — NOT_CITIZEN only */}
                {!isCitizen && activeGeo?.immigrationCourt && (
                  <GeoCard
                    icon={<Building2 size={16} />}
                    label="Nearest Immigration Court"
                    name={activeGeo.immigrationCourt.name}
                    detail={`${activeGeo.immigrationCourt.distanceMiles} mi ${activeGeo.immigrationCourt.cardinal}`}
                    accentColor="#fca5a5"
                  />
                )}

                {!isCitizen && activeGeo?.iceEro && (
                  <GeoCard
                    icon={<Shield size={16} />}
                    label="ICE ERO Field Office"
                    name={activeGeo.iceEro.name}
                    detail={`${activeGeo.iceEro.distanceMiles} mi ${activeGeo.iceEro.cardinal}`}
                    accentColor="#fcd34d"
                  />
                )}

                {/* Footer disclaimer */}
                <p className="text-[10px] text-center leading-relaxed px-1 mt-1" style={{ color: 'rgba(255,255,255,0.28)' }}>
                  Built by{' '}
                  <a href="https://metaphase.tech" target="_blank" rel="noopener noreferrer"
                    className="font-semibold hover:underline" style={{ color: '#fb923c' }}>
                    MetaPhase
                  </a>
                  . Not affiliated with any U.S. government agency.
                </p>
              </div>
            )}
          </div>

          {/* Footer — only shown when no geo cards (otherwise footer is inside geo panel) */}
          {!hasGeoCards && (
            <p className="mt-6 text-xs text-center leading-relaxed px-4" style={{ color: 'rgba(255,255,255,0.38)' }}>
              Demonstration mode — no case data collected or stored. Built by{' '}
              <a href="https://metaphase.tech" target="_blank" rel="noopener noreferrer"
                className="font-semibold hover:underline" style={{ color: '#fb923c' }}>
                MetaPhase
              </a>
              . Not affiliated with any U.S. government agency.
            </p>
          )}
        </div>
      </main>
    </div>
  )
}
