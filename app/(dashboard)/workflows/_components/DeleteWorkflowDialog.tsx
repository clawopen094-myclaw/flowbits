"use client";

import React from 'react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
  } from "@/components/ui/alert-dialog"
import { useMutation } from "@tanstack/react-query"
import { DeleteWorkflow } from "@/actions/workflows/deleteWorkflow"
import { toast } from 'sonner';

interface Props{
    open: boolean;
    setOpen: (open:boolean)=> void;
    workflowId:string
    refresh:()=>void;
}

function DeleteWorkflowDialog({open,setOpen,workflowId,refresh}:Props) {
  const deleteMutation = useMutation({
    mutationFn: DeleteWorkflow,
    onSuccess: () => {
      refresh();
      toast.success("Workflow deleted successfully.",{ id : workflowId} )
    },
    onError: () => {
      toast.error("Error deleting workflow.",{ id : workflowId} )
    }
  })
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone. This will permanently <span className='font-bold'>DELETE</span> your
          account and remove your data from our servers.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction className='bg-red-500' onClick={
          (e)=>{toast.loading("Deleting workflow...",{ id : workflowId });deleteMutation.mutate(workflowId)}}>Continue</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
  )
}

export default DeleteWorkflowDialog