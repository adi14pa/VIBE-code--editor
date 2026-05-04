-- CreateEnum
CREATE TYPE "Templates" AS ENUM ('REACT', 'NEXTJS', 'EXPRESS', 'VUE', 'HONO', 'ANGULAR');

-- CreateTable
CREATE TABLE "Playground" (
    "_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "template" "Templates" NOT NULL DEFAULT 'REACT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Playground_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "StarMark" (
    "_id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "playgroundId" TEXT NOT NULL,
    "isMarked" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StarMark_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "TemplateFile" (
    "_id" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "playgroundId" TEXT NOT NULL,

    CONSTRAINT "TemplateFile_pkey" PRIMARY KEY ("_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StarMark_userId_playgroundId_key" ON "StarMark"("userId", "playgroundId");

-- CreateIndex
CREATE UNIQUE INDEX "TemplateFile_playgroundId_key" ON "TemplateFile"("playgroundId");

-- AddForeignKey
ALTER TABLE "Playground" ADD CONSTRAINT "Playground_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StarMark" ADD CONSTRAINT "StarMark_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StarMark" ADD CONSTRAINT "StarMark_playgroundId_fkey" FOREIGN KEY ("playgroundId") REFERENCES "Playground"("_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemplateFile" ADD CONSTRAINT "TemplateFile_playgroundId_fkey" FOREIGN KEY ("playgroundId") REFERENCES "Playground"("_id") ON DELETE CASCADE ON UPDATE CASCADE;
