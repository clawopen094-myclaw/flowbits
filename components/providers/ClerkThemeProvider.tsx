"use client"

import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export default function ClerkThemeWrapper({ children }: { children: React.ReactNode }) {
    const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    
    const actualTheme = localStorage.getItem('my-theme')
    setTheme(actualTheme || 'system')
  }, [setTheme])

    return (
        <ClerkProvider
            afterSignOutUrl="/sign-in"
            appearance={
              resolvedTheme === 'dark' ? {baseTheme: dark} : undefined
              }
            >
            {children}
        </ClerkProvider>
    );
}