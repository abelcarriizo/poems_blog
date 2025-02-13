from .. import jwt
from src.models import AdminModel
from src.models import  UserModel
from flask_jwt_extended import verify_jwt_in_request, get_jwt
from functools import wraps
from .decorators import verify_jwt_in_request

# Decorador para restringir el acceso a usuarios administradores
def admin_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        verify_jwt_in_request()
        claims = get_jwt()  
        if claims.get('role') == 'admin':
            return fn(*args, **kwargs)  # Ejecutar función si es admin
        else:
            return {'message': 'Only admins can access this resource'}, 403
    return wrapper

# Cargar la identidad del usuario (ID)
@jwt.user_identity_loader
def user_identity_lookup(identity):
    return str(identity) 


# Cargar claims adicionales en el token
@jwt.additional_claims_loader
def add_claims_to_access_token(identity):
    user = UserModel.query.get(identity)  

    if not user:
        return {}

    return {
        'role': 'admin' if isinstance(user, AdminModel) else 'user',
        'id': str(user.id),  
        'email': user.email
    }
