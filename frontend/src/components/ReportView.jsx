import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Copy, Download, CheckCheck, Star, ChevronDown, ChevronUp } from 'lucide-react'

function extractScore(feedback) {
  const match = feedback?.match(/Score:\s*(\d+(?:\.\d+)?)\s*\/\s*10/i)
  return match ? parseFloat(match[1]) : null
}

function ScoreBadge({ score }) {
  if (score === null) return null
  const color = score >= 8 ? 'green' : score >= 6 ? 'orange' : 'red'
  const colorMap = {
    green:  { bg: 'bg-green-500/10',  border: 'border-green-500/30',  text: 'text-green-400'  },
    orange: { bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-400' },
    red:    { bg: 'bg-red-500/10',    border: 'border-red-500/30',    text: 'text-red-400'    },
  }
  const c = colorMap[color]
  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${c.bg} border ${c.border}`}>
      <Star className={`w-4 h-4 ${c.text}`} />
      <span className={`text-sm font-bold ${c.text}`}>{score}/10</span>
      <span className="text-xs text-slate-500">Critic Score</span>
    </div>
  )
}

export default function ReportView({ report, feedback }) {
  const [copied, setCopied]         = useState(false)
  const [showCritic, setShowCritic] = useState(false)
  const score = extractScore(feedback)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(report)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const blob = new Blob([report], { type: 'text/markdown' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = 'research-report.md'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* ── Report card ──────────────────────────────────── */}
      <div className="rounded-2xl border border-[#1e2a3a] bg-[#0e1420] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-green-400 shadow-lg shadow-green-500/50" />
            <span className="text-sm font-semibold text-white">Research Report</span>
          </div>

          <div className="flex items-center gap-2">
            <ScoreBadge score={score} />

            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-slate-400
                hover:text-white hover:bg-white/5 border border-transparent
                hover:border-white/10 transition-all duration-200"
            >
              {copied ? <CheckCheck className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-slate-400
                hover:text-white hover:bg-white/5 border border-transparent
                hover:border-white/10 transition-all duration-200"
            >
              <Download className="w-3.5 h-3.5" />
              .md
            </button>
          </div>
        </div>

        {/* Report body — rendered markdown */}
        <div className="px-8 py-6 max-h-[60vh] overflow-y-auto">
          <div className="prose prose-invert prose-sm max-w-none
            prose-headings:text-white prose-headings:font-semibold
            prose-h1:text-2xl prose-h1:mb-4
            prose-h2:text-lg prose-h2:mt-8 prose-h2:mb-3 prose-h2:text-blue-300
            prose-h3:text-base prose-h3:text-slate-300
            prose-p:text-slate-400 prose-p:leading-7
            prose-li:text-slate-400
            prose-strong:text-slate-200
            prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
            prose-code:text-cyan-300 prose-code:bg-cyan-500/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs
            prose-hr:border-white/5
          ">
            <ReactMarkdown>{report}</ReactMarkdown>
          </div>
        </div>
      </div>

      {/* ── Critic feedback ───────────────────────────── */}
      {feedback && (
        <div className="rounded-2xl border border-orange-500/20 bg-orange-500/5 overflow-hidden">
          <button
            onClick={() => setShowCritic(!showCritic)}
            className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-white/2 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-orange-400" />
              <span className="text-sm font-semibold text-white">Critic Review</span>
              {score !== null && (
                <span className={`text-xs px-2 py-0.5 rounded-full font-bold
                  ${score >= 8 ? 'text-green-400 bg-green-500/10' : score >= 6 ? 'text-orange-400 bg-orange-500/10' : 'text-red-400 bg-red-500/10'}`}>
                  {score}/10
                </span>
              )}
            </div>
            {showCritic
              ? <ChevronUp className="w-4 h-4 text-slate-500" />
              : <ChevronDown className="w-4 h-4 text-slate-500" />}
          </button>

          {showCritic && (
            <div className="px-6 pb-5 border-t border-orange-500/10 animate-fade-in">
              <div className="mt-4 bg-[#080b11] rounded-xl p-5">
                <pre className="text-xs text-slate-400 whitespace-pre-wrap font-mono leading-relaxed">
                  {feedback}
                </pre>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
