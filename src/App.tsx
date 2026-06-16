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

  const goToVerify = useCallback(async () => {
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

  const goToLanding = useCallback(() => { setPage('landing'); setGeo(null) }, [])
  const goToResult = useCallback((r: ResultState) => { setResult(r); setPage('result') }, [])
  const goToNewCase = useCallback(() => { setResult(null); setPage('verify') }, [])

  if (page === 'result' && result) {
    return <ResultPage result={result} geo={geo} onNewCase={goToNewCase} onHome={goToLanding} />
  }
  if (page === 'verify') {
    return <VerifyPage onResult={goToResult} onBack={goToLanding} geo={geo} />
  }
  return <LandingPage onStart={goToVerify} />
}
