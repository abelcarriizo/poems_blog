from .. import db

class Poem(db.Model):
  __tablename__ = 'Poems'

  id = db.Column(db.Integer, primary_key=True)
  title = db.Column(db.String(120), nullable=False)
  author_id = db.Column(db.Integer, db.ForeignKey('Users.id'), nullable=False)
  genre = db.Column(db.String(50), nullable=False)
  date_created = db.Column(db.DateTime, server_default=db.func.now(), nullable=False)
  description = db.Column(db.String(255)) #Descripcion breve del poema
  content = db.Column(db.Text, nullable=False) #Contenido extenso del poema

  author = db.relationship('User', back_populates='poems')
  ratings = db.relationship('Rating', back_populates='poem', cascade='all, delete-orphan')
  
  #Convertir objeto a JSON
  def to_json(self):
    poem_json = {
       "id": self.id,
       "title": self.title,
       "author_id": self.author_id,
       "genre": self.genre,
       "date_created": self.date_created.isoformat(),
       "description": self.description,
       "content": self.content
       }
    return poem_json
  
  #Convertir JSON a objeto
  @staticmethod
  def from_json(poem_json):
    id = poem_json.get("id")
    title = poem_json.get("title")
    author_id = poem_json.get("author_id")
    genre = poem_json.get("genre")
    date_created = poem_json.get("date_created")
    description = poem_json.get("description")
    content = poem_json.get("content")
    return Poem(id=id, title=title, author_id=author_id, genre=genre, date_created=date_created, description=description, content=content)
