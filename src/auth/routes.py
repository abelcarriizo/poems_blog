from flask import Blueprint, request
from flask_jwt_extended import create_access_token
from src.models import UserModel
from src.models import AdminModel
from .. import db

auth = Blueprint('auth', __name__, url_prefix='/auth')

# Ruta de login para usuarios
@auth.route('/login', methods=['POST'])
def login():
    email = request.json.get('email')
    password = request.json.get('password')
    
    user = UserModel.query.filter_by(email=email).first()
    if user and user.validate_pass(password):
        
        token = create_access_token(identity=user)
        
        data = {
            "id": str(user.id),
            "email": user.email,
            "access_token": token
        }
        
        return data, 200
    else:
        return {'message': 'Invalid credentials'}, 401

# Ruta de login para administradores
@auth.route('/login/admin', methods=['POST'])
def admin_login():
    email = request.json.get('email')
    password = request.json.get('password')
    
    admin = AdminModel.query.filter_by(email=email).first()
    if admin and admin.validate_pass(password):
        token = create_access_token(identity=admin)
        data = {
            "id": str(admin.id),
            "email": admin.email,
            "access_token": token
        }
        
        return data, 200
    else:
        return {'message': 'Invalid credentials'}, 401

# Ruta de registro para usuarios
@auth.route('/register', methods=['POST'])
def register():
    data = request.json
    user = UserModel.from_json(data)
    
    # Verificar si el email ya existe
    if UserModel.query.filter_by(email=user.email).first():
        return {'message': 'Email already in use'}, 409
    
    db.session.add(user)
    db.session.commit()
    return user.to_json(), 201