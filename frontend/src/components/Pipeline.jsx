import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import {
  Search, Globe, PenLine, Sparkles,
  CheckCircle2, Loader2, AlertCircle,
  ChevronDown, ChevronUp, Copy, Download,
  CheckCheck, RotateCcw, Star,
} from 'lucide-react'

/* ── Step metadata ─────────────────────────────── */
const STEP_META = {
  search: {
    icon: Search,
    name: 'Search Agent',
    desc: 'Finding relevant information across the web',
    borderActive: 'border-l-indigo-500',
    bg: 'bg-indigo-50',
    text: 'text-indigo-600',
    iconColor: 'text-indigo-500',
  },
  reader: {
    icon: Globe,
    name: 'Reader Agent',
    desc: 'Scraping and extracting deep content',
    borderActive: 'border-l-violet-500',
    bg: 'bg-violet-50',
    text: 'text-violet-600',
    iconColor: 'text-violet-500',
  },
  writer: {
    icon: PenLine,
    name: 'Writer Chain',
    desc: 'Drafting a structured research report',
    borderActive: 'border-l-blue-500',
    bg: 'bg-blue-50',
    text: 'text-blue-600',
    iconColor: 'text-blue-500',
  },
  critic: {
    icon: Sparkles,
    name: 'Critic Chain',
    desc: 'Reviewing and scoring the report',
    borderActive: 'border-l-amber-500',
    bg: 'bg-amber-50',
    text: 'text-amber-600',
    iconColor: 'text-amber-500',
  },
}
const STEP_KEYS = Object.keys(STEP_META)

/* ═══════════════════════════════════════════════════
   StepCard — individual agent step
   ═══════════════════════════════════════════════════ */
