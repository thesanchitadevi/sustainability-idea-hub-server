import { Prisma, UserStatus } from "@prisma/client";
import { adminSearchAbleFields } from "./admin.contant";
import { paginationHelper } from "../../../helpers/paginationHelper";
import prisma from "../../../shared/prisma";
import { IAdminFilterRequest } from "./admin.interface";
import { IPaginationOptions } from "../../interfaces/pagination";

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
