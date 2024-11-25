import os
from flask import Flask
from dotenv import load_dotenv
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy

api = Api() # Inicializa API de Flask Restful
db = SQLAlchemy() # Inicializa SQLAlchemy

# Método que inicializará todos los módulos y devolverá la aplicación
def create_app():
  app = Flask(__name__) # Inicializa Flask  

  load_dotenv() # Carga las variables de entorno

  #Configuracion de Base de Datos
  app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
  app.config['SQLALCHEMY_DATABASE_URI'] = f"mysql+mysqlconnector://{os.getenv('DATABASE_USER')}:{os.getenv('DATABASE_PASSWORD')}@localhost/{os.getenv('DATABASE_NAME')}"

  db.init_app(app)

  import src.resources as resources

  # Carga a la API los recursos
  #Todos los recursos
  api.add_resource(resources.UsersResource, '/users')
  api.add_resource(resources.AdminsResource, '/admins')
  api.add_resource(resources.PoemsResource, '/poems')
  # */ratings* se utilizara para crear ratings. */ratings/poem* se utilizara para obtener todos los ratings de un poema.
  api.add_resource(resources.RatingsResource, '/ratings', '/ratings/poem/<int:poem_id>')
  
  #Recursos por ID
  api.add_resource(resources.UserResource, '/user/<int:id>')
  api.add_resource(resources.AdminResource, '/admin/<int:admin_id>')
  api.add_resource(resources.PoemResource, '/poem/<int:id>')
  api.add_resource(resources.RatingResource, '/rating/<int:id>')

  api.init_app(app) # Carga la aplicacion en la API de Flask Restful
  
  return app