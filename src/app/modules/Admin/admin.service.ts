

import { IdeaCategory, IdeaStatus, Prisma } from "../../../../generated/prisma";
import { paginationHelper } from "../../../helpers/paginationHelper";
import prisma from "../../../shared/prisma";
import { IPaginationOptions } from "../../interfaces/pagination";
import { IIdeaFilters } from "../Idea/idea.interface";


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

// Get all ideas with pagination and filtering
const getAllIdeasForAdmin = async (
  filters: IIdeaFilters,
  paginationOptions: IPaginationOptions
) => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(paginationOptions);

  const { searchTerm, category, isPaid, ...filterData } = filters;

  const andConditions: Prisma.IdeaWhereInput[] = [];

  // Search term filtering
  if (searchTerm) {
    andConditions.push({
      OR: [
        {
          title: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
        {
          problem_statement: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
        {
          proposed_solution: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
      ],
    });
  }

  // Category filtering
  if (category) {
    andConditions.push({
      category: {
        equals: category as IdeaCategory,
      },
    });
  }

  // IsPaid filtering
  if (isPaid !== undefined) {
    andConditions.push({
      isPaid: isPaid === "true" || isPaid === true,
    });
  }

  // Filter by status, isPublished, etc.
  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.entries(filterData).map(([field, value]) => ({
        [field]: { equals: value },
      })),
    });
  }

  // Explicit status filtering (UNDER_REVIEW, APPROVED, REJECTED)
  const allowedStatuses: IdeaStatus[] = ["UNDER_REVIEW", "APPROVED", "REJECT"];
  andConditions.push({
    status: {
      in: allowedStatuses,
    },
  });

  const whereConditions: Prisma.IdeaWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.idea.findMany({
    where: whereConditions,
    include: {
      images: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          profile_image: true,
        },
      },
    },
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const total = await prisma.idea.count({
    where: whereConditions,
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};


export const AdminServices = {rejectionIdea, getAllIdeasForAdmin};
