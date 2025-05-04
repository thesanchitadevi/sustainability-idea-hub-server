import { Idea, IdeaCategory, Prisma, UserRole } from "@prisma/client";
import { fileUploader } from "../../../helpers/fileUploader";
import prisma from "../../../shared/prisma";
import { IFile } from "../../interfaces/file";
import { IPaginationOptions } from "../../interfaces/pagination";
import { paginationHelper } from "../../../helpers/paginationHelper";
import { IIdeaFilters, IUpdateIdeaStatus } from "./idea.interface";
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
  // console.log(result, "result");

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

  // Check if the user is authorized to delete the idea
  if (userRole !== UserRole.ADMIN && existingIdea.user_id !== userId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Not authorized to delete this idea"
    );
  }

  // Delete associated images from Cloudinary
  await prisma.ideaImages.deleteMany({
    where: { idea_id: id },
  });

  // Delete the idea from the database
  await prisma.idea.delete({
    where: { id },
  });
};

// Update Status of an idea
const updateIdeaStatus = async (
  id: string,
  statusData: IUpdateIdeaStatus,
  userRole: UserRole
): Promise<Idea> => {
  // Check if the idea exists
  const existingIdea = await prisma.idea.findUnique({
    where: { id }
  });

  if (!existingIdea) {
    throw new AppError(httpStatus.NOT_FOUND, 'Idea not found');
  }

  // Check if the user is authorized to update the status
  // Only admins can update the status
  if (userRole !== UserRole.ADMIN) {
    throw new AppError(httpStatus.FORBIDDEN, 'Only admins can update idea status');
  }

  // 3. Update the status
  return await prisma.idea.update({
    where: { id },
    data: {
      status: statusData.status,
      // Automatically publish when approved
      isPublished: statusData.status === 'APPROVED' ? true : existingIdea.isPublished
    },
    include: {
      images: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  });
};

export const IdeaServices = {
  createIdea,
  getAllIdeas,
  getIdeaById,
  deleteIdea,
  updateIdeaStatus
};
