"use client";

import {
  Bot,
  ChevronRight,
  Menu,
  Plus,
  Search
} from "lucide-react"
import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel } from "@/components/ui/sidebar";

import { Input } from "@/components/ui/input"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { TaskType } from "@/types/type";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import { Button } from "@/components/ui/button";
import { SidebarData } from "@/lib/workflow/sidebarData";
import { type ColorMode, type ColorModeClass } from "@xyflow/react";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { RainbowButton } from "@/components/magicui/rainbow-button";


const data = SidebarData;


export function ComponentsSidebar() {

    const [colorMode, setColorMode] = useState<ColorMode>();
    const {theme,resolvedTheme} = useTheme();
    useEffect(() => {
      if (resolvedTheme) {
        setColorMode(resolvedTheme as ColorModeClass);
      }
    }, [resolvedTheme]);




  if (!colorMode){
    return (<></>)
  }

  return (
      <Sidebar className="border-r border-border bg-background ">
        <SidebarHeader className="px-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h1 className="px-1 font-semibold">Components</h1>
            </div>
            <SidebarTrigger>
              <Menu className="h-6 w-6" />
            </SidebarTrigger>
          </div>
          <div className="relative mt-3">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search" className="pl-8 pr-8" />
            <kbd className="pointer-events-none absolute right-2 top-2.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
              /
            </kbd>
          </div>
        </SidebarHeader>

        <SidebarContent className="gap-0">
        {/* We create a collapsible SidebarGroup for each parent. */}
        {data.navMain.map((item) => (
          <Collapsible
            key={item.title}
            title={item.title}
            defaultOpen
            className="group/collapsible"
          >
            <SidebarGroup>
              <SidebarGroupLabel
                asChild
                className="group/label text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                <CollapsibleTrigger>
                  <div className="flex items-center gap-2">
                  <item.icon size={16} />{"  "}
                  {item.title}{"  "}
                  </div>
                  <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent className="overflow-auto rounded-lg">
                  <SidebarMenu>
                    {item.items.map((item) => (
                      <TaskItemButton key={item.title} taskType={item.type}/>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        ))}
      </SidebarContent>


        {/* TODO: Add ask ai feature for generating workflow. */}

        {/* <SidebarFooter className="border-t border-border">
        <RainbowButton className="flex items-center gap-2">
          <Bot size={20} />
          <span>Ask AI</span>
        </RainbowButton>
        </SidebarFooter> */}


      </Sidebar>

  )
}

function TaskItemButton({ taskType }: { taskType: TaskType }) {
  const task = TaskRegistry[taskType];
  const {resolvedTheme} = useTheme();
  

  const onDragStart = (event: React.DragEvent, type: TaskType,resolvedTheme:string | undefined) => {
      event.dataTransfer.setData("application/reactflow", type);
      event.dataTransfer.effectAllowed = "move";

      const originalElement = event.currentTarget as HTMLElement;
      const clone = originalElement.cloneNode(true) as HTMLElement;
      // Get computed styles from original element
      const computedStyles = window.getComputedStyle(originalElement);
      const width = originalElement.getBoundingClientRect().width;
      // Apply critical styles directly to clone
      clone.style.backgroundColor = resolvedTheme==="dark"? "rgba(21, 21, 23, 1)" : "rgba(243, 243, 244, 1)";
      clone.style.width = `${width}px`;
      clone.style.position = 'absolute';
      clone.style.left = '-9999px';
      clone.style.boxSizing = 'border-box';
      
      document.body.appendChild(clone);

      // Use original element's dimensions for positioning
      const rect = originalElement.getBoundingClientRect();
      event.dataTransfer.setDragImage(clone, rect.width / 2, rect.height / 2);

      setTimeout(() => document.body.removeChild(clone), 0);
  };

  return (
      <SidebarMenuItem key={task.label}>
          <SidebarMenuButton asChild>
              <div className="p-[1px]">
                  <div
                      className="bg-primary/5 flex items-center p-4 h-[5px] gap-2 w-full rounded-lg data-[dragging=true]:border"
                      draggable
                      onDragStart={(event) => onDragStart(event, taskType,resolvedTheme)}
                  >
                      <task.icon size={16} /> {task.label}
                  </div>
              </div>
          </SidebarMenuButton>
      </SidebarMenuItem>
  );
}