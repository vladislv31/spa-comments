-- CreateTable
CREATE TABLE "Comment" (
    "id" SERIAL NOT NULL,
    "homePage" TEXT NOT NULL,
    "body" TEXT NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);
