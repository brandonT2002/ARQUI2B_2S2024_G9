import { Handler } from "express";

import { subscribeMessages } from "../services/mqtt.services";
import { Topic } from "../enums/mqtt.enums";

// Controlador para obtener acceso
export const accessHandler: Handler = async (req, res) => {
  try {
    const access = await subscribeMessages(Topic.ControlAcceso);
    if (access === 1) {
      res.status(200).send("Ah ingresado un usuario.");
    } else {
        res.status(200)
    }
  } catch (error) {
    res.status(500).send("Error al obtener acceso.");
  }
};
