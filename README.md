
# MinIdea — Proyecto Integrador M2 | Henry

## Descripción del proyecto

MinIdea es una API REST desarrollada como Proyecto
Integrador del Módulo 2 del Bootcamp Full Stack
Web de Henry.

El proyecto permite administrar autores y
publicaciones mediante operaciones CRUD
(Create, Read, Update, Delete).

La aplicación utiliza Node.js y Express para
gestionar las solicitudes HTTP, mientras que
PostgreSQL almacena la información de forma
persistente.

## Tecnologías utilizadas

- Node.js
- JavaScript
- Express.js
- PostgreSQL
- pg (node-postgres)
- dotenv
- Git y GitHub
- Node.js Test Runner

## Funcionalidades principales

- Crear, consultar, actualizar y eliminar autores.
- Crear, consultar, actualizar y eliminar publicaciones.
- Consultar publicaciones pertenecientes a un autor.
- Validar datos recibidos por la API.
- Manejar errores mediante respuestas HTTP.
- Almacenar información en PostgreSQL.
- Ejecutar pruebas automatizadas.

## Arquitectura

La aplicación separa sus responsabilidades
en diferentes capas:

- Routes: definen los endpoints.
- Controllers: procesan solicitudes y respuestas.
- Services: contienen la lógica y las consultas SQL.
- DB: administra la conexión con PostgreSQL.

Esta organización facilita el mantenimiento
y la comprensión del código.


## Instalación y configuración

### 1. Requisitos previos

Para ejecutar MinIdea se necesita:

- Node.js
- npm
- PostgreSQL
- Git

### 2. Descargar el repositorio

```bash
git clone https://github.com/JunotQuiroz/MinIdea.git
cd MinIdea
```

### 3. Instalar las dependencias

```bash
npm install
```

### 4. Configurar las variables de entorno

Crear el archivo .env a partir del ejemplo:

```bash
cp .env.example .env
```

Editar .env con los datos correspondientes
a la instalación local de PostgreSQL.

No compartir ni publicar las credenciales reales.

### 5. Crear la base de datos

```bash
createdb minidea
```

Crear las tablas:

```bash
psql -X -v ON_ERROR_STOP=1 -d minidea -f sql/01_setup.sql
```

Insertar los registros iniciales:

```bash
psql -X -v ON_ERROR_STOP=1 -d minidea -f sql/02_seed.sql
```

### 6. Iniciar el servidor

```bash
node src/server.js
```

Por defecto, la aplicación utiliza el puerto 3000.

Para comprobar que funciona:

```bash
curl http://localhost:3000/health
```

Respuesta esperada:

```json
{
  "status": "ok",
  "project": "MinIdea"
}
```

## Pruebas automatizadas

MinIdea utiliza el sistema de pruebas integrado
en Node.js (Node.js Test Runner).

Las pruebas se ejecutan sobre una base de datos
independiente llamada minidea_test.

### Preparar la base de pruebas

```bash
createdb minidea_test
```

```bash
psql -X -v ON_ERROR_STOP=1 -d minidea_test -f sql/01_setup.sql
```

```bash
psql -X -v ON_ERROR_STOP=1 -d minidea_test -f sql/02_seed.sql
```

### Ejecutar las pruebas

```bash
npm test
```

El proyecto cuenta con doce pruebas automatizadas que verifican:

- El funcionamiento de GET /health.
- La conexión con la base de datos de pruebas.
- La consulta de autores.
- La respuesta para autores inexistentes.
- La creación correcta de autores.
- La validación de autores sin nombre.
- La consulta de publicaciones por autor.
- El rechazo de identificadores inválidos.
- La actualización de autores mediante PUT.
- La eliminación de autores mediante DELETE.
- La actualización de publicaciones mediante PUT.
- La eliminación de publicaciones mediante DELETE.


Las pruebas verifican códigos HTTP, respuestas
JSON y operaciones con PostgreSQL.

## Endpoints de la API

La API REST de MinIdea se encuentra desplegada
en Render y está disponible públicamente.

**Servidor de producción (Render):**
https://minidea.onrender.com

**Servidor de desarrollo local:**
http://localhost:3000

### Comprobación de endpoints públicos

- Estado del servidor:
  https://minidea.onrender.com/health

