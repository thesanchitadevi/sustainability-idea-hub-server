import {
  Idea,
  IdeaCategory,
  IdeaStatus,
  Prisma,
  UserRole,
} from "@prisma/client";
import { fileUploader } from "../../../helpers/fileUploader";
import prisma from "../../../shared/prisma";
import { IFile } from "../../interfaces/file";
import { IPaginationOptions } from "../../interfaces/pagination";
import { paginationHelper } from "../../../helpers/paginationHelper";
import { IIdeaFilters } from "./idea.interface";
import { AppError } from "../../errors/AppError";
import httpStatus from "http-status";

// Create a new idea with image uploads
const createIdea = async (userId: string, payload: any, files: IFile[]) => {
  // Upload images to Cloudinary
  const uploadedImages = await Promise.all(
    files.map(async (file) => {
      const cloudinaryResponse = await fileUploader.uploadToCloudinary(file);
      return {
        imageUrl: cloudinaryResponse?.secure_url,
      };
    })
  );

  // Create the idea with associated images
  const result = await prisma.idea.create({
    data: {
      title: payload.title,
      problem_statement: payload.problemStatement,
      proposed_solution: payload.proposedSolution,
      description: payload.description,
      isPaid: payload.isPaid === "true",
      status: "DRAFT",
      isPublished: false,
      category: payload.category,
      images: {
        createMany: {
          data: uploadedImages,
        },
      },
      user: {
        connect: {
          id: userId,
        },
      },
    },
    include: {
      images: true,
      user: {
        // Include basic user info
        select: {
          id: true,
          name: true,
          email: true,
          profile_image: true,
        },
      },
    },
  });

  return result;
};

// Get all ideas with pagination and filtering
const getAllIdeas = async (
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

// Get a single idea by ID with role-based access control
const getIdeaById = async (
  id: string,
  userRole: UserRole,
  userId?: string
): Promise<Idea | null> => {
  // Base query to fetch the idea with related data
  const baseQuery: Prisma.IdeaFindUniqueArgs = {
    where: { id },
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
  };

  // Fetch the idea
  const result = await prisma.idea.findUnique(baseQuery);

  // If idea doesn't exist, return null
  if (!result) {
    return null;
  }

  // Apply role-based access control
  if (userRole === UserRole.ADMIN) {
    // Admins can see all ideas with all fields
    return result;
  } else if (userRole === UserRole.MEMBERS) {
    // Members can see:
    // - All their own ideas (both published and unpublished)
    // - Only published ideas from others
    if (result.user_id === userId || result.isPublished) {
      return result;
    }
    // Return null for unpublished ideas that don't belong to the user
    // return null;
  }
  return result;
};

// Update an idea
const updateIdea = async (
  id: string,
  payload: {
    title?: string;
    problem_statement?: string;
    proposed_solution?: string;
    description?: string;
  },
  userRole: UserRole,
  userId?: string
): Promise<Idea> => {
  // Check if the idea exists
  const existingIdea = await prisma.idea.findUnique({
    where: { id },
  });

  if (!existingIdea) {
    throw new AppError(httpStatus.NOT_FOUND, "Idea not found");
  }

  // Check if the idea is published (prevent updates if published)
  if (existingIdea.isPublished) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Only unpublished ideas can be updated"
    );
  }

  // Update only allowed fields
  return await prisma.idea.update({
    where: { id },
    data: {
      title: payload.title,
      problem_statement: payload.problem_statement,
      proposed_solution: payload.proposed_solution,
      description: payload.description,
      updatedAt: new Date(), // Auto-update timestamp
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
};

// Delete an idea
const deleteIdea = async (
  id: string,
  userRole: UserRole,
  userId?: string
): Promise<void> => {
  // Check if the idea exists
  const existingIdea = await prisma.idea.findUnique({
    where: { id },
  });

  if (!existingIdea) {
    throw new AppError(httpStatus.NOT_FOUND, "Idea not found");
  }

  //  Check if idea is published (prevent deletion if published)
  if (existingIdea.isPublished) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Only unpublished ideas can be deleted"
    );
  }

  // Check if the user is the owner or an admin. Admin can delete any idea.
  if (userRole !== UserRole.ADMIN && existingIdea.user_id !== userId) {
    throw new AppError(httpStatus.FORBIDDEN, "Not your idea to delete");
  }

  await prisma.$transaction([
    // Delete associated images first
    prisma.ideaImages.deleteMany({
      where: { idea_id: id },
    }),
    // Then delete the idea
    prisma.idea.delete({
      where: { id },
    }),
  ]);
};

// Update idea status by admin
const updateIdeaStatusByAdmin = async (
  id: string,
  statusData: { status: IdeaStatus; rejectionFeedback?: string },
  userRole: UserRole
): Promise<Idea> => {
  // Verify admin privileges
  if (userRole !== UserRole.ADMIN) {
    throw new AppError(httpStatus.FORBIDDEN, "Admin access required");
  }

  const existingIdea = await prisma.idea.findUnique({ where: { id } });
  if (!existingIdea) {
    throw new AppError(httpStatus.NOT_FOUND, "Idea not found");
  }

  return await prisma.idea.update({
    where: { id },
    data: {
      status: statusData.status,
      isPublished: statusData.status === IdeaStatus.APPROVED,
      rejectionFeedback:
        statusData.status === IdeaStatus.REJECT
          ? statusData.rejectionFeedback || "No feedback provided"
          : null,
    },
    include: {
      images: true,
      user: { select: { id: true, name: true, email: true } },
    },
  });
};

// Submit an idea for review
const submitIdeaForReview = async (
  id: string,
  userId: string
): Promise<Idea> => {
  const existingIdea = await prisma.idea.findUnique({ where: { id } });

  if (!existingIdea) {
    throw new AppError(httpStatus.NOT_FOUND, "Idea not found");
  }

  // Verify ownership
  if (existingIdea.user_id !== userId) {
    throw new AppError(httpStatus.FORBIDDEN, "Not your idea to submit");
  }

  // Prevent resubmission if already under review/approved
  if (existingIdea.status !== "DRAFT") {
    throw new AppError(
      httpStatus.CONFLICT,
      `Idea is already ${existingIdea.status.toLowerCase()}`
    );
  }

  return await prisma.idea.update({
    where: { id },
    data: {
      status: "UNDER_REVIEW",
      isPublished: false,
    },
    include: {
      user: { select: { id: true, name: true, email: true } },
    },
  });
};

export const IdeaServices = {
  createIdea,
  getAllIdeas,
  getIdeaById,
  updateIdea,
  deleteIdea,
  updateIdeaStatusByAdmin,
  submitIdeaForReview,
};
