import sys
import os
import uuid
import json
import asyncio
from threading import Thread
from queue import Queue, Empty

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

# ── Make sure the project root is on the path so we can import pipeline ───────
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from pipeline import run_research_pipeline_stream

# ── App setup ─────────────────────────────────────────────────────────────────
app = FastAPI(title="Multi-Agent Research API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── In-memory task registry ───────────────────────────────────────────────────
# Maps task_id -> Queue of events
_task_queues: dict[str, Queue] = {}


class ResearchRequest(BaseModel):
    topic: str


# ── Routes ────────────────────────────────────────────────────────────────────

@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.post("/api/research/start")
def start_research(req: ResearchRequest):
    """Start the pipeline in a background thread, return a task_id."""
    if not req.topic.strip():
        raise HTTPException(status_code=400, detail="Topic cannot be empty.")

    task_id = str(uuid.uuid4())
    q: Queue = Queue()
    _task_queues[task_id] = q

    def _run():
        try:
            for event in run_research_pipeline_stream(req.topic):
                q.put(event)
        except Exception as e:
            q.put({"step": "error", "status": "error", "data": str(e)})
        finally:
            q.put(None)  # sentinel: stream finished

    thread = Thread(target=_run, daemon=True)
    thread.start()

    return {"task_id": task_id}


@app.get("/api/research/stream/{task_id}")
async def stream_research(task_id: str):
    """SSE endpoint — streams pipeline events for the given task_id."""
    if task_id not in _task_queues:
        raise HTTPException(status_code=404, detail="Task not found.")

    q = _task_queues[task_id]

    async def event_generator():
        try:
            while True:
                # Poll the queue without blocking the event loop
                try:
                    event = await asyncio.get_event_loop().run_in_executor(
                        None, lambda: q.get(timeout=60)
                    )
                except Empty:
                    yield "data: {\"step\":\"error\",\"status\":\"error\",\"data\":\"Timeout\"}\n\n"
                    break

                if event is None:  # sentinel
                    yield "data: {\"step\":\"done\",\"status\":\"done\",\"data\":null}\n\n"
                    break

                yield f"data: {json.dumps(event)}\n\n"
        finally:
            _task_queues.pop(task_id, None)

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        },
    )
