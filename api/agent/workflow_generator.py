"""
ContentFlow Agent — Workflow Generation Engine

Takes natural language conversation context and generates structured
WorkflowDefinition JSON that maps to React Flow nodes and edges.

Uses pydantic-ai with OpenRouter for structured output generation.
"""

import os
from typing import Optional
from pydantic import BaseModel, Field
from pydantic_ai import Agent
from pydantic_ai.models.openai import OpenAIModel
from dotenv import load_dotenv

load_dotenv()

MODEL_NAME = os.getenv("DEFAULT_MODEL", "nvidia/nemotron-3-ultra-550b-a55b:free")


class WorkflowNode(BaseModel):
    id: str = Field(description="Unique node identifier")
    type: str = Field(description="Node type: SCRAPE_TRENDS, AI_TEXT_GEN, AI_IMAGE_GEN, LINKEDIN_PUBLISH, etc.")
    label: str = Field(description="Human-readable node label")
    inputs: dict = Field(default_factory=dict, description="Node input parameters")
    position: dict = Field(default_factory=dict, description="Visual position {x, y}")


class WorkflowEdge(BaseModel):
    source: str = Field(description="Source node ID")
    target: str = Field(description="Target node ID")
    sourceHandle: str = Field(default="Response", description="Output handle on source node")
    targetHandle: str = Field(default="Input", description="Input handle on target node")


class WorkflowDefinition(BaseModel):
    workflowName: str = Field(description="Name of the workflow")
    description: str = Field(description="What the workflow does")
    nodes: list[WorkflowNode] = Field(description="All nodes in the flow")
    edges: list[WorkflowEdge] = Field(description="All connections between nodes")
    schedule: Optional[str] = Field(default=None, description="Cron expression for scheduling")
    platforms: list[str] = Field(default_factory=list, description="Target platforms")
    estimatedCredits: int = Field(default=0, description="Estimated credit cost per run")


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

NODE_TEMPLATES = {
    "SCRAPE_TRENDS": {
        "label": "Trending Scraper",
        "inputs": {"Niche": "", "Sources": "google_trends,reddit", "Max Results": "10"},
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
        "inputs": {"Prompt": "", "Style": "minimalist", "Width": "1200", "Height": "630"},
        "position": {"x": 800, "y": 100},
    },
    "HASHTAG_GEN": {
        "label": "Hashtag Generator",
        "inputs": {"Input": ""},
        "position": {"x": 1150, "y": 100},
    },
    "LINKEDIN_PUBLISH": {
        "label": "LinkedIn Publisher",
        "inputs": {"Content": "", "Image URL": "", "Hashtags": ""},
        "position": {"x": 1500, "y": 100},
    },
    "INSTAGRAM_PUBLISH": {
        "label": "Instagram Publisher",
        "inputs": {"Content": "", "Image URL": "", "Hashtags": "", "Caption": ""},
        "position": {"x": 1500, "y": 250},
    },
    "YOUTUBE_PUBLISH": {
        "label": "YouTube Publisher",
        "inputs": {"Title": "", "Description": "", "Video URL": "", "Tags": "", "Thumbnail URL": ""},
        "position": {"x": 1500, "y": 400},
    },
    "TWITTER_PUBLISH": {
        "label": "Twitter Publisher",
        "inputs": {"Content": "", "Image URL": "", "Hashtags": ""},
        "position": {"x": 1500, "y": 550},
    },
}

SYSTEM_PROMPT = """You are a content workflow architect. Given a user's content pipeline requirements, generate a structured WorkflowDefinition.

Available node types and their input parameters:
- SCRAPE_TRENDS: {"Niche": string, "Sources": string, "Max Results": string}
- AI_TEXT_GEN: {"Input": string, "System Message": string, "Model": string, "Temperature": string, "Platform": string}
- AI_IMAGE_GEN: {"Prompt": string, "Style": string, "Width": string, "Height": string}
- HASHTAG_GEN: {"Input": string}
- LINKEDIN_PUBLISH: {"Content": string, "Image URL": string, "Hashtags": string}
- INSTAGRAM_PUBLISH: {"Content": string, "Image URL": string, "Hashtags": string, "Caption": string}
- YOUTUBE_PUBLISH: {"Title": string, "Description": string, "Video URL": string, "Tags": string, "Thumbnail URL": string}
- TWITTER_PUBLISH: {"Content": string, "Image URL": string, "Hashtags": string}

Rules:
1. Always start with SCRAPE_TRENDS as the first node
2. Follow with AI_TEXT_GEN to generate content
3. Include AI_IMAGE_GEN for visual content
4. Include HASHTAG_GEN before publishing
5. Add a publish node for each target platform the user mentions
6. Position nodes in a left-to-right flow with proper x,y coordinates (x spacing ~350, y spacing ~150)
7. Generate descriptive workflow names and descriptions
8. Use cron expressions for schedule: daily="0 9 * * *", weekdays="0 9 * * 1-5", weekly="0 9 * * 1"
9. Estimate credits: SCRAPE_TRENDS=5, AI_TEXT_GEN=2, AI_IMAGE_GEN=5, HASHTAG_GEN=1, each publish=1

Respond with a complete WorkflowDefinition that reflects the user's requirements."""


