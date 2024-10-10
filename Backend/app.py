import serial
import time
import mysql.connector
from datetime import datetime

# Configurar el puerto serial y la velocidad de baudios
ser = serial.Serial('COM7', 9600, timeout=1)  # Cambia 'COM7' por el puerto correcto en tu sistema
time.sleep(2)  # Esperar a que la conexión se estabilice

# Conexión a la base de datos
db_config = {
    'host': 'fase2-arqui2.c7cwk0oc6gti.us-east-1.rds.amazonaws.com',
    'user': 'admin',
    'password': 'admin_arqui2',
    'database': 'FASE2_ARQUI2'
}

# Crear la conexión con MySQL
db_connection = mysql.connector.connect(**db_config)
cursor = db_connection.cursor()

# Función para insertar datos en la tabla correspondiente
def insertar_datos(tabla, valor):
    fecha_actual = datetime.now().strftime('%Y-%m-%d')  # Fecha en formato YYYY-MM-DD
    query = f'INSERT INTO {tabla} (VALOR, FECHA) VALUES (%s, %s)'
    cursor.execute(query, (valor, fecha_actual))
    db_connection.commit()  # Confirmar la transacción
    print(f"Datos insertados en {tabla}: {valor} en la fecha {fecha_actual}")

# Leer datos del puerto serial
try:
    while True:
        if ser.in_waiting > 0:
            # Leer la línea de datos del monitor serial
            line = ser.readline().decode('utf-8').rstrip()
            print(f"Datos recibidos: {line}")

            # Parsear la línea recibida (asumiendo formato JSON, por ejemplo: {"temperatura": 25.3, "humedad": 45.2, "luz": 200.5, "co2": 400.0, "proximidad": 10.0})
            try:
                data = eval(line)  # Convierte la cadena a un diccionario

                # Insertar los datos en las tablas correspondientes
                if "temperatura" in data:
                    insertar_datos('TEMPERATURA', data['temperatura'])
                if "humedad" in data:
                    insertar_datos('HUMEDAD', data['humedad'])
                if "luzSolar" in data:
                    insertar_datos('LUZ', data['luzSolar'])
                if "co2" in data:
                    insertar_datos('CO2', data['co2'])
                if "proximidad" in data:
                    insertar_datos('PROXIMIDAD', data['proximidad'])
            except Exception as e:
                print(f"Error al parsear los datos: {e}")

except KeyboardInterrupt:
    print("Cerrando la conexión...")
finally:
    # Cerrar las conexiones
    cursor.close()
    db_connection.close()
    ser.close()
