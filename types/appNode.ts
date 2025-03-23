import {Node} from "@xyflow/react"
import { TaskType } from "./type";

export interface AppNodeData {
    type: TaskType;
    inputs: Record<string,string>;
    tools?: Record<string,string>;
    [key: string]:any;
}


export interface AppNode extends Node {
    data: AppNodeData
}


export type AppNodeMissingInputs = {
    nodeId: string;
    inputs: string[];
}