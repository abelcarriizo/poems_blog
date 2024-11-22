from flask import request
from flask_restful import Resource
from src.database import usersDB

class User(Resource):
  def get(self,id):
    if int(id) in usersDB:
      return usersDB[int(id)]
    return '', 404
  
  def put(self, id):
    if int(id) in usersDB:
      user = usersDB[int(id)]
      data = request.get_json()
      user.update(data)
      return user
    return '', 404
  
  def delete(self, id):
    if int(id) in usersDB:
      del usersDB[int(id)]
      return '', 204
    return '', 404
  
class Users(Resource):
  def get(self):
    return usersDB
  
  def post(self):
    id = int(max(usersDB.keys())) + 1
    user = request.get_json()
    usersDB[id] = user
    print(usersDB)
    return '', 201