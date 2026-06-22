import { useState, useCallback, useEffect, useRef } from 'react'
import LandingPage from './pages/LandingPage'
import VerifyPage from './pages/VerifyPage'
import ResultPage from './pages/ResultPage'
import TermsPage from './pages/TermsPage'
import PrivacyPage from './pages/PrivacyPage'
import SourcesPage from './pages/SourcesPage'
import { type OutcomeNode, type Step, IMMIGRATION_ENGINE_START_NODE } from './engine/engine'
import { type GeoData, fetchGeoData, getLocation, classifyGeoError, type GeoError } from './geo'

export type Page = 'landing' | 'verify' | 'result' | 'terms' | 'privacy' | 'sources'
export type ResultState = { outcome: OutcomeNode; nodeId: string; history: Step[] }

function hashForPage(page: Page): string {
  if (page === 'verify') return '#/verify'
  if (page === 'result') return '#/result'
  if (page === 'terms') return '#/terms'
  if (page === 'privacy') return '#/privacy'
  if (page === 'sources') return '#/sources'
  return '#/'
}

function pageFromHash(hash: string): Page {
  if (hash.startsWith('#/verify')) return 'verify'
  if (hash.startsWith('#/result')) return 'result'
  if (hash.startsWith('#/terms')) return 'terms'
  if (hash.startsWith('#/privacy')) return 'privacy'
  if (hash.startsWith('#/sources')) return 'sources'
  return 'landing'
}

export default function App() {
  const [page, setPage] = useState<Page>(() => {
    // On mobile, skip landing page
    if (typeof window !== 'undefined' && window.innerWidth < 768) return 'verify'
    // Check hash on initial load
    const h = window.location.hash
    if (h) return pageFromHash(h)
    return 'landing'
  })
  const [result, setResult] = useState<ResultState | null>(null)
  const [geo, setGeo] = useState<GeoData | null>(null)
  const [geoError, setGeoError] = useState<GeoError | null>(null)
  const [verifyStart, setVerifyStart] = useState<string | undefined>(undefined)
  const [verifyOrigin, setVerifyOrigin] = useState<'landing' | 'result' | undefined>(undefined)

  // Track the current page in a ref so the popstate handler never closes over stale state
  const pageRef = useRef(page)
  useEffect(() => { pageRef.current = page }, [page])

  // Sync URL hash on page changes (but NOT for in-verify question navigation)
  const isVerifyInternalNav = useRef(false)
  useEffect(() => {
    if (isVerifyInternalNav.current) { isVerifyInternalNav.current = false; return }
    window.history.pushState({ page }, '', hashForPage(page))
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [page])

  // App-level popstate: only act when the page actually needs to change
  useEffect(() => {
    const onPopState = (e: PopStateEvent) => {
      // If the state was pushed by VerifyPage (has historyLen), ignore at App level
      if (e.state && typeof e.state.historyLen === 'number') return
      const target = pageFromHash(window.location.hash)
      if (target !== pageRef.current) {
        setPage(target)
      }
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  // On mobile, immediately go to verify on mount
  useEffect(() => {
    if (window.innerWidth < 768) goToVerify()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const goToVerify = useCallback(async () => {
    setVerifyStart(undefined)
    setGeoError(null)
    setPage('verify')
    try {
      const pos = await getLocation()
      const data = await fetchGeoData(pos.coords.latitude, pos.coords.longitude)
      setGeo(data)
    } catch (err) {
      setGeo(null)
      if (err instanceof GeolocationPositionError || err instanceof Error) {
        setGeoError(classifyGeoError(err as GeolocationPositionError))
      }
    }
  }, [])

  const goToLanding = useCallback(() => {
    setPage('landing'); setGeo(null); setGeoError(null); setVerifyStart(undefined); setVerifyOrigin(undefined)
  }, [])
  const goToResult = useCallback((r: ResultState) => { setResult(r); setPage('result') }, [])
  const goToNewCase = useCallback(() => { setResult(null); setVerifyStart(undefined); setVerifyOrigin(undefined); setPage('verify') }, [])
  const goToStatusCheck = useCallback(() => { setVerifyStart(IMMIGRATION_ENGINE_START_NODE); setVerifyOrigin('result'); setPage('verify') }, [])
  const goToStatusCheckFromLanding = useCallback(() => {
    setResult(null); setVerifyStart(IMMIGRATION_ENGINE_START_NODE); setVerifyOrigin('landing'); setPage('verify')
  }, [])
  const backToResult = useCallback(() => { setPage('result') }, [])

  if (page === 'terms')   return <TermsPage onBack={goToLanding} />
  if (page === 'privacy') return <PrivacyPage onBack={goToLanding} />
  if (page === 'sources') return <SourcesPage onBack={goToLanding} />
  if (page === 'result' && result) {
    return <ResultPage result={result} geo={geo} onNewCase={goToNewCase} onHome={goToLanding} onStatusCheck={goToStatusCheck} />
  }
  if (page === 'verify') {
    return (
      <VerifyPage
        onResult={goToResult}
        onBack={verifyStart ? (verifyOrigin === 'result' ? backToResult : goToLanding) : goToLanding}
        geo={geo}
        geoError={geoError}
        startNodeId={verifyStart}
        backLabel={verifyStart && verifyOrigin === 'result' ? 'Back to result' : 'Back to home'}
      />
    )
  }
  return <LandingPage onStart={goToVerify} onCheckStatus={goToStatusCheckFromLanding} />
}
