import { Handler } from "express";

import { subscribeMessages } from "../services/mqtt.services";
import { Topic } from "../enums/mqtt.enums";

// Controlador para informar los datos en tiempo real
export const infoHandler: Handler = async (req, res) => {
  try {
    const [sensorLuz, sensorTemp, sensorHumedad, sensorCO2, sensorProx] =
      await Promise.all([
        subscribeMessages(Topic.SensorLuz),
        subscribeMessages(Topic.SensorTemp),
        subscribeMessages(Topic.SensorHumedad),
        subscribeMessages(Topic.SensorCO2),
        subscribeMessages(Topic.SensorProx),
      ]);

    const sensorData = {
      luz: sensorLuz,
      temperatura: sensorTemp,
      humedad: sensorHumedad,
      co2: sensorCO2,
      proximidad: sensorProx,
    };

    res.status(200).send({ sensorData });
  } catch (error) {
    res.status(500).send("Error al obtener los datos.");
  }
};
