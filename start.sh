#!/bin/bash
# Start both backend (FastAPI) and frontend (Vite) dev servers
set -e
DIR="$(cd "$(dirname "$0")" && pwd)"

echo "🚀 Starting ResearchAI..."
echo ""

# Backend
echo "▶  Backend  → http://localhost:8000"
cd "$DIR"
uv run uvicorn backend.main:app --reload --port 8000 &
BACKEND_PID=$!

# Frontend
echo "▶  Frontend → http://localhost:5173"
cd "$DIR/frontend"
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Open http://localhost:5173"
echo "   Press Ctrl+C to stop."

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; echo ''; echo 'Stopped.'" EXIT
wait
