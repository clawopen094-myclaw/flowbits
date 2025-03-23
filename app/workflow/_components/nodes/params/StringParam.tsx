"use client";

import { useEffect, useId, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ParamProps } from "@/types/type";
import StringExpander from "./StringExpander";



function StringParam({param,value,updateNodeParamValue,disabled}:ParamProps) {
  const [internalValue, setInternalValue] = useState(value);
  const id = useId();
  useEffect(()=>{
    setInternalValue(value);
  },[value])

  return (
    <div className="space-y-1 px-3 py-3 w-full">
        <Label htmlFor={id}  className="text-xs flex gap-1">
        {param.name}
        {param.required && (<p className="text-red-400">*</p>)}
        </Label>
        <Input disabled={disabled} id={id} className="h-8 text-xs pr-[33px]" placeholder="Enter Value" value={internalValue} onChange={(e)=>{setInternalValue(e.target.value)}} onBlur={(e)=>{updateNodeParamValue(e.target.value)}}/>
        <StringExpander mode="Edit" name={param.name} value={internalValue} disabled={disabled} setValue={setInternalValue} updateNodeValue={updateNodeParamValue} className="absolute right-5 top-11 -translate-y-1/2"/>
        {param.helperText && (
        <Label htmlFor={id} className="text-[0.7rem] flex gap-1 text-muted-foreground">
        {param.helperText}
        </Label>)}
    </div>
  )
}

export default StringParam