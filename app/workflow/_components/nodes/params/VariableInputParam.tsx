"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useId, useState, useEffect, useCallback } from "react";

import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader, X } from "lucide-react";
import React from "react";
import { ParamProps } from "@/types/type";
import { NodeVariableInputModal } from "../settings/NodeVariableInputModal";
import { getSystemVariable } from "@/actions/SystemVariables/getSystemVariables";

interface SystemVariables {
  name: string,
  value: string,
}

function VariableInputParam({ param, value, updateNodeParamValue }: ParamProps) {
  const id = useId();
  const [internalValue, setInternalValue] = useState<string | undefined>(value || undefined);
  const [sysVar, setSysVar] = useState<SystemVariables[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  const fetchSysVars = useCallback(async ()=>{
    try {
      const data = await getSystemVariable();
      setSysVar(data)
    } catch (err) {
      setError("Failed to fetch Variables. Please try again.");
    } finally {
      setLoading(false);
    }
  },[]) 



  useEffect(() => {
    setInternalValue(value);
    fetchSysVars();
  }, [value,fetchSysVars]);

  const handleSelect = (selectedValue: string) => {
    setInternalValue(selectedValue);
    updateNodeParamValue(selectedValue);
  };

  const removeItem = () => {
    setInternalValue(undefined);
    updateNodeParamValue("");
  };
  
  
  const options = sysVar.map(({ name, value }) => ({
    label: name,
    value: value
  }));

  return (
    <div className="space-y-1 px-3 py-3 w-full">
      <Label htmlFor={id} className="text-xs flex gap-1">
        {param.name}
        {param.required && <p className="text-red-400">*</p>}
      </Label>

      <Select value={internalValue} onValueChange={handleSelect}>
        <SelectTrigger className="w-full flex items-center min-h-[40px] gap-2 p-2">
          {internalValue ? (
            <Badge variant="blue" className="flex items-center gap-1 max-w-full overflow-hidden truncate whitespace-nowrap">
              { loading ? <Loader style={{animation: "spin 2s linear infinite"}} className="ease-linear text-primary w-3 h-3 cursor-pointer" />: <>
              {(() => {
              const label = options.find((opt) => opt.value === internalValue)?.label || "";
              return label.length > 30 ? label.slice(0, 30) + "..." : label;
            })()}
            </>}

              <X className="w-3 h-3 cursor-pointer stroke-red-400" onClick={removeItem} />
            </Badge>
          ) : (
            <SelectValue placeholder="Select API key" />
          )}
        
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {options.map(({ label, value }) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <NodeVariableInputModal refresh={fetchSysVars}/>
      
      {param.helperText && (
        <Label htmlFor={id} className="text-[0.7rem] text-muted-foreground">
          {param.helperText}
        </Label>
      )}
    </div>
  );
}

export default VariableInputParam;