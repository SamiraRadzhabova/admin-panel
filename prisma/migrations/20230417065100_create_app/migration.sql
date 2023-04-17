-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'SUB_ADMIN');

-- CreateEnum
CREATE TYPE "PermissionKey" AS ENUM ('WHITE_CAT', 'BLACK_CAT', 'BROWN_CAT', 'ORANGE_CAT', 'GREY_CAT');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "first_name" VARCHAR(50) NOT NULL,
    "last_name" VARCHAR(50) NOT NULL,
    "password" VARCHAR(100),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'SUB_ADMIN',

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_refresh_tokens" (
    "id" SERIAL NOT NULL,
    "expires_at" TIMESTAMP NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "user_refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_access_tokens" (
    "id" SERIAL NOT NULL,
    "expires_at" TIMESTAMP NOT NULL,
    "refresh_token_id" INTEGER NOT NULL,

    CONSTRAINT "user_access_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "password_recovery" (
    "email" VARCHAR(100) NOT NULL,
    "token" VARCHAR(100) NOT NULL,
    "expires_at" TIMESTAMP NOT NULL,

    CONSTRAINT "password_recovery_pkey" PRIMARY KEY ("email")
);

-- CreateTable
CREATE TABLE "permissions" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "key" "PermissionKey" NOT NULL,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_permissions" (
    "user_id" INTEGER NOT NULL,
    "permission_id" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_access_tokens_refresh_token_id_key" ON "user_access_tokens"("refresh_token_id");

-- CreateIndex
CREATE UNIQUE INDEX "password_recovery_email_key" ON "password_recovery"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_permissions_user_id_permission_id_key" ON "user_permissions"("user_id", "permission_id");

-- AddForeignKey
ALTER TABLE "user_refresh_tokens" ADD CONSTRAINT "user_refresh_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_access_tokens" ADD CONSTRAINT "user_access_tokens_refresh_token_id_fkey" FOREIGN KEY ("refresh_token_id") REFERENCES "user_refresh_tokens"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_permissions" ADD CONSTRAINT "user_permissions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_permissions" ADD CONSTRAINT "user_permissions_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
