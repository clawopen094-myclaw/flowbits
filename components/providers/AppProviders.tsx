"use client";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { use, useState } from "react";
import ClerkThemeWrapper from "./ClerkThemeProvider";
import NextTopLoader from "nextjs-toploader";


function AppProviders({children}:{children: React.ReactNode}) {
    const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
    <NextTopLoader color="#93c5fd" showSpinner={false}/>
    <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        storageKey="my-theme"
        enableSystem
        disableTransitionOnChange
    >
      <ClerkThemeWrapper>{children}</ClerkThemeWrapper> 
    </ThemeProvider>
    <ReactQueryDevtools/>
    </QueryClientProvider>
  )
}

export default AppProviders