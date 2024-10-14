import express from "express";
import morgan from "morgan";
import cors from "cors";
import "dotenv/config";

import lightsRoutes from "./routes/lights.routes";
import servoRoutes from "./routes/servo.routes";
import infoRoutes from "./routes/info.routes";
import accessRoutes from "./routes/access.routes";

const app = express();

app.set("port", process.env.API_PORT);
app.use(morgan("dev"));
app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "ACE2 - Proyecto Fase 3" });
});

app.use("/api/lights", lightsRoutes);
app.use("/api", servoRoutes);
app.use("/api", infoRoutes);
app.use("/api", accessRoutes);


export default app;
