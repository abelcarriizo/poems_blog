from sqlalchemy import func
from .. import db
from src.models import PoemModel
from src.utils import paginate
from src.utils import sort_ratings_newest_to_oldest, sort_ratings_oldest_to_newest
from src.utils import filter_poem_by_user
from src.models import RatingModel

from flask import jsonify, request
from flask_restful import Resource
from flask_jwt_extended import get_jwt_identity, jwt_required

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
      query = db.session.query(PoemModel, func.count(RatingModel.id).label('rating_count')) \
                        .outerjoin(RatingModel, PoemModel.id == RatingModel.poem_id) \
                        .group_by(PoemModel.id)
  
      # Obtener parámetros de ordenamiento
      sort_order = request.args.get('sort', 'least_rated')
  
      # Ordenar por cantidad de calificaciones (prioridad a los menos calificados)
      if sort_order == 'least_rated':
          query = query.order_by('rating_count', PoemModel.date_created.asc())  # Primero los menos calificados
      elif sort_order == 'most_rated':
          query = query.order_by('rating_count', PoemModel.date_created.desc())  # Primero los más calificados
      elif sort_order == 'newest':
          query = query.order_by(PoemModel.date_created.desc())  # Más recientes primero
      elif sort_order == 'oldest':
          query = query.order_by(PoemModel.date_created.asc())  # Más antiguos primero
  
      results = [{"id": poem.id, "title": poem.title, "rating_count": rating_count} for poem, rating_count in query.all()]
      return jsonify(results)

  @jwt_required()
  def post(self):
    user_id = get_jwt_identity()  # Obtener ID del usuario autenticado

    # Contar cuántos ratings ha hecho el usuario
    rating_count = db.session.query(RatingModel).filter_by(author_id=user_id).count()

    if rating_count < 5:
        return jsonify({"error": "Debes calificar al menos 5 poemas antes de subir uno nuevo."}), 403

    poem = PoemModel.from_json(request.get_json())
    poem.author_id = user_id  # Asignar autor
    db.session.add(poem)
    db.session.commit()
    return poem.to_json(), 201