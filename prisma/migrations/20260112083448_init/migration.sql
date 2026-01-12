-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "contact_name" TEXT,
    "contact_email" TEXT,
    "company_name" TEXT,
    "website_url" TEXT,
    "address" TEXT,
    "contact_phone" TEXT,
    "image" TEXT,
    "raw_materials" TEXT,
    "rating" INTEGER NOT NULL DEFAULT 0,
    "is_premium" BOOLEAN NOT NULL DEFAULT false,
    "subscription_type" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "consumer_id" TEXT NOT NULL,
    "manufacturer_id" TEXT NOT NULL,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "partnerships" (
    "id" TEXT NOT NULL,
    "partner_company_name" TEXT NOT NULL,
    "partner_benefits" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "manufacturer_id" TEXT NOT NULL,

    CONSTRAINT "partnerships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "support" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "support_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "meeting_locations" (
    "id" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "manufacturer_id" TEXT NOT NULL,

    CONSTRAINT "meeting_locations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_consumer_id_fkey" FOREIGN KEY ("consumer_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_manufacturer_id_fkey" FOREIGN KEY ("manufacturer_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partnerships" ADD CONSTRAINT "partnerships_manufacturer_id_fkey" FOREIGN KEY ("manufacturer_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meeting_locations" ADD CONSTRAINT "meeting_locations_manufacturer_id_fkey" FOREIGN KEY ("manufacturer_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
