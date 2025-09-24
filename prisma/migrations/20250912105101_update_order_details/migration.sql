/*
  Warnings:

  - You are about to drop the column `tripId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `orderId` on the `Trip` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Trip" DROP CONSTRAINT "Trip_orderId_fkey";

-- AlterTable
ALTER TABLE "public"."Order" DROP COLUMN "tripId";

-- AlterTable
ALTER TABLE "public"."Trip" DROP COLUMN "orderId";

-- CreateTable
CREATE TABLE "public"."OrderDetail" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "tripId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrderDetail_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."OrderDetail" ADD CONSTRAINT "OrderDetail_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OrderDetail" ADD CONSTRAINT "OrderDetail_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "public"."Trip"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
