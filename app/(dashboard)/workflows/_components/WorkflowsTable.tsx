import { useState } from "react";
import { DataTable } from "./workflows/_components/data-table"
import { columns } from "./workflows/_components/columns";

interface workflows{
    id: string;
    userId: string;
    name: string;
    description: string | null;
    defination: string;
    status: string;
    creditsCost: number;
    createdAt: Date;
    updatedAt: Date;
    lastRunAt: Date | null;
}


function WorkflowsTable({ workflows, refresh }: { workflows: workflows[], refresh: () => void }) {
    const tableData = workflows.map((workflow,index) => ({
        index: (index+1).toString(),
        id: workflow.id.toString(),
        name: workflow.name,
        description: workflow.description || "", // Convert null to an empty string
        status: workflow.status,
        updatedAt: workflow.updatedAt?.toISOString() || "", // Ensure it's a Date object
        lastRunAt: workflow.lastRunAt?.toISOString() || "", // Ensure correct Date type
    }));

    return (
        <div className="p-0.5">
            <DataTable data={tableData} columns={columns} refresh={refresh} />
        </div>
    );
}

export default WorkflowsTable;