import { fileUploader } from "../../../helpers/fileUploader";
import prisma from "../../../shared/prisma";
import { IAuthUser } from "../../interfaces/common";
import { IFile } from "../../interfaces/file";

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

  console.log(uploadedImages, "uploadedImages");

  console.log(userId, "user");

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
      userId,
    },
    include: {
      images: true,
      user: {
        // Include basic user info if needed
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
  console.log(result, "result");

  // return result;
};

export const IdeaServices = {
  createIdea,
};
