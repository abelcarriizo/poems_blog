from src.models import RatingModel

def filter_ratings_by_user(user_id, query):
    """
    Filtra todos los ratings realizados por un usuario específico.
    """
    return query.filter(RatingModel.author_id == user_id)

def filter_ratings_by_poem(poem_id, query):
    """
    Filtra todos los ratings asociados a un poema específico.
    """
    return query.filter(RatingModel.poem_id == poem_id)
