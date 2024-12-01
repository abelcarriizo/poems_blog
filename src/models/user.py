from ..import db
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
  __tablename__ = 'Users'

  id = db.Column(db.Integer, primary_key=True)
  firstname = db.Column(db.String(10), nullable=False)
  lastname = db.Column(db.String(15), nullable=False)
  username = db.Column(db.String(40), nullable=False)
  gender = db.Column(db.String(10), nullable=False)
  description = db.Column(db.String(100), nullable=False)
  email = db.Column(db.String(40), nullable=False)
  password = db.Column(db.String(255), nullable=False)

  poems = db.relationship('Poem', back_populates='author', cascade='all, delete-orphan')
  ratings = db.relationship('Rating', back_populates='author', cascade='all, delete-orphan')
  
  #Getter de la contraseña plana no permite leerla
  @property
  def plain_password(self):
    raise AttributeError('Password cant be read')
  
  #Setter de la contraseña toma un valor en texto plano
  # calcula el hash y lo guarda en el atributo password
  @plain_password.setter
  def plain_password(self, password):
    self.password = generate_password_hash(password)
    
  #Método que compara una contraseña en texto plano con el hash guardado en la db
  def validate_pass(self,password):
    return check_password_hash(self.password, password)

  def __repr__(self) -> str:
    return f'Usuario: {self.username}'
  
  # Convertir objeto a json
  def to_json(self):
    return {
      "id": self.id,
      "firstname": self.firstname,
      "lastname": self.lastname,
      "username": self.username,
      "gender": self.gender,
      "description": self.description,
      "email": self.email,
    }
  
  # Convertir json a objeto
  @staticmethod
  def from_json(user_json):
    id = user_json.get("id")
    firstname = user_json.get("firstname")
    lastname = user_json.get("lastname")
    username = user_json.get("username")
    gender = user_json.get("gender")
    description = user_json.get("description")
    email = user_json.get("email")
    password = user_json.get("password")
    return User(id=id, firstname=firstname, lastname=lastname, username=username, gender=gender, description=description, email=email, plain_password=password)
