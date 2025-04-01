"use client";

import { getCreditsUsageInPeriod } from "@/actions/analytics/GetCreditsUsageInPeriod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { ChartColumnStackedIcon } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis } from "recharts";


type chartData = Awaited<ReturnType<typeof getCreditsUsageInPeriod>>

function CreditsUsageChart({data,title,description}:{data:chartData,title:string,description:string}) {
    const chartCongif = {
        success: {
            label: "Successfull Phases Credits",
            color: "hsl(var(--chart-2))",
        },
        failed: {
            label: "Failed Phases Credits",
            color: "hsl(var(--chart-3))",
        }
    }
  return (
    <Card>
        <CardHeader className="">
            <CardTitle className="flex flex-1 gap-3 items-center">
                <ChartColumnStackedIcon className="w-5 h-5 text-primary" />
                {title}
            </CardTitle>
            <CardDescription>
                {description}
            </CardDescription>
        </CardHeader>
        <CardContent>
            <ChartContainer config={chartCongif} className="max-h-[200px] w-full">
                <BarChart data={data} height={200} accessibilityLayer margin={{top: 20}}>
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
                <ChartTooltip content={<ChartTooltipContent className="w-[250px]"/>}/>
                <Bar radius={[0,0,4,4]} fill="var(--color-success)" fillOpacity={0.8} stroke="var(--color-success)" stackId={"a"} dataKey={"success"}/>
                <Bar radius={[4,4,0,0]} fill="var(--color-failed)" fillOpacity={0.8} stroke="var(--color-failed)" stackId={"a"} dataKey={"failed"}/>
                </BarChart>
            </ChartContainer>
        </CardContent>
    </Card>
  )
}

export default CreditsUsageChart