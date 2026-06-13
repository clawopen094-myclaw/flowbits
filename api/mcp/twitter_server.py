"""
Twitter/X MCP Server — Content posting and analytics for Twitter/X.

Standalone FastMCP server. Run with: python api/mcp/twitter_server.py
Phase 3: Mock data. Phase 5: Real Twitter API v2 integration.
"""

from mcp.server.fastmcp import FastMCP

mcp = FastMCP("Twitter/X Content Server")


@mcp.tool()
def post_content(content: str, image_url: str = "", hashtags: str = "") -> dict:
    """Post content to Twitter/X. Returns mock success for Phase 3.

    Args:
        content: The tweet text (max 280 chars for real API)
        image_url: Optional URL of an image to attach
        hashtags: Optional space-separated hashtags
    """
    return {
        "success": True,
        "platform": "twitter",
        "tweet_id": "tw_mock_jkl012",
        "url": "https://twitter.com/user/status/mock012",
        "text": content[:280],
        "hashtags": hashtags.split() if hashtags else [],
        "image_attached": bool(image_url),
        "scheduled_at": None,
    }


@mcp.tool()
def get_analytics(days: int = 30) -> dict:
    """Get Twitter/X account analytics for the specified time period.

    Args:
        days: Number of days to look back (default 30)
    """
    return {
        "platform": "twitter",
        "period_days": days,
        "metrics": {
            "total_tweets": 45,
            "total_impressions": 98000,
            "total_likes": 5600,
            "total_retweets": 780,
            "total_replies": 620,
            "total_quote_tweets": 210,
            "total_bookmarks": 340,
            "avg_engagement_rate": "2.89%",
            "top_tweet_id": "tw_mock_top_001",
            "top_tweet_impressions": 12400,
            "follower_count": 8200,
            "follower_growth": "+1.7%",
        },
        "trend": "up 5% vs previous period",
    }


if __name__ == "__main__":
    mcp.run()
