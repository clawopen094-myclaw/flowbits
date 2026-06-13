"use client";

import { DownloadIcon, Workflow, Activity, BookDashed,TvMinimalPlay } from "lucide-react";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { LucideIcon } from "lucide-react";
import { period } from "@/types/analytics";
import { getWorkflowExecutionStats } from "@/actions/analytics/getWorkflowExecutionStats";
import { useCallback, useEffect, useState } from "react";
import MonthlyExecutionChart from "./MonthlyRunChart";
import ReactCountUpWrapper from "@/components/ReactCountUpWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";


type responseData = Awaited<ReturnType<typeof getWorkflowExecutionStats>>

export default function WorkflowFeatures() {

    const items = [
        {
          title: "All Workflows",
          value: 1,
          icon: Workflow,
        },
        {
          title: "Active",
          value: 1,
          icon: Activity,
        },
        {
          title: "Draft",
          value: 0,
          icon: DownloadIcon,
        },
        {
          title: "Monthly Runs",
          value: 120,
          icon: TvMinimalPlay,
        }
    ]

    const iconMap: Record<string, LucideIcon> = {
        Workflow,
        Activity,
        DownloadIcon,
        TvMinimalPlay,
      };


      const curDate = new Date();

      const selectedPeriod: period = {
          month: curDate.getMonth(),
          year: curDate.getFullYear(),
      };
      
      const [data,setData] = useState<responseData>([])
      const [loading,setLoading] = useState(true)
      const [error,setError] = useState<string | null>()

      const fetchWorkflows = useCallback(async () => {
        setLoading(true);
        try {
        const data = await getWorkflowExecutionStats(selectedPeriod);
        setData(data);
        setError(null);
        } catch (err) {
        setError("Failed to fetch workflows. Please try again.");
        } finally {
        setLoading(false);
        }
      }, []);

      useEffect(() => {
        fetchWorkflows();
      }, [fetchWorkflows]);


  
  return (
    
<div className="flex items-center pb-6 gap-4">
  {/* Left Section: Grid Items */}
  <ul className="grid grid-cols-2 gap-4 w-[440px] flex-shrink-0">
    {items.map((item, index) => {
      return (
        <GridItem key={index} title={item.title} value={item.value} icon={item.icon}/>
      );
    })}
  </ul>

  {/* Right Section: Chart taking remaining space */}
  <div className="flex-1">
    <MonthlyExecutionChart data={data} />
  </div>
</div>
  );
}


interface Props{
  title:string;
  value: number;
  icon: LucideIcon
}


const GridItem = (props:Props) => {
  return (
    <Card className="relative overflow-hidden h-full bg-gradient-to-br from-primary/5 via-primary/0 to-background">
      <CardHeader className="flex p-4">
          <CardTitle><span className="text-lg text-primary/90">{props.title}</span></CardTitle>
          <props.icon size={90} className="text-muted-foreground absolute -bottom-5 -right-6 stroke-primary opacity-10"/>
      </CardHeader>
      <CardContent className="p-4 pt-0">
          <div className="text-2xl font-bold text-primary/80 dark:text-primary/80">
              <ReactCountUpWrapper value={props.value}/>
          </div>
      </CardContent>
    </Card>
  );
};

