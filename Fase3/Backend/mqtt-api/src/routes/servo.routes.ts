import { Router } from "express";

import { openGateHandler } from "../handlers/servo.handler";

const router = Router();

router.post("/gate-open", openGateHandler);

export default router;
