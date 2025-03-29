"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ShieldCheck, ShieldOffIcon } from "lucide-react"
import { useQuery } from '@tanstack/react-query'
import CreateVariableDialog from "./_components/CreateVariableDialog"
import GlobalVariables from "./_components/GlobalVariables"
import AccountIntegrations from "./_components/AccountIntegrations"
import { getSystemVariable } from "@/actions/SystemVariables/getSystemVariables"

export default function CredentialsPage() {
  return (
    <div className="flex flex-1 flex-col h-full">
      <div className="flex justify-between">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold">Credentials</h1>
          <p className="text-muted-foreground">Manage your credentials</p>
        </div>
      </div>

      <div className="h-full py-6 space-y-8">
        <Alert>
          <div className="flex items-center gap-4">
            <ShieldCheck className="h-8 w-8 stroke-primary"/>
            <div>
              <AlertTitle className="text-primary">Encryption</AlertTitle>
              <AlertDescription>All information is securely encrypted, ensuring your data remains safe.</AlertDescription>
            </div>
          </div>
        </Alert>
        
        <UserCredentials/>
      </div>
    </div>
  )
}

function UserCredentials() {
  const { data: credentials, isLoading, error } = useQuery({
    queryKey: ['systemVariables'],
    queryFn: () => getSystemVariable(),
  })

  if (isLoading) return <Skeleton className="h-[400px] w-full" />
  if (error) return <div>Error loading credentials</div>
  if (!credentials) return <div>Failed to load credentials</div>

  if (credentials.length === 0) {
    return (
      <Card className="w-full p-4">
        <div className="flex flex-col gap-4 items-center justify-center">
          <div className="rounded-full bg-accent w-20 h-20 flex items-center justify-center">
            <ShieldOffIcon size={40} className="stroke-primary" />
          </div>
          <div className="flex flex-col gap-1 text-center">
            <p className="font-bold">No credentials created yet</p>
            <p className="text-sm text-muted-foreground">
              Click the button below to create your first credential
            </p>
          </div>
          <CreateVariableDialog triggerText="Add Global Variable" />
        </div>
      </Card>
    )
  }

  return (
    <>
      <GlobalVariables credentials={credentials} />
      <AccountIntegrations />
    </>
  )
}