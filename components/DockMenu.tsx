"use client";

import { HomeIcon, ReceiptText, Workflow, KeyRound, Sparkles } from 'lucide-react'
import React from "react";
import { FloatingDock } from "@/components/ui/floating-dock";

export function FloatingDockDemo() {
  const links = [
    {
      title: "Dashboard",
      icon: (
        <HomeIcon className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/",
    },
    {
      title: "Agent Chat",
      icon: (
        <Sparkles className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/agent",
    },
    {
      title: "Workflows",
      icon: (
        <Workflow className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/workflows",
    },
    {
      title: "Credentials",
      icon: (
        <KeyRound className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/credentials",
    },
    {
      title: "Billing",
      icon: (
        <ReceiptText className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/billing",
    }
  ];
  return (
    <div className="fixed bottom-1 mb-1 left-1/2 transform -translate-x-1/2 flex items-end w-fit gap-4 z-[50]">
      <FloatingDock
        mobileClassName="translate-y-20" // only for demo, remove for production
        items={links}
      />
    </div>
  );
}
