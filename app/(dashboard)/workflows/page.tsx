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
import WorkflowsTable from "./_components/WorkflowsTable";

// Define the type for a workflow object
interface workflow {
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

function WorkflowPage() {
  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center justify-between px-1">
        <div className="space-y-1">
          <p className="text-lg px-0.5 text-muted-foreground">Manage all your workflows</p>
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
  const [workflows, setWorkflows] = useState<workflow[]>([]); // Define type for workflows
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
      <BackgroundLines className="flex items-center justify-center h-[calc(100vh-240px)] w-full">
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
      <div className="flex-none p-1">
        <div className="sm:flex sm:flex-wrap md:grid md:grid-cols-1">
          <WorkflowFeatures />
        </div>
      </div>

      {/* Workflow cards section */}
      <div className="flex-1 min-h-0 overflow-auto">
        <div className="space-y-4">
          <WorkflowsTable workflows={workflows} refresh={handleRefresh}/>
        </div>
      </div>
    </div>
  );
}

export default WorkflowPage;