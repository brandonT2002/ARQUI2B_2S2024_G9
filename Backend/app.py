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
    """Conectar a la base de datos."""
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

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3001)
