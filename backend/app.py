import os
from flask_cors import CORS  # Importa CORS
from src import create_app, db

app = create_app()

# Habilitar CORS para la aplicación
CORS(app, resources={r"/*": {"origins": "*"}})  # Permite todas las solicitudes

app.app_context().push()

if __name__ == '__main__':
  db.create_all()
  app.run(debug=True, port=os.getenv("FLASK_PORT"))
