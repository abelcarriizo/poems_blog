import os
from flask_cors import CORS  
from src import create_app, db

app = create_app()
app.app_context().push()

# Habilitar CORS para la aplicación
CORS(app, resources={r"/*": {"origins": "*"}}) 
CORS(app, resources={r"/static/uploads/*": {"origins": "*"}})

if __name__ == '__main__':
    db.create_all()
    app.run(debug=True, port=int(os.getenv("FLASK_PORT", 5000)))