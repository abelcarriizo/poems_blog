from .. import db
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model): 
    __tablename__ = 'Users'

    id = db.Column(db.Integer, primary_key=True)
    firstname = db.Column(db.String(10), nullable=False)
    lastname = db.Column(db.String(15), nullable=False)
    username = db.Column(db.String(40), nullable=False, unique=True)
    gender = db.Column(db.String(10), nullable=False)
    description = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(40), nullable=False, unique=True)
    password = db.Column(db.String(255), nullable=False)
    image_url = db.Column(db.String(255), nullable=True, default="/static/uploads/default-avatar.jpg")

    poems = db.relationship('Poem', back_populates='author', cascade='all, delete-orphan')
    ratings = db.relationship('Rating', back_populates='author', cascade='all, delete-orphan')

    @property
    def plain_password(self):
        raise AttributeError('Password cannot be read')

    @plain_password.setter
    def plain_password(self, password):
        self.password = generate_password_hash(password)

    def validate_pass(self, password):
        return check_password_hash(self.password, password)


    def to_json(self):
        if self.image_url and not self.image_url.startswith("/static/uploads/"):
            image_path = f"/static/uploads/{self.id}/{self.image_url}"
        elif not self.image_url or self.image_url == "/static/uploads/default-avatar.jpg":
            # Asignar la imagen por defecto dentro de la carpeta del usuario
            image_path = f"/static/uploads/{self.id}/default-avatar.jpg"
        else:
            image_path = self.image_url
        
        return {
            "id": self.id,
            "firstname": self.firstname,
            "lastname": self.lastname,
            "username": self.username,
            "gender": self.gender,
            "description": self.description,
            "email": self.email,
            "image_url": f"http://localhost:5000{image_path}"
        }

    @staticmethod
    def from_json(user_json):
        return User(
            id=user_json.get("id"),
            firstname=user_json.get("firstname"),
            lastname=user_json.get("lastname"),
            username=user_json.get("username"),
            gender=user_json.get("gender"),
            description=user_json.get("description"),
            email=user_json.get("email"),
            plain_password=user_json.get("password"),
            image_url=user_json.get("image_url")
        )
