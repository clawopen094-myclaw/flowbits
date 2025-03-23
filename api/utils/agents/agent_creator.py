import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))


import importlib
from typing import Dict, Any, Union, List, Callable

from pydantic_ai import Agent
from pydantic_ai.models.openai import OpenAIModel
from pydantic_ai.models.gemini import GeminiModel
from pydantic_ai.models.anthropic import AnthropicModel


class AgentCreator:
    """
    Creates and configures AI agents.
    """

    def __init__(self, inputs: Dict[str, Any]):
        self.inputs = inputs
        self.model_str = inputs.get('Model')
        self.system_prompt = inputs.get('System Message')
        self.api_key = inputs.get('API Key')
        self.temperature = inputs.get('Temperature')
        self.tool_names: List[str] = inputs.get('tools', [])  # Store tool names, not the functions themselves
        self.validate_inputs()
        self.model = self.create_model()
        self.model_settings = self.create_model_settings() # Create model settings

    def validate_inputs(self):
        if not all([self.model_str, self.system_prompt, self.api_key]):
            raise ValueError("Missing required inputs: Model, System Message, and API Key.")

        model_parts = self.model_str.split(":", 1)
        if len(model_parts) != 2:
            raise ValueError(f"Invalid model string format: {self.model_str}. Expected 'provider:model_name'")

    def create_model_settings(self) -> Dict[str, Any]:
        """Creates a dictionary of model settings."""
        model_settings = {}
        if self.temperature is not None:
            model_settings["temperature"] = float(self.temperature)
        return model_settings

    def create_model(self) -> Union[OpenAIModel, GeminiModel, AnthropicModel]:
        model_parts = self.model_str.split(":", 1)
        provider_prefix, model_name = model_parts

        # model_settings are now handled separately, passed to the Agent.
        if provider_prefix == "openai":
            model = OpenAIModel(model_name, api_key=self.api_key)
        elif provider_prefix == "google-gla":
            model = GeminiModel(model_name, api_key=self.api_key)
        elif provider_prefix == "anthropic":
            model = AnthropicModel(model_name, api_key=self.api_key)
        else:
            raise ValueError(f"Unsupported provider: {provider_prefix}")

        return model

    def load_tool(self, tool_name: str) -> Callable:
        """Loads a tool function from the 'tools' module."""
        try:
            # Absolute import (correct way for your structure)
            module = importlib.import_module(f"tools.{tool_name}")
            tool_func = getattr(module, tool_name)
            return tool_func
        except (ImportError, AttributeError) as e:
            raise ImportError(f"Could not import tool '{tool_name}': {e}")


    def create_agent(self) -> Agent:
        """
        Creates the AI agent with the specified model, system prompt, and tools.
        """

        agent = Agent(
            model=self.model,
            deps_type=str,  #  deps_type should be consistent
            system_prompt=self.system_prompt,
            model_settings=self.model_settings # Pass model_settings here
        )

        for tool_name in self.tool_names:
            tool_func = self.load_tool(tool_name)
            if getattr(tool_func, "__name__", "").startswith("get_"):
                agent.tool(tool_func)
            else:
                agent.tool_plain(tool_func)

        return agent