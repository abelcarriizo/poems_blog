from .. import jwt
from src.models import AdminModel

from flask_jwt_extended import verify_jwt_in_request, get_jwt
from functools import wraps
from .decorators import verify_jwt_in_request

# Decorador para restringir el acceso a usuarios administradores
def admin_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        verify_jwt_in_request()  # Verificar que el JWT es correcto
        claims = get_jwt()  # Obtener claims del JWT
        # Verificar que el usuario sea un administrador
        if claims.get('role') == 'admin':
            return fn(*args, **kwargs)  # Ejecutar función si es admin
        else:
            return {'message': 'Only admins can access this resource'}, 403
    return wrapper

# Cargar la identidad del usuario (ID)
@jwt.user_identity_loader
def user_identity_lookup(user):
    return str(user.id)

# Cargar claims adicionales en el token (roles, email, etc.)
@jwt.additional_claims_loader
def add_claims_to_access_token(user):
    claims = {
        'role': 'admin' if isinstance(user, AdminModel) else 'user',
        'id': user.id,
        'email': user.email
    }
    return claims