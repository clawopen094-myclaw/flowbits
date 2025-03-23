from pydantic_ai import RunContext

def get_player_name(ctx: RunContext[str]) -> str:
    """Get the player's name."""
    return ctx.deps