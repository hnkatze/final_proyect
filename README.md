# Task Manager API

![CI Pipeline](https://github.com/hnkatze/final_proyect/actions/workflows/ci.yml/badge.svg)

REST API para gestion de tareas construida con Node.js, Express y PostgreSQL. Incluye pipeline completo de CI/CD con GitHub Actions y deploy automatico en Railway.

## Objetivo

Construir un pipeline completo de desarrollo, testing, integracion continua y despliegue continuo (CI/CD) para una aplicacion funcional, integrando conocimientos sobre contenedores Docker, automatizacion y deployment.

## Arquitectura

```
+------------------+     +-------------------+     +------------------+
|                  |     |                   |     |                  |
|   Cliente HTTP   +---->+   Express API     +---->+   PostgreSQL     |
|   (Postman/curl) |     |   (Node.js)       |     |   (Database)     |
|                  |     |                   |     |                  |
+------------------+     +-------------------+     +------------------+
                               |
                         +-----+------+
                         |            |
                    /api/health  /api/tasks
                                     |
                              +------+------+
                              |  Controller |
                              +------+------+
                                     |
                              +------+------+
                              |    Model    |
                              +------+------+
                                     |
                              +------+------+
                              |  PostgreSQL |
                              +-------------+

+--------------------------------------------------------------------+
|                        CI/CD Pipeline                               |
|                                                                     |
|  Push/PR --> GitHub Actions --> Lint --> Test --> Coverage           |
|                                                                     |
|  Push main --> GitHub Actions --> Deploy --> Railway (Production)    |
+--------------------------------------------------------------------+

+--------------------------------------------------------------------+
|                     Docker Architecture                             |
|                                                                     |
|  +-------------+        +-------------+                             |
|  |   app       |------->|   db        |                             |
|  |  (Node.js)  | :3000  | (Postgres)  | :5432                      |
|  |  Alpine     |        |  Alpine     |                             |
|  +-------------+        +-------------+                             |
|        |                       |                                    |
|        v                       v                                    |
|   Multi-stage build      pgdata volume                              |
+--------------------------------------------------------------------+
```

## Stack Tecnologico

| Componente | Tecnologia |
|-----------|------------|
| Runtime | Node.js 20 |
| Framework | Express 4 |
| Base de datos | PostgreSQL 16 |
| Testing | Jest + Supertest |
| Linting | ESLint |
| Contenedores | Docker + Docker Compose |
| CI/CD | GitHub Actions |
| Deploy | Railway |

## Instalacion Local

### Prerrequisitos

- Node.js 20+
- PostgreSQL 16+ (local o Docker)
- npm 10+

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/hnkatze/final_proyect.git
cd final_proyect

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con tu conexion a PostgreSQL

# 4. Inicializar la base de datos
npm run db:init

# 5. Iniciar el servidor
npm run dev
```

El servidor estara disponible en `http://localhost:3000`.

## Instrucciones Docker

### Build de la imagen

```bash
# Construir imagen
docker build -t task-manager-api .

# Ejecutar contenedor (requiere PostgreSQL externo)
docker run -p 3000:3000 -e DATABASE_URL=postgresql://... task-manager-api
```

### Docker Compose (recomendado)

```bash
# Levantar todos los servicios (app + PostgreSQL)
docker-compose up -d

# Ver logs
docker-compose logs -f app

# Detener servicios
docker-compose down

# Detener y eliminar volumenes
docker-compose down -v
```

La app estara en `http://localhost:3000` y PostgreSQL en `localhost:5432`.

## Endpoints

### Health Check

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| GET | `/api/health` | Estado del servidor y la base de datos |

```bash
curl http://localhost:3000/api/health

# Respuesta:
# { "status": "ok", "timestamp": "2026-03-26T..." }
```

### Tasks CRUD

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| GET | `/api/tasks` | Listar todas las tareas |
| GET | `/api/tasks/:id` | Obtener tarea por ID |
| POST | `/api/tasks` | Crear nueva tarea |
| PUT | `/api/tasks/:id` | Actualizar tarea |
| DELETE | `/api/tasks/:id` | Eliminar tarea |

#### Ejemplos

```bash
# Listar tareas
curl http://localhost:3000/api/tasks

# Crear tarea
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Estudiar Docker", "description": "Completar el proyecto final"}'

# Respuesta:
# {
#   "id": 1,
#   "title": "Estudiar Docker",
#   "description": "Completar el proyecto final",
#   "completed": false,
#   "created_at": "2026-03-26T...",
#   "updated_at": "2026-03-26T..."
# }

# Obtener tarea por ID
curl http://localhost:3000/api/tasks/1

# Actualizar tarea
curl -X PUT http://localhost:3000/api/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"title": "Estudiar Docker avanzado", "completed": true}'

# Eliminar tarea
curl -X DELETE http://localhost:3000/api/tasks/1
```

## Testing

```bash
# Ejecutar tests
npm test

# Ejecutar tests con cobertura
npm run test:coverage

# Ejecutar linter
npm run lint
```

### Cobertura

Los tests cubren:
- Health check endpoint
- CRUD completo de tareas (crear, leer, actualizar, eliminar)
- Validaciones (titulo requerido, ID invalido)
- Manejo de errores (404, 400)
- Ruta no encontrada (404 handler)

## Pipeline CI/CD

### CI (Integracion Continua)

Se ejecuta en cada push y pull request:

1. **Checkout** del codigo
2. **Setup** Node.js 20 con cache de npm
3. **Install** dependencias
4. **Lint** con ESLint
5. **Test** con Jest + cobertura
6. **Upload** reporte de cobertura como artefacto

### CD (Despliegue Continuo)

Se ejecuta al hacer push a `main`:

1. **Checkout** del codigo
2. **Install** Railway CLI
3. **Deploy** automatico a Railway

## Deploy

La aplicacion esta desplegada en Railway:

- **URL**: `https://final-proyect.up.railway.app`
- PostgreSQL provisionado como servicio interno de Railway
- Variables de entorno configuradas via Railway dashboard
- Deploy automatico en cada push a `main`

## Variables de Entorno

| Variable | Descripcion | Ejemplo |
|----------|-------------|---------|
| `PORT` | Puerto del servidor | `3000` |
| `DATABASE_URL` | Connection string PostgreSQL | `postgresql://user:pass@host:5432/db` |
| `NODE_ENV` | Entorno de ejecucion | `production` |

## Estructura del Proyecto

```
final_proyect/
├── src/
│   ├── app.js               # Express app (sin listen)
│   ├── server.js             # Entry point (listen + init DB)
│   ├── config/
│   │   ├── database.js       # Pool de conexion PostgreSQL
│   │   └── init-db.js        # Script de inicializacion
│   ├── routes/
│   │   └── tasks.js          # Definicion de rutas
│   ├── controllers/
│   │   └── tasks.js          # Logica de negocio
│   └── models/
│       └── task.js            # Modelo y queries SQL
├── tests/
│   └── tasks.test.js         # Tests con Jest + Supertest
├── .github/workflows/
│   ├── ci.yml                # Pipeline CI
│   └── cd.yml                # Pipeline CD
├── Dockerfile                # Multi-stage build
├── docker-compose.yml        # App + PostgreSQL
├── .dockerignore
├── .eslintrc.json
├── .env.example
├── .gitignore
├── package.json
├── CHECKLIST.md
└── README.md
```

## Autor

- **Camilo** - Desarrollo completo

## Licencia

MIT
