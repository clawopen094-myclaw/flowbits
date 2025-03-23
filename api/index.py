from fastapi import FastAPI
from pydantic_ai import Agent, RunContext
from pydantic_ai.models.gemini import GeminiModel
from fastapi.middleware.cors import CORSMiddleware
from crawl4ai import *
from .nodes.registry import EXECUTOR_REGISTRY
from .utils.types import ExecutePhase

### Create FastAPI instance with custom docs and openapi url
app = FastAPI(docs_url="/api/py/docs", openapi_url="/api/py/openapi.json")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or restrict to ['http://localhost:3000']
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/helloFastApi")
async def hello_fast_api():
    return {"response": "Hello World"}


@app.post("/api/executephase")
async def execute_phase(executionData: ExecutePhase):
    run_fn = EXECUTOR_REGISTRY.get(executionData.type)
    if not run_fn:
        print(f"❌ Executor not found for type: {executionData.type}")
        return {"success": False, "error": "Executor not found"}
    return await run_fn(executionData.inputs)
