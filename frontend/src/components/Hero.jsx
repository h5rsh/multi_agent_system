import { useState } from 'react'
import { Search, ArrowRight, Loader2, Zap } from 'lucide-react'

const EXAMPLES = [
  'Quantum computing breakthroughs 2025',
  'AI in healthcare — latest advances',
  'Climate change mitigation strategies',
  'Space tourism industry outlook',
]

/* Floating gradient orbs — positioned to frame the hero like Mailkit's floating product images */
const ORBS = [
  { className: 'top-[8%] left-[5%] w-16 h-16', gradient: 'from-indigo-200/70 to-violet-200/50', delay: '0s', dur: '7s' },
  { className: 'top-[10%] right-[8%] w-20 h-20', gradient: 'from-rose-200/50 to-orange-200/30', delay: '1.5s', dur: '8s' },
  { className: 'top-[38%] left-[3%] w-12 h-12', gradient: 'from-amber-200/60 to-yellow-200/40', delay: '3s', dur: '6s' },
  { className: 'top-[22%] right-[5%] w-14 h-14', gradient: 'from-teal-200/50 to-emerald-200/30', delay: '0.5s', dur: '9s' },
  { className: 'bottom-[22%] left-[7%] w-10 h-10', gradient: 'from-blue-200/60 to-cyan-200/40', delay: '2s', dur: '7.5s' },
  { className: 'bottom-[18%] right-[10%] w-16 h-16', gradient: 'from-purple-200/40 to-fuchsia-200/20', delay: '4s', dur: '6.5s' },
  { className: 'top-[4%] left-[28%] w-8 h-8', gradient: 'from-emerald-200/50 to-teal-100/30', delay: '2.5s', dur: '10s' },
  { className: 'bottom-[28%] right-[28%] w-6 h-6', gradient: 'from-pink-200/40 to-rose-100/20', delay: '5s', dur: '8s' },
]

export default function Hero({ onSubmit, isLoading }) {
  const [topic, setTopic] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (topic.trim() && !isLoading) onSubmit(topic.trim())
  }

  return (
    <section className="relative min-h-[calc(100vh-73px)] flex flex-col items-center justify-center px-6 overflow-hidden">
      {/* ── Floating orbs ──────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none">
        {ORBS.map((orb, i) => (
          <div
            key={i}
            className={`absolute rounded-full bg-gradient-to-br ${orb.gradient} ${orb.className} blur-sm`}
            style={{ animation: `float ${orb.dur} ease-in-out infinite`, animationDelay: orb.delay }}
          />
        ))}
      </div>

      {/* ── Content ────────────────────────────────── */}
      <div className="relative z-10 text-center max-w-3xl">
        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 mb-8 animate-fade-up"
        >
          <Zap className="w-3.5 h-3.5 text-indigo-500" />
          <span className="text-sm font-medium text-indigo-600">4 AI Agents · Real-time Research</span>
        </div>

        {/* Headline */}
        <h1
          className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] leading-[1.08] tracking-tight mb-6 animate-fade-up"
          style={{ animationDelay: '0.1s' }}
        >
          Research anything.
          <br />
          <span className="gradient-text">Instantly.</span>
        </h1>

        {/* Subtitle */}
        <p
          className="text-base sm:text-lg md:text-xl text-gray-400 max-w-xl mx-auto mb-12 animate-fade-up"
          style={{ animationDelay: '0.2s' }}
        >
          Four AI agents collaborate to search, analyze, write,
          and critique, all in real time.
        </p>

        {/* ── Search card ──────────────────────────── */}
        <div className="animate-fade-up" style={{ animationDelay: '0.3s' }}>
          <form onSubmit={handleSubmit} className="relative max-w-xl mx-auto">
            <div className="relative flex items-center bg-white rounded-2xl shadow-lg shadow-gray-200/60 border border-gray-100 transition-all duration-300 focus-within:shadow-xl focus-within:shadow-indigo-100/60 focus-within:border-indigo-200">
              <Search className="absolute left-5 w-5 h-5 text-gray-500 pointer-events-none" />

              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Enter a research topic..."
                disabled={isLoading}
                className="flex-1 bg-transparent pl-14 pr-4 py-5 text-gray-800 placeholder-gray-500 text-base outline-none rounded-2xl disabled:opacity-50"
              />

              <button
                type="submit"
                disabled={!topic.trim() || isLoading}
                className="m-1.5 flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200
                  bg-gray-900 hover:bg-gray-800 active:scale-[0.97] text-white shadow-md shadow-gray-900/10
                  disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Starting…
                  </>
                ) : (
                  <>
                    Research
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* ── Example chips ────────────────────────── */}
        <p
          className="text-xs text-gray-300 mt-8 mb-3 uppercase tracking-[0.2em] font-medium animate-fade-up"
          style={{ animationDelay: '0.4s' }}
        >
          or try one of these
        </p>
        <div className="flex flex-wrap justify-center gap-2 animate-fade-up" style={{ animationDelay: '0.5s' }}>
          {EXAMPLES.map((t) => (
            <button
              key={t}
              onClick={() => setTopic(t)}
              disabled={isLoading}
              className="px-3.5 py-1.5 rounded-full text-sm text-gray-400 bg-white border border-gray-100
                hover:border-indigo-200 hover:text-indigo-600 hover:bg-indigo-50/50
                active:scale-[0.97] transition-all duration-200 disabled:opacity-30 shadow-sm"
            >
              {t}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
