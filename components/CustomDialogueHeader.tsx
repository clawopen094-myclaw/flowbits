"use client";
import {DialogHeader, DialogTitle} from "@/components/ui/dialog";
import { LucideIcon } from "lucide-react";
import React from 'react'
import { cn } from "@/lib/utils";
import { Separator } from "./ui/separator";

interface props{
    title?: string,
    subTitle?: string,
    icon?: LucideIcon,

    iconClassName?: string,
    titleClassName?: string,
    subtitleClassName?: string
}


function CustomDialogueHeader(props: props) {
    const Icon  = props.icon
  return (
    <DialogHeader className="py-6">
        <DialogTitle asChild>
            <div className="flex flex-col items-center gap-2 mb-2">
                {Icon && <Icon className={cn("stroke-primary",props.iconClassName)} size={30}/>}
                {props.title && <p className={cn("text-xl text-primary",props.titleClassName)}>{props.title}</p>}
                {props.subTitle && <p className={cn("text-sm text-muted-foreground",props.subtitleClassName)}>{props.subTitle}</p>}
                
            </div>
        </DialogTitle>
    {/* <Separator/> */}
    </DialogHeader>
  )
}

export default CustomDialogueHeader