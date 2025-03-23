"use client";

import { Workflow } from '@prisma/client'
import { addEdge, Background, BackgroundVariant, Connection, Controls, Edge, ReactFlow, useEdgesState, useNodesState,useReactFlow,type ColorMode,type ColorModeClass } from '@xyflow/react'
import React, { useCallback } from 'react'
import "@xyflow/react/dist/style.css"
import { useState,useEffect } from 'react'
import { useTheme } from "next-themes";
import { CreateFlowNode } from '@/lib/workflow/createFlowNode'
import { TaskType } from '@/types/type'
import NodeComponents from './nodes/NodeComponent'
import Loading from './Loading';
import BottomBar from './BottomBar';
import { AppNode } from '@/types/appNode';
import CustomEdge from './edges/CustomEdge';
import NodeInput from './nodes/NodeInput';
import { TaskRegistry } from '@/lib/workflow/task/registry';
import NavigationTabs from './NavigationTabs';
import { WorkflowStatus } from '@/status/WorkflowStatus';

const nodeTypes = {
  AppFlowNode: NodeComponents,
}

const fitViweOption = { padding : 1 }

function FlowEditor({workflow}:{workflow:Workflow}) {
    const { resolvedTheme } = useTheme();
    const [colorMode, setColorMode] = useState<ColorMode>();
    useEffect(() => {
      if (resolvedTheme) {
        setColorMode(resolvedTheme as ColorModeClass);
      }
    }, [resolvedTheme]);

    const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
    const {screenToFlowPosition, updateNodeData} = useReactFlow();
    const [viewPort, setViewPort] = useState({ x: 0, y: 0, zoom: 1 });
  
    useEffect(()=>{
      try{
        const flow = JSON.parse(workflow.defination)
        if (flow.viewport){
          setViewPort(flow.viewport);
        }
        if (!flow) return;
        setNodes(flow.nodes||[])
        setEdges(flow.edges||[])
      }catch(error){}
    },[workflow.defination,setEdges,setNodes,setViewPort])

    const onDragOver = useCallback((event:React.DragEvent)=>{
      event.preventDefault();
      event.dataTransfer.effectAllowed = "move";
    },[])

    const onDrop = useCallback((event:React.DragEvent)=>{
      event.preventDefault();
      const taskType = event.dataTransfer.getData("application/reactflow");
      if (typeof taskType === undefined || !taskType) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      })

      const newNode = CreateFlowNode(taskType as TaskType,position)
      setNodes((nds)=>nds.concat(newNode))

    },[screenToFlowPosition,setNodes])

    const onConnect = useCallback((connection:Connection)=> {
      setEdges ((eds)=> addEdge({ ...connection, animated:false},eds));
      if (!connection.targetHandle) return;
      const node = nodes.find((node)=>node.id === connection.target);
      if (!node) return;
      const nodeInputs = node.data.inputs;
      // delete nodeInputs[connection.targetHandle];
      updateNodeData(node.id,{inputs:{
        ...nodeInputs,
        [connection.targetHandle]: "",
      }})
    },[setEdges,nodes,updateNodeData])

    const isValidConnection = useCallback((connection:Edge | Connection)=>{
      //  checking self connection
      if (connection.source === connection.target) return false;


      //  checking both input and output type
      const source = nodes.find((node)=>node.id === connection.source);
      const target = nodes.find((node)=>node.id === connection.target);
      if (!source || !target) return false;
      const sourceTask = TaskRegistry[source.data.type];
      const targetTask = TaskRegistry[target.data.type];
      const output = sourceTask.outputs.find((output)=>output.name === connection.sourceHandle);
      const input = targetTask.inputs.find((input)=>input.name === connection.targetHandle);
      if (input?.type !== output?.type) return false;

      return true;
      
    },[nodes])

    if (!colorMode) {
      return (
        <><Loading/></>
      );
  }

  return (
    <main className='min-h-[calc(100vh-67px)] w-full'>
        <NavigationTabs workflowId={workflow.id}/>
        <ReactFlow
        minZoom={0.2}
        maxZoom={4}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        colorMode={colorMode}
        nodeTypes={nodeTypes}
        proOptions={{ hideAttribution: true }}
        fitViewOptions={fitViweOption}
        defaultViewport={viewPort}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onConnect={onConnect}
        connectionLineComponent={CustomEdge}
        isValidConnection={isValidConnection}
        >
        <Background variant={BackgroundVariant.Dots} gap={12} size={1}/>
        <Controls position='top-right'/>
        </ReactFlow>
        <BottomBar id={workflow.id} name={workflow.name} description={workflow.description} status={workflow.status} isPublished={workflow.status===WorkflowStatus.PUBLISHED}/>
    </main>
  )
}

export default FlowEditor