function StepCard({ stepKey, status, data, index }) {
  const [expanded, setExpanded] = useState(false)
  const meta = STEP_META[stepKey]
  const Icon = meta.icon

  const isPending = status === 'pending'
  const isRunning = status === 'running'
  const isDone    = status === 'done'
  const isError   = status === 'error'

  return (
    <div
      className={`
        relative rounded-2xl border bg-white transition-all duration-500 overflow-hidden
        ${isPending ? 'opacity-40 border-gray-100' : ''}
        ${isRunning ? `border-l-4 ${meta.borderActive} border-gray-100 shadow-md` : ''}
        ${isDone    ? `border-l-4 ${meta.borderActive} border-gray-100` : ''}
        ${isError   ? 'border-l-4 border-l-red-500 border-gray-100' : ''}
      `}
      style={{
        animation: 'fade-up 0.5s ease both',
        animationDelay: `${index * 120}ms`,
      }}
    >
      {/* Shimmer overlay when running */}
      {isRunning && <div className="shimmer-overlay" />}

      <div className="px-5 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Left: icon + info */}
          <div className="flex items-center gap-3.5 min-w-0">
            <div
              className={`
                relative flex items-center justify-center w-10 h-10 rounded-xl shrink-0
                ${isPending ? 'bg-gray-50' : meta.bg}
                transition-colors duration-300
              `}
            >
              {isRunning ? (
                <Loader2 className={`w-5 h-5 ${meta.iconColor} animate-spin`} />
              ) : isDone ? (
                <CheckCircle2 className="w-5 h-5 text-green-500 animate-check-pop" />
              ) : isError ? (
                <AlertCircle className="w-5 h-5 text-red-500" />
              ) : (
                <Icon className="w-5 h-5 text-gray-300" />
              )}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className={`text-sm font-semibold ${isPending ? 'text-gray-400' : 'text-gray-800'}`}>
                  {meta.name}
                </span>
                <span
                  className={`
                    text-[11px] px-1.5 py-0.5 rounded font-mono font-semibold
                    ${isPending ? 'text-gray-300 bg-gray-50' : `${meta.text} ${meta.bg}`}
                  `}
                >
                  #{index + 1}
                </span>
              </div>
              <p className={`text-xs mt-0.5 ${isPending ? 'text-gray-300' : 'text-gray-400'}`}>
                {isRunning ? (
                  <span className="inline-flex items-center gap-1.5">
                    {meta.desc}
                    <span className={`inline-flex gap-[3px] ${meta.iconColor}`}>
                      <span className="typing-dot" />
                      <span className="typing-dot" />
                      <span className="typing-dot" />
                    </span>
                  </span>
                ) : meta.desc}
              </p>
            </div>
          </div>

          {/* Right: status + expand */}
          <div className="flex items-center gap-2 shrink-0">
            {isPending && <span className="text-xs text-gray-300 font-medium">Pending</span>}
            {isRunning && <span className={`text-xs ${meta.text} font-medium animate-pulse`}>Running</span>}
            {isDone    && <span className="text-xs text-green-500 font-medium">Complete</span>}
            {isError   && <span className="text-xs text-red-500 font-medium">Error</span>}

            {(isDone || isError) && data && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="p-1.5 rounded-lg text-gray-300 hover:text-gray-500 hover:bg-gray-50 transition-colors"
              >
                {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Expandable raw output */}
      {expanded && data && (
        <div className="px-5 pb-4 animate-fade-in">
          <div className={`rounded-xl p-4 max-h-48 overflow-y-auto ${isError ? 'bg-red-50' : 'bg-gray-50'}`}>
            <pre className={`text-xs whitespace-pre-wrap font-mono leading-relaxed ${isError ? 'text-red-600' : 'text-gray-500'}`}>
              {data.length > 1500 ? data.slice(0, 1500) + '\n\n… (truncated)' : data}
            </pre>
          </div>
        </div>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   ReportCard — rendered markdown + critic
   ═══════════════════════════════════════════════════ */
function extractScore(feedback) {
  const match = feedback?.match(/Score:\s*(\d+(?:\.\d+)?)\s*\/\s*10/i)
  return match ? parseFloat(match[1]) : null
}

function ReportCard({ report, feedback }) {
  const [copied, setCopied]         = useState(false)
  const [showCritic, setShowCritic] = useState(true)
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
    <div className="space-y-4 animate-fade-up" style={{ animationDelay: '0.15s' }}>
      {/* Divider */}
      <div className="flex items-center gap-4 pt-2 pb-2">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs text-gray-400 uppercase tracking-[0.2em] font-medium">Research Complete</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {/* ── Report ─────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-green-400 shadow-sm shadow-green-400/50" />
            <span className="text-sm font-semibold text-gray-800">Research Report</span>
            {score !== null && (
              <span
                className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-bold ${
                  score >= 8
                    ? 'text-green-600 bg-green-50'
                    : score >= 6
                      ? 'text-amber-600 bg-amber-50'
                      : 'text-red-600 bg-red-50'
                }`}
              >
                <Star className="w-3 h-3" />
                {score}/10
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all"
            >
              {copied
                ? <CheckCheck className="w-3.5 h-3.5 text-green-500" />
                : <Copy className="w-3.5 h-3.5" />
              }
              {copied ? 'Copied!' : 'Copy'}
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              .md
            </button>
          </div>
        </div>

        {/* Report body — markdown */}
        <div className="px-8 py-6 max-h-[60vh] overflow-y-auto">
          <div className="prose prose-sm max-w-none
            prose-headings:text-gray-800 prose-headings:font-semibold
            prose-h1:text-2xl prose-h1:mb-4
            prose-h2:text-lg prose-h2:mt-8 prose-h2:mb-3
            prose-h3:text-base
            prose-p:text-gray-600 prose-p:leading-7
            prose-li:text-gray-600
            prose-strong:text-gray-700
            prose-a:text-indigo-500 prose-a:no-underline hover:prose-a:underline
            prose-code:text-indigo-600 prose-code:bg-indigo-50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-code:font-normal
            prose-hr:border-gray-100
          ">
            <ReactMarkdown>{report}</ReactMarkdown>
          </div>
        </div>
      </div>

      {/* ── Critic ─────────────────────────────────── */}
      {feedback && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <button
            onClick={() => setShowCritic(!showCritic)}
            className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="text-sm font-semibold text-gray-800">Critic Review</span>
              {score !== null && (
                <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                  score >= 8 ? 'text-green-600 bg-green-50' :
                  score >= 6 ? 'text-amber-600 bg-amber-50' :
                  'text-red-600 bg-red-50'
                }`}>
                  {score}/10
                </span>
              )}
            </div>
            {showCritic
              ? <ChevronUp className="w-4 h-4 text-gray-400" />
              : <ChevronDown className="w-4 h-4 text-gray-400" />
            }
          </button>

          {showCritic && (
            <div className="px-6 pb-5 border-t border-gray-50 animate-fade-in">
              <div className="mt-4 bg-gray-50 rounded-xl p-5">
                <pre className="text-xs text-gray-500 whitespace-pre-wrap font-mono leading-relaxed">
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

/* ═══════════════════════════════════════════════════
   Pipeline — main view (steps + report)
   ═══════════════════════════════════════════════════ */
export default function Pipeline({ topic, steps, phase, report, feedback, error, onReset }) {
  const completedCount = STEP_KEYS.filter(k => steps[k].status === 'done').length

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      {/* ── Topic header ───────────────────────────── */}
      <div className="flex items-start justify-between gap-4 mb-8 animate-fade-up">
        <div className="min-w-0">
          <p className="text-xs text-gray-400 uppercase tracking-[0.15em] font-medium mb-1">Research Topic</p>
          <h2 className="text-xl font-bold text-gray-800 break-words">{topic}</h2>
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-gray-400 font-medium shrink-0
            bg-white border border-gray-100 hover:border-gray-200 hover:text-gray-600
            active:scale-[0.97] transition-all duration-200 shadow-sm"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          New Research
        </button>
      </div>

      {/* ── Progress bar ───────────────────────────── */}
      {phase === 'running' && (
        <div className="mb-8 animate-fade-in">
          <div className="flex justify-between text-xs text-gray-400 mb-2">
            <span>Pipeline progress</span>
            <span className="font-mono">{completedCount} / {STEP_KEYS.length}</span>
          </div>
          <div className="h-1 rounded-full bg-gray-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-700 ease-out"
              style={{ width: `${(completedCount / STEP_KEYS.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* ── Step cards ─────────────────────────────── */}
      <div className="space-y-3 mb-8">
        {STEP_KEYS.map((key, i) => (
          <StepCard
            key={key}
            stepKey={key}
            index={i}
            status={steps[key].status}
            data={steps[key].data}
          />
        ))}
      </div>

      {/* ── Error ──────────────────────────────────── */}
      {phase === 'error' && error && (
        <div className="flex items-start gap-3 p-5 rounded-2xl bg-red-50 border border-red-100 mb-8 animate-fade-in">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-600 mb-1">Pipeline failed</p>
            <p className="text-xs text-red-400">{error}</p>
          </div>
        </div>
      )}

      {/* ── Report ─────────────────────────────────── */}
      {phase === 'done' && report && (
        <ReportCard report={report} feedback={feedback} />
      )}
    </div>
  )
}
