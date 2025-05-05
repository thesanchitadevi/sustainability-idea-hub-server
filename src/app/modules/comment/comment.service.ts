import prisma from "../../../shared/prisma";

export const createCommentService = async ({
  userId,
  ideaId,
  parentId,
  comment,
}: ICommentParams) => {
  try {
    const result = await prisma.comment.create({
      data: {
        user_id: userId,
        idea_id: ideaId,
        parent_id: parentId,
        comment: comment,
      },
    });
    return result;
  } catch (error) {
    throw error;
  }
};
