#!/bin/bash

# Verificar si python3 está instalado
if ! command -v python3 &>/dev/null; then
    echo >&2 "Python 3 no está instalado. Abortando."
    exit 1
fi

# Verificar si python3-venv está instalado
if ! python3 -m venv --help &>/dev/null; then
    echo >&2 "El módulo python3-venv no está disponible. Abortando."
    exit 1
fi

# Crear y activar el entorno virtual
python3 -m venv venv

# Activar el entorno virtual
source venv/bin/activate

# Actualizar pip en el entorno virtual
pip install --upgrade pip

# Instalar los requisitos del proyecto desde requirements.txt
pip install -r requirements.txt

# Comprobación del archivo .env
file=.env
path=$(pwd)
if [ ! -f $file ]; then
    # Preguntar al usuario por las variables de entorno
    echo "Configuración de variables de entorno para Flask:"
    read -p "Puerto de la aplicación (por defecto 5000): " FLASK_PORT
    read -p "Nombre de usuario de la base de datos: " DATABASE_USER
    read -p "Contraseña del usuario para la base de datos: " DATABASE_PASSWORD
    read -p "Clave secreta para JWT (se generará aleatoriamente si se deja vacío): " JWT_SECRET_KEY
    read -p "Duración del token JWT en segundos (por defecto 3600s): " JWT_ACCESS_TOKEN_EXPIRES

    # Definir valores por defecto si el usuario no ingresa nada
    FLASK_PORT=${FLASK_PORT:-5000}
    JWT_SECRET_KEY=${JWT_SECRET_KEY:-$(openssl rand -base64 32)}
    JWT_ACCESS_TOKEN_EXPIRES=${JWT_ACCESS_TOKEN_EXPIRES:-3600}

    # Escribir las variables en el archivo .env
    cat >.env <<EOF
# Archivo .env generado automáticamente para configuración de Flask

# Variables de Flask
export FLASK_PORT=${FLASK_PORT}

# Variables de la Base de Datos
export DATABASE_NAME=poems_blog
export DATABASE_USER=${DATABASE_USER}
export DATABASE_PASSWORD=${DATABASE_PASSWORD}

# Variables de JWT
export JWT_SECRET_KEY=${JWT_SECRET_KEY}
export JWT_ACCESS_TOKEN_EXPIRES=${JWT_ACCESS_TOKEN_EXPIRES}

EOF
    echo "Archivo .env creado satisfactoriamente."
fi

# Desactivar el entorno virtual cuando hayas terminado
deactivate
