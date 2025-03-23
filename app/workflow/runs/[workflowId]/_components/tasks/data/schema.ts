import { z } from "zod"
import { workflowStatus } from "./data"

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const taskSchema = z.object({
  id: z.string(),
  workflowId: z.string(),
  name: z.string(),
  status: z.string(),
  workflowStatus: z.string(),
  trigger: z.string(),
  credits: z.string(),
  startTime: z.string(),
})

export type Task = z.infer<typeof taskSchema>
