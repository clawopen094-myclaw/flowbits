"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function getWorkflowExecutions(workflowId: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthenticated!");
  }

  return prisma.workflowExecution.findMany({
    where: {
      userId,
      workflowId,
    },
    select: {
      id: true,
      workflowId: true,
      userId: true,
      trigger: true,
      status: true,
      createdAt: true,
      startedAt: true,
      completedAt: true,
      creditsConsumed: true,
      workflow: {
        select: {
          name: true,
          status: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}