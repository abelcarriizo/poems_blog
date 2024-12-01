from .. import db
from src.models import PoemModel
from src.utils import paginate
from src.utils import sort_ratings_newest_to_oldest, sort_ratings_oldest_to_newest
from src.utils import filter_poem_by_user

from flask import jsonify, request
from flask_restful import Resource
from flask_jwt_extended import jwt_required

class Poem(Resource):
  @jwt_required(optional=True)
  def get(self, id):
    poem = db.session.query(PoemModel).get_or_404(id)
    return poem.to_json()
  
  @jwt_required()
  def put(self, id):
    poem = db.session.query(PoemModel).get_or_404(id)
    data = request.get_json().items()
    for key, value in data:
      setattr(poem, key, value)
    db.session.add(poem)
    db.session.commit()
    return poem.to_json(), 201
  
  @jwt_required()
  def delete(self, id):
    poem = db.session.query(PoemModel).get_or_404(id)
    db.session.delete(poem)
    db.session.commit()
    return '', 204

class Poems(Resource):
  @jwt_required(optional=True)
  def get(self):   
    # Filtrar por parámetros opcionales en la URL
    query = db.session.query(PoemModel)    
    # Filtrar por parámetros opcionales en la URL
    user_id = request.args.get('user_id', type=int)
    sort_order = request.args.get('sort', 'newest')  # 'newest' o 'oldest'

    # Aplicar filtraciones
    if user_id:
      query = filter_poem_by_user(user_id, query)

    # Ordenar los resultados
    if sort_order == 'newest':
      query = sort_ratings_newest_to_oldest(query, PoemModel)
    elif sort_order == 'oldest':
      query = sort_ratings_oldest_to_newest(query, PoemModel)

    # Paginación
    paginated_data = paginate(query)
    return jsonify(paginated_data)
  
  @jwt_required()
  def post(self):
    poem = PoemModel.from_json(request.get_json())
    db.session.add(poem)
    db.session.commit()
    return poem.to_json(), 201
  