import os
from flask import Flask
from dotenv import load_dotenv
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_mail import Mail

api = Api() # Inicializa API de Flask Restful
db = SQLAlchemy() # Inicializa SQLAlchemy
jwt = JWTManager() # Inicializa Flask JWT
mailsender = Mail() # Inicializa Flask Mail

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
  api.add_resource(resources.RatingsResource, '/ratings')
  
  #Recursos por ID
  api.add_resource(resources.UserResource, '/user/<int:id>')
  api.add_resource(resources.AdminResource, '/admin/<int:id>')
  api.add_resource(resources.PoemResource, '/poem/<int:id>')
  api.add_resource(resources.RatingResource, '/rating/<int:id>')

  api.init_app(app) # Carga la aplicacion en la API de Flask Restful
    
  app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
  app.config["JWT_ACCESS_TOKEN_EXPIRES"] = int(os.getenv("JWT_ACCESS_TOKEN_EXPIRES"))
  
  jwt.init_app(app)
  
  from src.auth.routes import auth

  app.register_blueprint(auth) #Import blueprint for routes.auth
  
  #Configuración de mail
  app.config['MAIL_HOSTNAME'] = os.getenv('MAIL_HOSTNAME')
  app.config['MAIL_SERVER'] = os.getenv('MAIL_SERVER')
  app.config['MAIL_PORT'] = os.getenv('MAIL_PORT')
  app.config['MAIL_USE_TLS'] = os.getenv('MAIL_USE_TLS')
  app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
  app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
  app.config['FLASKY_MAIL_SENDER'] = os.getenv('FLASKY_MAIL_SENDER')
    
  #Inicializar en app
  mailsender.init_app(app)
  
  return app