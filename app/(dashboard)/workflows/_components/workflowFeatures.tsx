"use client";

import { Box, Workflow, Activity, BookDashed,TvMinimalPlay } from "lucide-react";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { LucideIcon } from "lucide-react";
import { LogsComponent } from "./LogsComponent";

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
            icon: "BookDashed",
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
        BookDashed,
        TvMinimalPlay,
      };


  return (
    
    <div className="min-h-[10rem] max-h-[12rem]">
        
    <ul className="flex gap-4 w-full">
    {items.map((item, index) => {
      const IconComponent = iconMap[item.icon];
      return (
        <GridItem
          key={index}
          area="flex-1 lg:basis-1/4 flex-shrink"
          icon={<IconComponent className="h-4 w-4 text-black dark:text-neutral-400" />}
          title={item.title}
          description="3"
        />
      );
    })}

    <div className="hidden xl:block flex-1 basis-1/2">
      <li className={`min-h-[10rem] max-h-[12rem] list-none `}>
        <div className="relative rounded-2.5xl border p-2 rounded-3xl md:p-3 ">
          <GlowingEffect
            blur={3}
            borderWidth={3}
            spread={100}
            glow={true}
            disabled={false}
            proximity={64}
            inactiveZone={0.01}
          />
          <div className="dark:shadow-[0px_0px_27px_0px_#2D2D2D]">
              {/* <LogsComponent/> */}
          </div>
          </div>
      </li>
    </div>
    </ul>
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
    <li className={`min-h-[10rem] max-h-[12rem] list-none ${area}`}>
      <div className="relative rounded-2.5xl border  p-2 rounded-3xl md:p-3">
        <GlowingEffect
          blur={3}
          borderWidth={3}
          spread={100}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
        />
        <div className="relative flex flex-col justify-between gap-6 overflow-hidden rounded-xl border-0.75 p-6  dark:shadow-[0px_0px_27px_0px_#2D2D2D] md:p-6  bg-gray-100/90 dark:bg-black">
          <div className="relative flex flex-1 flex-col justify-between gap-3">
            <div className="w-min rounded-lg border border-gray-600 p-2 ">
              {icon}
            </div>
            <div className="space-y-3">
              <h3 className="text-sm/normal font-normal font-sans md:text-xl text-black dark:text-neutral-400 whitespace-nowrap  ">
                {title}
              </h3>
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
