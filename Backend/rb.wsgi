import sys
import os

# Add the project directory to the sys.path
sys.path.insert(0, '/home/eduardo/ARQUI2B_2S2024_G9/Backend')

# Activate the virtual environment by setting the correct paths
venv_path = '/home/eduardo/ARQUI2B_2S2024_G9/venv'
os.environ['VIRTUAL_ENV'] = venv_path
os.environ['PYTHONHOME'] = venv_path
sys.prefix = venv_path
sys.exec_prefix = venv_path

# Add the site-packages of the virtual environment to the sys.path
site_packages_path = os.path.join(venv_path, 'lib', 'python3.11', 'site-packages')
sys.path.insert(0, site_packages_path)

# Import the Flask app
from rb import app as application  # Ensure 'rb' is your app's file name without .py