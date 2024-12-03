from ..import db
from werkzeug.security import generate_password_hash, check_password_hash

class Admin(db.Model):
  __tablename__ = 'Admins'
  
  id = db.Column(db.Integer, primary_key=True)
  firstname = db.Column(db.String(10), nullable=False)
  lastname = db.Column(db.String(15), nullable=False)
  username = db.Column(db.String(40), nullable=False)
  email = db.Column(db.String(40), nullable=False)
  password = db.Column(db.String(255), nullable=False)

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
      "email": self.email,
    }
  
  # Convertir json a objeto
  @staticmethod
  def from_json(user_json):
    id = user_json.get("id")
    firstname = user_json.get("firstname")
    lastname = user_json.get("lastname")    
    username = user_json.get("username")
    email = user_json.get("email")
    password = user_json.get("password")
    return Admin(id=id, firstname=firstname, lastname=lastname, username=username, email=email, plain_password=password)