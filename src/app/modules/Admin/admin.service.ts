

import prisma from "../../../shared/prisma";


const rejectionIdea = async (id:string, payload: {rejectionFeedback: string}) => {
  const isIdeaExists = await prisma.idea.findUniqueOrThrow({
    where: {
      id
    }
  });
  const res = await prisma.idea.update({
    where: {
      id:isIdeaExists.id
    },
    data: {
      rejectionFeedback: payload.rejectionFeedback
    }
  })
  return res;
};

export const AdminServices = {rejectionIdea};
