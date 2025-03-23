import { TaskParamType, TaskParams } from '@/types/type'
import React, { useCallback } from 'react'
import StringParam from './params/StringParam'
import { useReactFlow } from '@xyflow/react'
import { AppNode } from '@/types/appNode';
import ComboBoxParam from './params/ComboboxParam';
import TemperatureParam from './params/TemperatureParam';
import VariableInputParam from './params/VariableInputParam';
import ToogleParam from './params/ToogleParam';

function NodeParamField({param,nodeId,disabled,type}:{param:TaskParams, nodeId: string,disabled:boolean, type:string}) {

    const {updateNodeData,getNode} = useReactFlow();
    const node = getNode(nodeId) as AppNode;
    const value = node?.data.inputs?.[param.name];
    const updateNodeParamValue = useCallback((newValue:string)=>{
        updateNodeData(nodeId,{
            inputs:{
                ...node?.data.inputs,
                [param.name]:newValue,
            }
        })
    },[nodeId,updateNodeData,param.name,node?.data.inputs])

    switch(param.type){
        case TaskParamType.STRING: return (
            <StringParam disabled={disabled} param={param} value={value} updateNodeParamValue={updateNodeParamValue}/>
        )
        case TaskParamType.COMBO_BOX: return (
            <ComboBoxParam param={param} value={value} type={type} updateNodeParamValue={updateNodeParamValue}/>
        )
        case TaskParamType.RANGE_SLIDER: return (
            <TemperatureParam param={param} value={value} updateNodeParamValue={updateNodeParamValue} />
        )
        case TaskParamType.VARIABLE_INPUT: return (
            <VariableInputParam param={param} value={value} updateNodeParamValue={updateNodeParamValue}/>
        )
        case TaskParamType.TOOGLE_INPUT: return (
            <ToogleParam param={param} value={value} updateNodeParamValue={updateNodeParamValue}/>
        )
        default: return (
            <div className='w-full'>
                <p className='text-xs text-muted-foreground'>Not Implemented</p>
            </div>
        )
    }
}

export default NodeParamField