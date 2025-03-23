from typing import Callable, Dict, Any
from .OpenAI import OpenAI
from .LaunchBrowser import LaunchBrowser
from .GoogleGenerativeAI import GoogleGenerativeAI



# Executor registry (equivalent to the JavaScript version)
EXECUTOR_REGISTRY: Dict[str, Callable[[dict], Any]] = {
    "LAUNCH_BROWSER": LaunchBrowser,
    "OpenAI": OpenAI,
    "GOOGLE_GENERATIVE_AI": GoogleGenerativeAI,
}
