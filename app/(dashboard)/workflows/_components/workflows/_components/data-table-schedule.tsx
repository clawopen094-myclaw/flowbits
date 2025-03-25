import { CoinsIcon, CornerDownRightIcon, MoveRightIcon } from "lucide-react";
import SchedularDialog from "../../SchedularDialog";
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge";


function DataTableSchedule({id,isDraft, creditsCost,cron,refresh}:{id:string,isDraft:boolean,creditsCost:number,cron:string,refresh:()=> void}) {

  if (isDraft) return;

  return (
    <div className="flex items-center gap-1">
    <CornerDownRightIcon className="w-4 h-4" />
    <SchedularDialog workflowId={id} cron={cron} refresh={refresh}/>
    <MoveRightIcon className="w-4 h-4" />
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild className="px-0.5">
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="space-x-1 px-1.5 text-muted-foreground">
            <CoinsIcon className="h-4 w-4"/>
            <span className="text-sm">{creditsCost}</span>
            </Badge>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Credits consumption for full run of the workflow</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
    </div>
  )
}

export default DataTableSchedule