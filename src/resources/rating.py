from .. import db
from src.models import RatingModel
from src.utils import paginate
from src.utils import sort_ratings_newest_to_oldest, sort_ratings_oldest_to_newest
from src.utils import filter_ratings_by_user, filter_ratings_by_poem

from flask import jsonify, request
from flask_restful import Resource

class Rating(Resource):
  def get(self, id):
    rating = db.session.query(RatingModel).get_or_404(id)
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
  def get(self):
    query = db.session.query(RatingModel)    
    # Filtrar por parámetros opcionales en la URL
    user_id = request.args.get('user_id', type=int)
    poem_id = request.args.get('poem_id', type=int)
    sort_order = request.args.get('sort', 'newest')  # 'newest' o 'oldest'

    # Aplicar filtraciones
    if user_id:
      query = filter_ratings_by_user(user_id, query)
    if poem_id:
      query = filter_ratings_by_poem(poem_id, query)

    # Ordenar los resultados
    if sort_order == 'newest':
      query = sort_ratings_newest_to_oldest(query, RatingModel)
    elif sort_order == 'oldest':
      query = sort_ratings_oldest_to_newest(query, RatingModel)

    # Paginación
    paginated_data = paginate(query)
    return jsonify(paginated_data)
  
  def post(self):
    rating = RatingModel.from_json(request.get_json())
    db.session.add(rating)
    db.session.commit()
    return rating.to_json(), 201