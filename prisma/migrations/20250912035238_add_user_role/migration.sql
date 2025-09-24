/*
  Warnings:

  - Added the required column `createdById` to the `Trip` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Trip" ADD COLUMN     "createdById" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'user';

-- AddForeignKey
ALTER TABLE "public"."Trip" ADD CONSTRAINT "Trip_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
