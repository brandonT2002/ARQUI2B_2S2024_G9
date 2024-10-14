export enum Topic {
    SensorLuz    = "sensor/luz", // Cantidad de luz en el ambiente
    SensorTemp  = "sensor/temp", // Medición de temperatura
    SensorHumedad = "sensor/humedad", // Medición de humedad
    SensorCO2 = "sensor/co2", // Medición de calidad de aire
    SensorProx = "sensor/prox", // Medición de proximidad
    ControlLuz = "control/luz", // Encendido y apagado de luz
    ControlMotor = "control/motor", // Apertura de talaquera
    ControlAcceso = "control/acceso", // Notificación de acceso
}
