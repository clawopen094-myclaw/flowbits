import { DataTable } from "./workflows/_components/data-table"
import { columns } from "./workflows/_components/columns";

interface workflows {
    id: string;
    userId: string;
    name: string;
    description: string | null;
    defination: string;
    status: string;
    creditsCost: number;
    cron: string | null;
    createdAt: Date;
    updatedAt: Date;
    lastRunAt: Date | null;
  }

function WorkflowsTable({ workflows, refresh }: { workflows: workflows[], refresh: () => void }) {
    const tableData = workflows.map((workflow,index) => ({
        index: (index+1).toString(),
        id: workflow.id.toString(),
        name: workflow.name,
        description: workflow.description || "",
        status: workflow.status,
        updatedAt: workflow.updatedAt?.toISOString() || "",
        lastRunAt: workflow.lastRunAt?.toISOString() || "",
        creditsCost: workflow.creditsCost,
        cron: workflow.cron || "",
    }));

    return (
        <div className="p-1">
            <DataTable data={tableData} columns={columns(refresh)} refresh={refresh} />
        </div>
    );
}

export default WorkflowsTable;