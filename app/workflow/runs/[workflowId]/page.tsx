import NavigationTabs from "../../_components/NavigationTabs";
import { getWorkflowExecutions } from "@/actions/workflows/getWorkflowExecutions";
import { BackgroundLines } from "@/components/ui/background-lines";
import { Inbox } from "lucide-react";
import ExecutionTable from "./_components/ExecutionTable";
import { Suspense } from "react";
import Loading from "../../editor/[workflowId]/loading";

async function page({ params }: { params: { workflowId: string } }) {
  const executions = await getWorkflowExecutions(params.workflowId);

  if (!executions) {
    return <div>No data found</div>;
  }

  if (executions.length === 0) {
    return (
      <>
      <NavigationTabs workflowId={params.workflowId} />
      <BackgroundLines className="flex items-center justify-center h-[calc(100vh-67px)]">
        <div className="text-center space-y-4">
          <div className="rounded-full bg-accent w-20 h-20 flex items-center justify-center mx-auto">
            <Inbox size={40} className="stroke-primary" />
          </div>
          <div className="space-y-2">
            <p className="font-semibold">No runs have been triggered for this workflow</p>
            <p className="text-sm text-muted-foreground">
              You can trigger a new run in the editor page
            </p>
          </div>
        </div>
      </BackgroundLines>``
      </>
    );
  }

  return (
    <main className="min-h-[calc(100vh-67px)] w-full">
      <Suspense fallback={<Loading/>}>
      <NavigationTabs workflowId={params.workflowId} />
      <ExecutionTable workflowId={params.workflowId} executions={executions} />
      </Suspense>
    </main>
  );
}

export default page;