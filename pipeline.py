from agents import build_reader_agent, build_search_agent, writer_chain, critic_chain
import json


def run_research_pipeline_stream(topic: str):
    """
    Generator version of the research pipeline.
    Yields JSON-serialisable dicts that map to SSE events:
        { "step": str, "status": "running"|"done"|"error", "data": str|None }
    """

    state = {}

    # ── Step 1 · Search Agent ─────────────────────────────────────────────────
    yield {"step": "search", "status": "running", "data": None}
    try:
        search_agent = build_search_agent()
        search_result = search_agent.invoke({
            "messages": [("user", f"Find recent, reliable and detailed information about {topic}")]
        })
        state["search_results"] = search_result["messages"][-1].content
        yield {"step": "search", "status": "done", "data": state["search_results"]}
    except Exception as e:
        yield {"step": "search", "status": "error", "data": str(e)}
        return

    # ── Step 2 · Reader Agent ─────────────────────────────────────────────────
    yield {"step": "reader", "status": "running", "data": None}
    try:
        reader_agent = build_reader_agent()
        reader_result = reader_agent.invoke({
            "messages": [("user",
                f"Based on the following search results about '{topic}', "
                f"pick the most relevant URL and scrape it for deeper content.\n\n"
                f"Search Results:\n{state['search_results'][:800]}"
            )]
        })
        state["scraped_content"] = reader_result["messages"][-1].content
        yield {"step": "reader", "status": "done", "data": state["scraped_content"]}
    except Exception as e:
        yield {"step": "reader", "status": "error", "data": str(e)}
        return

    # ── Step 3 · Writer Chain ─────────────────────────────────────────────────
    yield {"step": "writer", "status": "running", "data": None}
    try:
        research_combined = (
            f"Search Results:\n{state['search_results']}\n\n"
            f"Detailed Scraped Content:\n{state['scraped_content']}\n\n"
        )
        state["report"] = writer_chain.invoke({
            "topic": topic,
            "research": research_combined
        })
        yield {"step": "writer", "status": "done", "data": state["report"]}
    except Exception as e:
        yield {"step": "writer", "status": "error", "data": str(e)}
        return

    # ── Step 4 · Critic Chain ─────────────────────────────────────────────────
    yield {"step": "critic", "status": "running", "data": None}
    try:
        state["feedback"] = critic_chain.invoke({
            "report": state["report"]
        })
        yield {"step": "critic", "status": "done", "data": state["feedback"]}
    except Exception as e:
        yield {"step": "critic", "status": "error", "data": str(e)}
        return

    # ── Done ──────────────────────────────────────────────────────────────────
    yield {"step": "done", "status": "done", "data": None}


def run_research_pipeline(topic: str) -> dict:
    """Original blocking CLI version — kept for backward compatibility."""
    state = {}
    for event in run_research_pipeline_stream(topic):
        step, status, data = event["step"], event["status"], event["data"]
        if status == "running":
            print(f"\n{'='*50}\nStep: {step} is running...\n{'='*50}")
        elif status == "done" and data:
            print(f"\n[{step}] output:\n{data}")
        elif status == "error":
            print(f"\n[{step}] ERROR: {data}")
        if step == "search" and status == "done":
            state["search_results"] = data
        elif step == "reader" and status == "done":
            state["scraped_content"] = data
        elif step == "writer" and status == "done":
            state["report"] = data
        elif step == "critic" and status == "done":
            state["feedback"] = data
    return state


if __name__ == "__main__":
    topic = input("\n Enter a research topic : ")
    run_research_pipeline(topic)
