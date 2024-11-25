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
  # Todos los ratings de un poema
  def get(self, poem_id):
    ratings = db.session.query(RatingModel).filter_by(poem_id=poem_id).order_by(RatingModel.date_created)
    return jsonify([rating.to_json() for rating in ratings])
  
  def post(self):
    rating = RatingModel.from_json(request.get_json())
    db.session.add(rating)
    db.session.commit()
    return rating.to_json(), 201