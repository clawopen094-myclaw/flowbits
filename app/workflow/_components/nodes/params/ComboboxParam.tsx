"use client";

import { useId, useState } from "react";
import { Label } from "@/components/ui/label";
import { TaskParams, TaskType, GeminiModels, OpenAIModels, formatGeminiLabel, formatOpenAILabel } from "@/types/type";
import { ComboboxSelector } from "@/components/ComboboxSelector";


interface Props {
  param: TaskParams,
  value: string,
  updateNodeParamValue: (newValue: string) => void,
  disabled?: boolean,
  type?: string,
}

function ComboBoxParam({param,value,updateNodeParamValue, type}:Props) {
    const id = useId();
    let models: { value: string; label: string }[] = [];

    switch (type) {
      case TaskType.GOOGLE_GENERATIVE_AI:
          models = Object.entries(GeminiModels).map(([key, value]) => ({
              value,
              label: formatGeminiLabel(key),
          }));
          break;
      case TaskType.OpenAI:
          models = Object.values(OpenAIModels).map(value => ({
              value,
              label: formatOpenAILabel(value),
          }));
          break;
  }

  return (
    <div className="space-y-1 px-3 py-3 !w-full">
        <Label htmlFor={id}  className="text-xs flex gap-1">
        {param.name}
        {param.required && (<p className="text-red-400">*</p>)}
        </Label>
        <ComboboxSelector models={models} mvalue={value} updateNodeParamValue={updateNodeParamValue}/>
        {param.helperText && (
        <Label htmlFor={id} className="text-[0.7rem] flex gap-1 text-muted-foreground">
        {param.helperText}
        </Label>)}
    </div>
  )
}

export default ComboBoxParam