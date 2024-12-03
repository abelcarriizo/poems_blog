from src.models import PoemModel

def filter_poem_by_user(user_id, query):
    """
    Filtra todos los ratings realizados por un usuario específico.
    """
    return query.filter(PoemModel.author_id == user_id)