"use client";

import { TooltipProvider } from "@/components/ui/tooltip";
import { useFlowValidation } from "@/hooks/useFlowvalidation";
import { cn } from "@/lib/utils";
import { CreateFlowNode } from "@/lib/workflow/createFlowNode";
import { AppNode } from "@/types/appNode";
import { useReactFlow, useStore } from "@xyflow/react";
import React, { ReactNode, useEffect, useState, useCallback } from "react";
import { toast } from "sonner";

const useSelectedNodeId = () => {
  return useStore((state) => {
    const selectedNode = state.nodes.find((node) => node.selected);
    return selectedNode ? selectedNode.id : null;
  });
};

function NodeCard({
  children,
  nodeId,
  isSelected,
  h,
  w,
}: {
  children: ReactNode;
  nodeId: string;
  isSelected: boolean;
  h: number;
  w: number;
}) {
  const { getNode, setCenter, addNodes } = useReactFlow();
  const selectedNodeId = useSelectedNodeId();
  const [curNodeId, setCurNodeId] = useState<string | null>(selectedNodeId);
  const {invalidInputs} = useFlowValidation();
  let hasInvalidInputs = null;
  if (invalidInputs!==undefined){
    hasInvalidInputs = invalidInputs.some((node) => node.nodeId === nodeId);
  }

  useEffect(() => {
    setCurNodeId(selectedNodeId);
  }, [selectedNodeId]);

  const duplicateNode = useCallback(
    (nodeId: string) => {
      const node = getNode(nodeId) as AppNode;
      if (!node) return;

      const newX = node.position.x;
      const newY = node.position.y + (node?.measured?.height || 0) + 20; //use measured height.
      const newNode = CreateFlowNode(node.data.type, { x: newX, y: newY });

      addNodes([newNode]);
    },
    [getNode, addNodes]
  );

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "d" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (!curNodeId) {
          return;
        }
        // Only proceed if current NodeCard is the selected one
        if (nodeId !== curNodeId) return;
        duplicateNode(curNodeId);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [curNodeId, duplicateNode, nodeId]);

  return (
    <div
      style={{ width: `${w}px` }}
      onDoubleClick={() => {
        const node = getNode(nodeId);
        if (!node) return;

        const { position, measured } = node;
        if (!position || !measured) return;

        const { width, height } = measured;
        const x = position.x + width! / 2;
        const y = position.y + height! / 2;
        if (x === undefined || y === undefined) return;

        setCenter(x, y, {
          zoom: 1,
          duration: 500,
        });
      }}
      className={cn(
        "bg-background dark:bg-[#141414] border border-primary/20 rounded-lg",
        isSelected && "border-primary/40",
        hasInvalidInputs && "border-red-500 dark:border-red-400"
      )}
    >
      <TooltipProvider>{children}</TooltipProvider>
    </div>
  );
}

export default NodeCard;