"""
YouTube MCP Server — Video upload and analytics for YouTube.

Standalone FastMCP server. Run with: python api/mcp/youtube_server.py
Phase 3: Mock data. Phase 5: Real YouTube Data API v3 integration.
"""

from mcp.server.fastmcp import FastMCP

mcp = FastMCP("YouTube Content Server")


@mcp.tool()
def upload_video(title: str, description: str, video_url: str, tags: str = "", thumbnail_url: str = "") -> dict:
    """Upload a video to YouTube. Returns mock success for Phase 3.

    Args:
        title: Video title
        description: Video description text
        video_url: URL of the video file to upload
        tags: Optional comma-separated tags
        thumbnail_url: Optional custom thumbnail URL
    """
    return {
        "success": True,
        "platform": "youtube",
        "video_id": "yt_mock_ghi789",
        "url": "https://youtube.com/watch?v=mock789",
        "title": title,
        "description_length": len(description),
        "tags": [t.strip() for t in tags.split(",") if t.strip()],
        "thumbnail_attached": bool(thumbnail_url),
        "privacy_status": "public",
        "scheduled_at": None,
    }


@mcp.tool()
def get_analytics(days: int = 30) -> dict:
    """Get YouTube channel analytics for the specified time period.

    Args:
        days: Number of days to look back (default 30)
    """
    return {
        "platform": "youtube",
        "period_days": days,
        "metrics": {
            "total_videos": 8,
            "total_views": 134000,
            "total_watch_hours": 4200,
            "total_likes": 8900,
            "total_comments": 670,
            "total_shares": 340,
            "avg_view_duration": "4:32",
            "top_video_id": "yt_mock_top_001",
            "top_video_views": 28000,
            "subscriber_count": 34000,
            "subscriber_growth": "+5.1%",
        },
        "trend": "up 18% vs previous period",
    }


if __name__ == "__main__":
    mcp.run()
