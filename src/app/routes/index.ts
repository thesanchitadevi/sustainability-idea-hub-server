import { Router } from "express";
import { AdminRouter } from "../modules/Admin/admin.routes";

const router = Router();

// Application routes
const moduleRoutes = [
  {
    path: "/admin",
    module: AdminRouter,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.module);
});

export default router;
