"use client";

import { getWorkflowExecutionStats } from "@/actions/analytics/getWorkflowExecutionStats";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Layers2Icon } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";


type chartData = Awaited<ReturnType<typeof getWorkflowExecutionStats>>

function ExecutionStatusChart({data}:{data:chartData}) {
    const chartCongif = {
        success: {
            label: "Success",
            color: "hsl(var(--chart-2))",
        },
        failed: {
            label: "Failed",
            color: "hsl(var(--chart-1))",
        }
    }
  return (
    <Card>
        <CardHeader className="">
            <CardTitle className="flex flex-1 gap-3 items-center">
                <Layers2Icon className="w-5 h-5 text-primary" />
                workflows
            </CardTitle>
            <CardDescription>
                Daily number of successfull and failed workflow executions
            </CardDescription>
        </CardHeader>
        <CardContent>
            <ChartContainer config={chartCongif} className="max-h-[200px] w-full">
                <AreaChart data={data} height={200} accessibilityLayer margin={{top: 20}}>
                <CartesianGrid vertical={false}/>
                <XAxis 
                dataKey={"date"}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString("en-US",{
                        month: "short",
                        day: "numeric",
                    });
                  }}
                />
                <ChartLegend content={<ChartLegendContent/>}/>
                <ChartTooltip content={<ChartTooltipContent className="w-[200px]"/>}/>
                <Area min={0} type={"bump"} fill="var(--color-success)" fillOpacity={0.6} stroke="var(--color-success)" stackId={"a"} dataKey={"success"}/>
                <Area min={0} type={"bump"} fill="var(--color-failed)" fillOpacity={0.6} stroke="var(--color-failed)" stackId={"a"} dataKey={"failed"}/>
                </AreaChart>
            </ChartContainer>
        </CardContent>
    </Card>
  )
}

export default ExecutionStatusChart