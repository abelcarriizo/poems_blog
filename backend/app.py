import os
from src import create_app, db

app = create_app()
app.app_context().push()

if __name__ == '__main__':
  db.create_all()
  app.run(debug=True, port=os.getenv("FLASK_PORT"))