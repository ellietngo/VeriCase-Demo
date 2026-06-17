import { useState, useCallback, useEffect } from 'react'
import LandingPage from './pages/LandingPage'
import VerifyPage from './pages/VerifyPage'
import ResultPage from './pages/ResultPage'
import { type OutcomeNode, type Step } from './engine/engine'
import { type GeoData, fetchGeoData, getLocation } from './geo'

export type Page = 'landing' | 'verify' | 'result'
export type ResultState = { outcome: OutcomeNode; nodeId: string; history: Step[] }

function hashForPage(page: Page): string {
  if (page === 'verify') return '#/verify'
  if (page === 'result') return '#/result'
  return '#/'
}

function pageFromHash(hash: string): Page {
  if (hash === '#/verify') return 'verify'
  if (hash === '#/result') return 'result'
  return 'landing'
}

export default function App() {
  const [page, setPage] = useState<Page>(() => {
    // On mobile, skip landing page
    if (typeof window !== 'undefined' && window.innerWidth < 768) return 'verify'
    return 'landing'
  })
  const [result, setResult] = useState<ResultState | null>(null)
  const [geo, setGeo] = useState<GeoData | null>(null)
  const [verifyStart, setVerifyStart] = useState<string | undefined>(undefined)
  const [verifyOrigin, setVerifyOrigin] = useState<'landing' | 'result' | undefined>(undefined)

  // Sync URL hash on page changes
  useEffect(() => {
    window.history.pushState(null, '', hashForPage(page))
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [page])

  // Listen for browser back/forward
  useEffect(() => {
    const onPopState = () => {
      const p = pageFromHash(window.location.hash)
      setPage(p)
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  // On mobile, immediately go to verify on mount
  useEffect(() => {
    if (window.innerWidth < 768) {
      goToVerify()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const goToVerify = useCallback(async () => {
    setVerifyStart(undefined)
    setPage('verify')
    // Fire geo lookup in background — don't block navigation
    try {
      const pos = await getLocation()
      const data = await fetchGeoData(pos.coords.latitude, pos.coords.longitude)
      setGeo(data)
    } catch {
      // Geo is optional — silently ignore errors (denied, timeout, API down)
      setGeo(null)
    }
  }, [])

  const goToLanding = useCallback(() => { setPage('landing'); setGeo(null); setVerifyStart(undefined); setVerifyOrigin(undefined) }, [])
  const goToResult = useCallback((r: ResultState) => { setResult(r); setPage('result') }, [])
  const goToNewCase = useCallback(() => { setResult(null); setVerifyStart(undefined); setVerifyOrigin(undefined); setPage('verify') }, [])

  const goToStatusCheck = useCallback(() => { setVerifyStart('Q_STATUS'); setVerifyOrigin('result'); setPage('verify') }, [])

  const goToStatusCheckFromLanding = useCallback(() => {
    setResult(null)
    setVerifyStart('Q_STATUS')
    setVerifyOrigin('landing')
    setPage('verify')
  }, [])

  const backToResult = useCallback(() => { setPage('result') }, [])

  if (page === 'result' && result) {
    return <ResultPage result={result} geo={geo} onNewCase={goToNewCase} onHome={goToLanding} onStatusCheck={goToStatusCheck} />
  }
  if (page === 'verify') {
    return (
      <VerifyPage
        onResult={goToResult}
        onBack={verifyStart ? (verifyOrigin === 'result' ? backToResult : goToLanding) : goToLanding}
        geo={geo}
        startNodeId={verifyStart}
      />
    )
  }
  return <LandingPage onStart={goToVerify} onCheckStatus={goToStatusCheckFromLanding} />
}
