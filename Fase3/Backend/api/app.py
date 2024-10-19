from flask import Flask, jsonify, request
import os
import pymysql
from datetime import datetime
from contextlib import contextmanager
import pandas as pd
from sqlalchemy import create_engine
from statsmodels.tsa.arima.model import ARIMA
import json

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

# Contexto de conexión a la base de datos
@contextmanager
def get_db_connection():
    connection = None
    try:
        connection = create_engine(f'mysql+mysqlconnector://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}')
        yield connection
    finally:
        if connection:
            connection.dispose()

# Función para conectar a la base de datos y recuperar los datos
def obtener_datos():
    with get_db_connection() as engine:
        query = "SELECT fecha, temperatura, humedad, luz, co2 FROM lecturas ORDER BY fecha"
        df = pd.read_sql(query, engine)
    return df

# Función para entrenar un modelo ARIMA y hacer predicciones
def predecir_dato_serie_temporal(serie, dias):
    model = ARIMA(serie, order=(5, 1, 0))  # Parámetros del modelo ARIMA (p, d, q)
    model_fit = model.fit()
    prediccion = model_fit.forecast(steps=dias)
    return prediccion

# Función para calcular los días entre la última fecha registrada y la fecha solicitada
def calcular_dias_entre_fechas(ultima_fecha, fecha_objetivo):
    return (fecha_objetivo - ultima_fecha).days

def predecir_para_fecha(fecha_objetivo):
    df = obtener_datos()
    df['fecha'] = pd.to_datetime(df['fecha'])
    df.set_index('fecha', inplace=True)
    
    # Asegúrate de que el índice tenga una frecuencia
    df = df.resample('5s').mean()

    ultima_fecha = df.index.max()
    dias = calcular_dias_entre_fechas(ultima_fecha, fecha_objetivo)
    
    if dias < 1 or dias > 8:
        return {"status": "error", "message": "La proyección solo puede realizarse para un rango de 1 a 8 días desde la última fecha registrada."}, 400
    
    predicciones = {}
    for columna in ['temperatura', 'humedad', 'luz', 'co2']:
        predicciones[columna] = predecir_dato_serie_temporal(df[columna], dias).iloc[-1]
    
    return predicciones, 200

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

@app.route('/predict', methods=['POST'])
def predict():
    # Obtener la fecha objetivo desde el cuerpo de la solicitud
    data = request.get_json()
    fecha_str = data.get("fecha")

    try:
        fecha_objetivo = datetime.strptime(fecha_str, '%Y-%m-%d')
    except (ValueError, TypeError):
        return jsonify({"status": "error", "message": "Formato de fecha incorrecto. Use el formato YYYY-MM-DD."}), 400
    
    # Obtener las predicciones para la fecha solicitada
    predicciones, status_code = predecir_para_fecha(fecha_objetivo)
    
    if isinstance(predicciones, dict) and 'status' in predicciones:
        return jsonify(predicciones), status_code
    
    return jsonify({"fecha": fecha_objetivo.strftime('%Y-%m-%d'), "predicciones": {k: round(v, 2) for k, v in predicciones.items()}}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3001, debug=True)