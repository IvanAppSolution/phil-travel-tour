-- AlterTable
ALTER TABLE "public"."Travel" ADD COLUMN     "coverImagesUrl" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "noOfTravelDays" TEXT;
