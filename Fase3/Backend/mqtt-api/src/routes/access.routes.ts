import { Router } from "express";

import { accessHandler } from "../handlers/access.handler";

const router = Router();

router.get("/access", accessHandler);

export default router;
