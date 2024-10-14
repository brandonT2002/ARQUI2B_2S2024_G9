import { Handler } from "express";

import { publishMessage } from "../services/mqtt.services";
import { Topic } from "../enums/mqtt.enums";

export const turnOnLightsHandler: Handler = async (req, res) => {
  try {
    // Publicar el mensaje para encender las luces
    await publishMessage(Topic.ControlLuz, "1");
    res.status(200).send("Las luces se han encendido");
  } catch (error) {
    res.status(500).send("Error al encender las luces");
  }
};

export const turnOffLightsHandler: Handler = async (req, res) => {
  try {
    // Publicar el mensaje para apagar las luces
    await publishMessage(Topic.ControlLuz, "0");
    res.status(200).send("Las luces se han apagado");
  } catch (error) {
    res.status(500).send("Error al apagar las luces");
  }
};
