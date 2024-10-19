import serial
import time
import mysql.connector
from datetime import datetime
import re  # Para manejar datos mal formateados como Distancia25

ser = serial.Serial('/dev/ttyACM0', 9600, timeout=1)  # Cambia '/dev/ttyACM0' por el puerto correcto si es necesario
time.sleep(2)  # Esperar a que la conexi  n se estabilice

# Conexi  n a la base de datos
db_config = {
    'host': '34.46.189.38',
    'user': 'root',
    'password': 'bGJ5AonEH9+M*#0n',
    'database': 'ace2'
}

# Crear la conexi  n con MySQL
db_connection = mysql.connector.connect(**db_config)
cursor = db_connection.cursor()

# Funci  n para insertar los datos en la tabla 'lecturas'
def insertar_datos(temperatura, humedad, luz, co2, proximidad):
    fecha_actual = datetime.now().strftime('%Y-%m-%d %H:%M:%S')  # Fecha y hora actual en formato YYYY-MM-DD HH:MM:SS
    query = '''
        INSERT INTO lecturas (temperatura, humedad, luz, co2, proximidad, fecha) 
        VALUES (%s, %s, %s, %s, %s, %s)
    '''
    valores = (temperatura, humedad, luz, co2, proximidad, fecha_actual)
    cursor.execute(query, valores)
    db_connection.commit()  # Confirmar la transacci  n
    print(f"Datos insertados: {valores}")

# Funci  n para corregir los valores mal formateados (ejemplo: Distancia25 -> Distancia: 25)
def corregir_datos_mal_formateados(line):
    # Buscar patrones del tipo "Distancia25" y convertirlos a "Distancia: 25"
    line = re.sub(r'([a-zA-Z]+)(\d+)', r'\1: \2', line)
    return line

# Leer datos del puerto serial
try:
    while True:
        if ser.in_waiting > 0:
            # Leer la l  nea de datos del monitor serial
            line = ser.readline().decode('utf-8').rstrip()
            print(f"Datos recibidos: {line}")
            
            # Corregir datos mal formateados como "Distancia25"
            line = corregir_datos_mal_formateados(line)
            
            # Separar los datos recibidos
            try:
                # Suponiendo que los datos recibidos tienen este formato: "Temperatura: 23.40, Humedad: 81.00, Luz: 200.5, MQ: 124, Distancia: 25"
                datos = line.split(',')
                valores = {}

                for dato in datos:
                    # Verifica que el dato contenga un separador ":"
                    if ':' in dato:
                        clave, valor = dato.split(':')
                        valores[clave.strip().lower()] = valor.strip()

                # Aseg  rate de que todos los datos necesarios est  n presentes antes de insertar
                if "temperatura" in valores and "humedad" in valores and "luz" in valores and "mq" in valores and "distancia" in valores:
                    insertar_datos(
                        float(valores['temperatura']),
                        float(valores['humedad']),
                        float(valores['luz']),
                        float(valores['mq']),  # Cambi   "MQ" por "CO2" asumiendo que esa es tu intenci  n
                        float(valores['distancia'])
                    )
            except Exception as e:
                print(f"Error al parsear los datos: {e}")

except KeyboardInterrupt:
    print("Cerrando la conexi  n...")
finally:
    # Cerrar las conexiones
    cursor.close()
    db_connection.close()
    ser.close()

