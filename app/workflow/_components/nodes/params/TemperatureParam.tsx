"use client";

import { useEffect, useId, useState } from "react";
import { Label } from "@/components/ui/label";
import { ParamProps } from "@/types/type";
import { Slider } from "@/components/ui/slider";
import { Palette, PencilRuler } from "lucide-react";

function TemperatureParam({ param, value, updateNodeParamValue }: ParamProps) {
  const id = useId();
  const defaultValue = 0.7;

  useEffect(() => {
    if (value === undefined) {
      updateNodeParamValue(defaultValue.toFixed(2));
    }
  }, [updateNodeParamValue]);

  // Ensure initial value is a number
  const initialValue = parseFloat(value) || defaultValue;
  const [internalValue, setInternalValue] = useState<string>(initialValue.toString());

  // Handle slider change
  const handleSliderChange = (newValue: number[]) => {
    const val = newValue[0].toFixed(2);
    setInternalValue(val);
    updateNodeParamValue?.(val);
  };

  // Handle input change (allow empty input)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInternalValue(e.target.value);
  };

  // Enforce min/max constraints when input loses focus
  const handleBlur = () => {
    let newValue = parseFloat(internalValue);
    if (isNaN(newValue)) {
      newValue = 0.7; // Default value if input is empty
    }
    newValue = Math.min(Math.max(newValue, 0.1), 2); // Clamp value between 0.1 and 2
    setInternalValue(newValue.toFixed(2));
    updateNodeParamValue?.(newValue.toFixed(2));
  };

  return (
    <div className="space-y-1 px-3 py-3 w-full">
      <div className="flex flex-1 items-center justify-between gap-1">
        <Label htmlFor={id} className="text-xs flex gap-1">
          {param.name}
          {param.required && <p className="text-red-400">*</p>}
        </Label>
        <input
          type="text"
          value={internalValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          className="border rounded-lg text-xs h-6 text-center w-10"
        />
      </div>
      <Slider
        value={[parseFloat(internalValue) || 0.7]}
        onValueChange={handleSliderChange}
        min={0.1}
        max={2}
        step={0.05}
        className="py-1"
      />
        <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-1">
                <PencilRuler size={14}/>
                <p className="text-xs">Precise</p>
            </div>
            <div className="ml-auto flex items-center gap-1">
                <p className="text-xs">Creative</p>
                <Palette size={14}/>
            </div>
        </div>
    </div>
  );
}

export default TemperatureParam;