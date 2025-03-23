import { getWorkflowExecutions } from "@/actions/workflows/getWorkflowExecutions";

export enum TaskType {
    LAUNCH_BROWSER = "LAUNCH_BROWSER",
    INPUT= "INPUT",
    GOOGLE_GENERATIVE_AI = "GOOGLE_GENERATIVE_AI",
    OpenAI = "OpenAI"
}


export enum TaskParamType {
    STRING = "STRING",
    COMBO_BOX = "COMBO_BOX",
    RANGE_SLIDER = "SLIDER",
    TOOLS = "TOOLS",
    VARIABLE_INPUT = "VARIABLE_INPUT",
    TOOGLE_INPUT = "TOOGLE_INPUT"

}

export interface TaskParams {
    name: string,
    type: TaskParamType,
    helperText?: string,
    required: boolean,
    hideHandel: boolean,
    [key :string]:any,

}

export interface TaskoutputParam { 
    name: string,
    type: TaskParamType.STRING
}

export interface ParamProps {
    param: TaskParams,
    value: string,
    updateNodeParamValue: (newValue: string) => void,
    disabled?: boolean
}


export enum GeminiModels {
    GEMINI_1_5_FLASH = "gemini-1.5-flash",
    GEMINI_1_5_FLASH_8B = "gemini-1.5-flash-8b",
    GEMINI_1_5_PRO = "gemini-1.5-pro",
    GEMINI_2_FLASH =  "gemini-2.0-flash",
    GEMINI_2_FLASH_EXP =  "gemini-2.0-flash-exp",
    GEMINI_2_FLASH_LITE =  "gemini-2.0-flash-lite-preview-02-05",
    GEMINI_2_PRO_EXP =  "gemini-2.0-pro-exp-02-05",
    GEMINI_2_FLASH_THINK_EXP =  "gemini-2.0-flash-thinking-exp-01-21",
    LEARNLM_1_5_PRO_EXP = "learnlm-1.5-pro-experimental"
  }


export enum OpenAIModels {
    GPT_2 = "gpt-2",
    GPT_3 = "gpt-3",
    GPT_4 = "gpt-4",
    GPT_4O = "gpt-4o",
    GPT_4O_MINI = "gpt-4o-mini",
    O1 = "o1",
    O1_PREVIEW = "o1-preview",
    O1_MINI = "o1-mini",
    DALL_E = "dall-e",
    DALL_E_2 = "dall-e-2",
    DALL_E_3 = "dall-e-3",
    SORA = "sora",
    WHISPER = "whisper",
  }

// Format Gemini model keys (e.g., GEMINI_1_5_FLASH → "Gemini 1.5 Flash")
export const formatGeminiLabel = (key: string) => {
    return key
        .replace(/(\d+)_(\d+)/g, '$1.$2') // Convert 1_5 to 1.5
        .replace(/_/g, ' ')
        .replace(/\bGEMINI\b/g, 'Gemini')
        .replace(/\bFLASH\b/g, 'Flash')
        .replace(/\bPRO\b/g, 'Pro')
        .replace(/\bEXP\b/g, 'Exp')
        .replace(/\bTHINK\b/g, 'Think')
        .replace(/\bLEARNLM\b/g, 'LearnLM')
        .trim();
};

// Format OpenAI model values (e.g., "gpt-4o" → "GPT-4o")
export const formatOpenAILabel = (value: string) => {
    return value
        .split('-')
        .map((part, index) => {
            if (index === 0) return part.toUpperCase(); // GPT, DALL, etc.
            if (part === 'e') return 'E'; // Handle DALL-E
            return part;
        })
        .join('-')
        .replace(/-(\d+)/g, ' $1'); // Replace hyphens before numbers with space
};


export type ExecutionTableType = Awaited<ReturnType<typeof getWorkflowExecutions>>;