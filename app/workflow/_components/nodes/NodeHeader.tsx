import { Button } from '@/components/ui/button'
import { TaskRegistry } from '@/lib/workflow/task/registry'
import { TaskType } from '@/types/type'
import { Play } from 'lucide-react'
import React from 'react'
import { NodeSettingsDropdownMenu } from './settings/NodeSettingsDropdownMenu'

function NodeHeader({taskType}:{taskType:TaskType}) {
    const task = TaskRegistry[taskType]
  return (
    <div className='gap-2 p-3'>
      <div className='flex items-center gap-2'>
        <div className="bg-primary/10 p-1 rounded-md">
        <task.icon size={18} />
        </div>
        <div className='flex justify-between items-center w-full'>
            <p className='text-sm'>{task.label}</p>
        </div>
        <Button className='px-1.5' variant="ghost" size="xs">
          <Play/>
        </Button>
        {/* <NodeSettingsDropdownMenu isEntryPoint={task.isEntryPoint}/> */}
      </div>
      <p className='pt-2 text-[0.7rem] text-muted-foreground'>{task.description}</p>
    </div>
  )
}

export default NodeHeader