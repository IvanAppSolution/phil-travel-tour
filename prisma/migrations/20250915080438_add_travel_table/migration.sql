/*
  Warnings:

  - You are about to drop the column `locationId` on the `Order` table. All the data in the column will be lost.
  - The `tripId` column on the `Order` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `travelId` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `travelId` to the `Trip` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Order" DROP CONSTRAINT "Order_tripId_fkey";

-- AlterTable
ALTER TABLE "public"."Order" DROP COLUMN "locationId",
ADD COLUMN     "travelId" TEXT NOT NULL,
DROP COLUMN "tripId",
ADD COLUMN     "tripId" TEXT[];

-- AlterTable
ALTER TABLE "public"."Trip" ADD COLUMN     "travelId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "public"."Travel" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subTitle" VARCHAR(255),
    "description" TEXT,
    "shortDescription" VARCHAR(255),
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Travel_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Order" ADD CONSTRAINT "Order_travelId_fkey" FOREIGN KEY ("travelId") REFERENCES "public"."Travel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Trip" ADD CONSTRAINT "Trip_travelId_fkey" FOREIGN KEY ("travelId") REFERENCES "public"."Travel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
