import { z } from "zod";

export const createCommentSchema = z.object({
  body: z
    .object({
      ideaId: z.string({
        required_error: "Idea ID is required",
      }),
      parentId: z.string().optional(),
      comment: z.string({
        required_error: "Comment is required",
      }),
    })
    .strict(),
});
