from flask import Flask, jsonify, request
import os
import pymysql
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__)

DB_HOST = os.getenv('DB_HOST')
DB_PORT = int(os.getenv('DB_PORT', 3306))
DB_NAME = os.getenv('DB_NAME')
DB_USER = os.getenv('DB_USER')
DB_PASSWORD = os.getenv('DB_PASSWORD')

def connect_db():
    connection = pymysql.connect(
        host=DB_HOST,
        port=DB_PORT,
        user=DB_USER,
        password=DB_PASSWORD,
        database=DB_NAME
    )
    return connection

@app.route('/')
def index():
    return jsonify({"message": "API corriendo en el puerto 3001"})

# Conexión a la base de datos
@app.route('/check-db-connection')
def check_db_connection():
    try:
        connection = connect_db()
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
    finally:
        if connection:
            cursor.close()
            connection.close()

@app.route('/temperature', methods=['POST'])
def add_temperature():
    data = request.get_json()
    valor = data.get('valor')
    fecha = data.get('fecha')

    if valor is None or fecha is None:
        return jsonify({"status": "error", "message": "Datos incompletos"}), 400

    try:
        connection = connect_db()
        cursor = connection.cursor()
        cursor.execute("INSERT INTO TEMPERATURA (valor, fecha) VALUES (%s, %s)", (valor, fecha))
        connection.commit()
        return jsonify({"status": "success", "message": "Datos recibidos correctamente"}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": f"Error al insertar datos: {str(e)}"}), 500

@app.route('/humidity', methods=['POST'])
def add_temperature():
    data = request.get_json()
    valor = data.get('valor')
    fecha = data.get('fecha')

    if valor is None or fecha is None:
        return jsonify({"status": "error", "message": "Datos incompletos"}), 400

    try:
        connection = connect_db()
        cursor = connection.cursor()
        cursor.execute("INSERT INTO HUMEDAD (valor, fecha) VALUES (%s, %s)", (valor, fecha))
        connection.commit()
        return jsonify({"status": "success", "message": "Datos recibidos correctamente"}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": f"Error al insertar datos: {str(e)}"}), 500

@app.route('/light', methods=['POST'])
def add_temperature():
    data = request.get_json()
    valor = data.get('valor')
    fecha = data.get('fecha')

    if valor is None or fecha is None:
        return jsonify({"status": "error", "message": "Datos incompletos"}), 400

    try:
        connection = connect_db()
        cursor = connection.cursor()
        cursor.execute("INSERT INTO LUZ (valor, fecha) VALUES (%s, %s)", (valor, fecha))
        connection.commit()
        return jsonify({"status": "success", "message": "Datos recibidos correctamente"}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": f"Error al insertar datos: {str(e)}"}), 500

@app.route('/co2', methods=['POST'])
def add_temperature():
    data = request.get_json()
    valor = data.get('valor')
    fecha = data.get('fecha')

    if valor is None or fecha is None:
        return jsonify({"status": "error", "message": "Datos incompletos"}), 400

    try:
        connection = connect_db()
        cursor = connection.cursor()
        cursor.execute("INSERT INTO CO2 (valor, fecha) VALUES (%s, %s)", (valor, fecha))
        connection.commit()
        return jsonify({"status": "success", "message": "Datos recibidos correctamente"}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": f"Error al insertar datos: {str(e)}"}), 500    

@app.route('/proximity', methods=['POST'])
def add_temperature():
    data = request.get_json()
    valor = data.get('valor')
    fecha = data.get('fecha')

    if valor is None or fecha is None:
        return jsonify({"status": "error", "message": "Datos incompletos"}), 400

    try:
        connection = connect_db()
        cursor = connection.cursor()
        cursor.execute("INSERT INTO PROXIMIDAD (valor, fecha) VALUES (%s, %s)", (valor, fecha))
        connection.commit()
        return jsonify({"status": "success", "message": "Datos recibidos correctamente"}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": f"Error al insertar datos: {str(e)}"}), 500    

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3001, debug=True)
