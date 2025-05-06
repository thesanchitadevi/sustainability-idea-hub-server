import { Router } from "express";
import { UserRouter } from "../modules/User/user.routes";
import { AuthRouter } from "../modules/Auth/auth.routes";
import { IdeaRoutes } from "../modules/Idea/idea.routes";
import { AdminRouter } from "../modules/Admin/admin.routes";
import { PaymentRoutes } from "../modules/payment/payment.route";

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
    path:"/admin",
    module: AdminRouter
  },
  {
    path:"/payment",
    module:PaymentRoutes
  }
  
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.module);
});

export default router;
