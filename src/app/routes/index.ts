import { Router } from "express";
import { AdminRouter } from "../modules/Admin/admin.routes";
import { UserRouter } from "../modules/User/user.routes";
import { AuthRouter } from "../modules/Auth/auth.routes";

const router = Router();

// Application routes
const moduleRoutes = [
  {
    path: "/user",
    module: UserRouter,
  },
  {
    path: "/auth",
    module: AuthRouter,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.module);
});

export default router;
