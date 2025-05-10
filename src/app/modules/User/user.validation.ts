
import { z } from "zod";
import { UserRole, UserStatus } from "../../../../generated/prisma";

const createAdmin = z.object({
  password: z.string({
    required_error: "Password is required",
  }),
  user: z.object({
    name: z.string({
      required_error: "Name is required!",
    }),
    email: z.string({
      required_error: "Email is required!",
    }),
  }),
});

const updateStatus = z.object({
  body: z.object({
    status: z.enum([UserStatus.ACTIVE, UserStatus.BLOCKED, UserStatus.DELETED]),
  }),
});
const updateRole = z.object({
  body: z.object({
    role: z.enum([UserRole.ADMIN, UserRole.MEMBERS]),
  }),
});

export const UserValidationSchema = {
  createAdmin,
  updateStatus,
  updateRole
};
