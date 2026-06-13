"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, EyeOff } from "lucide-react";

const STORAGE_KEY = "contentflow-agent-settings";

export interface AgentSettings {
  providerId: string;
  modelId: string;
  apiKey: string;
}

const PROVIDERS = [
  { id: "aihubmix", label: "AIHubMix" },
  { id: "anthropic", label: "Anthropic" },
  { id: "asksage", label: "AskSage" },
  { id: "baseten", label: "Baseten" },
  { id: "bedrock", label: "Bedrock" },
  { id: "cerebras", label: "Cerebras" },
  { id: "claude-code", label: "Claude Code" },
  { id: "cline", label: "Cline" },
  { id: "deepseek", label: "DeepSeek" },
  { id: "dify", label: "Dify" },
  { id: "doubao", label: "Doubao" },
  { id: "fireworks", label: "Fireworks" },
  { id: "gemini", label: "Gemini" },
  { id: "groq", label: "Groq" },
  { id: "hicap", label: "HiCap" },
  { id: "huawei-cloud-maas", label: "Huawei Cloud MAAS" },
  { id: "huggingface", label: "HuggingFace" },
  { id: "kilo", label: "Kilo" },
  { id: "litellm", label: "LiteLLM" },
  { id: "lmstudio", label: "LM Studio" },
  { id: "minimax", label: "MiniMax" },
  { id: "mistral", label: "Mistral" },
  { id: "moonshot", label: "Moonshot" },
  { id: "nebius", label: "Nebius" },
  { id: "nousResearch", label: "Nous Research" },
  { id: "oca", label: "OCA" },
  { id: "ollama", label: "Ollama" },
  { id: "openai-codex", label: "OpenAI Codex" },
  { id: "openai-codex-cli", label: "OpenAI Codex CLI" },
  { id: "openai-compatible", label: "OpenAI Compatible" },
  { id: "openai-native", label: "OpenAI Native" },
  { id: "opencode", label: "OpenCode" },
  { id: "openrouter", label: "OpenRouter" },
  { id: "poolside", label: "Poolside" },
  { id: "qwen", label: "Qwen" },
  { id: "qwen-code", label: "Qwen Code" },
  { id: "requesty", label: "Requesty" },
  { id: "sambanova", label: "SambaNova" },
  { id: "sapaicore", label: "SapAI Core" },
  { id: "together", label: "Together" },
  { id: "v0", label: "v0" },
  { id: "vercel-ai-gateway", label: "Vercel AI Gateway" },
  { id: "vertex", label: "Vertex" },
  { id: "wandb", label: "Weights & Biases" },
  { id: "xai", label: "xAI" },
  { id: "xiaomi", label: "Xiaomi" },
  { id: "zai", label: "Z.AI" },
  { id: "zai-coding-plan", label: "Z.AI Coding Plan" },
];

function getSettings(): AgentSettings {
  if (typeof window === "undefined") return { providerId: "", modelId: "", apiKey: "" };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { providerId: "", modelId: "", apiKey: "" };
  } catch {
    return { providerId: "", modelId: "", apiKey: "" };
  }
}

export function getAgentSettings(): AgentSettings {
  return getSettings();
}

interface AgentSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AgentSettingsDialog({ open, onOpenChange }: AgentSettingsDialogProps) {
  const [providerId, setProviderId] = useState("");
  const [modelId, setModelId] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);

  useEffect(() => {
    if (open) {
      const settings = getSettings();
      setProviderId(settings.providerId || "");
      setModelId(settings.modelId || "");
      setApiKey(settings.apiKey || "");
    }
  }, [open]);

  function handleSave() {
    const settings: AgentSettings = { providerId, modelId, apiKey };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Agent Settings</DialogTitle>
          <DialogDescription>
            Configure the AI provider, model, and API key for the agent.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="provider">Provider</Label>
            <Select value={providerId} onValueChange={setProviderId}>
              <SelectTrigger id="provider">
                <SelectValue placeholder="Select a provider..." />
              </SelectTrigger>
              <SelectContent>
                {PROVIDERS.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="model">Model</Label>
            <Input
              id="model"
              value={modelId}
              onChange={(e) => setModelId(e.target.value)}
              placeholder="claude-sonnet-4"
            />
            <p className="text-xs text-muted-foreground">
              Models are fetched from the selected provider. Common models: gpt-4o, claude-sonnet-4, gemini-2.5-flash, deepseek-chat, grok-3
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="apikey">API Key</Label>
            <div className="relative">
              <Input
                id="apikey"
                type={showApiKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowApiKey(!showApiKey)}
              >
                {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              OpenRouter: openrouter.ai/keys &middot; Anthropic: console.anthropic.com &middot; OpenAI: platform.openai.com
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