_workflow_agent: Optional[Agent[None]] = None


def _get_agent() -> Agent[None]:
    global _workflow_agent
    if _workflow_agent is None:
        model = OpenAIModel(MODEL_NAME, provider="openrouter")
        _workflow_agent = Agent(
            model,
            output_type=WorkflowDefinition,
            system_prompt=SYSTEM_PROMPT,
        )
    return _workflow_agent


def generate_workflow_from_context(
    niche: str = "data science",
    audience: str = "professionals",
    tone: str = "professional",
    frequency: str = "daily",
    platforms: Optional[list[str]] = None,
    visual_style: str = "minimalist",
) -> WorkflowDefinition:
    if platforms is None:
        platforms = ["linkedin"]

    nodes = []
    edges = []
    node_ids = ["trend-scraper", "content-writer", "image-gen", "hashtag-gen"]
    node_types = ["SCRAPE_TRENDS", "AI_TEXT_GEN", "AI_IMAGE_GEN", "HASHTAG_GEN"]

    for platform in platforms:
        platform_upper = platform.upper().replace("-", "_")
        pub_type = f"{platform_upper}_PUBLISH"
        for template_key, pub_suffix in [
            ("LINKEDIN_PUBLISH", "linkedin"),
            ("INSTAGRAM_PUBLISH", "instagram"),
            ("YOUTUBE_PUBLISH", "youtube"),
            ("TWITTER_PUBLISH", "twitter"),
        ]:
            if pub_suffix == platform.lower():
                if template_key in NODE_TEMPLATES:
                    node_ids.append(f"{platform.lower()}-pub")
                    node_types.append(template_key)
                    break
                else:
                    node_ids.append(f"{platform.lower()}-pub")
                    node_types.append("LINKEDIN_PUBLISH")
                    break
        else:
            node_ids.append(f"{platform.lower()}-pub")
            node_types.append("LINKEDIN_PUBLISH")

    for i, (nid, ntype) in enumerate(zip(node_ids, node_types)):
        template = NODE_TEMPLATES.get(ntype, NODE_TEMPLATES["LINKEDIN_PUBLISH"]).copy()
        template["id"] = nid
        template["type"] = ntype
        template["position"]["y"] = 100 + (i % 3) * 150
        template["position"]["x"] = 100 + (i // 3) * 400

        if ntype == "SCRAPE_TRENDS":
            template["inputs"]["Niche"] = niche
        elif ntype == "AI_TEXT_GEN":
            template["inputs"]["System Message"] = (
                f"You are a {tone} social media content writer targeting {audience}. "
                f"Create engaging, well-researched content about {niche}."
            )
        elif ntype == "AI_IMAGE_GEN":
            template["inputs"]["Style"] = visual_style

        nodes.append(WorkflowNode(**template))

    for i in range(len(node_ids) - 1):
        edges.append(WorkflowEdge(source=node_ids[i], target=node_ids[i + 1]))

    credit_costs = {
        "SCRAPE_TRENDS": 5, "AI_TEXT_GEN": 2, "AI_IMAGE_GEN": 5,
        "HASHTAG_GEN": 1, "LINKEDIN_PUBLISH": 1, "INSTAGRAM_PUBLISH": 1,
        "YOUTUBE_PUBLISH": 1, "TWITTER_PUBLISH": 1,
    }
    estimated_credits = sum(credit_costs.get(nt, 1) for nt in node_types)

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


generate_workflow = generate_workflow_from_context


async def generate_workflow_from_chat(
    user_message: str,
    conversation_history: Optional[list[dict]] = None,
) -> dict:
    history = conversation_history or []
    user_turn_count = sum(1 for m in history if m.get("role") == "user")

    if user_turn_count <= 1:
        return {
            "type": "clarifying_questions",
            "questions": [
                {"id": i, "question": t["question"], "field": t["field"], "examples": t["examples"]}
                for i, t in enumerate(CLARIFYING_QUESTION_TEMPLATES[:4])
            ],
        }

    agent = _get_agent()
    try:
        result = await agent.run(user_message)
        workflow = result.output
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
    except Exception as e:
        workflow = generate_workflow_from_context()
        return {
            "type": "workflow",
            "workflow": workflow.model_dump(),
            "explanation": (
                f"I've built a {len(workflow.nodes)}-step content pipeline for you (template fallback). "
                f"LLM generation failed: {str(e)[:200]}. "
                f"It scrapes trending topics, generates content and images, "
                f"and publishes to {', '.join(workflow.platforms)} on a "
                f"{workflow.schedule} schedule. Estimated cost: {workflow.estimatedCredits} credits per run."
            ),
        }
