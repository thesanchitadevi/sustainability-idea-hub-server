import { IdeaCategory, IdeaStatus } from "@prisma/client";
import { z } from "zod";

// Create Idea Validation
const createIdeaSchema = z.object({
  title: z.string({
    required_error: "Title is required",
  }),
  problemStatement: z.string({
    required_error: "Problem statement is required",
  }),
  proposedSolution: z.string({
    required_error: "Proposed solution is required",
  }),
  description: z.string({
    required_error: "Description is required",
  }),
  isPaid: z.string().optional(),
  category: z.enum([...Object.values(IdeaCategory)] as [string, ...string[]], {
    required_error: "Category is required",
  }),
});

const updateIdeaSchema = z.object({
  title: z.string().optional(),
  problemStatement: z.string().optional(),
  proposedSolution: z.string().optional(),
  description: z.string().optional(),
});

const updateStatus = z.object({
  status: z.enum([...Object.values(IdeaStatus)] as [string, ...string[]]),
});

export const IdeaValidation = {
  createIdeaSchema,
  updateIdeaSchema,
  updateStatus,
};
