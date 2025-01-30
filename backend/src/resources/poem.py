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
    print("🚀 Flask recibió la petición GET /poems")  
    
    query = db.session.query(PoemModel)

    # Obtener parámetros
    user_id = request.args.get('user_id', type=int)
    sort_order = request.args.get('sort', 'newest')
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 9, type=int)

    print(f"🔍 Parámetros recibidos en Flask:")
    print(f"   user_id: {user_id}")
    print(f"   sort_order: {sort_order}")
    print(f"   page: {page}, per_page: {per_page}")

    # Verificar que los parámetros son correctos
    if page < 1 or per_page < 1:
        print("❌ Error: Parámetros inválidos")
        return jsonify({"message": "Error: Parámetros inválidos"}), 422

    if user_id:
      print(f"🔎 Filtrando por author_id={user_id}...")
      query = query.filter(PoemModel.author_id == user_id)  # ✅ Cambio aquí

    # Ordenar los resultados
    if sort_order == 'newest':
        print("🔄 Ordenando por más reciente primero...")
        query = query.order_by(PoemModel.date_created.desc())  # ✅ Cambio aquí
    elif sort_order == 'oldest':
        print("🔄 Ordenando por más antiguo primero...")
        query = query.order_by(PoemModel.date_created.asc())  # ✅ Cambio aquí

    # Verificar si hay resultados
    try:
        total_results = query.count()
        print(f"✅ Total de poemas encontrados: {total_results}")

        if total_results == 0:
            print("⚠️ No hay poemas para este usuario.")
            return jsonify({"message": "No hay poemas disponibles"}), 200

        # Aplicar paginación
        paginated_data = paginate(query)
        return jsonify(paginated_data)

    except Exception as e:
        print(f"⚠️ Error ejecutando la consulta: {str(e)}")
        return jsonify({"message": "Error en la consulta", "error": str(e)}), 422

  @jwt_required()
  def post(self):
    poem = PoemModel.from_json(request.get_json())
    db.session.add(poem)
    db.session.commit()
    return poem.to_json(), 201
  