import { TaskParams, TaskParamType } from '@/types/type'
import { Handle, Position, useEdges } from '@xyflow/react'
import React from 'react'
import NodeParamField from './NodeParamField'
import { cn } from '@/lib/utils'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Badge } from '@/components/ui/badge'
import { useFlowValidation } from '@/hooks/useFlowvalidation'

const colorMap: Record<TaskParamType, string> = {
  [TaskParamType.STRING]: "blue",
  [TaskParamType.COMBO_BOX]: "pink",
  [TaskParamType.RANGE_SLIDER]: "red",
  [TaskParamType.TOOLS]: "orange",
  [TaskParamType.VARIABLE_INPUT]: "amber",
  [TaskParamType.TOOGLE_INPUT]: "green",
};

// This map ensures Tailwind correctly detects all possible classes
const colorClasses: Record<string, string> = {
  blue: "!border-blue-400 !dark:border-blue-300 !bg-blue-200 !dark:bg-blue-500",
  pink: "!border-pink-400 !dark:border-pink-300 !bg-pink-200 !dark:bg-pink-500",
  red: "!border-red-400 !dark:border-red-300 !bg-red-200 !dark:bg-red-500",
  orange: "!border-orange-400 !dark:border-orange-300 !bg-orange-200 !dark:bg-orange-500",
  stone: "!border-stone-400 !dark:border-stone-300 !bg-stone-200 !dark:bg-stone-500", // Default fallback
};

function  NodeInput({input, nodeId,index,type}:{input:TaskParams, nodeId: string,index: number,type:string}) {
  const color = colorMap[input.type] || "stone";
  const classes = colorClasses[color] || colorClasses["stone"];

  const edges = useEdges();
  const isConnected = edges.some((edge) => edge.target === nodeId && edge.targetHandle === input.name);

  const {invalidInputs} = useFlowValidation();
  let hasError = null;

  if (invalidInputs!==undefined){
    hasError =invalidInputs.find((node) => node.nodeId === nodeId)?.inputs.find(invalidInput => invalidInput === input.name);

  }

  return (
    <>
    <div className={cn("relative w-full", hasError && "bg-destructive/30")}>
    <NodeParamField param={input} nodeId={nodeId} type={type} disabled={isConnected}/>
    {!input.hideHandel && ( 
      <Tooltip>
      <TooltipTrigger asChild>
      <Handle isConnectable={!isConnected} className={cn("!w-3 !h-3 !rounded-full !m-0 !p-0 !border-2 ",classes)}  id={input.name} type='target' position={Position.Left} style={{ top: `(${index}*50)%`, transform: "translateY(-50%) translateX(-50%)" }}/>
      </TooltipTrigger>
      <TooltipContent>
        <div className="p-2 w-[250px]">
          <div className="flex items-center gap-2 px-0.5 py-1">
            <p className='text-base text-muted-foreground'>Input type: </p>
            <Badge className={cn("!px-2 !py-1 !text-xs ml-5",classes)} variant="outline">{input.type}</Badge>
          </div>
          <p className='text-sm text-muted-foreground py-0.5'><strong>Drag</strong> to connect compatible outputs</p>
        </div>
        </TooltipContent>
      </Tooltip>
      )} 
    </div>
    </>
  )
}

export default NodeInput