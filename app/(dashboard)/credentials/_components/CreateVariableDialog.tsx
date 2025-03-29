"use client"

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import { createSystemVariable, createSystemVariableType } from '@/schemas/SystemVariable'
import { createVariable } from '@/actions/SystemVariables/createVariable'
import { Loader2Icon, Variable, CirclePlus } from "lucide-react"
import CustomDialogueHeader from '@/components/CustomDialogueHeader'
import { RainbowButton } from "@/components/magicui/rainbow-button"
import { useState } from 'react'

export default function CreateVariableDialog({ triggerText }: { triggerText?: string }) {

  const [open,setOpen] = useState(false)

  const queryClient = useQueryClient()
  const form = useForm<createSystemVariableType>({
    resolver: zodResolver(createSystemVariable),
    defaultValues: { name: '', value: '' },
  })

  const { mutate, isPending } = useMutation({
    mutationFn: createVariable,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['systemVariables'] })
      toast.success("System Variable saved")
    },
    onError: () => {
      toast.error("Something went wrong!")
    },
  })

  const onSubmit = (values: createSystemVariableType) => {
    mutate(values)
    form.reset()
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={(open)=>{form.reset();setOpen(open)}}>
      <DialogTrigger asChild>
        <Button><CirclePlus /> {triggerText ?? "Create Workflow"}</Button>
      </DialogTrigger>
      
      <DialogContent className="px-0">
        <CustomDialogueHeader icon={Variable} title="Add Global Variable" 
          subTitle="Securely store your API keys and passwords as global variables for easy access in workflows" />
        
        <div className="p-6 pt-0">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name (Required)</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>Choose a unique name</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Value (Required)</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>Enter the value for the variable</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <RainbowButton className="w-full z-10" type="submit" disabled={isPending}>
                {isPending ? <Loader2Icon className="animate-spin" /> : "Continue"}
              </RainbowButton>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}