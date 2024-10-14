import * as dotenv from "dotenv";

dotenv.config();

// Configuración del broker MQTT
export const mqttConfig = {
  brokerUrl: process.env.MQTT_BROKER_URL as string,
};
