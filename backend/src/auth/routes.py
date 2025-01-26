from .. import db
from src.models import UserModel, AdminModel
from src.mail.functions import sendMail
from flask import Blueprint, request
from flask_jwt_extended import create_access_token

# Crear el Blueprint para las rutas de autenticación
auth = Blueprint('auth', __name__, url_prefix='/auth')

# **Ruta de Login para Usuarios**
@auth.route('/login', methods=['POST'])
def login():
    # Obtener email y contraseña del cuerpo de la solicitud
    email = request.json.get('email')
    password = request.json.get('password')
    
    # Buscar al usuario por email
    user = UserModel.query.filter_by(email=email).first()
    if user and user.validate_pass(password):  # Validar la contraseña
        # Crear un token de acceso JWT
        token = create_access_token(identity=user)
        
        # Preparar los datos de respuesta
        data = {
            "id": str(user.id),
            "email": user.email,
            "access_token": token
        }
        return data, 200
    else:
        # Credenciales inválidas
        return {'message': 'Invalid credentials'}, 401

# **Ruta de Login para Administradores**
@auth.route('/login/admin', methods=['POST'])
def admin_login():
    # Obtener email y contraseña del cuerpo de la solicitud
    email = request.json.get('email')
    password = request.json.get('password')
    
    # Buscar al administrador por email
    admin = AdminModel.query.filter_by(email=email).first()
    if admin and admin.validate_pass(password):  # Validar la contraseña
        # Crear un token de acceso JWT
        token = create_access_token(identity=admin)
        
        # Preparar los datos de respuesta
        data = {
            "id": str(admin.id),
            "email": admin.email,
            "access_token": token
        }
        return data, 200
    else:
        # Credenciales inválidas
        return {'message': 'Invalid credentials'}, 401

# **Ruta de Registro para Usuarios**
@auth.route('/register', methods=['POST'])
def register():
    # Obtener datos del cuerpo de la solicitud
    data = request.json
    user = UserModel.from_json(data)  # Crear un objeto UserModel a partir del JSON recibido
    
    # Verificar si el email ya existe
    if UserModel.query.filter_by(email=user.email).first():
        return {'message': 'Email already in use'}, 409
    
    try:
        # Guardar el usuario en la base de datos
        db.session.add(user)
        db.session.commit()
        
        # Enviar un correo de bienvenida
        sent = sendMail([user.email], "Welcome!", 'register', user=user)
        if not sent:  # Verificar si el envío falló
            return {'message': 'Error sending email'}, 500
    except Exception as error:
        # En caso de error, revertir la transacción
        db.session.rollback()
        return {'message': str(error)}, 409

    # Devolver los datos del usuario registrado
    return user.to_json(), 201
