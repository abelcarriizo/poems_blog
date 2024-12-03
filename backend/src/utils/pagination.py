from flask import request

def paginate(query):
    """
    Realiza la paginación sobre una consulta SQLAlchemy.

    Args:
        query: La consulta SQLAlchemy a paginar.
        model: El modelo SQLAlchemy para convertir los resultados a JSON.

    Returns:
        dict: Diccionario con la información de la paginación.
    """
    # Obtener los parámetros de la solicitud (page y per_page con valores predeterminados)
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)

    # Realizar la paginación en la consulta
    paginated_query = query.paginate(page=page, per_page=per_page, error_out=False)

    # Formatear los datos paginados
    return {
        'total': paginated_query.total,         # Total de elementos
        'pages': paginated_query.pages,         # Total de páginas
        'current_page': paginated_query.page,   # Página actual
        'next_page': paginated_query.next_num,  # Número de la siguiente página
        'prev_page': paginated_query.prev_num,  # Número de la página anterior
        'has_next': paginated_query.has_next,   # ¿Hay página siguiente?
        'has_prev': paginated_query.has_prev,   # ¿Hay página anterior?
        'items': [item.to_json() for item in paginated_query.items]  # Elementos en la página actual
    }
