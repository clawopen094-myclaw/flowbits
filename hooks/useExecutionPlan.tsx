import { FlowToExecutionPlan, FlowToExecutionPlanValidationErrors } from "@/lib/workflow/executionPlan";
import { AppNode } from "@/types/appNode";
import { useReactFlow } from "@xyflow/react";
import { useCallback } from "react";
import { useFlowValidation } from "./useFlowvalidation";
import { toast } from "sonner";

const useExecutionPlan = () => {

    const {toObject} = useReactFlow();
    const { setInvalidInputs, clearErrors } = useFlowValidation();

    const handleErrors = useCallback((error: any)=>{
        switch (error.type) {
            case FlowToExecutionPlanValidationErrors.NO_ENTRYPOINT:
                toast.error("No starting point found");
                break;
            case FlowToExecutionPlanValidationErrors.INVALID_INPUTS:
                toast.error("All input values are not provided");
                setInvalidInputs(error.invalidElements);
                break;
            case FlowToExecutionPlanValidationErrors.ENRYPOINT_NOT_CONNECTED:
                toast.error("Starting point not connected");
                setInvalidInputs(error.invalidElements);
                break;
            case FlowToExecutionPlanValidationErrors.MULTIPLE_ENTRYPOINTS:
                toast.error("Multiple starting point found");
                setInvalidInputs(error.invalidElements);
                break;
            default:
                toast.error("Something went wrong!");
                break;
        }
    },[])

    const gengerateExecutionPlan = useCallback(()=>{
        const {nodes,edges} = toObject();
        const { executionPlan, error } = FlowToExecutionPlan(nodes as AppNode[],edges);
        if (error){
            handleErrors(error);
            return null;
        }
        clearErrors();
        return executionPlan;

    },[toObject,handleErrors,clearErrors])

    return gengerateExecutionPlan;
};

export default useExecutionPlan;

