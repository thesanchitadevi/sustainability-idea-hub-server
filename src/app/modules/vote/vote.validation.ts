import { z } from "zod";

export const voteSchema = z
  .object({
    voteType: z.enum(["UP_VOTE", "DOWN_VOTE"], {
      required_error: "Vote type is required",
    }),
  })
  .strict();
