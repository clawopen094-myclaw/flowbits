import { TaskParams, TaskParamType } from '@/types/type'
import { Handle, Position } from '@xyflow/react'
import React, { useId } from 'react'
import NodeParamField from './NodeParamField'
import { cn } from '@/lib/utils'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { TextQuote } from 'lucide-react'

const colorMap: Record<TaskParamType, string> = {
    [TaskParamType.STRING]: "blue",
    [TaskParamType.COMBO_BOX]: "pink",
    [TaskParamType.RANGE_SLIDER]: "red",
    [TaskParamType.TOOLS]: "orange",
    [TaskParamType.VARIABLE_INPUT]: "amber",
    [TaskParamType.TOOGLE_INPUT]: "green",
  };
  

const colorClasses: Record<string, string> = {
    blue: "!border-blue-400 !dark:border-blue-300 !bg-blue-200 !dark:bg-blue-500",
    pink: "!border-pink-400 !dark:border-pink-300 !bg-pink-200 !dark:bg-pink-500",
    red: "!border-red-400 !dark:border-red-300 !bg-red-200 !dark:bg-red-500",
    orange: "!border-orange-400 !dark:border-orange-300 !bg-orange-200 !dark:bg-orange-500",
    stone: "!border-stone-400 !dark:border-stone-300 !bg-stone-200 !dark:bg-stone-500", // Default fallback
};


interface outputParam {
    name: string,
    type: TaskParamType
}


function NodeOutput({output, nodeId,index}:{output:outputParam, nodeId: string,index: number}) {
    const color = colorMap[output.type] || "stone";
    const classes = colorClasses[color] || colorClasses["stone"];

  const id = useId();
  return (
    <>
    
    <div className="relative w-full">
        <div className="space-y-1 px-3 py-3 w-full">
            <div className='flex items-center justify-between'>
                <Label htmlFor={id}  className="text-xs flex gap-1">
                Output
                </Label>
                <div className="flex items-center gap-2">
                <Button size="xs" variant="ghost">
                <TextQuote/> {output.name}
                </Button>
                </div>
            </div>
        </div>
      <Tooltip>
      <TooltipTrigger asChild>
      <Handle className={cn("!w-3 !h-3 !rounded-full !m-0 !p-0 !border-2",classes)}  id={output.name} type='source' position={Position.Right} style={{ top: `(${index}*50)%`, transform: "translateY(-50%) translateX(50%)" }}/>
      </TooltipTrigger>
      <TooltipContent>
        <div className="p-2 w-[250px]">
          <div className="flex items-center gap-2 px-0.5 py-1">
            <p className='text-base text-muted-foreground'>Output type: </p>
            <Badge className={cn("!px-2 !py-1 !text-xs ml-5",classes)} variant="outline">{output.type}</Badge>
          </div>
          <p className='text-sm text-muted-foreground py-0.5'><strong>Drag</strong> to connect compatible outputs</p>
        </div>
        </TooltipContent>
      </Tooltip>
    </div>
    </>
  )
}

export default NodeOutput