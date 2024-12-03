from .. import db
from src.models import UserModel
from src.utils import paginate
from src.auth.decorators import admin_required

from flask import jsonify, request
from flask_restful import Resource
from flask_jwt_extended import jwt_required

class User(Resource):
  @jwt_required()
  def get(self,id):
    user = db.session.query(UserModel).get_or_404(id)
    return user.to_json()
  
  @jwt_required()
  def put(self, id):
    user = db.session.query(UserModel).get_or_404(id)
    data = request.get_json().items()
    for key, value in data:
      setattr(user, key, value)
    db.session.add(user)
    db.session.commit()
    return user.to_json(), 201

  @admin_required
  def delete(self, id):
    user = db.session.query(UserModel).get_or_404(id)
    db.session.delete(user)
    db.session.commit()
    return '', 204
  
class Users(Resource):
  @jwt_required(optional=True)
  def get(self):
    query = UserModel.query
    data = paginate(query)
    return jsonify(data)
  
  @admin_required
  def post(self):
    user = UserModel.from_json(request.get_json())
    db.session.add(user)
    db.session.commit()
    return user.to_json(), 201
      