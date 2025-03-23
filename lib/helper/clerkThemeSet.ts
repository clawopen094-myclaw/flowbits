"use client";

import { useTheme } from "next-themes";

const { theme } = useTheme();

export const curTheme = theme === "dark" ? true : false;