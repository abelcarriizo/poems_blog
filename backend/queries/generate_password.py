from werkzeug.security import generate_password_hash

"""
Este código ha sido creado para generar contraseñas utilizando el mismo algoritmo de encriptación que emplea el proyecto, 
con el fin de mantener la consistencia en la seguridad de las contraseñas almacenadas en la base de datos. 
El propósito es utilizar estas contraseñas encriptadas para crear administradores o una gran cantidad de usuarios 
directamente en la base de datos a través de la terminal, facilitando la carga de datos para realizar pruebas.
El objetivo principal es la validación y pruebas del sistema, no se recomienda utilizar este enfoque en un entorno de producción.
"""

#Para usuario he usado password, para el admin hashedpassword123 (por si me olvido)
password = "user123"
hashed_passwords = [generate_password_hash(password)]

print(hashed_passwords)