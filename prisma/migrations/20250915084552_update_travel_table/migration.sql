/*
  Warnings:

  - You are about to drop the column `createdById` on the `Trip` table. All the data in the column will be lost.
  - You are about to drop the column `noOfTravelDays` on the `Trip` table. All the data in the column will be lost.
  - You are about to drop the column `pricePerPerson` on the `Trip` table. All the data in the column will be lost.
  - Added the required column `createdById` to the `Travel` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Trip" DROP CONSTRAINT "Trip_createdById_fkey";

-- AlterTable
ALTER TABLE "public"."Travel" ADD COLUMN     "createdById" TEXT NOT NULL,
ADD COLUMN     "noOfTravelDays" TEXT,
ADD COLUMN     "pricePerPerson" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "public"."Trip" DROP COLUMN "createdById",
DROP COLUMN "noOfTravelDays",
DROP COLUMN "pricePerPerson";

-- AddForeignKey
ALTER TABLE "public"."Travel" ADD CONSTRAINT "Travel_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