- Consultar autores:
  https://minidea.onrender.com/authors

- Consultar publicaciones:
  https://minidea.onrender.com/posts

El despliegue utiliza Node.js y Express,
conectados a PostgreSQL alojado en Render.

Nota: el servicio gratuito de Render puede
tardar en responder después de un periodo
de inactividad.

### Autores

| Método | Endpoint | Descripción |
|---|---|---|
| GET | /authors | Obtener todos los autores |
| GET | /authors/:id | Obtener un autor por ID |
| POST | /authors | Crear un autor |
| PUT | /authors/:id | Actualizar un autor |
| DELETE | /authors/:id | Eliminar un autor |

### Publicaciones

| Método | Endpoint | Descripción |
|---|---|---|
| GET | /posts | Obtener todas las publicaciones |
| GET | /posts/:id | Obtener una publicación por ID |
| GET | /posts/author/:authorId | Consultar publicaciones de un autor |
| POST | /posts | Crear una publicación |
| PUT | /posts/:id | Actualizar una publicación |
| DELETE | /posts/:id | Eliminar una publicación |

### Estado del servidor

| Método | Endpoint | Descripción |
|---|---|---|
| GET | /health | Verificar el funcionamiento de Express |

## Ejemplos de solicitudes

### Crear un autor

Método: POST

Endpoint: /authors

Cuerpo JSON:

```json
{
  "name": "Nuevo Autor",
  "email": "nuevo@ejemplo.com",
  "bio": "Autor interesado en compartir ideas"
}
```

### Crear una publicación

Método: POST

Endpoint: /posts

Cuerpo JSON:

```json
{
  "author_id": 1,
  "title": "Mi nueva publicación",
  "content": "Contenido de ejemplo para MinIdea.",
  "published": false
}
```

## Códigos de respuesta HTTP

La API utiliza códigos HTTP para indicar
el resultado de las solicitudes.

- 200 OK: operación de consulta o actualización exitosa.
- 201 Created: recurso creado correctamente.
- 400 Bad Request: datos inválidos.
- 404 Not Found: recurso no encontrado.
- 500 Internal Server Error: error interno del servidor.

## Despliegue en Render

MinIdea se encuentra desplegado en Render,
utilizando un servicio web Node.js y una
base de datos PostgreSQL.

### 1. Crear la base de datos

1. Crear una instancia PostgreSQL en Render.
2. Asignar un nombre a la base de datos.
3. Seleccionar la región de despliegue.
4. Guardar las credenciales proporcionadas
   por Render de forma segura.

### 2. Crear el servicio web

1. Seleccionar New Web Service en Render.
2. Conectar el repositorio de GitHub.
3. Seleccionar la rama main.
4. Configurar el entorno Node.js.
5. Seleccionar la misma región que PostgreSQL.

Configuración utilizada:

- Build Command: npm ci
- Start Command: npm start
- Health Check Path: /health

### 3. Configurar variables de entorno

Las siguientes variables deben configurarse
en el servicio web de Render:

- PGHOST: hostname interno de PostgreSQL.
- PGPORT: puerto de PostgreSQL.
- PGDATABASE: nombre de la base de datos.
- PGUSER: usuario de PostgreSQL.
- PGPASSWORD: contraseña de PostgreSQL.
- NODE_ENV: production.

Render proporciona automáticamente el puerto
del servicio web mediante la variable PORT.

Las credenciales reales no deben incorporarse
al repositorio de GitHub.

### 4. Preparar las tablas y los datos

Conectarse a PostgreSQL desde una computadora
local mediante la conexión externa de Render,
utilizando SSL.

Una vez dentro de psql, ejecutar:

```sql
\set ON_ERROR_STOP on
\i sql/01_setup.sql
\i sql/02_seed.sql
```

Estos archivos permiten crear las tablas
authors y posts, así como cargar los datos
iniciales del proyecto.

Los scripts de preparación deben ejecutarse
sobre una base de datos nueva para evitar
duplicaciones o conflictos con datos existentes.

### 5. Comprobar el despliegue

Después del despliegue, verificar:

- GET /health
- GET /authors
- GET /posts

Servidor de producción:

https://minidea.onrender.com

El despliegue automático permite publicar
cambios posteriores al actualizar la rama
main del repositorio conectado.

