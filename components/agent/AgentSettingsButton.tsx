"use client";

import { useState, useEffect } from "react";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AgentSettingsDialog, getAgentSettings, type AgentSettings } from "./AgentSettingsDialog";

export function AgentSettingsButton() {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<AgentSettings>({ providerId: "", modelId: "", apiKey: "" });

  useEffect(() => {
    setSettings(getAgentSettings());
  }, []);

  useEffect(() => {
    if (!open) {
      setSettings(getAgentSettings());
    }
  }, [open]);

  const providerLabel = settings.providerId || "openrouter";
  const modelLabel = settings.modelId || "gpt-4o";

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="w-full text-xs"
        onClick={() => setOpen(true)}
      >
        <Settings className="h-3 w-3 mr-1" />
        Settings: {providerLabel} / {modelLabel}
      </Button>
      <AgentSettingsDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
