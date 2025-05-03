-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('MEMBERS', 'ADMIN');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'BLOCKED', 'DELETED');

-- CreateEnum
CREATE TYPE "paymentStatus" AS ENUM ('PENDING', 'FAILED', 'PAID');

-- CreateEnum
CREATE TYPE "IdeaStatus" AS ENUM ('UNDER_REVIEW', 'APPROVED', 'REJECT', 'DRAFT');

-- CreateEnum
CREATE TYPE "voteType" AS ENUM ('UP_VOTE', 'DOWN_VOTE');

-- CreateEnum
CREATE TYPE "ideaCategory" AS ENUM ('Energy', 'Waste', 'Transportation');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "profile_image" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "status" "UserStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Idea" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "problem_statement" TEXT NOT NULL,
    "proposed_solution" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "isPaid" BOOLEAN NOT NULL,
    "status" "IdeaStatus" NOT NULL,
    "isPublished" BOOLEAN NOT NULL,
    "category" "ideaCategory" NOT NULL,
    "rejectionFeedback" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Idea_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment" (
    "payment_id" TEXT NOT NULL,
    "UserId" TEXT NOT NULL,
    "IdeaId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "status" "paymentStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_pkey" PRIMARY KEY ("payment_id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "UserId" TEXT NOT NULL,
    "IdeaId" TEXT NOT NULL,
    "parent_id" TEXT,
    "commentText" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vote" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "idea_id" TEXT NOT NULL,
    "vote_type" "voteType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IdeaImages" (
    "id" TEXT NOT NULL,
    "idea_id" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IdeaImages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Idea" ADD CONSTRAINT "Idea_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_IdeaId_fkey" FOREIGN KEY ("IdeaId") REFERENCES "Idea"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_IdeaId_fkey" FOREIGN KEY ("IdeaId") REFERENCES "Idea"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "Comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vote" ADD CONSTRAINT "vote_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vote" ADD CONSTRAINT "vote_idea_id_fkey" FOREIGN KEY ("idea_id") REFERENCES "Idea"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IdeaImages" ADD CONSTRAINT "IdeaImages_idea_id_fkey" FOREIGN KEY ("idea_id") REFERENCES "Idea"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
