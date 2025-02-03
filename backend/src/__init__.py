import os
from flask import Flask
from dotenv import load_dotenv
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_mail import Mail
from flask_migrate import Migrate

api = Api()  # Inicializa API de Flask Restful
db = SQLAlchemy()  # Inicializa SQLAlchemy
jwt = JWTManager()  # Inicializa Flask JWT
mailsender = Mail()  # Inicializa Flask Mail
migrate = None  # Inicializa Migrate

def create_app():
    app = Flask(__name__, static_url_path='', static_folder='static')  # Inicializa Flask  

    load_dotenv()  # Carga las variables de entorno

    # Configuración de Base de Datos
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SQLALCHEMY_DATABASE_URI'] = f"mysql+mysqlconnector://{os.getenv('DATABASE_USER')}:{os.getenv('DATABASE_PASSWORD')}@localhost/{os.getenv('DATABASE_NAME')}"

    db.init_app(app)

    # Inicializar Flask-Migrate
    global migrate
    migrate = Migrate(app, db)

    import src.resources as resources
    from src.resources.admin import AdminStats
    from src.resources.user import UserImageUpload


    # Carga los recursos en la API
    api.add_resource(resources.UsersResource, '/users')
    api.add_resource(resources.AdminsResource, '/admins')
    api.add_resource(resources.PoemsResource, '/poems')
    api.add_resource(resources.RatingsResource, '/ratings')

    api.add_resource(resources.UserResource, '/user/<int:id>')
    api.add_resource(resources.AdminResource, '/admin/<int:id>')
    api.add_resource(resources.PoemResource, '/poem/<int:id>')
    api.add_resource(resources.RatingResource, '/rating/<int:id>')
    api.add_resource(AdminStats, '/admin/stats') 
    api.add_resource(UserImageUpload, '/users/<int:user_id>/upload-image')


    api.init_app(app)  # Carga la aplicación en la API de Flask Restful

    # Configuración de JWT
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = int(os.getenv("JWT_ACCESS_TOKEN_EXPIRES"))
    jwt.init_app(app)

    # Importar y registrar el Blueprint de autenticación
    from src.auth.routes import auth
    from src.resources.user import users
    app.register_blueprint(auth)
    app.register_blueprint(users, url_prefix='/users')
    # Configuración de mail
    app.config['MAIL_HOSTNAME'] = os.getenv('MAIL_HOSTNAME')
    app.config['MAIL_SERVER'] = os.getenv('MAIL_SERVER')
    app.config['MAIL_PORT'] = os.getenv('MAIL_PORT')
    app.config['MAIL_USE_TLS'] = os.getenv('MAIL_USE_TLS')
    app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
    app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
    app.config['FLASKY_MAIL_SENDER'] = os.getenv('FLASKY_MAIL_SENDER')

    mailsender.init_app(app)  # Inicializar Flask-Mail
    
    return app
