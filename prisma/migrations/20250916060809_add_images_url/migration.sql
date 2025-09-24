/*
  Warnings:

  - You are about to drop the column `noOfTravelDays` on the `Travel` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Travel" DROP COLUMN "noOfTravelDays",
ADD COLUMN     "imagesUrl" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "public"."Trip" ADD COLUMN     "imagesUrl" TEXT[] DEFAULT ARRAY[]::TEXT[];
