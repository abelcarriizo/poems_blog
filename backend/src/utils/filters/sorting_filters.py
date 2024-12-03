def sort_ratings_newest_to_oldest(query, model):
    """
    Ordena los ratings del más nuevo al más viejo.
    """
    return query.order_by(model.date_created.desc())

def sort_ratings_oldest_to_newest(query, model):
    """
    Ordena los ratings del más viejo al más nuevo.
    """
    return query.order_by(model.date_created.asc())