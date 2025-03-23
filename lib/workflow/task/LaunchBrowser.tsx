import { WorkflowTask } from "@/status/WorkflowStatus";
import { TaskParamType, TaskType } from "@/types/type";
import { GlobeIcon, LucideProps } from "lucide-react";

export const LaunchBrowserTask = {
    type: TaskType.LAUNCH_BROWSER,
    label: "Launch Browser",
    icon: (props: LucideProps) => <GlobeIcon size={typeof props.size === 'string' ? parseInt(props.size, 10) : props.size} />,
    description: "Opens a browser and retrieves HTML and Markdown data.",
    isEntryPoint: true as boolean,
    height: 280,
    width: 300,
    credits: 5,
    inputs:[
        {
            name: "Website Url",
            type: TaskParamType.STRING,
            helperText: "eg: https://www.google.com",
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


