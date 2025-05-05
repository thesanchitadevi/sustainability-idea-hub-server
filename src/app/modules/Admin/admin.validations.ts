import { z } from "zod";

const rejectionFeedbackValidation = z.object({
  body: z.object({
    rejectionFeedback: z.string({required_error: "rejectionFeedback is required"}),
  }),
});

export const AdminValidationSchemas = {
  rejectionFeedbackValidation,
};
