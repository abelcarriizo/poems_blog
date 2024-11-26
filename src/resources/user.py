from .. import db
from src.models import UserModel

from flask import jsonify, request
from flask_restful import Resource

class User(Resource):
  def get(self,id):
    user = db.session.query(UserModel).get_or_404(id)
    return user.to_json()
  
  def put(self, id):
    user = db.session.query(UserModel).get_or_404(id)
    data = request.get_json().items()
    for key, value in data:
      setattr(user, key, value)
    db.session.add(user)
    db.session.commit()
    return user.to_json(), 201

  def delete(self, id):
    user = db.session.query(UserModel).get_or_404(id)
    db.session.delete(user)
    db.session.commit()
    return '', 204
  
class Users(Resource):
  def get(self):
    # Obtener parámetros de paginación de la solicitud
    page = request.args.get('page', 1, type=int) # Numero de página, por defecto 1
    per_page = request.args.get('per_page', 10, type=int) # Elementos por página, por defecto 10
    
    # Realizar la consulta a la base de datos con paginación
    users = UserModel.query.paginate(page=page, per_page=per_page, error_out=False)
    
    # Formatear la respuesta con los datos paginados
    data = {
      'total': users.total,  # Total de elementos
      'pages': users.pages,  # Total de páginas
      'current_page': users.page,  # Página actual
      'next_page': users.next_num,  # Siguiente número de página
      'prev_page': users.prev_num,  # Número de página anterior
      'has_next': users.has_next,  # ¿Hay una página siguiente?
      'has_prev': users.has_prev,  # ¿Hay una página anterior?
      'items': [user.to_json() for user in users.items]  # Elementos en la página actual
      }
    
    return jsonify(data)
  
  def post(self):
    user = UserModel.from_json(request.get_json())
    db.session.add(user)
    db.session.commit()
    return user.to_json(), 201
      