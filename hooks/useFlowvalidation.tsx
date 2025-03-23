import { FlowValidationContext } from "@/components/context/FlowValidationContext";
import { useContext } from "react";

export function useFlowValidation(){
    const contex = useContext(FlowValidationContext);
    if (!contex) {
        throw new Error("useFlowValidation must be used within a FlowValidationContextProvider");
    }
    return contex;
}