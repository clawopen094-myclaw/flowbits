import {z} from "zod"

export const createSystemVariable = z.object({
    name: z.string().max(60),
    value: z.string().max(80),
})

export type createSystemVariableType = z.infer<typeof createSystemVariable>