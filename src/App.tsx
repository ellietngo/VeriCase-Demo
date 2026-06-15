import { useState } from 'react'
import LandingPage from './pages/LandingPage'
import VerifyPage from './pages/VerifyPage'
import ResultPage from './pages/ResultPage'
import { type OutcomeNode } from './engine/engine'

export type Page = 'landing' | 'verify' | 'result'
export type ResultState = { outcome: OutcomeNode; nodeId: string }

export default function App() {
  const [page, setPage] = useState<Page>('landing')
  const [result, setResult] = useState<ResultState | null>(null)

  const goToVerify = () => setPage('verify')
  const goToLanding = () => setPage('landing')
  const goToResult = (r: ResultState) => { setResult(r); setPage('result') }
  const goToNewCase = () => { setResult(null); setPage('verify') }

  if (page === 'result' && result) {
    return <ResultPage result={result} onNewCase={goToNewCase} onHome={goToLanding} />
  }
  if (page === 'verify') {
    return <VerifyPage onResult={goToResult} onBack={goToLanding} />
  }
  return <LandingPage onStart={goToVerify} />
}
