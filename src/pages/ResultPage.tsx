import React, { useState } from 'react'
import { CheckCircle2, XCircle, Shield, RotateCcw, Home, Anchor, Building2, AlertTriangle, Users, MapPin, WifiOff, ListChecks, ChevronDown, Compass, Printer, Download, FileJson } from 'lucide-react'
import { jsPDF } from 'jspdf'
import { type ResultState } from '../App'
import { type GeoData } from '../geo'
import { useOnlineStatus } from '../useOnlineStatus'
import GovBanner from '../components/GovBanner'
import TorchLogo from '../components/TorchLogo'
import MiniMap from '../components/MiniMap'

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

// The immigration-status engine (see IMMIGRATION_ENGINE_START_NODE in engine.ts)
// is a fully separate question tree from the citizenship determination — it never
// shares nodes with, or routes into, the citizenship engine. Its outcome nodes
// resolve to one of 16 status codes (LPR, CPR, REFUGEE, ASYLEE, etc.), each
// carrying its own `title` and `definition` from citizenship_rules.json — so the
// result page builds its headline/body generically from those fields instead of
// a hand-maintained per-outcome copy table.
function immigrationStatusCopy(outcome: { title: string; definition?: string }) {
  return {
    eyebrow: 'Status Check Complete',
    headline: outcome.title,
    body: (outcome.definition ? `${outcome.definition} ` : '') +
      'This is a current-status check only — it is separate from, and does not by itself determine, U.S. citizenship.',
  }
}

function GeoCard({
  icon,
  label,
  name,
  detail,
  accentColor,
  updatedSince,
}: {
  icon: React.ReactNode
  label: string
  name: string
  detail: string
  accentColor: string
  updatedSince?: string
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
        <span className="flex items-center justify-center" style={{ color: accentColor }}>{icon}</span>
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/40 mb-0.5">{label}</p>
        <p className="text-sm font-semibold text-white leading-snug">{name}</p>
        <p className="text-xs text-white/50 mt-0.5">{detail}</p>
        {updatedSince && (
          <p className="text-[10px] text-white/30 mt-1.5">Up to date since {updatedSince}</p>
        )}
      </div>
    </div>
  )
}

// Shared disclaimer text — appears on every export (PDF footer, JSON field) so
// the two artifacts stay in sync if this wording ever changes.
const LEGAL_DISCLAIMER =
  'No personal data is collected or stored by VeriCase. This determination is not legal advice.'

type AuditSnapshot = {
  app: string
  generatedAtIso: string
  generatedAtLocal: string
  location: { latitude: number; longitude: number; jurisdiction: string | null } | null
  determination: { outcome: string; title: string; citation: string }
  questions: { step: number; prompt: string; answer: string; citation: string }[]
  disclaimer: string
}

function buildAuditSnapshot(result: ResultState, geo: GeoData | null): AuditSnapshot {
  const now = new Date()
  return {
    app: 'VeriCase by MetaPhase',
    generatedAtIso: now.toISOString(),
    generatedAtLocal: now.toLocaleString(),
    location: geo
      ? {
          latitude: geo.latitude,
          longitude: geo.longitude,
          jurisdiction: [geo.county, geo.state].filter(Boolean).join(', ') || null,
        }
      : null,
    determination: {
      outcome: result.outcome.outcome,
      title: result.outcome.title,
      citation: result.outcome.citation,
    },
    questions: result.history.map((s, i) => ({
      step: i + 1,
      prompt: s.node.prompt,
      answer: s.chosenLabel,
      citation: s.node.citation,
    })),
    disclaimer: LEGAL_DISCLAIMER,
  }
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

function exportAuditJson(result: ResultState, geo: GeoData | null) {
  const snapshot = buildAuditSnapshot(result, geo)
  const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: 'application/json' })
  triggerDownload(blob, `vericase-audit-${Date.now()}.json`)
}

