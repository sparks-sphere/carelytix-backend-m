/*
  Warnings:

  - Added the required column `category` to the `product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `costPrice` to the `product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gst` to the `product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `noOfUses` to the `product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shelfLifeInDays` to the `product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `triggerNotificationInDays` to the `product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `volume` to the `product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "product" ADD COLUMN     "batchCode" TEXT,
ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "costPrice" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "gst" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "hsn" TEXT,
ADD COLUMN     "noOfUses" INTEGER NOT NULL,
ADD COLUMN     "quantity" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "shelfLifeInDays" INTEGER NOT NULL,
ADD COLUMN     "triggerNotificationInDays" INTEGER NOT NULL,
ADD COLUMN     "volume" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "stock_update" (
    "id" TEXT NOT NULL,
    "dateOfPurchase" TIMESTAMP(3) NOT NULL,
    "productId" TEXT NOT NULL,
    "volume" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "costPrice" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stock_update_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bill" (
    "id" TEXT NOT NULL,
    "bill_number" TEXT NOT NULL,
    "customer_name" TEXT,
    "customer_phone" TEXT,
    "customer_email" TEXT,
    "subtotal" DOUBLE PRECISION NOT NULL,
    "gst_amount" DOUBLE PRECISION NOT NULL,
    "discount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "total_amount" DOUBLE PRECISION NOT NULL,
    "payment_method" TEXT NOT NULL,
    "payment_status" TEXT NOT NULL DEFAULT 'PENDING',
    "bill_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bill_item" (
    "id" TEXT NOT NULL,
    "bill_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "volume" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "gst" DOUBLE PRECISION NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bill_item_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "bill_bill_number_key" ON "bill"("bill_number");

-- AddForeignKey
ALTER TABLE "stock_update" ADD CONSTRAINT "stock_update_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bill_item" ADD CONSTRAINT "bill_item_bill_id_fkey" FOREIGN KEY ("bill_id") REFERENCES "bill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bill_item" ADD CONSTRAINT "bill_item_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
