import { Router } from "express";

import { infoHandler } from "../handlers/info.handler";

const router = Router();

router.get("/info", infoHandler);

export default router;
