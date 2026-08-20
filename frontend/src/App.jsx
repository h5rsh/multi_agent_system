import { useState, useCallback } from 'react'
import Hero from './components/Hero'
import Pipeline from './components/Pipeline'
import { Brain, Sparkles } from 'lucide-react'

const API_BASE = import.meta.env.VITE_API_URL || ''

const STEPS = ['search', 'reader', 'writer', 'critic']

function initSteps() {
  return Object.fromEntries(STEPS.map(s => [s, { status: 'pending', data: null }]))
}

export default function App() {
  const [phase, setPhase]       = useState('idle')
  const [topic, setTopic]       = useState('')
  const [steps, setSteps]       = useState(initSteps())
  const [report, setReport]     = useState(null)
  const [feedback, setFeedback] = useState(null)
  const [error, setError]       = useState(null)

  const updateStep = useCallback((key, patch) => {
    setSteps(prev => ({ ...prev, [key]: { ...prev[key], ...patch } }))
  }, [])

  const handleReset = () => {
    setPhase('idle')
    setTopic('')
    setSteps(initSteps())
    setReport(null)
    setFeedback(null)
    setError(null)
  }

  const handleSubmit = async (inputTopic) => {
    setTopic(inputTopic)
    setSteps(initSteps())
    setPhase('running')
    setReport(null)
    setFeedback(null)
    setError(null)

    try {
      const res = await fetch(`${API_BASE}/api/research/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: inputTopic }),
      })
      if (!res.ok) throw new Error(`Server error: ${res.status}`)
      const { task_id } = await res.json()

      const es = new EventSource(`${API_BASE}/api/research/stream/${task_id}`)

      es.onmessage = (e) => {
        const event = JSON.parse(e.data)
        const { step, status, data } = event

        if (step === 'done') {
          es.close()
          setPhase('done')
          return
        }
        if (step === 'error') {
          es.close()
          setPhase('error')
          setError(data || 'An unknown error occurred.')
          return
        }

        updateStep(step, { status, data: data || null })
        if (step === 'writer' && status === 'done') setReport(data)
        if (step === 'critic' && status === 'done') setFeedback(data)
      }

      es.onerror = () => {
        es.close()
        setPhase('error')
        setError('Connection to the server was lost. Please try again.')
      }
    } catch (err) {
      setPhase('error')
      setError(err.message)
    }
  }

  return (
    <div className="min-h-screen" style={{ background: '#FAFAF9' }}>
      {/* ── Navbar ──────────────────────────────────── */}
      <nav className="flex items-center justify-between px-6 md:px-10 py-5 border-b border-gray-100/80">
        <button
          onClick={handleReset}
          className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-900">
            <Brain className="w-4 h-4 text-white" />
          </div>
          <span className="text-[15px] font-bold text-gray-800 tracking-tight">ResearchAI</span>
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs text-gray-400">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Powered by Mistral AI</span>
        </div>
      </nav>

      {/* ── Content ─────────────────────────────────── */}
      {phase === 'idle' ? (
        <Hero onSubmit={handleSubmit} isLoading={false} />
      ) : (
        <Pipeline
          topic={topic}
          steps={steps}
          phase={phase}
          report={report}
          feedback={feedback}
          error={error}
          onReset={handleReset}
        />
      )}
    </div>
  )
}
