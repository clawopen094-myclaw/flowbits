import { TaskType } from "@/types/type";
import { ArrowDownToDot, BrainCircuit, LucideProps } from "lucide-react";

export const SidebarData = {
    versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
    navMain: [
    {
            title: "Inputs",
            icon: (props:LucideProps)=>(
                <ArrowDownToDot {...props} />
            ),
            items: [
              {
                title: "Open Browser",
                type: TaskType.LAUNCH_BROWSER,
              },
              {
                title: "Input Text",
                type: TaskType.INPUT,
              },
            ],
        },
        {
        title: "Models",
        icon: (props:LucideProps)=>(
            <BrainCircuit {...props} />
        ),
        items: [
          {
            title: "Open AI",
            type: TaskType.OpenAI,
          },
          {
            title: "Google Generative AI",
            type: TaskType.GOOGLE_GENERATIVE_AI,
          },
        ],
      },
    ],
  }
  