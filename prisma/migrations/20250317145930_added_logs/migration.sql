-- CreateTable
CREATE TABLE "ExecutionLogs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "logLevel" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "executionPhaseId" TEXT NOT NULL,
    CONSTRAINT "ExecutionLogs_executionPhaseId_fkey" FOREIGN KEY ("executionPhaseId") REFERENCES "executionPhase" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
