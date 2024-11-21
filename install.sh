#!/bin/bash

# Verificar si python3 está instalado
if ! command -v python3 &> /dev/null; then
    echo >&2 "Python 3 no está instalado. Abortando."
    exit 1
fi

# Verificar si python3-venv está instalado
if ! python3 -m venv --help &> /dev/null; then
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

# Desactivar el entorno virtual cuando hayas terminado
deactivate