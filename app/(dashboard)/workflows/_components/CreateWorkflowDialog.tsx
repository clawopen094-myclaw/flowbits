"use client";

import React, { useCallback, useState } from 'react'
import { Dialog,DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import CustomDialogueHeader from '@/components/CustomDialogueHeader'
import {Workflow,CirclePlus, Loader2Icon} from "lucide-react"
import { useForm } from 'react-hook-form';
import { createWorkflowSchema,createWorkflowSchemaType } from '@/schemas/workflows';
import {zodResolver} from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from '@/components/ui/textarea';
import { useMutation } from '@tanstack/react-query';
import {createWorkflow} from "@/actions/workflows/createWorkflow"
import { toast } from 'sonner';
import { RainbowButton } from "@/components/magicui/rainbow-button";


function CreateWorkflowDialog({triggerText}:{triggerText?: string}){
    const [open,setOpen] = useState(false)

    const form  = useForm<createWorkflowSchemaType>({
      resolver: zodResolver(createWorkflowSchema),
      defaultValues: {}
    })

    const {mutate, isPending} = useMutation({
      mutationFn: createWorkflow,
      onSuccess: ()=>{toast.success("Workflow created",{id:"create-workflow"})},
      onError: ()=>{toast.error("Failed to create workflow",{id:"create-workflow"})},
    })


    const onSubmit = useCallback((values: createWorkflowSchemaType)=>{
      toast.loading("Creating workflow...",{ id: "create-workflow"});
      mutate(values);
      },
      [mutate])


  return (
    <Dialog open={open} onOpenChange={(open)=>{form.reset();setOpen(open)}}>
        <DialogTrigger asChild>
              <Button className=''><CirclePlus/> {triggerText ?? "Create Workflow"}</Button>
        </DialogTrigger>
        <DialogContent className='px-0'>
        <CustomDialogueHeader icon={Workflow} title='Create Workflow' subTitle='Start building your workflow'/>
        <div className="p-6 pt-0">
        <Form {...form}>
          <form className="space-y-8 w-full" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='flex flex-1 gap-1 items-center'>
                    Name
                    <p className='text-xs text-primary'>
                      (Required)
                    </p>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    Choose a descriptive and unique name
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='flex flex-1 gap-1 items-center'>
                    Description
                  </FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormDescription>
                    Choose a description for the workflow
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <RainbowButton className='w-full z-10' type="submit" disabled={isPending}>
              {!isPending && "Continue"}
              {isPending && <Loader2Icon className='animate-spin'/>}
            </RainbowButton>
          </form>
        </Form>
        </div>
        </DialogContent>
    </Dialog>
  )
}

export default CreateWorkflowDialog