-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "hashedPassword" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserArticle" (
    "userId" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,

    CONSTRAINT "UserArticle_pkey" PRIMARY KEY ("userId","articleId")
);

-- CreateTable
CREATE TABLE "ArticleHead" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "siteTitle" TEXT NOT NULL,
    "siteUrl" TEXT NOT NULL,

    CONSTRAINT "ArticleHead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArticleBody" (
    "articleId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "abstractText" TEXT NOT NULL,

    CONSTRAINT "ArticleBody_pkey" PRIMARY KEY ("articleId")
);

-- AddForeignKey
ALTER TABLE "UserArticle" ADD CONSTRAINT "UserArticle_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserArticle" ADD CONSTRAINT "UserArticle_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "ArticleHead"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleBody" ADD CONSTRAINT "ArticleBody_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "ArticleHead"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
