from flask import request
from flask_restful import Resource
from src.database import ratingsDB

class Rating(Resource):
  def get(self, id):
    if int(id) in ratingsDB:
      return ratingsDB[int(id)]
    return '', 404
  
  def put(self, id):
    if int(id) in ratingsDB:
      rating = ratingsDB[int(id)]
      data = request.get_json()
      rating.update(data)
      return rating, 201
    return '', 404
  
  def delete(self, id):
    if int(id) in ratingsDB:
      del ratingsDB[int(id)]
      return '', 204
    return '', 404
  
class Ratings(Resource):
  def get(self):
    return ratingsDB
  
  def post(self):
    id = int(max(ratingsDB.keys())) + 1
    rating = request.get_json()
    ratingsDB[id] = rating
    return '', 201
