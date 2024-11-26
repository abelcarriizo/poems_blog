from .. import db
from src.models import AdminModel
from flask import jsonify, request
from flask_restful import Resource

class Admin(Resource):
  def get(self, id):
    admin = db.session.query(AdminModel).get_or_404(id)
    return admin.to_json()
  
  def put(self, id):
    admin = db.session.query(AdminModel).get_or_404(id)
    data = request.get_json().items()
    for key, value in data:
        setattr(admin, key, value)
    db.session.add(admin)
    db.session.commit()
    return admin.to_json(), 201
  
  def delete(self, id):
    admin = db.session.query(AdminModel).get_or_404(id)
    db.session.delete(admin)
    db.session.commit()
    return '', 204
    
class Admins(Resource):
  def get(self):
    # Obtener parámetros de paginación de la solicitud
    page = request.args.get('page', 1, type=int) # Numero de página, por defecto 1
    per_page = request.args.get('per_page', 10, type=int) # Elementos por página, por defecto 10
    
    # Realizar la consulta a la base de datos con paginación
    admins = AdminModel.query.paginate(page=page, per_page=per_page, error_out=False)
    
    # Formatear la respuesta con los datos paginados
    data = {
      'total': admins.total,  # Total de elementos
      'pages': admins.pages,  # Total de páginas
      'current_page': admins.page,  # Página actual
      'next_page': admins.next_num,  # Siguiente número de página
      'prev_page': admins.prev_num,  # Número de página anterior
      'has_next': admins.has_next,  # ¿Hay una página siguiente?
      'has_prev': admins.has_prev,  # ¿Hay una página anterior?
      'items': [admin.to_json() for admin in admins.items]  # Elementos en la página actual
      }
    
    return jsonify(data)
  
  def post(self):
    admin = AdminModel.from_json(request.get_json())
    db.session.add(admin)
    db.session.commit()
    return admin.to_json(), 201
