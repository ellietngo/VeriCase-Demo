import { useState, useCallback } from 'react'
import LandingPage from './pages/LandingPage'
import VerifyPage from './pages/VerifyPage'
import ResultPage from './pages/ResultPage'
import { type OutcomeNode, type Step } from './engine/engine'
import { type GeoData, fetchGeoData, getLocation } from './geo'

export type Page = 'landing' | 'verify' | 'result'
export type ResultState = { outcome: OutcomeNode; nodeId: string; history: Step[] }

export default function App() {
  const [page, setPage] = useState<Page>('landing')
  const [result, setResult] = useState<ResultState | null>(null)
  const [geo, setGeo] = useState<GeoData | null>(null)
  const [verifyStart, setVerifyStart] = useState<string | undefined>(undefined)

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

  const goToLanding = useCallback(() => { setPage('landing'); setGeo(null); setVerifyStart(undefined) }, [])
  const goToResult = useCallback((r: ResultState) => { setResult(r); setPage('result') }, [])
  const goToNewCase = useCallback(() => { setResult(null); setVerifyStart(undefined); setPage('verify') }, [])

  // Secondary "wizard" entry point: from a NOT_CITIZEN result, jump straight into
  // the immigration-status classifier (Q_STATUS) without restarting the whole interview.
  // The prior result/geo stay in state so "back" from the first question returns to it.
  const goToStatusCheck = useCallback(() => { setVerifyStart('Q_STATUS'); setPage('verify') }, [])
  const backToResult = useCallback(() => { setPage('result') }, [])

  if (page === 'result' && result) {
    return <ResultPage result={result} geo={geo} onNewCase={goToNewCase} onHome={goToLanding} onStatusCheck={goToStatusCheck} />
  }
  if (page === 'verify') {
    return (
      <VerifyPage
        onResult={goToResult}
        onBack={verifyStart ? backToResult : goToLanding}
        geo={geo}
        startNodeId={verifyStart}
      />
    )
  }
  return <LandingPage onStart={goToVerify} />
}
