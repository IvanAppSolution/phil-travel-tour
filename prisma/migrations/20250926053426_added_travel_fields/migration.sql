-- AlterTable
ALTER TABLE "public"."Travel" ADD COLUMN     "amenities" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "bookingNote" TEXT,
ADD COLUMN     "discountDescription" VARCHAR(255),
ADD COLUMN     "discountPercent" INTEGER,
ADD COLUMN     "discountPrice" DOUBLE PRECISION,
ADD COLUMN     "isFeatured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isPublished" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "priceDescription" VARCHAR(255);
