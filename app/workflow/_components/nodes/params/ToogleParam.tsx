import { useEffect, useId, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ParamProps, TaskParams } from "@/types/type";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";

function ToogleParam({param,value,updateNodeParamValue}:ParamProps) {
    const id = useId();

      useEffect(() => {
        if (value === undefined) {
          updateNodeParamValue("false");
        }
      }, [updateNodeParamValue]);

    const str = "true";
    const isChecked = str === value; 
    const [internalValue, setInternalValue] = useState(isChecked);

  return (
    <div className="space-y-1 px-3 py-3 w-full">
        <div className="flex flex-1 items-center justify-between">
            <Label htmlFor={id}  className="text-xs flex gap-1 items-center">
            {param.name}
            <Tooltip>
            <TooltipTrigger asChild>
            <Info size={10} className="cursor-help"/>
            </TooltipTrigger>
            <TooltipContent>
                <div className="p-1">
                <p className='text-xs text-muted-foreground py-0.5'>{param.helperText}</p>
                </div>
                </TooltipContent>
            </Tooltip>
            </Label>
            <Switch checked={internalValue} size="sm" onCheckedChange={(checked)=>{updateNodeParamValue(checked.toString());setInternalValue(checked)}}/>
        </div>
    </div>
  )
}

export default ToogleParam