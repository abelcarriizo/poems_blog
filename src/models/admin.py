from ..import db

class Admin(db.Model):
  __tablename__ = 'Admins'
  
  id = db.Column(db.Integer, primary_key=True)
  firstname = db.Column(db.String(10), nullable=False)
  lastname = db.Column(db.String(15), nullable=False)
  username = db.Column(db.String(40), nullable=False)
  email = db.Column(db.String(40), nullable=False)
  password = db.Column(db.String(40), nullable=False)

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
    return Admin(id=id, firstname=firstname, lastname=lastname, username=username, email=email, password=password)
