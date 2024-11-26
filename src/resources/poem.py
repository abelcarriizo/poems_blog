from .. import db
from src.models import PoemModel

from flask import jsonify, request
from flask_restful import Resource

class Poem(Resource):
  def get(self, id):
    poem = db.session.query(PoemModel).get_or_404(id)
    return poem.to_json()
  
  def put(self, id):
    poem = db.session.query(PoemModel).get_or_404(id)
    data = request.get_json().items()
    for key, value in data:
      setattr(poem, key, value)
    db.session.add(poem)
    db.session.commit()
    return poem.to_json(), 201
  
  def delete(self, id):
    poem = db.session.query(PoemModel).get_or_404(id)
    db.session.delete(poem)
    db.session.commit()
    return '', 204

class Poems(Resource):
  def get(self):
    # Obtener parámetros de paginación de la solicitud
    page = request.args.get('page', 1, type=int)  # Número de página, por defecto 1
    per_page = request.args.get('per_page', 10, type=int)  # Elementos por página, por defecto 10

    # Realizar la consulta a la base de datos con paginación
    poems = PoemModel.query.paginate(page=page, per_page=per_page, error_out=False)

    # Formatear la respuesta con los datos paginados
    data = {
      'total': poems.total,  # Total de elementos
      'pages': poems.pages,  # Total de páginas
      'current_page': poems.page,  # Página actual
      'next_page': poems.next_num,  # Siguiente número de página
      'prev_page': poems.prev_num,  # Número de página anterior
      'has_next': poems.has_next,  # ¿Hay una página siguiente?
      'has_prev': poems.has_prev,  # ¿Hay una página anterior?
      'items': [poem.to_json() for poem in poems.items]  # Elementos en la página actual
      }

    return jsonify(data)
  
  def post(self):
    poem = PoemModel.from_json(request.get_json())
    db.session.add(poem)
    db.session.commit()
    return poem.to_json(), 201
  