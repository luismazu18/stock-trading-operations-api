-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_transactions" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "stock_symbol" TEXT NOT NULL,
    "data" JSONB NOT NULL DEFAULT '{}',
    "status" "TransactionStatus" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "user_transactions_user_id_idx" ON "user_transactions"("user_id");

-- CreateIndex
CREATE INDEX "user_transactions_status_idx" ON "user_transactions"("status");

-- CreateIndex
CREATE INDEX "user_transactions_stock_symbol_idx" ON "user_transactions"("stock_symbol");

-- CreateIndex
CREATE INDEX "user_transactions_data_idx" ON "user_transactions" USING GIN ("data");

-- AddForeignKey
ALTER TABLE "user_transactions" ADD CONSTRAINT "user_transactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
