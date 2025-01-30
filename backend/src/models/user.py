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
    image_url = db.Column(db.String(255), nullable=True)  # Campo para la imagen

    poems = db.relationship('Poem', back_populates='author', cascade='all, delete-orphan')
    ratings = db.relationship('Rating', back_populates='author', cascade='all, delete-orphan')

    # Métodos de seguridad (hash de contraseñas, validación, etc.)
    @property
    def plain_password(self):
        raise AttributeError('Password cant be read')

    @plain_password.setter
    def plain_password(self, password):
        self.password = generate_password_hash(password)

    def validate_pass(self, password):
        return check_password_hash(self.password, password)

    def __repr__(self) -> str:
        return f'Usuario: {self.username}'

    # Convertir objeto a JSON
    def to_json(self):
        return {
            "id": self.id,
            "firstname": self.firstname,
            "lastname": self.lastname,
            "username": self.username,
            "gender": self.gender,
            "description": self.description,
            "email": self.email,
            "image_url": self.image_url,  # Agregar la URL de la imagen al JSON
        }

    # Convertir JSON a objeto
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
        image_url = user_json.get("image_url")  # Obtener el campo de imagen
        return User(id=id, firstname=firstname, lastname=lastname, username=username, gender=gender, description=description, email=email, plain_password=password, image_url=image_url)
