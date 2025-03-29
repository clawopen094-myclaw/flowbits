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
import { CirclePlus, Loader2Icon, VariableIcon } from "lucide-react";
import { createVariable } from "@/actions/SystemVariables/createVariable";
import { toast } from "sonner";
import { createSystemVariable, createSystemVariableType } from "@/schemas/SystemVariable";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import CustomDialogueHeader from "@/components/CustomDialogueHeader";
import { RainbowButton } from "@/components/magicui/rainbow-button";

export function NodeVariableInputModal({ refresh }: { refresh?: () => void }) {
  const [open, setOpen] = useState(false);

  const form = useForm<createSystemVariableType>({
    resolver: zodResolver(createSystemVariable),
    defaultValues: {},
  });

  const { mutate, isPending } = useMutation({
    mutationFn: createVariable,
    onSuccess: () => {
      toast.success("System Variable saved", { id: "systemvariable-save" });
      refresh?.(); // Only call refresh if it's provided
    },
    onError: () => {
      toast.error("Something went wrong!", { id: "systemvariable-save" });
    },
  });

  const onSubmit = useCallback(
    (values: createSystemVariableType) => {
      mutate(values);
      setOpen(false);
    },
    [mutate]
  );

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
  <DialogContent className='px-0'>
  <CustomDialogueHeader icon={VariableIcon} title='Add Global Variable' subTitle='Securely store your API keys and passwords as global variables for easy access in workflows'/>
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
              Choose an unique name
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="value"
        render={({ field }) => (
          <FormItem>
            <FormLabel className='flex flex-1 gap-1 items-center'>
              Value
              <p className='text-xs text-primary'>
                (Required)
              </p>
            </FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormDescription>
              Enter the value for the variable
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
  );
}