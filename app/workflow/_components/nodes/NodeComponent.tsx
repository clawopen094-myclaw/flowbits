import { memo } from "react";
import NodeCard from "./NodeCard";
import { NodeProps, useReactFlow } from "@xyflow/react";
import NodeHeader from "./NodeHeader";
import { AppNode, AppNodeData } from "@/types/appNode";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import NodeInputs from "./NodeInputs";
import NodeInput from "./NodeInput";
import { Separator } from "@/components/ui/separator";
import NodeOutputs from "./NodeOutputs";
import NodeOutput from "./NodeOutput";
import NodeTools from "./NodeTools";
import React from "react";
import { Badge } from "@/components/ui/badge";


const DEV_MODE = process.env.NEXT_PUBLIC_DEV_MODE === "true";

const NodeComponents  = memo((props:NodeProps)=> {
    const nodeData = props.data as AppNodeData
    const task = TaskRegistry[nodeData.type]
    const showTools = task.tools && task.tools.length > 0;
    return ( 
    <>
    <NodeCard nodeId={props.id} isSelected={!!props.selected} h={task.height} w={task.width}>
    {DEV_MODE && <Badge>Dev: {props.id}</Badge>}
    <NodeHeader taskType={nodeData.type}/>
    <Separator/>
    <NodeInputs>
        {task.inputs.map((input,index) => (
            <NodeInput key={input.name} input={input} nodeId={props.id} index={index} type={task.type}/>
        ))}
    </NodeInputs>
    {showTools && (
        <>
        <Separator/>
        <div className='flex flex-col'>
            {task.tools?.map((tool, index) => (
                <NodeTools index={index} tools={tool}/>
            ))}
        </div>
        </>
    )}
    <NodeOutputs>
        {task.outputs.map((output,index) => (
            <NodeOutput key={output.name} output={output}  nodeId={props.id} index={index}/>
        ))}
    </NodeOutputs>
    </NodeCard>
    </>
    )
})

export default NodeComponents;
NodeComponents.displayName = "NodeComponent";