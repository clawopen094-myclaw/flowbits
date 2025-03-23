"use client"

import { useEffect, useState, useCallback } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { getUserWorkflows } from "@/actions/workflows/getUserWorkflows";
import { RefreshCcw, Search, Workflow } from "lucide-react";
import CreateWorkflowDialog from "./_components/CreateWorkflowDialog";
import WorkflowCard from "./_components/WorkflowCard";
import WorkflowFeatures from "./_components/workflowFeatures";
import { BackgroundLines } from "@/components/ui/background-lines";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Define the type for a workflow object
interface Workflow {
  id: string;
  name: string;
  userId: string;
  description: string | null;
  defination: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

function WorkflowPage() {
  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Workflows</h1>
          <p className="text-muted-foreground">Manage all your workflows</p>
        </div>
        <CreateWorkflowDialog />
      </div>
      <UserWorkFlows />
    </div>
  );
}

function UserWorkflowSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
    </div>
  );
}

function UserWorkFlows() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]); // Define type for workflows
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // Define type for error
  const [searchQuery, setSearchQuery] = useState("");

  const fetchWorkflows = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getUserWorkflows();
      setWorkflows(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch workflows. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWorkflows();
  }, [fetchWorkflows]);

  const handleRefresh = () => {
    fetchWorkflows();
  };

  const filteredWorkflows = workflows.filter((workflow) =>
    workflow.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <UserWorkflowSkeleton />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4">
        <p className="text-red-500">{error}</p>
        <Button onClick={fetchWorkflows} variant="outline">
          <RefreshCcw className="w-4 h-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  if (workflows.length === 0) {
    return (
      <BackgroundLines className="flex items-center justify-center h-[calc(100vh-240px)]">
        <div className="text-center space-y-4">
          <div className="rounded-full bg-accent w-20 h-20 flex items-center justify-center mx-auto">
            <Workflow size={40} className="stroke-primary" />
          </div>
          <div className="space-y-2">
            <p className="font-semibold">No workflow created yet</p>
            <p className="text-sm text-muted-foreground">
              Click the button below to create your first workflow
            </p>
          </div>
          <CreateWorkflowDialog triggerText="Create your first Workflow" />
        </div>
      </BackgroundLines>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Features section */}
      <div className="flex-none">
        <div className="sm:flex sm:flex-wrap md:grid md:grid-cols-1">
          <WorkflowFeatures />
        </div>
      </div>

      {/* Workflow cards section */}
      <div className="flex-1 min-h-0 overflow-auto pt-5">
        <div className="py-2 flex items-center justify-between">
          <div className="flex items-center w-full max-w-sm space-x-2 rounded-lg border px-3.5 py-2">
            <Search className="h-4 w-4" />
            <Input
              type="search"
              placeholder="Search workflows"
              className="w-full border-0 h-8 font-semibold"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search workflows"
            />
          </div>
          <Button
            className="border-dashed"
            variant="outline"
            onClick={handleRefresh}
            disabled={loading}
          >
            <RefreshCcw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
        <div className="space-y-4 my-5">
          {filteredWorkflows.length > 0 ? (
            filteredWorkflows.map((workflow) => (
              <WorkflowCard refresh={handleRefresh} key={workflow.id} workflow={workflow} />
            ))
          ) : (
            <p className="text-center text-muted-foreground">
              No workflows match your search.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default WorkflowPage;