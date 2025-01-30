from flask import request

def paginate(query):
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 9, type=int)

    print(f"🚀 Paginando - page: {page}, per_page: {per_page}")

    # Validar que page y per_page sean enteros positivos
    if page < 1 or per_page < 1:
        return {"message": "Los valores de page y per_page deben ser positivos"}, 422

    try:
        paginated_query = query.paginate(page=page, per_page=per_page, error_out=False)
    except Exception as e:
        return {"message": "Error en la paginación", "error": str(e)}, 422

    return {
        'total': paginated_query.total,
        'pages': paginated_query.pages,
        'current_page': paginated_query.page,
        'next_page': paginated_query.next_num,
        'prev_page': paginated_query.prev_num,
        'has_next': paginated_query.has_next,
        'has_prev': paginated_query.has_prev,
        'items': [item.to_json() for item in paginated_query.items]
    }
