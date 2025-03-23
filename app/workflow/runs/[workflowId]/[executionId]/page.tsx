import { GetWorkflowExecutionWithPhase } from "@/actions/workflows/GetWorkflowExecutionWithPhase"
import Loading from "@/app/workflow/_components/Loading"
import { auth } from "@clerk/nextjs/server"
import { Suspense } from "react"
import ExecutionViewer from "./_components/ExecutionViewer"

function ExecutionViewerPage({params}:{params:{executionId:string,workflowId:string}}) {
  return (
    <div className="flex flex-col h-[calc(100vh-53px)] w-full overflow-hidden">
    <section className="flex h-full overflow-auto">
        <Suspense fallback={<Loading/>}>
            <ExecutionViewerWrapper executionId={params.executionId} workflowId={params.workflowId}/>
        </Suspense>
    </section>
    </div>
  )
}

export default ExecutionViewerPage


async function ExecutionViewerWrapper({executionId,workflowId}:{executionId:string,workflowId:string}) {

    const {userId} = await auth();
    if (!userId){
        return <div>Unauthenticated</div>
    }

    const workflowexecution = await GetWorkflowExecutionWithPhase(executionId);
    if (!workflowexecution) return <div>not found</div>;

    return <ExecutionViewer initialData={workflowexecution}/>
}