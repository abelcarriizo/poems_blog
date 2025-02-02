from flask_jwt_extended import jwt_required

from src.models.poem import Poem
from src.models.rating import Rating
from src.models.user import User
from .. import db
from src.models.admin import Admin as AdminModel
from src.utils import paginate
from src.auth.decorators import admin_required

from flask import jsonify, request
from flask_restful import Resource

class Admin(Resource):
  @admin_required
  def get(self, id):
    admin = db.session.query(AdminModel).get_or_404(id)
    return admin.to_json()
  
  @admin_required
  def put(self, id):
    admin = db.session.query(AdminModel).get_or_404(id)
    data = request.get_json().items()
    for key, value in data:
        setattr(admin, key, value)
    db.session.add(admin)
    db.session.commit()
    return admin.to_json(), 201
  
  @admin_required
  def delete(self, id):
    admin = db.session.query(AdminModel).get_or_404(id)
    db.session.delete(admin)
    db.session.commit()
    return '', 204
    
class Admins(Resource):
  @admin_required
  def get(self):
    query = AdminModel.query
    data = paginate(query)
    return jsonify(data)
  
  
  def post(self):
    admin = AdminModel.from_json(request.get_json())
    db.session.add(admin)
    db.session.commit()
    return admin.to_json(), 201

class AdminStats(Resource):
    @jwt_required()
    def get(self):
        """🔹 Retorna las estadísticas de la plataforma."""
        total_users = User.query.count()
        total_poems = Poem.query.count()
        total_ratings = Rating.query.count()
        total_admins = db.session.query(AdminModel).count()  

        return jsonify({
            "total_users": total_users,
            "total_poems": total_poems,
            "total_ratings": total_ratings,
            "total_admins": total_admins
        })