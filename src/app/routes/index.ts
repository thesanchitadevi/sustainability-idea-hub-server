import { Router } from "express";
import { AuthRouter } from "../modules/Auth/auth.routes";
import { IdeaRoutes } from "../modules/Idea/idea.routes";
import { UserRouter } from "../modules/User/user.routes";

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
  {
    path: "/idea",
    module: IdeaRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.module);
});

export default router;
