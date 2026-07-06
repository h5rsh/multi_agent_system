import { useState } from 'react'
import {
  Search, Globe, PenLine, MessageSquare,
  CheckCircle2, Loader2, AlertCircle, ChevronDown, ChevronUp
} from 'lucide-react'

const STEP_META = {
  search: {
    icon: Search,
    label: 'Search Agent',
    description: 'Finding recent, reliable information across the web',
    color: 'blue',
    gradient: 'from-blue-500/20 to-blue-600/5',
    border: 'border-blue-500/30',
    iconBg: 'bg-blue-500/15',
    iconColor: 'text-blue-400',
    glowColor: 'shadow-blue-500/20',
  },
  reader: {
    icon: Globe,
    label: 'Reader Agent',
    description: 'Scraping the most relevant URL for deep content',
    color: 'purple',
    gradient: 'from-purple-500/20 to-purple-600/5',
    border: 'border-purple-500/30',
    iconBg: 'bg-purple-500/15',
    iconColor: 'text-purple-400',
    glowColor: 'shadow-purple-500/20',
  },
  writer: {
    icon: PenLine,
    label: 'Writer Chain',
    description: 'Drafting a structured research report',
    color: 'cyan',
    gradient: 'from-cyan-500/20 to-cyan-600/5',
    border: 'border-cyan-500/30',
    iconBg: 'bg-cyan-500/15',
    iconColor: 'text-cyan-400',
    glowColor: 'shadow-cyan-500/20',
  },
  critic: {
    icon: MessageSquare,
    label: 'Critic Chain',
    description: 'Reviewing and scoring the report',
    color: 'orange',
    gradient: 'from-orange-500/20 to-orange-600/5',
    border: 'border-orange-500/30',
    iconBg: 'bg-orange-500/15',
    iconColor: 'text-orange-400',
    glowColor: 'shadow-orange-500/20',
  },
}

function StatusBadge({ status }) {
  if (status === 'pending') return (
    <span className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
      <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
      Pending
    </span>
  )
  if (status === 'running') return (
    <span className="flex items-center gap-1.5 text-xs text-blue-400 font-medium animate-pulse">
      <Loader2 className="w-3.5 h-3.5 animate-spin" />
      Running…
    </span>
  )
  if (status === 'done') return (
    <span className="flex items-center gap-1.5 text-xs text-green-400 font-medium">
      <CheckCircle2 className="w-3.5 h-3.5" />
      Complete
    </span>
  )
  if (status === 'error') return (
    <span className="flex items-center gap-1.5 text-xs text-red-400 font-medium">
      <AlertCircle className="w-3.5 h-3.5" />
      Error
    </span>
  )
}

export default function StepCard({ stepKey, status, data, index }) {
  const [expanded, setExpanded] = useState(false)
  const meta = STEP_META[stepKey]
  const Icon = meta.icon

  const isActive = status === 'running'
  const isDone = status === 'done'
  const isError = status === 'error'
  const isPending = status === 'pending'

  return (
    <div
      className={`
        relative rounded-2xl border transition-all duration-500
        ${isPending ? 'opacity-40 border-[#1e2a3a] bg-[#0e1420]' : ''}
        ${isActive  ? `border-${meta.color === 'blue' ? 'blue' : meta.color}-500/40 bg-gradient-to-br ${meta.gradient} shadow-lg ${meta.glowColor} animate-fade-in` : ''}
        ${isDone    ? `border-[#1e2a3a] bg-[#0e1420] hover:border-${meta.color === 'blue' ? 'blue' : meta.color}-500/20 animate-fade-in` : ''}
        ${isError   ? 'border-red-500/30 bg-red-500/5 animate-fade-in' : ''}
      `}
      style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'backwards' }}
    >
      {/* Running pulse ring */}
      {isActive && (
        <div className="absolute inset-0 rounded-2xl animate-pulse-glow pointer-events-none" />
      )}

      <div className="p-5">
        <div className="flex items-center justify-between">
          {/* Left: icon + label */}
          <div className="flex items-center gap-4">
            <div className={`flex items-center justify-center w-11 h-11 rounded-xl ${meta.iconBg} border ${meta.border} shrink-0`}>
              {isActive
                ? <Loader2 className={`w-5 h-5 ${meta.iconColor} animate-spin`} />
                : <Icon className={`w-5 h-5 ${isDone ? meta.iconColor : 'text-slate-600'}`} />
              }
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-semibold ${isPending ? 'text-slate-600' : 'text-white'}`}>
                  {meta.label}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-mono font-bold
                  ${isPending ? 'text-slate-700 bg-slate-800' : `${meta.iconColor} bg-${meta.color === 'blue' ? 'blue' : meta.color}-500/10`}`}>
                  #{index + 1}
                </span>
              </div>
              <p className={`text-xs mt-0.5 ${isPending ? 'text-slate-700' : 'text-slate-500'}`}>
                {meta.description}
              </p>
            </div>
          </div>

          {/* Right: status + expand */}
          <div className="flex items-center gap-3">
            <StatusBadge status={status} />
            {isDone && data && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-300 transition-colors px-2 py-1 rounded-lg hover:bg-white/5"
              >
                {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                {expanded ? 'Hide' : 'View'}
              </button>
            )}
          </div>
        </div>

        {/* Output preview */}
        {isDone && data && expanded && (
          <div className="mt-4 pt-4 border-t border-white/5 animate-fade-in">
            <div className="bg-[#080b11] rounded-xl p-4 max-h-52 overflow-y-auto">
              <pre className="text-xs text-slate-400 whitespace-pre-wrap font-mono leading-relaxed">
                {data.slice(0, 1200)}{data.length > 1200 ? '\n\n… (truncated)' : ''}
              </pre>
            </div>
          </div>
        )}

        {/* Error output */}
        {isError && data && (
          <div className="mt-4 pt-4 border-t border-red-500/10 animate-fade-in">
            <div className="bg-red-500/5 rounded-xl p-4">
              <pre className="text-xs text-red-400 whitespace-pre-wrap font-mono">{data}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