// Custom-formatted audit document — deliberately NOT a screenshot/print of the
// result card. Built field-by-field with jsPDF so the export stays concise and
// readable on its own: VeriCase letterhead, a generated-at + location stamp,
// the final determination, then every question/answer/citation in the path.
// Shared by both the "Save as PDF" and "Print" actions so what you print is
// exactly what you download.
// Citizenship-engine results are green (CITIZEN) / red (NOT_CITIZEN); every
// immigration-status engine outcome (any of the 16 status codes) is rendered in
// the engine's blue, matching the in-app theming — they're a current-status
// check, not a citizenship verdict, so they don't get a green/red split.
function pdfColorForOutcome(outcome: string): [number, number, number] {
  if (outcome === 'CITIZEN') return [6, 95, 70] // #065f46
  if (outcome === 'NOT_CITIZEN') return [185, 28, 28] // #b91c1c
  return [29, 78, 216] // immigration-status outcomes — #1d4ed8
}

function buildAuditPdfDoc(result: ResultState, geo: GeoData | null): jsPDF {
  const snapshot = buildAuditSnapshot(result, geo)
  const isImmigrationPdf = snapshot.determination.outcome !== 'CITIZEN' && snapshot.determination.outcome !== 'NOT_CITIZEN'
  const [detR, detG, detB] = pdfColorForOutcome(snapshot.determination.outcome)

  const doc = new jsPDF({ unit: 'pt', format: 'letter' })
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 48
  const usableWidth = pageWidth - margin * 2
  // Room reserved at the bottom of every page for the disclaimer (which can
  // wrap to two lines) + page-number line, so body text never gets drawn
  // underneath or past it.
  const footerReserve = 40
  let y = margin

  // Checks space for a single line and breaks to a new page if it won't fit.
  // Called per-line (not per-block) so a long question/answer/citation can
  // never run off the bottom of a page — it just continues on the next one.
  function ensureSpace(needed: number) {
    if (y + needed > pageHeight - margin - footerReserve) {
      doc.addPage()
      y = margin
    }
  }

  // Draws each line individually, page-breaking as needed, and advances y.
  function drawWrappedLines(lines: string[], x: number, lineHeight: number) {
    lines.forEach((line) => {
      ensureSpace(lineHeight)
      doc.text(line, x, y)
      y += lineHeight
    })
  }

  // Letterhead
  doc.setFillColor(6, 95, 70) // #065f46
  doc.rect(0, 0, pageWidth, 64, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(20)
  doc.text('VeriCase', margin, 38)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.text(`by MetaPhase  ·  ${isImmigrationPdf ? 'Immigration Status Audit Trail' : 'Citizenship Determination Audit Trail'}`, margin, 52)
  y = 64 + 28

  // Generated + location stamp
  doc.setTextColor(40, 40, 40)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.text('Generated', margin, y)
  doc.setFont('helvetica', 'normal')
  doc.text(snapshot.generatedAtLocal, margin + 72, y)
  y += 16

  doc.setFont('helvetica', 'bold')
  doc.text('Location', margin, y)
  doc.setFont('helvetica', 'normal')
  const locationLine = snapshot.location
    ? `${snapshot.location.latitude.toFixed(5)}, ${snapshot.location.longitude.toFixed(5)}` +
      (snapshot.location.jurisdiction ? `   (${snapshot.location.jurisdiction})` : '')
    : 'Not available'
  doc.text(locationLine, margin + 72, y)
  y += 22

  doc.setDrawColor(220, 220, 220)
  doc.line(margin, y, pageWidth - margin, y)
  y += 24

  // Final determination
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.setTextColor(detR, detG, detB)
  doc.text('Final Determination', margin, y)
  y += 18
  doc.setFontSize(15)
  doc.text(snapshot.determination.title, margin, y)
  y += 16
  doc.setFont('helvetica', 'italic')
  doc.setFontSize(9)
  doc.setTextColor(120, 120, 120)
  doc.text(snapshot.determination.citation, margin, y)
  y += 26

  doc.setDrawColor(220, 220, 220)
  doc.line(margin, y, pageWidth - margin, y)
  y += 22

  // Questions & answers
  doc.setTextColor(40, 40, 40)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  ensureSpace(20)
  doc.text(`Questions & Answers (${snapshot.questions.length})`, margin, y)
  y += 18

  snapshot.questions.forEach((q) => {
    // IMPORTANT: set each segment's font/size BEFORE calling splitTextToSize
    // for it. splitTextToSize wraps using whatever font is currently active —
    // measuring with one font's metrics and then drawing in a different,
    // wider font (as the previous version did, by computing all three
    // line-arrays up front against leftover font state) lets lines run past
    // the right margin and off the page.
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    const promptLines: string[] = doc.splitTextToSize(`${q.step}. ${q.prompt}`, usableWidth)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    const answerLines: string[] = doc.splitTextToSize(q.answer, usableWidth - 10)

    doc.setFont('helvetica', 'italic')
    doc.setFontSize(8.5)
    const citationLines: string[] = doc.splitTextToSize(q.citation, usableWidth - 10)

    // Keep a question glued to its answer/citation when it reasonably fits;
    // if it doesn't, drawWrappedLines below still breaks safely line-by-line.
    const blockHeight = promptLines.length * 13 + answerLines.length * 13 + citationLines.length * 11 + 14
    ensureSpace(Math.min(blockHeight, pageHeight - margin * 2 - footerReserve))

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.setTextColor(30, 30, 30)
    drawWrappedLines(promptLines, margin, 13)
    y += 2

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.setTextColor(20, 90, 60)
    drawWrappedLines(answerLines, margin + 10, 13)
    y += 1

    doc.setFont('helvetica', 'italic')
    doc.setFontSize(8.5)
    doc.setTextColor(140, 140, 140)
    drawWrappedLines(citationLines, margin + 10, 11)
    y += 12
  })

  // Disclaimer + page numbers on every page
  const pageCount = doc.getNumberOfPages()
  for (let p = 1; p <= pageCount; p++) {
    doc.setPage(p)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7.5)
    doc.setTextColor(170, 170, 170)
    doc.text(LEGAL_DISCLAIMER, margin, pageHeight - 28, { maxWidth: usableWidth })
    doc.text(`Page ${p} of ${pageCount}`, pageWidth - margin - 56, pageHeight - 14)
  }

  return doc
}

