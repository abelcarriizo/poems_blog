from .. import db
from sqlalchemy.orm import validates

class Rating(db.Model):
  __tablename__ = 'Ratings'

  id = db.Column(db.Integer, primary_key=True)
  author_id = db.Column(db.Integer, db.ForeignKey('Users.id'), nullable=False)
  poem_id = db.Column(db.Integer, db.ForeignKey('Poems.id'), nullable=False)
  date_created = db.Column(db.DateTime, server_default=db.func.now(), nullable=False)
  stars = db.Column(db.Integer, nullable=False)
  comment = db.Column(db.String(255))

  author = db.relationship('User', back_populates='ratings')
  poem = db.relationship('Poem', back_populates='ratings')
  
  # Valida que las estrellas estén entre 1 y 5 antes de asignar el valor
  @validates('estrellas')
  def validate_estrellas(self, key, value):
    if value < 1 or value > 5:
      raise ValueError("El valor de 'estrellas' debe estar entre 1 y 5")
    return value
  
  #Convertir objeto a JSON
  def to_json(self):
    rating_json = {
      "id": self.id,
      "author_id": self.author_id,
      "poem_id": self.poem_id,
      "date_created": self.date_created.isoformat(),
      "comment": self.content
      }
    return rating_json
  
  #Convertir JSON a objeto
  @staticmethod
  def from_json(rating_json):
    id = rating_json.get("id")
    author_id = rating_json.get("author_id")
    poem_id = rating_json.get("poem_id")
    date_created = rating_json.get("date_created")
    comment = rating_json.get("content")
    return Rating(id=id, author_id=author_id, poem_id=poem_id, date_created=date_created, comment=comment)