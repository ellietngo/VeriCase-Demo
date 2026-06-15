import { useState } from 'react'
import { type OutcomeNode } from './engine/engine'
import LandingPage from './pages/LandingPage'
import VerifyPage from './pages/VerifyPage'
import ResultPage from './pages/ResultPage'

export type ResultState = {
  outcome: OutcomeNode
  nodeId: string
}

type Page = 'landing' | 'verify' | 'result'

export default function App() {
  const [page, setPage] = useState<Page>('landing')
  const [result, setResult] = useState<ResultState | null>(null)

  if (page === 'verify') {
    return (
      <VerifyPage
        onResult={(r) => { setResult(r); setPage('result') }}
        onBack={() => setPage('landing')}
      />
    )
  }

  if (page === 'result' && result) {
    return (
      <ResultPage
        result={result}
        onNewCase={() => setPage('verify')}
        onHome={() => setPage('landing')}
      />
    )
  }

  return <LandingPage onStart={() => setPage('verify')} />
}
