import { Brain, Sparkles } from 'lucide-react'

export default function Header() {
  return (
    <header className="relative z-10 flex items-center justify-between px-8 py-5 border-b border-white/5">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30">
          <Brain className="w-5 h-5 text-blue-400" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500" />
          </span>
        </div>
        <div>
          <h1 className="text-base font-bold text-white leading-none">ResearchAI</h1>
          <p className="text-xs text-slate-500 mt-0.5">Multi-Agent Pipeline</p>
        </div>
      </div>

      {/* Status badge */}
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
        <Sparkles className="w-3.5 h-3.5 text-green-400" />
        <span className="text-xs font-medium text-green-400">Powered by Mistral AI</span>
      </div>
    </header>
  )
}
