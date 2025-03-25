"use client";

import { DownloadIcon, Workflow, Activity, BookDashed,TvMinimalPlay } from "lucide-react";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { LucideIcon } from "lucide-react";
import { LogsComponent } from "./LogsComponent";
import { MonthlyRunChart } from "./MonthlyRunChart";

export default function WorkflowFeatures() {

    const items = [
        {
            icon: "Workflow",
            title: "All Workflows"
        },
        {
            icon: "Activity",
            title: "Active"
        },
        {
            icon: "DownloadIcon",
            title: "Draft"
        },
        {
            icon: "TvMinimalPlay",
            title: "Monthly Runs"
        }
    ]

    const iconMap: Record<string, LucideIcon> = {
        Workflow,
        Activity,
        DownloadIcon,
        TvMinimalPlay,
      };


  return (
    
<div className="flex items-center pb-6 gap-4">
  {/* Left Section: Grid Items */}
  <ul className="grid grid-cols-2 gap-4 w-[440px] flex-shrink-0">
    {items.map((item, index) => {
      const IconComponent = iconMap[item.icon];
      return (
        <GridItem
          key={index}
          area="flex-1"
          icon={<IconComponent className="h-4 w-4 text-black dark:text-neutral-400" />}
          title={item.title}
          description="3"
        />
      );
    })}
  </ul>

  {/* Right Section: Chart taking remaining space */}
  <div className="flex-1">
    <MonthlyRunChart className="w-full h-full" />
  </div>
</div>
  );
}

interface GridItemProps {
  area: string;
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
}

const GridItem = ({ area, icon, title, description }: GridItemProps) => {
  return (
    <li className={`list-none ${area}`}>
      <div className="relative rounded-lg border  p-2 md:p-3">
        <GlowingEffect
          blur={3}
          borderWidth={2}
          spread={100}
          glow={true}
          disabled={true}
          proximity={64}
          inactiveZone={0}
        />
        <div className="relative flex flex-col justify-between gap-6 overflow-hidden rounded-xl border-0.75 p-1  md:p-1">
          <div className="relative flex flex-1 flex-col justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-min rounded-lg border border-gray-600 p-2 ">
                {icon}
              </div>
              <h3 className="text-sm/normal font-normal font-sans md:text-xl text-black dark:text-neutral-400 whitespace-nowrap  ">
                  {title}
              </h3>
            </div>

            <div className="space-y-3 ml-3">
              <h2
                className="[&_b]:md:font-semibold [&_strong]:md:font-semibold font-sans text-lg/[1.125rem] md:text-2xl/[1.375rem] text-black dark:text-white"
              >
                {description}
              </h2>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};
