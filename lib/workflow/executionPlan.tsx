import { WorkflowExecutionPlan, WorkflowExecutionPlanPhase } from "@/status/WorkflowStatus";
import { AppNode, AppNodeMissingInputs } from "@/types/appNode";
import { Edge, getIncomers } from "@xyflow/react";
import { TaskRegistry } from "./task/registry";
import { Workflow } from "@prisma/client";
import { toast } from "sonner";


export enum FlowToExecutionPlanValidationErrors{
    "NO_ENTRYPOINT",
    "INVALID_INPUTS",
    "ENRYPOINT_NOT_CONNECTED",
    "MULTIPLE_ENTRYPOINTS"
}

type FlowToExecutionPlanType = {
    executionPlan?: WorkflowExecutionPlan;
    error?: {
        type: FlowToExecutionPlanValidationErrors;
        invalidElements?: AppNodeMissingInputs[];
    }
}

export function FlowToExecutionPlan(nodes: AppNode[], edges: Edge[]):FlowToExecutionPlanType{

    const entrypoints = nodes.filter((node)=>TaskRegistry[node.data.type].isEntryPoint);

    const validEntrypoints = entrypoints.filter(
        (entrypoint) => !edges.some((edge) => edge.target === entrypoint.id)
    );

    let firstEntryPoint = null;

    if (validEntrypoints.length === 1) {
        firstEntryPoint = validEntrypoints[0];
    }
    
    else if (validEntrypoints.length > 1) {
        return {
            error:{
                type: FlowToExecutionPlanValidationErrors.MULTIPLE_ENTRYPOINTS,
            }
        };
    }

    if (!firstEntryPoint) {
        return {
            error:{
                type: FlowToExecutionPlanValidationErrors.NO_ENTRYPOINT,
            }
        };
    }
    if (!edges.find((edge)=>edge.source === firstEntryPoint.id)) {
        return {
            error:{
                type: FlowToExecutionPlanValidationErrors.ENRYPOINT_NOT_CONNECTED,
            }
        };
    }

    const inputsWithErrors: AppNodeMissingInputs[] = [];
    const planned = new Set<string>();

    const invalidInputs = getInvalidInputs(firstEntryPoint,planned,edges);
    if (invalidInputs.length > 0) {
        inputsWithErrors.push({
            nodeId: firstEntryPoint.id,
            inputs: invalidInputs,
        });
    }

    const executionPlan: WorkflowExecutionPlan = [
        {
            phase: 1,
            nodes: [firstEntryPoint],
        }
    ];

    planned.add(firstEntryPoint.id);
 
    for (let phase = 2; phase <= nodes.length && planned.size < nodes.length; phase++){
        const nextPhase: WorkflowExecutionPlanPhase = {phase,nodes:[]};
        for (const currentNode of nodes){
            if (planned.has(currentNode.id)) {
                continue;
            }
            const invalidInputs = getInvalidInputs(currentNode,planned,edges);
            if (invalidInputs.length > 0) {
                const incomers = getIncomers(currentNode,nodes,edges);
                if (incomers.every(incomer=>planned.has(incomer.id))) {
                    console.error("Invalid inputs",currentNode.id,invalidInputs);
                    inputsWithErrors.push({
                        nodeId: currentNode.id,
                        inputs: invalidInputs,
                    });
                }
                else{
                    continue;
                }
            }

            nextPhase.nodes.push(currentNode);
            // planned.add(currentNode.id);
        }
        for (const node of  nextPhase.nodes){
            planned.add(node.id);
        }
        executionPlan.push(nextPhase);
    }

    if (inputsWithErrors.length > 0) {
        return {
            error: {
                type: FlowToExecutionPlanValidationErrors.INVALID_INPUTS,
                invalidElements: inputsWithErrors,
            }
        };
    }

    return {executionPlan};
};


function getInvalidInputs(node: AppNode, planned: Set<string>, edges: Edge[]){
    const invalidInputs = [];
    const inputs = TaskRegistry[node.data.type].inputs;
    // console.log("@Node",node.id);
    for (const input of inputs){
        const inputValue= node.data.inputs[input.name];
        if (inputValue === undefined){
            invalidInputs.push(input.name);
            continue;
        }
        const inputValueProvided = inputValue.length > 0;
        if (inputValueProvided){
            continue;
        }
        const incomingEdges = edges.filter((edge)=>edge.target === node.id);
        const inputLinkedToOutput = incomingEdges.find(
            (edge)=> edge.targetHandle === input.name
        );

        if (inputValue === "" && !inputLinkedToOutput && input.required){
            invalidInputs.push(input.name);
            continue;
        }

        console.log(input.required,input.name)
        const requiredInputVisitedOutput = input.required && inputLinkedToOutput && planned.has(inputLinkedToOutput.source);
        if (requiredInputVisitedOutput){
            continue;
        }
        else if (!input.required ){
            if (!inputLinkedToOutput) continue;
            if (inputLinkedToOutput && planned.has(inputLinkedToOutput.source)) continue;

        }

        invalidInputs.push(input.name);

    }

    return invalidInputs;
}