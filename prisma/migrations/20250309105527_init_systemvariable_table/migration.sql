/*
  Warnings:

  - A unique constraint covering the columns `[name,value,userId]` on the table `SystemVariables` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "SystemVariables_name_userId_key";

-- CreateIndex
CREATE UNIQUE INDEX "SystemVariables_name_value_userId_key" ON "SystemVariables"("name", "value", "userId");
