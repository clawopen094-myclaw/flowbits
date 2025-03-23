"use client";

import { useQuery } from "@tanstack/react-query";
import { DataTable } from "./tasks/_components/data-table";
import { columns } from "./tasks/_components/columns";
import { getWorkflowExecutions } from "@/actions/workflows/getWorkflowExecutions";
import { ExecutionTableType } from "@/types/type";
import { useEffect, useRef, useState } from "react";
import Loading from "@/app/workflow/editor/[workflowId]/loading";

function ExecutionTable({
  executions,
  workflowId,
}: {
  workflowId: string;
  executions: ExecutionTableType;
}) {
  const [data, setData] = useState(executions);
  const previousDataRef = useRef(executions);

  const { data: queryData, isFetching } = useQuery({
    queryKey: ["executions", workflowId],
    initialData: executions,
    queryFn: () => getWorkflowExecutions(workflowId),
    refetchInterval: 5000,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (JSON.stringify(queryData) !== JSON.stringify(previousDataRef.current)) {
      setData(queryData);
      previousDataRef.current = queryData;
    }
  }, [queryData]);

  const tableData = data.map((execution) => ({
    id: execution.id,
    workflowId: execution.workflowId,
    name: execution.workflow.name || "",
    status: execution.status,
    trigger:execution.trigger,
    workflowStatus: execution.workflow.status,
    credits: execution.creditsConsumed.toString(),
    startTime: execution.startedAt?.toISOString() || "",
  }));

  return (
    <div className="p-4 m-4">
      <div className="flex items-center justify-between space-y-2 pb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Executions</h2>
          <p className="text-muted-foreground">
            Here&apos;s a list of all the runs for this workflow
          </p>
        </div>
        <div className="flex items-center space-x-2"></div>
      </div>
      <DataTable data={tableData} columns={columns} />
    </div>
  );
}

export default ExecutionTable;