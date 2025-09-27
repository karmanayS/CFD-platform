-- CreateTable
CREATE TABLE "public"."OpenOrders" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "asset" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "qty" DOUBLE PRECISION NOT NULL,
    "leverage" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "margin" DOUBLE PRECISION NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OpenOrders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Balances" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "margin" DOUBLE PRECISION NOT NULL,
    "locked" DOUBLE PRECISION NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Balances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Snapshots" (
    "id" SERIAL NOT NULL,
    "at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Balances_userId_key" ON "public"."Balances"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Snapshots_at_key" ON "public"."Snapshots"("at");

-- AddForeignKey
ALTER TABLE "public"."OpenOrders" ADD CONSTRAINT "OpenOrders_timestamp_fkey" FOREIGN KEY ("timestamp") REFERENCES "public"."Snapshots"("at") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Balances" ADD CONSTRAINT "Balances_timestamp_fkey" FOREIGN KEY ("timestamp") REFERENCES "public"."Snapshots"("at") ON DELETE CASCADE ON UPDATE CASCADE;
