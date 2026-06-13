"""
LinkedIn MCP Server — Content posting and analytics for LinkedIn.

Standalone FastMCP server. Run with: python api/mcp/linkedin_server.py
Phase 3: Mock data. Phase 5: Real LinkedIn API integration.
"""

from mcp.server.fastmcp import FastMCP

mcp = FastMCP("LinkedIn Content Server")


@mcp.tool()
def post_content(content: str, image_url: str = "", hashtags: str = "") -> dict:
    """Post content to LinkedIn. Returns mock success for Phase 3.

    Args:
        content: The post text content
        image_url: Optional URL of an image to attach
        hashtags: Optional space-separated hashtags
    """
    return {
        "success": True,
        "platform": "linkedin",
        "post_id": "li_mock_abc123",
        "url": "https://linkedin.com/feed/update/urn:li:activity:mock123",
        "preview": content[:200],
        "hashtags": hashtags.split() if hashtags else [],
        "image_attached": bool(image_url),
        "scheduled_at": None,
    }


@mcp.tool()
def get_analytics(days: int = 30) -> dict:
    """Get LinkedIn post analytics for the specified time period.

    Args:
        days: Number of days to look back (default 30)
    """
    return {
        "platform": "linkedin",
        "period_days": days,
        "metrics": {
            "total_posts": 12,
            "total_impressions": 28450,
            "total_engagements": 1230,
            "total_reactions": 890,
            "total_comments": 240,
            "total_shares": 100,
            "avg_engagement_rate": "4.32%",
            "top_post_id": "li_mock_top_001",
            "top_post_impressions": 5200,
        },
        "trend": "up 12% vs previous period",
    }


if __name__ == "__main__":
    mcp.run()
