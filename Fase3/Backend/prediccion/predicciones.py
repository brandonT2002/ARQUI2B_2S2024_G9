import pandas as pd
from sqlalchemy import create_engine
from statsmodels.tsa.arima.model import ARIMA
import json
from datetime import datetime

# Función para conectar a la base de datos y recuperar los datos
def obtener_datos():
    # Crear el motor de conexión con SQLAlchemy (usa tus credenciales)
    engine = create_engine('mysql+mysqlconnector://root:bGJ5AonEH9+M*#0n@34.46.189.38:3306/ace2')
    
    # Consulta para obtener los datos
    query = "SELECT fecha, temperatura, humedad, luz, co2, proximidad FROM lecturas ORDER BY fecha"
    
    # Leer los datos directamente desde la base de datos usando el motor de SQLAlchemy
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
    # Obtener los datos de la base de datos
    df = obtener_datos()
    df['fecha'] = pd.to_datetime(df['fecha'])
    
    # Eliminar duplicados en el índice
    df = df[~df.index.duplicated(keep='first')]
    
    df.set_index('fecha', inplace=True)
    
    # Asegúrate de que el índice tenga una frecuencia
    df = df.resample('5s').mean()

    # Obtener la última fecha en la base de datos
    ultima_fecha = df.index.max()
    
    # Calcular la cantidad de días entre la última fecha y la fecha objetivo
    dias = calcular_dias_entre_fechas(ultima_fecha, fecha_objetivo)
    
    # Verificar que la fecha objetivo esté dentro del rango de 8 días
    if dias < 1 or dias > 8:
        return "La proyección solo puede realizarse para un rango de 1 a 8 días desde la última fecha registrada."
    
    # Hacer predicciones para cada variable
    predicciones = {}
    for columna in ['temperatura', 'humedad', 'luz', 'co2', 'proximidad']:
        predicciones[columna] = predecir_dato_serie_temporal(df[columna], dias).iloc[-1]  # Obtener la predicción del último día

    
    return predicciones, fecha_objetivo



# Función para mostrar el resultado de las predicciones en formato JSON
def predicciones_a_json(predicciones, fecha_objetivo):
    # Crear un diccionario para el JSON con la fecha objetivo y las predicciones
    prediccion_json = {
        fecha_objetivo.strftime('%Y-%m-%d'): {
            'temperatura': round(predicciones['temperatura'], 2),
            'humedad': round(predicciones['humedad'], 2),
            'luz': round(predicciones['luz'], 2),
            'co2': round(predicciones['co2'], 2),
            'proximidad': round(predicciones['proximidad'], 2)
        }
    }
    
    # Convertir el diccionario a formato JSON
    prediccion_json_ordenada = json.dumps(prediccion_json, indent=4)
    return prediccion_json_ordenada

# Función principal que pide al usuario una fecha futura
def main():
    print("Bienvenido al sistema de predicción climática.")
    
    # Solicitar la fecha al usuario
    fecha_str = input("Ingrese la fecha para la predicción (formato YYYY-MM-DD): ")
    try:
        fecha_objetivo = datetime.strptime(fecha_str, '%Y-%m-%d')
    except ValueError:
        print("Formato de fecha incorrecto. Intente nuevamente.")
        return
    
    # Obtener las predicciones para la fecha solicitada
    predicciones, fecha_objetivo = predecir_para_fecha(fecha_objetivo)
    
    if isinstance(predicciones, str):
        print(predicciones)
    else:
        resultado_json = predicciones_a_json(predicciones, fecha_objetivo)
        print(resultado_json)

# Ejecutar el programa principal
if __name__ == "__main__":
    main()
