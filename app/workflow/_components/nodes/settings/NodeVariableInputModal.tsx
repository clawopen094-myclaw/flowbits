"use client";

import { useCallback, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CirclePlus, Loader2Icon } from "lucide-react";
import { createVariable } from "@/actions/SystemVariables/createVariable";
import { toast } from "sonner";
import { createSystemVariable, createSystemVariableType } from "@/schemas/SystemVariable";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormMessage } from "@/components/ui/form";

export function NodeVariableInputModal({refresh}:{refresh:()=> void}) {

      const [open,setOpen] = useState(false)
  
      const form  = useForm<createSystemVariableType>({
        resolver: zodResolver(createSystemVariable),
        defaultValues: {}
      })

    const {mutate,isPending} = useMutation({
          mutationFn: createVariable,
          onSuccess: ()=>{toast.success("System Variable saved",{id: "systemvariable-save"});refresh();},
          onError: (e)=> {toast.error("Something went wrong!",{id: "systemvariable-save"})}
      })

    const onSubmit = useCallback((values: createSystemVariableType)=>{
      mutate(values);
      setOpen(false);
      },[mutate])

  return (
    <Dialog open={open} onOpenChange={(open)=>{form.reset();setOpen(open)}}>
      <DialogTrigger asChild>
        <Button
          className="absolute right-10 top-12 -translate-y-1/2"
          variant="icon"
          size="xs"
        >
          <CirclePlus className="w-4 h-4 cursor-pointer stroke-secondary-foreground/50" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] p-5">
        <DialogHeader>
          <DialogTitle className="text-base">Add Global Variable</DialogTitle>
          <DialogDescription className="text-sm">
            Define a global variable that can be used across the application. Click "Save Variable" when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
        <form className="space-y-3 w-full" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-3 py-0.5">
          <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <div className="grid grid-cols-4 items-center gap-1">
            <Label htmlFor="name" className="text-left">Name:</Label>
            <FormControl>
                <Input {...field} className="col-span-3"/>
            </FormControl>
            <FormMessage />
            </div>
          )}
          />
          <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <div className="grid grid-cols-4 items-center gap-1">
            <Label htmlFor="value" className="text-left">Value:</Label>
            <FormControl>
            <Input {...field} className="col-span-3"/>
            </FormControl>
            <FormMessage />
            </div>
          )}
          />
          </div>
          <DialogFooter>
          <Button size="sm" type="submit" disabled={isPending}>
          {!isPending && "Save Variable"}
          {isPending && <Loader2Icon className='animate-spin'/>}
          </Button>
          </DialogFooter>
        </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}