Para consultar la documentación de la API,
importar docs/openapi.yaml en Swagger Editor.

## Metodología de desarrollo y uso de inteligencia artificial

### Enfoque de aprendizaje

MinIdea fue desarrollado mediante una metodología incremental, apoyada en inteligencia artificial como herramienta de aprendizaje, acompañamiento técnico y revisión de código.

El objetivo no fue únicamente construir una API funcional, sino comprender los fundamentos del desarrollo backend y aplicar los conocimientos adquiridos durante el Módulo 2 del Bootcamp Full Stack Web de Henry.

En lugar de generar el proyecto completo automáticamente, se decidió trabajar paso a paso, creando archivos, funciones y componentes conforme avanzaba el aprendizaje.

### Herramienta de inteligencia artificial utilizada

Se utilizó **ChatGPT de OpenAI** como asistente de programación y apoyo educativo.

La IA participó principalmente en:

- Explicar conceptos relacionados con Node.js, Express, PostgreSQL, SQL y arquitectura REST.
- Orientar la estructura del proyecto y la separación de responsabilidades entre rutas, controladores y servicios.
- Proponer fragmentos de código y explicar su funcionamiento.
- Ayudar a interpretar mensajes de error y resultados obtenidos en la terminal.
- Diseñar escenarios para comprobar las operaciones CRUD.
- Orientar la creación de pruebas automatizadas.
- Apoyar la elaboración de documentación técnica.

### Metodología de trabajo

El desarrollo se organizó en seis etapas:

**1. Comprensión del problema**

Se analizaron los objetivos del Proyecto Integrador y las funcionalidades necesarias para administrar autores y publicaciones.

**2. Construcción incremental**

Se desarrollaron progresivamente la base de datos, la conexión con PostgreSQL, los servicios, los controladores y los endpoints de Express.

Cada componente se incorporó después de comprender su propósito y relación con el resto del sistema.

**3. Explicación y revisión del código**

Se utilizó la IA para analizar instrucciones, funciones, consultas SQL y estructuras de JavaScript, buscando entender tanto el funcionamiento individual como la integración de los componentes.

**4. Pruebas manuales**

Se ejecutaron consultas SQL y solicitudes HTTP mediante la terminal, utilizando herramientas como `psql` y `curl`.

Los resultados se revisaron para comprobar respuestas exitosas, validaciones y manejo de solicitudes incorrectas.

**5. Testing automatizado**

Se creó una base de datos independiente, `minidea_test`, y se implementaron ocho pruebas automatizadas mediante Node.js Test Runner.

Estas pruebas permiten comprobar aspectos de la aplicación, la conexión con PostgreSQL y distintos escenarios de los endpoints.

**6. Control de versiones y documentación**

Los avances fueron respaldados periódicamente mediante GitHub Desktop, utilizando commits descriptivos para mantener un historial del desarrollo.

También se documentaron la instalación, configuración, arquitectura, funcionalidades y uso de la API.

### Responsabilidad del desarrollador

La inteligencia artificial se utilizó como herramienta de apoyo, no como sustituto de las decisiones y verificaciones del desarrollador.

El trabajo incluyó la creación y modificación de archivos en Visual Studio Code, ejecución de comandos, interpretación de resultados, comprobación de funcionalidades y seguimiento de errores.

Las propuestas de la IA se contrastaron con el comportamiento real de la aplicación mediante pruebas manuales y automatizadas.

### Reflexión sobre el aprendizaje

El principal beneficio de utilizar inteligencia artificial durante MinIdea fue contar con una herramienta capaz de explicar conceptos técnicos, orientar la resolución de problemas y facilitar un aprendizaje progresivo.

Este proceso permitió relacionar conceptos de programación con su aplicación práctica en una API REST.

También permitió reconocer que el código propuesto por una IA necesita ser comprendido, revisado y probado, ya que una respuesta generada automáticamente no garantiza que una implementación funcione correctamente.

**Conclusión:** MinIdea representa un ejercicio de desarrollo backend asistido por inteligencia artificial, en el que se combinan conocimientos técnicos, aprendizaje incremental, validación funcional y control de versiones.

**Enlace de ChatGPT:** https://chatgpt.com/share/6ae7a567-a038-83e8-beb2-f234062f68e5