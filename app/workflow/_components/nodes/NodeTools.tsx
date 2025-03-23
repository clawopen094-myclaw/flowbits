import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { TaskParamType } from '@/types/type'
import { Handle, Position } from '@xyflow/react'
import { TextQuote } from 'lucide-react'
import React, { useId } from 'react'


interface ToolsProp{
    name: string,
    type: TaskParamType
}


function NodeTools({tools,index}:{tools:ToolsProp,index:number}) {
    const id = useId();
  return (
    <div className="relative w-full">
    <div className="space-y-1 px-3 py-3 w-full">
        <div className='flex items-center justify-between'>
            <Label htmlFor={id}  className="text-xs flex gap-1">
            Tools
            </Label>
            <div className="flex items-center gap-2">
            <Switch size="sm"/>
            </div>
        </div>
    </div>
  <Tooltip>
  <TooltipTrigger asChild>
  <Handle className={cn("!w-3 !h-3 !rounded-full !m-0 !p-0 !border-2 ",`!border-teal-400 dark:!border-teal-300 !bg-teal-200 dark:!bg-teal-500`)}  id={tools.name} type='target' position={Position.Left} style={{ top: `(${index}*50)%`, transform: "translateY(-50%) translateX(-50%)" }}/>
  </TooltipTrigger>
  <TooltipContent>
    <div className="p-2 w-[250px]">
      <div className="flex items-center gap-2 px-0.5 py-1">
        <p className='text-base text-muted-foreground'>Input type: </p>
        <Badge className={`!border-teal-400 dark:!border-teal-300 !bg-teal-200 dark:!bg-teal-500 !px-2 !py-1 !text-xs ml-5`} variant="outline">{tools.type}</Badge>
      </div>
      <p className='text-sm text-muted-foreground py-0.5'><strong>Drag</strong> to connect compatible outputs</p>
    </div>
    </TooltipContent>
  </Tooltip>
</div>
  )
}

export default NodeTools