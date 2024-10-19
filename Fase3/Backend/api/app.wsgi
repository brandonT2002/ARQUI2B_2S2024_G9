import sys
import os

# Añadir el nuevo directorio del proyecto a sys.path
sys.path.insert(0, '/home/eduardo/Development/ARQUI2B_2S2024_G9/Fase3/Backend/app')

# Activar el nuevo entorno virtual configurando las rutas correctas
venv_path = '/home/eduardo/Development/venv'
os.environ['VIRTUAL_ENV'] = venv_path
os.environ['PYTHONHOME'] = venv_path
sys.prefix = venv_path
sys.exec_prefix = venv_path

# Añadir el site-packages del nuevo entorno virtual a sys.path
site_packages_path = os.path.join(venv_path, 'lib', 'python3.11', 'site-packages')
sys.path.insert(0, site_packages_path)

# Importar la aplicación Flask desde el nuevo path de app.py
from app import app as application  # Asegúrate de que 'app.py' tiene 'app' como instancia de Flask