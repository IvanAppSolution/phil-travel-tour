/*
  Warnings:

  - You are about to drop the column `endDate` on the `Trip` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `Trip` table. All the data in the column will be lost.
  - You are about to drop the `OrderDetail` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `endDate` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tripId` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."OrderDetail" DROP CONSTRAINT "OrderDetail_orderId_fkey";

-- DropForeignKey
ALTER TABLE "public"."OrderDetail" DROP CONSTRAINT "OrderDetail_tripId_fkey";

-- AlterTable
ALTER TABLE "public"."Location" ADD COLUMN     "description" TEXT,
ADD COLUMN     "imageUrl" TEXT[],
ADD COLUMN     "shortDescription" VARCHAR(255);

-- AlterTable
ALTER TABLE "public"."Order" ADD COLUMN     "endDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "locationId" TEXT[],
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "tripId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Trip" DROP COLUMN "endDate",
DROP COLUMN "startDate",
ADD COLUMN     "shortDescription" VARCHAR(255),
ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "savedBookings" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- DropTable
DROP TABLE "public"."OrderDetail";

-- AddForeignKey
ALTER TABLE "public"."Order" ADD CONSTRAINT "Order_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "public"."Trip"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