function exportAuditPdf(result: ResultState, geo: GeoData | null) {
  buildAuditPdfDoc(result, geo).save(`vericase-audit-${Date.now()}.pdf`)
}

// "Print" opens the same formatted PDF document (not the result card) in a new
// tab and asks the browser's PDF viewer to trigger its print dialog right away.
function printAuditPdf(result: ResultState, geo: GeoData | null) {
  const doc = buildAuditPdfDoc(result, geo)
  doc.autoPrint()
  const blobUrl = doc.output('bloburl')
  window.open(blobUrl, '_blank')
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
  const outcomeKind = result.outcome.outcome
  const isCitizen = outcomeKind === 'CITIZEN'
  // The citizenship engine (rules.start) resolves to CITIZEN/NOT_CITIZEN; the
  // separate, self-contained immigration-status engine (IMMIGRATION_ENGINE_START_NODE)
  // resolves only to IMMIGRANT_STATUS/NONIMMIGRANT_STATUS. The two engines never
  // share nodes, so a result is exactly one of these, never both.
  const isCitizenshipResult = outcomeKind === 'CITIZEN' || outcomeKind === 'NOT_CITIZEN'
  const isImmigrationResult = !isCitizenshipResult

  const statusCopy = isImmigrationResult ? immigrationStatusCopy(result.outcome) : undefined
  const [showAudit, setShowAudit] = useState(false)
  const online = useOnlineStatus()
  const activeGeo = online ? geo : null   // never show stale location data when offline
  const hasGeoCards = activeGeo && (activeGeo.cbpPort || activeGeo.immigrationCourt || activeGeo.iceEro)

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden" style={pageStyle}>
      <style>{`
        @media print {
          body { background: white !important; color: #111 !important; }
          .no-print { display: none !important; }
          .print-card { box-shadow: none !important; border: 1px solid #ddd !important; }
          header, .geo-panel, iframe { display: none !important; }
          .card-in { animation: none !important; }
          #print-header { display: block !important; }
        }
        #print-header { display: none; }
      `}</style>
      {/* Print-only header */}
      <div id="print-header" style={{ padding: '16px 24px 8px', borderBottom: '2px solid #065f46', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <strong style={{ fontSize: 18, color: '#065f46' }}>VeriCase</strong>
          <span style={{ fontSize: 11, color: '#888' }}>by MetaPhase — {isImmigrationResult ? 'Immigration Status Check' : 'Citizenship Determination'}</span>
        </div>
        <div style={{ fontSize: 11, color: '#aaa' }}>
          Generated {new Date().toLocaleString()} · No personal data collected or stored
        </div>
      </div>
      <div style={shineStyle} aria-hidden="true" />
      <GovBanner />

      {/* Header */}
      <header
        className="relative z-10 px-4 py-4 text-white no-print"
        style={{ background: 'rgba(0,25,15,0.45)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}
      >
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <button
            onClick={onHome}
            className="flex items-center gap-2 rounded-xl hover:bg-white/10 px-2 py-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label="Go to home"
          >
            <TorchLogo size={22} className="text-white" />
            <div className="text-left">
              <div className="font-bold tracking-tight text-sm">VeriCase</div>
              <p className="text-[9px] uppercase tracking-[0.25em] text-white/40 mt-0.5">by MetaPhase</p>
            </div>
          </button>
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
            <div className="card-in print-card bg-white rounded-3xl shadow-2xl overflow-hidden">
              <div
                className="h-2"
                style={{
                  background: isImmigrationResult
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
                    {isImmigrationResult ? (
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
                      {statusCopy ? statusCopy.eyebrow : 'Determination Complete'}
                    </p>
                  </div>
                  <h1
                    className="text-4xl md:text-5xl font-extrabold leading-tight"
                    style={{ color: isImmigrationResult ? '#1d4ed8' : isCitizen ? '#065f46' : '#b91c1c' }}
                  >
                    {statusCopy ? statusCopy.headline : isCitizen ? 'U.S. Citizen' : 'Not a U.S. Citizen'}
                  </h1>
                </div>

                {/* Badge */}
                <div className="mb-4">
                  <span
                    className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-1.5 rounded-full"
                    style={
                      isImmigrationResult
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
                  {statusCopy
                    ? statusCopy.body
                    : isCitizen
                      ? 'Based on the answers provided, this person appears to be a U.S. citizen. This determination is not legal advice.'
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
                      className="text-sm font-medium hover:underline" style={{ color: isImmigrationResult ? '#1d4ed8' : '#dc2626' }}>
                      Learn about U.S. Citizenship →
                    </a>
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
                                style={{ background: isImmigrationResult ? '#1d4ed8' : isCitizen ? '#16a34a' : '#dc2626' }}
                              >
                                {isImmigrationResult ? (
                                  <Compass size={11} className="text-white" aria-hidden="true" />
                                ) : isCitizen ? (
                                  <CheckCircle2 size={11} className="text-white" aria-hidden="true" />
                                ) : (
                                  <XCircle size={11} className="text-white" aria-hidden="true" />
                                )}
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs text-[#999]">Final determination</p>
                                <p className="text-sm font-semibold mt-0.5" style={{ color: isImmigrationResult ? '#1d4ed8' : isCitizen ? '#065f46' : '#b91c1c' }}>
                                  {result.outcome.title}
                                </p>
                                <p className="text-[11px] text-[#bbb] italic mt-0.5">{result.outcome.citation}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Audit trail download actions */}
                        <div className="mt-4 pt-3 border-t border-[#eee] flex flex-wrap gap-2">
                          <button
                            onClick={() => printAuditPdf(result, activeGeo)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors hover:bg-gray-100"
                            style={{ border: '1px solid #ddd', color: '#555' }}
                          >
                            <Printer size={12} aria-hidden="true" />
                            Print
                          </button>
                          <button
                            onClick={() => exportAuditJson(result, activeGeo)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors hover:bg-gray-100"
                            style={{ border: '1px solid #ddd', color: '#555' }}
                          >
                            <FileJson size={12} aria-hidden="true" />
                            Download JSON
                          </button>
                          <button
                            onClick={() => exportAuditPdf(result, activeGeo)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors hover:bg-gray-100"
                            style={{ border: '1px solid #ddd', color: '#555' }}
                          >
                            <Download size={12} aria-hidden="true" />
                            Save as PDF
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="border-t border-[#EEE] pt-5 flex flex-wrap sm:flex-nowrap gap-3">
                  <button
                    onClick={onNewCase}
                    className="flex-1 min-w-[9.5rem] flex items-center justify-center border-2 border-[#EEE]
                      text-[#333] font-semibold py-3 rounded-2xl
                      hover:border-green-700 hover:text-green-700 transition-colors
                      focus:outline-none focus:ring-4 focus:ring-green-700/20"
                  >
                    {/* Icon + label wrapped together so the pair is sized to its own
                        content and centered as one unit — if the button is left as a
                        flex row with two top-level children, a wrapped two-line label
                        stretches to fill the remaining width and shoves the icon
                        against the left edge instead of keeping it next to the text. */}
                    <span className="inline-flex items-center gap-2 whitespace-nowrap">
                      <RotateCcw size={16} className="flex-shrink-0" aria-hidden="true" />
                      New Case
                    </span>
                  </button>
                  {/* Immigration status check — entry point into the separate immigration-status
                      engine. Shown on every citizenship-engine result (CITIZEN and NOT_CITIZEN
                      alike) so it's always available as a next step; hidden on immigration-engine
                      results themselves, since offering the same wizard from its own result
                      would be circular. */}
                  {isCitizenshipResult && (
                    <button
                      onClick={onStatusCheck}
                      className="flex-1 min-w-[9.5rem] flex items-center justify-center border-2
                        text-white font-semibold py-3 rounded-2xl transition-colors
                        hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-700/20"
                      style={{ background: '#2563eb', borderColor: '#2563eb' }}
                    >
                      <span className="inline-flex items-center gap-2 whitespace-nowrap">
                        <Compass size={16} className="flex-shrink-0" aria-hidden="true" />
                        Immigration Status
                      </span>
                    </button>
                  )}
                  <button
                    onClick={onHome}
                    className="flex-1 min-w-[9.5rem] flex items-center justify-center text-white
                      font-semibold py-3 rounded-2xl transition-colors
                      focus:outline-none focus:ring-4 focus:ring-green-900/30"
                    style={{ background: '#065f46' }}
                  >
                    <span className="inline-flex items-center gap-2 whitespace-nowrap">
                      <Home size={16} className="flex-shrink-0" aria-hidden="true" />
                      Back to Home
                    </span>
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
                    updatedSince="Jan 2025"
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
                    updatedSince="Mar 2025"
                  />
                )}

                {!isCitizen && activeGeo?.iceEro && (
                  <GeoCard
                    icon={<Shield size={16} />}
                    label="ICE ERO Field Office"
                    name={activeGeo.iceEro.name}
                    detail={`${activeGeo.iceEro.distanceMiles} mi ${activeGeo.iceEro.cardinal}`}
                    accentColor="#fcd34d"
                    updatedSince="Mar 2025"
                  />
                )}

                {/* Minimap */}
                {activeGeo && (
                  <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
                    <MiniMap latitude={activeGeo.latitude} longitude={activeGeo.longitude} height={160} />
                    <a
                      href={`https://maps.google.com/?q=${activeGeo.latitude},${activeGeo.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-2 text-[10px] font-semibold transition-colors hover:bg-white/10"
                      style={{ color: 'rgba(255,255,255,0.45)', background: 'rgba(0,0,0,0.25)' }}
                    >
                      <MapPin size={10} style={{ color: '#86efac' }} aria-hidden="true" />
                      Open in Google Maps
                    </a>
                  </div>
                )}

                {/* Footer */}
                <p className="text-[10px] text-center leading-relaxed px-1 mt-1" style={{ color: 'rgba(255,255,255,0.28)' }}>
                  Built by{' '}
                  <a href="https://metaphase.tech" target="_blank" rel="noopener noreferrer"
                    className="font-semibold hover:underline" style={{ color: '#fb923c' }}>
                    MetaPhase
                  </a>
                  {' · '}
                  <a href="#/terms" className="hover:underline" style={{ color: 'rgba(255,255,255,0.28)' }}>Terms of Use</a>
                </p>
              </div>
            )}
          </div>

          {/* Footer — only shown when no geo panel */}
          {!hasGeoCards && !online && (
            <p className="mt-6 text-xs text-center leading-relaxed px-4" style={{ color: 'rgba(255,255,255,0.38)' }}>
              Built by{' '}
              <a href="https://metaphase.tech" target="_blank" rel="noopener noreferrer"
                className="font-semibold hover:underline" style={{ color: '#fb923c' }}>
                MetaPhase
              </a>
              {' · '}
              <a href="#/terms" className="hover:underline" style={{ color: 'rgba(255,255,255,0.28)' }}>Terms of Use</a>
            </p>
          )}
        </div>
      </main>
    </div>
  )
}
