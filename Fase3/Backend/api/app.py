from flask import Flask, jsonify, request
import os
import pymysql
from datetime import datetime
from contextlib import contextmanager

# Configuración de Flask
app = Flask(__name__)

# Variables de conexión a la base de datos
DB_HOST = '34.46.189.38'
DB_PORT = 3306
DB_NAME = 'ace2'
DB_USER = 'root'
DB_PASSWORD = 'bGJ5AonEH9+M*#0n'

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

# Ruta para obtener los datos de las diferentes columnas de la tabla 'lecturas'
@app.route('/temperature', defaults={'limit': 25}, methods=['GET'])
@app.route('/temperature/<limit>', methods=['GET'])
def get_temperature(limit):
    return get_last_entries('temperatura', limit)

@app.route('/humidity', defaults={'limit': 25}, methods=['GET'])
@app.route('/humidity/<limit>', methods=['GET'])
def get_humidity(limit):
    return get_last_entries('humedad', limit)

@app.route('/light', defaults={'limit': 25}, methods=['GET'])
@app.route('/light/<limit>', methods=['GET'])
def get_light(limit):
    return get_last_entries('luz', limit)

@app.route('/co2', defaults={'limit': 25}, methods=['GET'])
@app.route('/co2/<limit>', methods=['GET'])
def get_co2(limit):
    return get_last_entries('co2', limit)

@app.route('/proximity', defaults={'limit': 25}, methods=['GET'])
@app.route('/proximity/<limit>', methods=['GET'])
def get_proximity(limit):
    return get_last_entries('proximidad', limit)

# Función genérica para obtener los últimos registros de una columna de la tabla 'lecturas'
def get_last_entries(column_name, limit):
    try:
        with get_db_connection() as connection:
            cursor = connection.cursor()
            
            # Validar si el límite es 'all' para devolver todos los registros
            if limit == 'all':
                query = f"SELECT {column_name}, fecha FROM lecturas ORDER BY fecha DESC;"
                cursor.execute(query)
            else:
                # Convertir el límite a un número entero
                try:
                    limit = int(limit)
                except ValueError:
                    return jsonify({"status": "error", "message": "El límite debe ser un número o 'all'."}), 400
                
                query = f"SELECT {column_name}, fecha FROM lecturas ORDER BY fecha DESC LIMIT %s;"
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