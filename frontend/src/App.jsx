import { useState, useCallback } from 'react'
import Header      from './components/Header'
import ResearchForm from './components/ResearchForm'
import StepCard    from './components/StepCard'
import ReportView  from './components/ReportView'
import { RotateCcw, AlertCircle } from 'lucide-react'

const STEPS = ['search', 'reader', 'writer', 'critic']

function initStepState() {
  return Object.fromEntries(STEPS.map((s) => [s, { status: 'pending', data: null }]))
}

// ── Background mesh gradient ──────────────────────────────────────────────────
function BgMesh() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full
        bg-blue-600/6 blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full
        bg-purple-600/6 blur-[120px]" />
      <div className="absolute top-[40%] left-[40%] w-[300px] h-[300px] rounded-full
        bg-cyan-600/4 blur-[80px]" />
    </div>
  )
}

export default function App() {
  const [steps,     setSteps]     = useState(initStepState())
  const [isLoading, setIsLoading] = useState(false)
  const [phase,     setPhase]     = useState('idle')   // 'idle' | 'running' | 'done' | 'error'
  const [report,    setReport]    = useState(null)
  const [feedback,  setFeedback]  = useState(null)
  const [topic,     setTopic]     = useState('')
  const [error,     setError]     = useState(null)

  const updateStep = useCallback((stepKey, patch) => {
    setSteps((prev) => ({
      ...prev,
      [stepKey]: { ...prev[stepKey], ...patch },
    }))
  }, [])

  const handleReset = () => {
    setSteps(initStepState())
    setIsLoading(false)
    setPhase('idle')
    setReport(null)
    setFeedback(null)
    setTopic('')
    setError(null)
  }

  const handleSubmit = async (inputTopic) => {
    setTopic(inputTopic)
    setSteps(initStepState())
    setPhase('running')
    setIsLoading(true)
    setReport(null)
    setFeedback(null)
    setError(null)

    try {
      // 1️⃣ Start pipeline
      const startRes = await fetch('/api/research/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: inputTopic }),
      })
      if (!startRes.ok) throw new Error(`Server error: ${startRes.status}`)
      const { task_id } = await startRes.json()

      // 2️⃣ Open SSE stream
      const evtSource = new EventSource(`/api/research/stream/${task_id}`)

      evtSource.onmessage = (e) => {
        const event = JSON.parse(e.data)
        const { step, status, data } = event

        if (step === 'done') {
          evtSource.close()
          setIsLoading(false)
          setPhase('done')
          return
        }

        if (step === 'error') {
          evtSource.close()
          setIsLoading(false)
          setPhase('error')
          setError(data || 'An unknown error occurred.')
          return
        }

        updateStep(step, { status, data: data || null })

        if (step === 'writer' && status === 'done') setReport(data)
        if (step === 'critic' && status === 'done') setFeedback(data)
      }

      evtSource.onerror = () => {
        evtSource.close()
        setIsLoading(false)
        setPhase('error')
        setError('Connection to the server was lost.')
      }
    } catch (err) {
      setIsLoading(false)
      setPhase('error')
      setError(err.message)
    }
  }

  const showPipeline = phase !== 'idle'

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#080b11' }}>
      <BgMesh />
      <Header />

      <main className="relative z-10 flex-1 w-full max-w-4xl mx-auto px-4 pb-16">
        {/* ── Landing / Input ── */}
        {phase === 'idle' && (
          <ResearchForm onSubmit={handleSubmit} isLoading={isLoading} />
        )}

        {/* ── Pipeline view ── */}
        {showPipeline && (
          <div className="pt-10 space-y-8 animate-fade-in">
            {/* Topic + reset */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-600 uppercase tracking-widest mb-1">Research Topic</p>
                <h2 className="text-xl font-bold text-white">{topic}</h2>
              </div>
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-slate-400
                  border border-[#1e2a3a] hover:border-blue-500/30 hover:text-blue-400
                  hover:bg-blue-500/5 transition-all duration-200"
              >
                <RotateCcw className="w-4 h-4" />
                New research
              </button>
            </div>

            {/* Progress bar */}
            {phase === 'running' && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Pipeline progress</span>
                  <span>
                    {Object.values(steps).filter((s) => s.status === 'done').length} / {STEPS.length} steps
                  </span>
                </div>
                <div className="h-1 rounded-full bg-[#1e2a3a] overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-700 rounded-full"
                    style={{
                      width: `${(Object.values(steps).filter((s) => s.status === 'done').length / STEPS.length) * 100}%`,
                    }}
                  />
                </div>
              </div>
            )}

            {/* Step cards */}
            <div className="grid gap-3">
              {STEPS.map((stepKey, i) => (
                <StepCard
                  key={stepKey}
                  stepKey={stepKey}
                  index={i}
                  status={steps[stepKey].status}
                  data={steps[stepKey].data}
                />
              ))}
            </div>

            {/* Error */}
            {phase === 'error' && error && (
              <div className="flex items-start gap-3 p-5 rounded-2xl bg-red-500/5 border border-red-500/20 animate-fade-in">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-red-400 mb-1">Pipeline failed</p>
                  <p className="text-xs text-slate-400">{error}</p>
                </div>
              </div>
            )}

            {/* Report */}
            {phase === 'done' && report && (
              <div className="pt-4">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex-1 h-px bg-[#1e2a3a]" />
                  <span className="text-xs text-slate-600 uppercase tracking-widest px-4">Final Output</span>
                  <div className="flex-1 h-px bg-[#1e2a3a]" />
                </div>
                <ReportView report={report} feedback={feedback} />
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
