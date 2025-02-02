from .. import db
from src.models import UserModel
from src.utils import paginate
from src.auth.decorators import admin_required

from flask import jsonify, request
from flask_restful import Resource
from flask_jwt_extended import jwt_required

class User(Resource):
  @jwt_required()
  def get(self, id):
    user = db.session.query(UserModel).get(id)  # No usar get_or_404() aquí
    if not user:
        return jsonify({'error': 'Usuario no encontrado'}), 404
    return user.to_json()

  
  @jwt_required()
  def put(self, id):
    user = db.session.query(UserModel).get_or_404(id)
    data = request.get_json().items()
    for key, value in data:
      setattr(user, key, value)
    db.session.add(user)
    db.session.commit()
    return user.to_json(), 201

  @admin_required
  def delete(self, id):
    user = db.session.query(UserModel).get_or_404(id)
    db.session.delete(user)
    db.session.commit()
    return '', 204
  
class Users(Resource):
  @jwt_required(optional=True)
  def get(self):
    query = UserModel.query
    data = paginate(query)
    return jsonify(data)
  
  @admin_required
  def post(self):
    user = UserModel.from_json(request.get_json())
    db.session.add(user)
    db.session.commit()
    return user.to_json(), 201
import os
from flask import Blueprint, request, jsonify, send_from_directory
from werkzeug.utils import secure_filename
from src.models import UserModel  # ✅ Importar el modelo correctamente
from .. import db

UPLOAD_FOLDER = 'uploads/'  # Carpeta donde se guardan las imágenes

# Crear el Blueprint de usuarios
users = Blueprint('users', __name__)

# Asegurar que la carpeta de subidas exista
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@users.route('/<int:user_id>/upload-image', methods=['POST', 'OPTIONS'])
def upload_user_image(user_id):
    if request.method == 'OPTIONS':
        return jsonify({'status': 'OK'}), 200  # Permitir preflight CORS

    print(f"📥 Intentando subir imagen para usuario {user_id}")  # Debug

    if 'image' not in request.files:
        print("❌ No se envió ninguna imagen")  # Debug
        return jsonify({'error': 'No se envió ninguna imagen'}), 400

    file = request.files['image']
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        file.save(filepath)

        # ✅ Obtener el usuario correctamente
        user = User.query.get(user_id)
        if not user:
            print("❌ Usuario no encontrado")  # Debug
            return jsonify({'error': 'Usuario no encontrado'}), 404

        user.image_url = f"/uploads/{filename}"  # ✅ Guardamos la URL relativa
        db.session.commit()

        return jsonify({'message': 'Imagen subida correctamente', 'image_url': user.image_url}), 200

    return jsonify({'error': 'Archivo no permitido'}), 400

@users.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)
