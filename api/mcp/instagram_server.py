"""
Instagram MCP Server — Content posting and analytics for Instagram.

Standalone FastMCP server. Run with: python api/mcp/instagram_server.py
Phase 3: Mock data. Phase 5: Real Instagram Graph API integration.
"""

from mcp.server.fastmcp import FastMCP

mcp = FastMCP("Instagram Content Server")


@mcp.tool()
def post_content(caption: str, image_url: str = "", hashtags: str = "", location: str = "") -> dict:
    """Post content to Instagram. Returns mock success for Phase 3.

    Args:
        caption: The post caption text
        image_url: URL of the image to post
        hashtags: Optional space-separated hashtags
        location: Optional location tag
    """
    return {
        "success": True,
        "platform": "instagram",
        "post_id": "ig_mock_def456",
        "url": "https://instagram.com/p/mock456",
        "caption": caption[:300],
        "hashtags": hashtags.split() if hashtags else [],
        "location": location or None,
        "image_attached": bool(image_url),
        "scheduled_at": None,
    }


@mcp.tool()
def get_analytics(days: int = 30) -> dict:
    """Get Instagram account analytics for the specified time period.

    Args:
        days: Number of days to look back (default 30)
    """
    return {
        "platform": "instagram",
        "period_days": days,
        "metrics": {
            "total_posts": 18,
            "total_impressions": 52000,
            "total_likes": 3400,
            "total_comments": 520,
            "total_saves": 890,
            "total_shares": 210,
            "avg_engagement_rate": "6.18%",
            "top_post_id": "ig_mock_top_001",
            "top_post_likes": 420,
            "follower_count": 12500,
            "follower_growth": "+2.3%",
        },
        "trend": "up 8% vs previous period",
    }


if __name__ == "__main__":
    mcp.run()
