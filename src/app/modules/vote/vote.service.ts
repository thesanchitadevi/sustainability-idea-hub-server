import prisma from "../../../shared/prisma";
import { IVoteService } from "./vote.interface";

export const handleVoteService = async ({
  userId,
  ideaId,
  voteType,
}: IVoteService) => {
  try {
    const existingVote = await prisma.vote.findFirst({
      where: {
        AND: [
          {
            user_id: userId,
          },
          {
            idea_id: ideaId,
          },
        ],
      },
    });
    if (!existingVote) {
      // If no existing vote, create a new one
      const newVote = await prisma.vote.create({
        data: {
          user_id: userId,
          idea_id: ideaId,
          vote_type: voteType,
        },
      });
      return { message: "Vote added successfully", data: newVote };
    } else {
      // If there's an existing vote, check if it's the same type
      if (existingVote.vote_type === voteType) {
        // If same vote type, delete the vote (toggle off)
        await prisma.vote.delete({
          where: {
            id: existingVote.id,
          },
        });
        return { message: "Vote removed successfully", data: null };
      } else {
        // If different vote type, update the vote
        const updatedVote = await prisma.vote.update({
          where: {
            id: existingVote.id,
          },
          data: {
            vote_type: voteType,
          },
        });
        return { message: "Vote updated successfully", data: updatedVote };
      }
    }
  } catch (error) {
    // Handle error (e.g., log it, rethrow it, etc.)
    throw new Error("Error checking existing vote");
  }
};

export const getVoteService = async (ideaId: string) => {
  try {
    const votes = await prisma.vote.findMany({
      where: {
        idea_id: ideaId,
      },
    });
    if (!votes) {
      return { message: "No vote found", data: null };
    } else {
      return { message: "Vote found", data: votes };
    }
  } catch (error) {
    // Handle error
    throw error;
  }
};
