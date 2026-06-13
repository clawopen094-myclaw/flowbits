"""
ContentFlow Agent — Workflow Generation Engine

Takes natural language conversation context and generates structured
WorkflowDefinition JSON that maps to React Flow nodes and edges.

Uses pydantic-ai for structured output with validation.
Phase 1: Mock agent with realistic response patterns.
Phase 2: Full LLM-powered generation via pydantic-ai.
"""

from typing import Optional
from pydantic import BaseModel, Field


# =============================================================================
# Workflow Definition Schema
# =============================================================================

class WorkflowNode(BaseModel):
    """A single node in the content workflow graph."""
    id: str = Field(description="Unique node identifier")
    type: str = Field(description="Node type: SCRAPE_TRENDS, AI_TEXT_GEN, AI_IMAGE_GEN, LINKEDIN_PUBLISH, etc.")
    label: str = Field(description="Human-readable node label")
    inputs: dict = Field(default_factory=dict, description="Node input parameters")
    position: dict = Field(default_factory=dict, description="Visual position {x, y}")


class WorkflowEdge(BaseModel):
    """An edge connecting two nodes in the workflow."""
    source: str = Field(description="Source node ID")
    target: str = Field(description="Target node ID")
    sourceHandle: str = Field(default="Response", description="Output handle on source node")
    targetHandle: str = Field(default="Input", description="Input handle on target node")


class WorkflowDefinition(BaseModel):
    """Complete workflow definition — maps to React Flow nodes + edges."""
    workflowName: str = Field(description="Name of the workflow")
    description: str = Field(description="What the workflow does")
    nodes: list[WorkflowNode] = Field(description="All nodes in the flow")
    edges: list[WorkflowEdge] = Field(description="All connections between nodes")
    schedule: Optional[str] = Field(default=None, description="Cron expression for scheduling")
    platforms: list[str] = Field(default_factory=list, description="Target platforms")
    estimatedCredits: int = Field(default=0, description="Estimated credit cost per run")


# =============================================================================
# Clarifying Questions
# =============================================================================

CLARIFYING_QUESTION_TEMPLATES = [
    {
        "question": "What niche or industry should the content focus on?",
        "field": "niche",
        "examples": ["AI/ML engineering", "data science", "web development", "cybersecurity", "cloud computing"],
    },
    {
        "question": "Who is your target audience?",
        "field": "audience",
        "examples": ["beginners looking to break in", "experienced professionals", "C-level executives", "technical practitioners"],
    },
    {
        "question": "What tone should the content have?",
        "field": "tone",
        "examples": ["professional", "educational", "inspirational", "technical/deep-dive", "conversational"],
    },
    {
        "question": "How frequently should content go out?",
        "field": "frequency",
        "examples": ["daily", "weekdays only", "twice a week", "weekly"],
    },
    {
        "question": "What visual style for images?",
        "field": "visualStyle",
        "examples": ["minimalist", "data-viz heavy", "illustrative", "photo-realistic", "branded"],
    },
]


# =============================================================================
# Workflow Generation
# =============================================================================

NODE_TEMPLATES = {
    "SCRAPE_TRENDS": {
        "label": "Trending Scraper",
        "inputs": {
            "Niche": "",
            "Sources": "google_trends,reddit",
            "Max Results": "10",
        },
        "position": {"x": 100, "y": 100},
    },
    "AI_TEXT_GEN": {
        "label": "AI Content Writer",
        "inputs": {
            "Input": "",
            "System Message": "You are a professional social media content writer.",
            "Model": "gpt-4o",
            "Temperature": "0.7",
            "Platform": "linkedin",
        },
        "position": {"x": 450, "y": 100},
    },
    "AI_IMAGE_GEN": {
        "label": "AI Image Generator",
        "inputs": {
            "Prompt": "",
            "Style": "minimalist",
            "Width": "1200",
            "Height": "630",
        },
        "position": {"x": 800, "y": 100},
    },
    "HASHTAG_GEN": {
        "label": "Hashtag Generator",
        "inputs": {
            "Input": "",
        },
        "position": {"x": 1150, "y": 100},
    },
    "LINKEDIN_PUBLISH": {
        "label": "LinkedIn Publisher",
        "inputs": {
            "Content": "",
            "Image URL": "",
            "Hashtags": "",
        },
        "position": {"x": 1500, "y": 100},
    },
}


