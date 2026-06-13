"use client";

import { useTheme } from "next-themes";

export function useClerkTheme(): boolean {
  const { theme } = useTheme();
  return theme === "dark";
}