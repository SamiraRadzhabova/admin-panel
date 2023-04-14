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

-- CreateIndex
CREATE UNIQUE INDEX "user_access_tokens_refresh_token_id_key" ON "user_access_tokens"("refresh_token_id");

-- AddForeignKey
ALTER TABLE "user_refresh_tokens" ADD CONSTRAINT "user_refresh_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_access_tokens" ADD CONSTRAINT "user_access_tokens_refresh_token_id_fkey" FOREIGN KEY ("refresh_token_id") REFERENCES "user_refresh_tokens"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "password_recovery" (
    "email" VARCHAR(100) NOT NULL,
    "token" VARCHAR(100) NOT NULL,
    "expires_at" TIMESTAMP NOT NULL,

    CONSTRAINT "password_recovery_pkey" PRIMARY KEY ("email")
);

-- CreateIndex
CREATE UNIQUE INDEX "password_recovery_email_key" ON "password_recovery"("email");
