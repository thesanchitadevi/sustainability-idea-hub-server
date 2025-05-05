import { Router } from "express";
import { AuthRouter } from "../modules/Auth/auth.routes";
import { CommentRouter } from "../modules/comment/comment.route";
import { IdeaRoutes } from "../modules/Idea/idea.routes";
import { UserRouter } from "../modules/User/user.routes";
import { VoteRoutes } from "../modules/vote/vote.route";

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
  {
    path: "/vote",
    module: VoteRoutes,
  },
  {
    path: "/comment",
    module: CommentRouter,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.module);
});

export default router;
