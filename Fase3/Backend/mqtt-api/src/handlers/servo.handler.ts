import { Handler } from "express";
import * as dotenv from "dotenv";

dotenv.config();

import { publishMessage } from "../services/mqtt.services";
import { Topic } from "../enums/mqtt.enums";

// Controlador para abrir la talanquera
export const openGateHandler: Handler = async (req, res) => {
  try {
    const pass = req.body.pass as string; // Contraseña enviada
    const passEnv = process.env.SERVO_PASSWORD as string; // Contraseña esperada

    if (pass !== passEnv) {
      // Si la contraseña es incorrecta
      await publishMessage(Topic.ControlMotor, "0");
      res.status(401).send("Contraseña incorrecta");
    } else {
      // Si la contraseña es correcta
      await publishMessage(Topic.ControlMotor, "1");
      res.status(200).send("La talanquera se ha abierto");
    }
  } catch (error) {
    res.status(500).send("Error al abrir la talanquera");
  }
};
