import { AppNode } from "@/types/appNode";
import { TaskType } from "@/types/type";
import { TaskRegistry } from "./task/registry";

export function CreateFlowNode(
    NodeType: TaskType,
    position?: {x:number, y:number},
):AppNode{
    const task = TaskRegistry[NodeType];
    return {
        id: crypto.randomUUID(),
        type: "AppFlowNode",
        data: {
            type: NodeType,
            inputs: {},
            tools: {},
        },
        position: position ?? { x: 0, y: 0 },
    }
}