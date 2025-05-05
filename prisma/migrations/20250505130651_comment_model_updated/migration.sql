/*
  Warnings:

  - You are about to drop the column `IdeaId` on the `comments` table. All the data in the column will be lost.
  - You are about to drop the column `UserId` on the `comments` table. All the data in the column will be lost.
  - You are about to drop the column `commentText` on the `comments` table. All the data in the column will be lost.
  - Added the required column `comment` to the `comments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `idea_id` to the `comments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `comments` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_IdeaId_fkey";

-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_UserId_fkey";

-- AlterTable
ALTER TABLE "comments" DROP COLUMN "IdeaId",
DROP COLUMN "UserId",
DROP COLUMN "commentText",
ADD COLUMN     "comment" TEXT NOT NULL,
ADD COLUMN     "idea_id" TEXT NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_idea_id_fkey" FOREIGN KEY ("idea_id") REFERENCES "ideas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
