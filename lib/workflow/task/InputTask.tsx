import { WorkflowTask } from "@/status/WorkflowStatus";
import { TaskParamType, TaskType } from "@/types/type";
import { LucideProps, SquarePen } from "lucide-react";

export const InputTask = {
    type: TaskType.INPUT,
    label: "Input",
    icon: (props: LucideProps) => <SquarePen size={typeof props.size === 'string' ? parseInt(props.size, 10) : props.size} />,
    description: "Save your input",
    isEntryPoint: true as boolean,
    height: 280,
    width: 300,
    credits: 0,
    inputs:[
        {
            name: "Input",
            type: TaskParamType.STRING,
            helperText: "Enter your input",
            required: true,
            hideHandel: false,
        }
    ] as const,
    outputs:[
        {
            name: "Response",
            type: TaskParamType.STRING,
        }
    ] as const,
    tools: [] as const
} satisfies WorkflowTask;


