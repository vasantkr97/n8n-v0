/*
  Warnings:

  - You are about to drop the column `webhookId` on the `Workflow` table. All the data in the column will be lost.
  - You are about to drop the `Node` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Webhook` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `connections` to the `Workflow` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nodes` to the `Workflow` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Node" DROP CONSTRAINT "Node_workflowId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Workflow" DROP CONSTRAINT "Workflow_webhookId_fkey";

-- DropIndex
DROP INDEX "public"."Workflow_webhookId_key";

-- AlterTable
ALTER TABLE "public"."Execution" ADD COLUMN     "finishedAt" TIMESTAMP(3),
ADD COLUMN     "results" JSONB,
ADD COLUMN     "startedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "public"."Workflow" DROP COLUMN "webhookId",
ADD COLUMN     "connections" JSONB NOT NULL,
ADD COLUMN     "nodes" JSONB NOT NULL;

-- DropTable
DROP TABLE "public"."Node";

-- DropTable
DROP TABLE "public"."Webhook";
