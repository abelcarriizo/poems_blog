import os
import uuid
from flask import Blueprint, request, jsonify, send_from_directory
from flask_restful import Resource
from flask_jwt_extended import jwt_required
from werkzeug.utils import secure_filename
from .. import db
from src.models import UserModel
from src.utils import paginate
from src.auth.decorators import admin_required

# 📌 Definir la carpeta donde se guardan las imágenes
UPLOAD_FOLDER = os.path.join(os.getcwd(), 'static/uploads/')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)  # Asegurar que la carpeta existe

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    """ Validar si un archivo es permitido """
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

class User(Resource):

    def get(self, id):
        user = db.session.query(UserModel).get(id)
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

    @jwt_required()
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

    @jwt_required()
    def post(self):
        user = UserModel.from_json(request.get_json())
        db.session.add(user)
        db.session.commit()
        return user.to_json(), 201

class UserImageUpload(Resource):
    @jwt_required()
    def post(self, user_id):
        """ Manejar la carga de imágenes de perfil """
        if 'file' not in request.files:
            return {'message': '❌ No se envió ningún archivo'}, 400

        file = request.files['file']
        if file.filename == '':
            return {'message': '❌ No se seleccionó un archivo'}, 400

        if file and allowed_file(file.filename):
            filename_ext = file.filename.rsplit('.', 1)[-1].lower()
            filename = f"{uuid.uuid4().hex}.{filename_ext}"

            user_folder = os.path.join(UPLOAD_FOLDER, str(user_id))
            os.makedirs(user_folder, exist_ok=True)

            filepath = os.path.join(user_folder, filename)
            file.save(filepath)

            # ✅ Guardamos el nuevo nombre de archivo en la BD
            user = UserModel.query.get(user_id)
            if user:
                user.image_url = f"/static/uploads/{user_id}/{filename}"
                db.session.commit()
                
                print(f"📸 Imagen guardada en: {user.image_url}")  # 🔥 Depuración
                
                return {
                    'message': '✅ Imagen subida con éxito',
                    'image_url': f"http://localhost:5000{user.image_url}"
                }, 200
            else:
                return {'message': '❌ Usuario no encontrado'}, 404
        else:
            return {'message': '❌ Tipo de archivo no permitido'}, 400


# 📌 Blueprint para servir imágenes correctamente
users = Blueprint('users', __name__)
from werkzeug.utils import safe_join
from flask import send_from_directory
from werkzeug.utils import safe_join

@users.route('/static/uploads/<int:user_id>/<path:filename>')
def serve_uploaded_file(user_id, filename):
    """ Servir imágenes desde static/uploads/{user_id}/ """
    user_folder = os.path.join(os.getcwd(), 'backend', 'static', 'uploads', str(user_id))
    filepath = safe_join(user_folder, filename)

    print(f"🔎 Intentando acceder a: {filepath}")  # 🔥 Depuración

    if not os.path.isfile(filepath):
        print("❌ Imagen no encontrada en el servidor")
        return jsonify({'message': '❌ Imagen no encontrada'}), 404

    return send_from_directory(user_folder, filename)
