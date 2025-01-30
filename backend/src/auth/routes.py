import os

from src.models.user import User
from .. import  db
from ..utils import allowed_file
from src.models import UserModel, AdminModel
from src.mail.functions import sendMail
from flask import Blueprint, app, jsonify, request
from flask_jwt_extended import create_access_token
from werkzeug.utils import secure_filename  # ✅ Importa secure_filename correctamente


# Crear el Blueprint para las rutas de autenticación
auth = Blueprint('auth', __name__, url_prefix='/auth')
# **Ruta de Login para Usuarios**
@auth.route('/login', methods=['POST'])
def login():
    email = request.json.get('email')
    password = request.json.get('password')

    user = UserModel.query.filter_by(email=email).first()
    if user and user.validate_pass(password):  
        # ✅ Cambiar `identity` a un string con el ID del usuario
        token = create_access_token(identity=str(user.id))

        data = {
            "id": str(user.id),  # Asegurar que el ID es string
            "email": user.email,
            "access_token": token
        }
        return data, 200
    else:
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
@auth.route('/api/users/<int:user_id>/upload-image', methods=['POST'])
def upload_user_image(user_id):
    if 'image' not in request.files:
        return jsonify({'error': 'No se envió ninguna imagen'}), 400

    file = request.files['image']

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)

        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'Usuario no encontrado'}), 404

        # Actualizar la URL de la imagen del usuario
        user.image_url = filepath
        db.session.commit()

        return jsonify({'message': 'Imagen subida correctamente', 'image_url': filepath}), 200

    return jsonify({'error': 'Archivo no permitido'}), 400
