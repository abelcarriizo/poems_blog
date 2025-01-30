import os
from flask_cors import CORS  # Importa CORS
from src import create_app, db
from flask_migrate import Migrate  # Importamos Flask-Migrate

app = create_app()

# Habilitar CORS para la aplicación
CORS(app, resources={r"/*": {"origins": "*"}})  # Permite todas las solicitudes

# Inicializar Flask-Migrate
migrate = Migrate(app, db)

if __name__ == '__main__':
    app.run(debug=True, port=int(os.getenv("FLASK_PORT", 5000)))
