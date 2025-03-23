import {
    AnimatedSpan,
    Terminal,
    TypingAnimation,
  } from "@/components/magicui/terminal";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExecutionLogs } from "@prisma/client";
import { Clock3 } from "lucide-react";
  
  const TerminalIcon: any = {
    'info': 'ℹ',
    'warn': '❢',
    'error': '✘',
    'success': '✔'
  }

  const TerminalColor: any = {
    'info': 'text-blue-500',
    'warn': 'text-yellow-500',
    'error': 'text-red-500',
    'success': 'text-green-500'
  }

  export function LogsComponent({logs}:{logs: ExecutionLogs[]|undefined}) {
    return (
      <Card>
      <CardHeader className="rounded-lg rounded-b-none border-b py-4 bg-gray-50 dark:bg-background">
      <CardTitle className="text-sm font-semibold">Logs</CardTitle>
      <CardDescription className="text-xs text-muted-foreground">Run logs for this phase</CardDescription>
  </CardHeader>
      <Terminal className="h-full w-full">
        <TypingAnimation>&gt; Logs . . . </TypingAnimation>
        {logs && logs.length > 0 ? (
          <>
            {logs.map((log) => (
              <AnimatedSpan key={log.id} delay={500} className={TerminalColor[log.logLevel]}>
                <div className="flex items-center justify-between">
                <span>{TerminalIcon[log.logLevel]} {log.message}</span>
                <span className="flex items-center gap-2"><Clock3 size={13}/> {log.timestamp.toISOString()}</span>
                </div>
              </AnimatedSpan>
            ))}
          </>
        ) : (
          <AnimatedSpan delay={500} className="text-yellow-500">
            <span>❢ No logs for this phase.</span>
          </AnimatedSpan>
        )}

      </Terminal>
      </Card>
    );
  }
  