def generate_workflow_from_context(
    niche: str = "data science",
    audience: str = "professionals",
    tone: str = "professional",
    frequency: str = "daily",
    platforms: Optional[list[str]] = None,
    visual_style: str = "minimalist",
) -> WorkflowDefinition:
    """
    Generate a workflow definition from conversation context.
    
    Phase 1: Template-based generation with customization.
    Phase 2: LLM-powered generation via pydantic-ai.
    """
    if platforms is None:
        platforms = ["linkedin"]

    # Build nodes
    nodes = []
    edges = []
    node_ids = ["trend-scraper", "content-writer", "image-gen", "hashtag-gen", "linkedin-pub"]
    node_types = ["SCRAPE_TRENDS", "AI_TEXT_GEN", "AI_IMAGE_GEN", "HASHTAG_GEN", "LINKEDIN_PUBLISH"]

    for i, (nid, ntype) in enumerate(zip(node_ids, node_types)):
        template = NODE_TEMPLATES[ntype].copy()
        template["id"] = nid
        template["type"] = ntype
        template["position"]["y"] = 100 + (i % 3) * 150  # Stagger vertically
        template["position"]["x"] = 100 + (i // 3) * 400  # Stagger horizontally

        # Customize inputs based on context
        if ntype == "SCRAPE_TRENDS":
            template["inputs"]["Niche"] = niche
        elif ntype == "AI_TEXT_GEN":
            template["inputs"]["System Message"] = (
                f"You are a {tone} social media content writer targeting {audience}. "
                f"Create engaging, well-researched content about {niche}."
            )
        elif ntype == "AI_IMAGE_GEN":
            template["inputs"]["Style"] = visual_style
        elif ntype == "HASHTAG_GEN":
            template["inputs"]["Input"] = ""
        elif ntype == "LINKEDIN_PUBLISH":
            template["inputs"]["Content"] = ""

        nodes.append(WorkflowNode(**template))

    # Build edges (linear flow)
    for i in range(len(node_ids) - 1):
        edges.append(
            WorkflowEdge(
                source=node_ids[i],
                target=node_ids[i + 1],
            )
        )

    # Calculate credits
    credit_costs = {
        "SCRAPE_TRENDS": 5,
        "AI_TEXT_GEN": 2,
        "AI_IMAGE_GEN": 5,
        "HASHTAG_GEN": 1,
        "LINKEDIN_PUBLISH": 1,
    }
    estimated_credits = sum(credit_costs.get(nt, 0) for nt in node_types)

    # Schedule mapping
    schedule_map = {
        "daily": "0 9 * * *",
        "weekdays": "0 9 * * 1-5",
        "twice a week": "0 9 * * 1,4",
        "weekly": "0 9 * * 1",
    }

    return WorkflowDefinition(
        workflowName=f"{niche.title()} Content Pipeline",
        description=f"Automated content pipeline: scrapes trending {niche} topics, "
        f"generates {tone} {platforms[0]} posts with {visual_style} images, "
        f"and publishes on a {frequency} schedule.",
        nodes=nodes,
        edges=edges,
        schedule=schedule_map.get(frequency, "0 9 * * *"),
        platforms=platforms,
        estimatedCredits=estimated_credits,
    )


# =============================================================================
# Agent Interface (for Phase 2: pydantic-ai integration)
# =============================================================================

async def generate_workflow_from_chat(
    user_message: str,
    conversation_history: Optional[list[dict]] = None,
) -> dict:
    """
    Phase 2 entry point: Takes a user message + history, returns either
    clarifying questions or a complete workflow definition.
    
    Phase 1: Returns mock clarifying questions on first message,
    workflow on second.
    """
    history = conversation_history or []
    user_turn_count = sum(1 for m in history if m.get("role") == "user")

    if user_turn_count <= 1:
        # First interaction: return clarifying questions
        return {
            "type": "clarifying_questions",
            "questions": [
                {
                    "id": i,
                    "question": t["question"],
                    "field": t["field"],
                    "examples": t["examples"],
                }
                for i, t in enumerate(CLARIFYING_QUESTION_TEMPLATES[:4])
            ],
        }

    # Second interaction: generate workflow
    # Extract context from history (simplified for P1)
    workflow = generate_workflow_from_context()

    return {
        "type": "workflow",
        "workflow": workflow.model_dump(),
        "explanation": (
            f"I've built a {len(workflow.nodes)}-step content pipeline for you. "
            f"It scrapes trending topics, generates content and images, "
            f"and publishes to {', '.join(workflow.platforms)} on a "
            f"{workflow.schedule} schedule. Estimated cost: {workflow.estimatedCredits} credits per run."
        ),
    }
