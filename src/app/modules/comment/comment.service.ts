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
export const getCommentService = async (ideaId: string) => {
  try {
    const result = await prisma.comment.findMany({
      where: {
        AND: [
          {
            idea_id: ideaId,
          },
          {
            parent_id: null,
          },
        ],
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profile_image: true,
            role: true,
          },
        },
        replies: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                profile_image: true,
                role: true,
              },
            },
          },
        },
      },
    });
    return result;
  } catch (error) {
    throw error;
  }
};

// delete a comment
export const deleteCommentService = async (commentId: string) => {
  try {
    // Use a transaction to ensure both operations complete or neither does
    const result = await prisma.$transaction(async (tx) => {
      // First, delete all child comments that have this comment as parent
      await tx.comment.deleteMany({
        where: {
          parent_id: commentId,
        },
      });

      // Then delete the comment itself
      return tx.comment.delete({
        where: {
          id: commentId,
        },
      });
    });
    return result;
  } catch (error) {
    throw error;
  }
};
