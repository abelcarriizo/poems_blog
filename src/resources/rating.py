from .. import db
from src.models import RatingModel

from flask import jsonify, request
from flask_restful import Resource

class Rating(Resource):
  def get(self, id):
    rating = db.session.query(RatingModel).get_or_404(id)
    
    print(rating)
    
    return rating.to_json()
  
  def put(self, id):
    rating = db.session.query(RatingModel).get_or_404(id)
    data = request.get_json().items()
    for key, value in data:
      setattr(rating, key, value)
    db.session.add(rating)
    db.session.commit()
    return rating.to_json(), 201
  
  def delete(self, id):
    rating = db.session.query(RatingModel).get_or_404(id)
    db.session.delete(rating)
    db.session.commit()
    return '', 204
  
class Ratings(Resource):
  def get(self, poem_id):
    # Obtener parámetros de paginación de la solicitud
    page = request.args.get('page', 1, type=int) # Numero de página, por defecto 1
    per_page = request.args.get('per_page', 10, type=int) # Elementos por página, por defecto 10
    
    # Realizar la consulta a la base de datos con paginación
    ratings = db.session.query(RatingModel).filter_by(poem_id=poem_id).order_by(RatingModel.date_created).paginate(page=page, per_page=per_page, error_out=False)
    
    # Formatear la respuesta con los datos paginados
    data = {
      'total': ratings.total,  # Total de elementos
      'pages': ratings.pages,  # Total de páginas
      'current_page': ratings.page,  # Página actual
      'next_page': ratings.next_num,  # Siguiente número de página
      'prev_page': ratings.prev_num,  # Número de página anterior
      'has_next': ratings.has_next,  # ¿Hay una página siguiente?
      'has_prev': ratings.has_prev,  # ¿Hay una página anterior?
      'items': [rating.to_json() for rating in ratings.items]  # Elementos en la página actual
      }
    
    return jsonify(data)
  
  def post(self):
    rating = RatingModel.from_json(request.get_json())
    db.session.add(rating)
    db.session.commit()
    return rating.to_json(), 201