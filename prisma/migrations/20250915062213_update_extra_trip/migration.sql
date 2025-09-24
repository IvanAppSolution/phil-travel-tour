/*
  Warnings:

  - You are about to drop the column `noOfTripDays` on the `Trip` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Trip" DROP COLUMN "noOfTripDays",
ADD COLUMN     "noOfTravelDays" INTEGER,
ADD COLUMN     "pricePerPerson" DOUBLE PRECISION;
