import { useState } from 'react'
import { Search, ArrowRight, Loader2 } from 'lucide-react'

const EXAMPLE_TOPICS = [
  'Quantum computing breakthroughs 2025',
  'Future of AI in healthcare',
  'Climate change mitigation technologies',
  'Space tourism industry outlook',
]

export default function ResearchForm({ onSubmit, isLoading }) {
  const [topic, setTopic] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (topic.trim() && !isLoading) onSubmit(topic.trim())
  }

  return (
    <div className="flex flex-col items-center gap-10 py-16 px-6 animate-fade-in">
      {/* Hero text */}
      <div className="text-center max-w-2xl">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
          </span>
          <span className="text-sm text-blue-400 font-medium">4 AI Agents · Live Research</span>
        </div>

        <h2 className="text-5xl font-extrabold leading-tight mb-4">
          <span className="text-white">Research any topic</span>
          <br />
          <span
            style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #06b6d4 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            in seconds.
          </span>
        </h2>
        <p className="text-slate-400 text-lg">
          Four AI agents collaborate — searching the web, scraping content,
          writing reports, and critiquing quality — all in real time.
        </p>
      </div>

      {/* Search form */}
      <form onSubmit={handleSubmit} className="w-full max-w-2xl">
        <div className="relative group">
          {/* Glow effect */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl opacity-0 group-focus-within:opacity-40 blur transition-opacity duration-300" />

          <div className="relative flex items-center bg-[#0e1420] border border-[#1e2a3a] group-focus-within:border-blue-500/50 rounded-2xl transition-colors duration-200">
            <Search className="absolute left-5 w-5 h-5 text-slate-500 pointer-events-none" />

            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter a research topic..."
              disabled={isLoading}
              className="flex-1 bg-transparent pl-14 pr-4 py-5 text-white placeholder-slate-500 text-base outline-none disabled:opacity-50"
            />

            <button
              type="submit"
              disabled={!topic.trim() || isLoading}
              className="m-2 flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200
                bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400
                text-white shadow-lg shadow-blue-500/20
                disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  Research
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Example topics */}
      <div className="flex flex-col items-center gap-3">
        <p className="text-xs text-slate-600 uppercase tracking-widest">Try an example</p>
        <div className="flex flex-wrap justify-center gap-2">
          {EXAMPLE_TOPICS.map((t) => (
            <button
              key={t}
              onClick={() => setTopic(t)}
              disabled={isLoading}
              className="px-3 py-1.5 rounded-lg text-xs text-slate-400 border border-[#1e2a3a]
                hover:border-blue-500/40 hover:text-blue-400 hover:bg-blue-500/5
                transition-all duration-200 disabled:opacity-40"
            >
              {t}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
