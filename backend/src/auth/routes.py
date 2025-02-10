import os

from src.models.user import User
from .. import  db
from src.models import UserModel, AdminModel
from src.mail.functions import sendMail
from flask import Blueprint, app, jsonify, request, send_from_directory
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from werkzeug.utils import secure_filename 


# Crear el Blueprint para las rutas de autenticación
auth = Blueprint('auth', __name__, url_prefix='/auth')
image = Blueprint('users', __name__, url_prefix='/users')
# **Ruta de Login para Usuarios**
@auth.route('/login', methods=['POST'])
def login():
    email = request.json.get('email')
    password = request.json.get('password')

    user = UserModel.query.filter_by(email=email).first()
    if user and user.validate_pass(password):  
        token = create_access_token(identity=str(user.id))

        data = {
            "id": str(user.id),  
            "email": user.email,
            "token": token 
        }
        return jsonify(data), 200
    else:
        return jsonify({'message': 'Invalid credentials'}), 401




# **Ruta de Login para Administradores**
@auth.route('/login/admin', methods=['POST'])
def admin_login():
    email = request.json.get('email')
    password = request.json.get('password')

    print(f"🔍 Intentando login con: {email}")  
    admin = AdminModel.query.filter_by(email=email).first()

    if not admin:
        print("Administrador no encontrado")  
        return {'message': 'Invalid credentials'}, 401

    print(f"Administrador encontrado: {admin.email}")  

    if not admin.validate_pass(password):
        print("Contraseña incorrecta")  
        return {'message': 'Invalid credentials'}, 401

    token = create_access_token(identity=str(admin.id), additional_claims={
        "id": str(admin.id),
        "email": admin.email,
        "role": "admin"
    })

    return {"id": str(admin.id), "email": admin.email, "token": token}, 200


# **Ruta de Registro para Usuarios**
@auth.route('/register', methods=['POST'])
def register():
    # Obtener datos del cuerpo de la solicitud
    data = request.json
    user = UserModel.from_json(data)  
    
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