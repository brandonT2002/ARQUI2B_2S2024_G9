import { Router } from "express";

import {
  turnOnLightsHandler,
  turnOffLightsHandler,
} from "../handlers/lights.handler";

const router = Router();

router.post("/turn-on", turnOnLightsHandler);
router.post("/turn-off", turnOffLightsHandler);

export default router;
