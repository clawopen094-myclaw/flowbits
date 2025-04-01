import React, { Suspense } from 'react'
import getPeriods from '@/actions/analytics/periods'
import PeriodSelector from './_components/PeriodSelector';
import { period } from '@/types/analytics';
import { Skeleton } from '@/components/ui/skeleton';
import GetStatusCardValue from '@/actions/analytics/GetStatusCardValues';
import { CirclePlayIcon, CoinsIcon, WaypointsIcon } from 'lucide-react';
import StatsCardItem from './_components/StatsCard';
import { waitFor } from '@/lib/helper/waitFor';
import { getWorkflowExecutionStats } from '@/actions/analytics/getWorkflowExecutionStats';
import ExecutionStatusChart from './_components/ExecutionStatusChart';
import { getCreditsUsageInPeriod } from '@/actions/analytics/GetCreditsUsageInPeriod';
import CreditsUsageChart from '../billing/_components/CreditsUsageChart';


function HomePage({searchParams}:{searchParams:{month?:string,year?:string}}) {
  const curDate = new Date();
  const {month,year} = searchParams;
  const period: period = {
    month: month ? parseInt(month) : curDate.getMonth(),
    year: year ? parseInt(year) : curDate.getFullYear(),
  }
  return (
    <div className="flex flex-1 flex-col h-full">
    <div className="flex items-center justify-between">
      <h1 className='text-3xl font-bold'>Home</h1>
      <Suspense fallback={<Skeleton className='w-[180px] h-[40px]'/>}>
        <PeriodSelectorWrapper selectedPeriod={period}/>
      </Suspense>
    </div>
    <div className="h-full py-5 flex flex-col gap-4 pb-16">
    <Suspense fallback={<StatsCardSkeleton/>}>
      <StatsCard selectedPeriod={period}/>
    </Suspense>
    <Suspense fallback={<Skeleton className='w-full h-[300px]'/>}>
      <StatsExecutionStatus selectedPeriod={period}/>
    </Suspense>
    <Suspense fallback={<Skeleton className='w-full h-[300px]'/>}>
      <CreditsUsageInPeriod selectedPeriod={period}/>
    </Suspense>
    </div>
    </div>
  )
}


async function PeriodSelectorWrapper({selectedPeriod}:{selectedPeriod:period}){
  const periods = await getPeriods();
  return <PeriodSelector selectedPeriod={selectedPeriod} periods={periods}/>
}


async function StatsCard({selectedPeriod}:{selectedPeriod:period}){
  const data = await GetStatusCardValue(selectedPeriod);
  return <div className='grid gap-3 lg:gap-8 lg:grid-cols-3 min-h-[120px]'>
    <StatsCardItem title="Workflow Executions" value={data.workflowExecutions} icon={CirclePlayIcon}/>
    <StatsCardItem title="Phase Executions" value={data.phaseExecutions} icon={WaypointsIcon}/>
    <StatsCardItem title="Credits Consumed" value={data.creditsConsumed} icon={CoinsIcon}/>
  </div>
}

function StatsCardSkeleton(){
  return <div className="grid gap-3 lg:gap-8 lg:grid-cols-3">
    {[1,2,3].map((i)=>(
      <Skeleton key={i} className='w-full min-h-[120px]'/>
    ))}
  </div>
}


async function StatsExecutionStatus({selectedPeriod}:{selectedPeriod:period}){
  const data  = await getWorkflowExecutionStats(selectedPeriod);
  return <ExecutionStatusChart data={data}/>
}

async function CreditsUsageInPeriod({selectedPeriod}:{selectedPeriod:period}){
  const data  = await getCreditsUsageInPeriod(selectedPeriod);
  return <CreditsUsageChart data ={data} title="Daily credits spent" description="Daily credits consumed in selected period" />
}

export default HomePage