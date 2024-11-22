from flask import request
from flask_restful import Resource
from src.database import poemsDB

class Poem(Resource):
  def get(self, id):
    if int(id) in poemsDB:
      return poemsDB[int(id)]
    return '', 404
  
  def put(self, id):
    if int(id) in poemsDB:
      poem = poemsDB[int(id)]
      data = request.get_json()
      poem.update(data)
      return poem
    return '', 404
  
  def delete(self, id):
    if int(id) in poemsDB:
      del poemsDB[int(id)]
      return '', 204
    return '', 404

class Poems(Resource):
  def get(self):
    return poemsDB
  
  def post(self, id):
    id = int(max(poemsDB.keys())) + 1
    poem = request.get_json()
    poemsDB[id] = poem
    print(poemsDB)
    return '', 201   