/*
  Warnings:

  - You are about to drop the column `platfrom` on the `Credentials` table. All the data in the column will be lost.
  - Added the required column `platform` to the `Credentials` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Credentials" DROP COLUMN "platfrom",
ADD COLUMN     "platform" "public"."Platform" NOT NULL;
