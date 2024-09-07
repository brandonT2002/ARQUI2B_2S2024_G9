from flask import Flask, jsonify, request
import os
import pymysql
from dotenv import load_dotenv
from datetime import datetime
from contextlib import contextmanager

# Cargar variables de entorno
load_dotenv()

# Configuración de Flask
app = Flask(__name__)

# Variables de conexión a la base de datos
DB_HOST = os.getenv('DB_HOST')
DB_PORT = int(os.getenv('DB_PORT', 3306))
DB_NAME = os.getenv('DB_NAME')
DB_USER = os.getenv('DB_USER')
DB_PASSWORD = os.getenv('DB_PASSWORD')

# Contexto de conexión a la base de datos
@contextmanager
def get_db_connection():
    connection = None
    try:
        connection = pymysql.connect(
            host=DB_HOST,
            port=DB_PORT,
            user=DB_USER,
            password=DB_PASSWORD,
            database=DB_NAME
        )
        yield connection
    finally:
        if connection:
            connection.close()

# Rutas GET para obtener los datos de cada tabla con límite o todos los datos
@app.route('/temperature', defaults={'limit': 25}, methods=['GET'])
@app.route('/temperature/<limit>', methods=['GET'])
def get_temperature(limit):
    return get_last_entries('TEMPERATURA', limit)

@app.route('/humidity', defaults={'limit': 25}, methods=['GET'])
@app.route('/humidity/<limit>', methods=['GET'])
def get_humidity(limit):
    return get_last_entries('HUMEDAD', limit)

@app.route('/light', defaults={'limit': 25}, methods=['GET'])
@app.route('/light/<limit>', methods=['GET'])
def get_light(limit):
    return get_last_entries('LUZ', limit)

@app.route('/co2', defaults={'limit': 25}, methods=['GET'])
@app.route('/co2/<limit>', methods=['GET'])
def get_co2(limit):
    return get_last_entries('CO2', limit)

@app.route('/proximity', defaults={'limit': 25}, methods=['GET'])
@app.route('/proximity/<limit>', methods=['GET'])
def get_proximity(limit):
    return get_last_entries('PROXIMIDAD', limit)

def get_last_entries(table_name, limit):
    try:
        with get_db_connection() as connection:
            cursor = connection.cursor()
            
            # Validar si el límite es 'all' para devolver todos los registros
            if limit == 'all':
                query = f"SELECT valor, fecha FROM {table_name} ORDER BY fecha DESC;"
                cursor.execute(query)
            else:
                # Convertir el límite a un número entero
                try:
                    limit = int(limit)
                except ValueError:
                    return jsonify({"status": "error", "message": "El límite debe ser un número o 'all'."}), 400
                
                query = f"SELECT valor, fecha FROM {table_name} ORDER BY fecha DESC LIMIT %s;"
                cursor.execute(query, (limit,))
            
            resultados = cursor.fetchall()

            # Convertir los resultados a una lista de diccionarios con value como número y date en formato ISO
            datos = [{"value": float(row[0]), "date": row[1].isoformat()} for row in resultados]

            return jsonify(datos), 200
    except Exception as e:
        return jsonify({"status": "error", "message": f"Error al obtener datos: {str(e)}"}), 500

@app.route('/')
def index():
    return jsonify({"message": "API corriendo en la raspberry"})

@app.route('/check-db-connection')
def check_db_connection():
    try:
        with get_db_connection() as connection:
            cursor = connection.cursor()
            cursor.execute("SELECT VERSION();")
            db_version = cursor.fetchone()
            return jsonify({
                "status": "success",
                "message": "Conexión exitosa con la base de datos",
                "db_version": db_version[0]
            })
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": f"Error al conectar a la base de datos: {str(e)}"
        })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3001, debug=True)