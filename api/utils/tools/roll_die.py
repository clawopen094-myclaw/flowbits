import random

def roll_die() -> str:
    """Roll a six-sided die and return the result."""
    return str(random.randint(1, 6))