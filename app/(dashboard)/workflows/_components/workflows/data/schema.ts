import { z } from "zod"

export const taskSchema = z.object({
  index: z.string(),
  id: z.string(),
  name: z.string(),
  description: z.string(),
  status: z.string(),
  updatedAt: z.string(),
  lastRunAt: z.string()
})

export type Task = z.infer<typeof taskSchema>



