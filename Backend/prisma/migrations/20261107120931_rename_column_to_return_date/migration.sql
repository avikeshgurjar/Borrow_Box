/*
  Warnings:

  - You are about to drop the column `ReturnDate` on the `BorrowingItem` table. All the data in the column will be lost.
  - You are about to drop the column `pickupLocation` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BorrowingItem" DROP COLUMN "ReturnDate",
ADD COLUMN     "returnDate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "pickupLocation";
