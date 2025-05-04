import { IdeaCategory, Prisma } from "@prisma/client";
import { fileUploader } from "../../../helpers/fileUploader";
import prisma from "../../../shared/prisma";
import { IFile } from "../../interfaces/file";
import { IPaginationOptions } from "../../interfaces/pagination";
import { paginationHelper } from "../../../helpers/paginationHelper";
import { IIdeaFilters } from "./idea.interface";

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

export const IdeaServices = {
  createIdea,
  getAllIdeas,
};
