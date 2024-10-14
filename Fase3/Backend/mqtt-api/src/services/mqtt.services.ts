import mqtt, { MqttClient } from "mqtt";
import { mqttConfig } from "../config/mqtt.config";
import { Topic } from "../enums/mqtt.enums";
import internal from "stream";

// Conectar al broker MQTT
const client: MqttClient = mqtt.connect(mqttConfig.brokerUrl);

// Publicación de mensajes
export const publishMessage = async (topic: Topic, message: string) => {
  if (!client.connected) {
    console.error("Error: Cliente MQTT no conectado");
    throw new Error();
  }

  client.publish(topic, message, (err) => {
    if (err) {
      console.error("Error al publicar el mensaje:", err);
      throw err;
    } else {
      return;
    }
  });
};

// Suscripción a mensajes
export const subscribeMessages = async (topic: Topic): Promise<number> => {
  if (!client.connected) {
    console.error("Error: Cliente MQTT no conectado");
    throw new Error();
  }

  return new Promise((resolve, reject) => {
    // Suscribirse al topic
    client.subscribe(topic, (err) => {
      if (err) {
        console.error("Error al suscribirse al topic:", err);
        reject(new Error("Error al suscribirse al topic"));
        return;
      }
    });

    // Crear un timeout
    const timeout = setTimeout(() => {
      reject(new Error("Tiempo de espera excedido")); // Rechaza si el tiempo se excede
    }, 5000);

    // Recibir mensajes
    client.on("message", (topic, message) => {
      clearTimeout(timeout); // Limpiar el timeout si recibimos un mensaje
      resolve(parseInt(message.toString(), 10));
    });
  });
};
