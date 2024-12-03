# 📜 Poem Blog API

## Descripción

Este proyecto es una API para un blog de poemas donde los usuarios pueden:
- 📜 Publicar tus poemas y dejar que el mundo conozca tu talento.
- 🌟 Descubrir joyas ocultas en cada rincón de nuestra comunidad.
- 💬 Conectarte con otros artistas, comparte ideas y construye relaciones creativas.
- 📈 Mejora tu escritura con comentarios constructivos y reconocimiento de tus pares.

---

## ⚙️ Requisitos

- Python 3.x
- pip
- virtualenv
- MariaDB
- Bruno (cliente API)

---

## 🚀 Instalación

1. **Clona el repositorio**:

   ```sh
   git clone https://github.com/abelcarriizo/poems_blog.git
   ```

   Asegúrate de que los scripts tengan permisos de ejecución:

   ```sh
   chmod +x <scripts>
   ```

2. **Ejecuta el script de instalación**:

   ```sh
   ./install.sh
   ```

   ⚠️ **Nota**:
   - Utiliza MariaDB para evitar problemas de compatibilidad.
   - Crea manualmente la base de datos `poem_blog` o impórtala desde `src/database/poem_blog.sql`.
    
   El script `install.sh` generará automáticamente un archivo `.env` con las variables de entorno necesarias. Durante su ejecución, se te solicitará:
   
   - Puerto de Flask.
   - Usuario y contraseña de la base de datos.
   - Contraseña para el token.
   - Tiempo de expiración del token (en segundos).
   - Correo y contraseña desde donde se enviaran los mails.
   - Información del remitente.

1. **Crea la base de datos**:

   ```sql
   CREATE DATABASE poem_blog;
   ```

   O impórtala con:

   ```sh
   mysql -u tu_usuario -p poem_blog < src/database/poem_blog.sql
   ```

---

## 🔧 Configuración

### Configuración para el envío de correos
1. Gestiona tu cuenta de Google.
2. Ve a la sección de **Seguridad**.
3. Habilita **Acceso de aplicaciones menos seguras**.

---

## 🏃‍♂️ Uso

1. **Inicia la aplicación**:

   ```sh
   ./boot.sh
   ```

---

## 📚 Endpoints

### 📋 Autenticación
- **POST /auth/register**: Registro de usuarios.
- **POST /auth/login**: Inicio de sesión para usuarios.
- **POST /auth/login/admin**: Inicio de sesión para administradores.

### 👤 Usuarios
- **GET /users**: Obtiene todos los usuarios.
- **GET /user/<id>**: Obtiene un usuario por ID.
- **POST /users**: Crea un nuevo usuario.
- **PUT /user/<id>**: Actualiza un usuario.
- **DELETE /user/<id>**: Elimina un usuario.

### 🛠️ Administradores
- **GET /admins**: Obtiene todos los administradores.
- **GET /admin/<id>**: Obtiene un administrador por ID.
- **POST /admins**: Crea un nuevo administrador.
- **PUT /admin/<id>**: Actualiza un administrador.
- **DELETE /admin/<id>**: Elimina un administrador.

### ✍️ Poemas
- **GET /poems**: Obtiene todos los poemas.
- **GET /poem/<id>**: Obtiene un poema por ID.
- **POST /poems**: Crea un nuevo poema.
- **PUT /poem/<id>**: Actualiza un poema.
- **DELETE /poem/<id>**: Elimina un poema.

#### 📊 Filtros en Poemas:
- **Paginación**: `/poems?page=<número-página>`
- **Por usuario**: `/poems?user_id=<id>`
- **Ordenar**: 
  - Más nuevos: `/poems?sort=newest`
  - Más antiguos: `/poems?sort=oldest`
- **Combinados**: `/poems?user_id=<id>&sort=newest`

### ⭐ Ratings
- **GET /ratings**: Obtiene todos los ratings.
- **GET /rating/<id>**: Obtiene un rating por ID.
- **POST /ratings**: Crea un nuevo rating.
- **PUT /rating/<id>**: Actualiza un rating.
- **DELETE /rating/<id>**: Elimina un rating.

#### 📊 Filtros en Ratings:
- **Paginación**: `/ratings?page=<número-página>`
- **Por usuario**: `/ratings?user_id=<id>`
- **Ordenar**: 
  - Más nuevos: `/ratings?sort=newest`
  - Más antiguos: `/ratings?sort=oldest`
- **Combinados**: `/ratings?user_id=<id>&sort=newest`

---

¡Disfruta construyendo y utilizando esta API! ✨