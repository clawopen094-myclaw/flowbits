"use client";

import { Button } from "@/components/ui/button"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteVariable } from "@/actions/SystemVariables/deleteVariable"
import { toast } from "sonner"
import { LockKeyhole, Trash2 } from "lucide-react"
import CreateVariableDialog from "./CreateVariableDialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


type Credentials = {
    id: string;
    userId: string;
    name: string;
    value: string;
    createdAt: Date;
    updatedAt: Date;
  }

export default function GlobalVariables({ credentials }: { credentials: Credentials[] }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between py-3">
        <p className="text-start text-xl font-semibold">Global Variables</p>
        <CreateVariableDialog triggerText="Add Global Variable" />
      </div>
      <div className="flex flex-col gap-3">
        {credentials.map((credential) => (
          <GlobalVariableCard 
            key={credential.id} 
            id={credential.id} 
            name={credential.name} 
            createdAt={new Date(credential.createdAt)}
          />
        ))}
      </div>
    </div>
  )
}

function GlobalVariableCard({ id, name, createdAt }: { 
  id: string, 
  name: string, 
  createdAt: Date 
}) {
  const queryClient = useQueryClient()

  const deleteMutation = useMutation({
    mutationFn: deleteVariable,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['systemVariables'] })
      toast.success("Variable deleted successfully", { id: "delete-variable" })
    },
    onError: () => {
      toast.error("Error deleting variable", { id: "delete-variable" })
    },
    onMutate: () => {
      toast.loading("Deleting variable...", { id: "delete-variable" })
    }
  })

  return (            
    <Alert className="p-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-muted-foreground/20 rounded-lg">
            <LockKeyhole className="h-4 w-4 stroke-primary"/>
          </div>
          <div>
            <AlertTitle className="text-primary">{name}</AlertTitle>
            <AlertDescription className="text-muted-foreground">
              Added on: {createdAt.toLocaleDateString()}
            </AlertDescription>
          </div>
        </div>
        <div className="ml-auto">
          <Button 
            variant="danger" 
            onClick={() => deleteMutation.mutate(id)}
            disabled={deleteMutation.isPending}
          >
            <Trash2 className="mr-2 h-4 w-4"/> 
            {deleteMutation.isPending ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>
    </Alert>
  )
}