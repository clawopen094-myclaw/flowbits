"use server";

import { promises as fs } from "fs";
import path from "path"
import { z } from "zod"
import { taskSchema } from "@/app/workflow/runs/[workflowId]/_components/tasks/data/schema"



async function getTasks() {
    
  const data = await fs.readFile(
    path.join(process.cwd(), "app/workflow/runs/[workflowId]/_components/tasks/data/tasks.json")
  )

  const tasks = JSON.parse(data.toString())

  return z.array(taskSchema).parse(tasks)
}

export default getTasks