# Task Manager API

![CI Pipeline](https://github.com/hnkatze/final_proyect/actions/workflows/ci.yml/badge.svg)
![CD Pipeline](https://github.com/hnkatze/final_proyect/actions/workflows/cd.yml/badge.svg)

REST API para gestion de tareas construida con **Node.js**, **Express** y **PostgreSQL**. Incluye frontend web integrado, documentacion Swagger, pipeline completo de CI/CD con GitHub Actions y deploy automatico en Railway.

> **Deploy en produccion**: [https://finalproyect-production-8ea8.up.railway.app](https://finalproyect-production-8ea8.up.railway.app)

---

## Descripcion del Proyecto

Aplicacion funcional de gestion de tareas (Task Manager) que implementa un CRUD completo con las siguientes caracteristicas:

- **API REST** con 8 endpoints (health, CRUD, bulk create, stats, filtros)
- **Frontend web** integrado con interfaz moderna, animaciones y health monitor en tiempo real
- **Base de datos** PostgreSQL con soporte para prioridades, filtros y busqueda
- **Documentacion interactiva** con Swagger/OpenAPI 3.0
- **Contenedores Docker** con build multi-stage optimizado
- **Pipeline CI/CD** completo con GitHub Actions + Railway

## Objetivo

Construir un pipeline completo de desarrollo, testing, integracion continua y despliegue continuo (CI/CD) para una aplicacion funcional, integrando conocimientos sobre sistemas operativos, contenedores Docker, automatizacion y deployment.

---

## Diagrama de Arquitectura

```
                            +------------------------------------------+
                            |            CLIENTE (Browser)              |
                            |  Frontend HTML/CSS/JS  |  Swagger UI     |
                            +------------+-----------------------------+
                                         |
                                    HTTP Requests
                                         |
                                         v
+----------------------------------------------------------------------------------------+
|                              EXPRESS SERVER (:3000)                                      |
|                                                                                         |
|   +------------------+  +-----------------+  +------------------+  +------------------+ |
|   |  Static Files    |  |  Swagger Docs   |  |   Health Check   |  |   Task Routes    | |
|   |  GET /           |  |  GET /api/docs  |  |  GET /api/health |  |  GET /api/tasks  | |
|   +------------------+  +-----------------+  +------------------+  |  POST /api/tasks | |
|                                                                    |  PUT /api/tasks  | |
|                                                                    |  DELETE           | |
|                                                                    |  POST /bulk      | |
|                                                                    |  GET /stats      | |
|                                                                    +--------+---------+ |
|                                                                             |           |
|                                                    +------------+-----------+           |
|                                                    |            |                       |
|                                              Controller      Model                     |
|                                            (Validacion)   (SQL Queries)                 |
+----------------------------------------------------------------------------------------+
                                                    |
                                                    v
                                         +--------------------+
                                         |    PostgreSQL 16   |
                                         |   tasks table      |
                                         |   (id, title,      |
                                         |    description,    |
                                         |    completed,      |
                                         |    priority,       |
                                         |    timestamps)     |
                                         +--------------------+

+----------------------------------------------------------------------------------------+
|                              CI/CD Pipeline                                              |
|                                                                                         |
|   [Push/PR] --> GitHub Actions CI --> ESLint --> Jest + Coverage --> Artifacts           |
|                                                                                         |
|   [Push main] --> GitHub Actions CD --> Lint --> Tests --> Railway Auto-Deploy           |
+----------------------------------------------------------------------------------------+

+----------------------------------------------------------------------------------------+
|                           Docker Compose Architecture                                   |
|                                                                                         |
|   +-------------------+          +-------------------+                                  |
|   |   app (Node.js)   |  :3000   |   db (Postgres)   |  :5432                          |
|   |   Alpine Linux    +--------->|   Alpine Linux    |                                  |
|   |   Multi-stage     |          |   pgdata volume   |                                  |
|   |   Non-root user   |          |   Health check    |                                  |
|   +-------------------+          +-------------------+                                  |
+----------------------------------------------------------------------------------------+
```

---

## Stack Tecnologico

| Componente | Tecnologia | Version |
|-----------|------------|---------|
| Runtime | Node.js | 20 LTS |
| Framework | Express | 4.21 |
| Base de datos | PostgreSQL | 16 |
| Testing | Jest + Supertest | 29 / 7 |
| Linting | ESLint | 8 |
| Documentacion API | Swagger (OpenAPI) | 3.0 |
| Contenedores | Docker + Compose | 3.8+ |
| CI/CD | GitHub Actions | v4 |
| Deploy | Railway | Auto-deploy |
| Frontend | HTML/CSS/JS | Vanilla |

---

## Instalacion Local

### Prerrequisitos

- Node.js 20+
- PostgreSQL 16+ (local o via Docker)
- npm 10+
- Git

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/hnkatze/final_proyect.git
cd final_proyect

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con tu conexion a PostgreSQL:
# DATABASE_URL=postgresql://postgres:postgres@localhost:5432/taskmanager

# 4. Inicializar la base de datos
npm run db:init

# 5. Iniciar en modo desarrollo
npm run dev
```

El servidor estara disponible en `http://localhost:3000`.

### Scripts disponibles

| Comando | Descripcion |
|---------|-------------|
| `npm start` | Inicia el servidor en produccion |
| `npm run dev` | Inicia en modo desarrollo (watch) |
| `npm test` | Ejecuta tests con Jest |
| `npm run test:coverage` | Tests con reporte de cobertura |
| `npm run lint` | Ejecuta ESLint |
| `npm run lint:fix` | Corrige errores de ESLint |
| `npm run db:init` | Inicializa la base de datos |

---

## Instrucciones Docker

### Dockerfile (Multi-stage build)

```bash
# Construir la imagen
docker build -t task-manager-api .

# Ejecutar contenedor (requiere PostgreSQL externo)
docker run -p 3000:3000 -e DATABASE_URL=postgresql://user:pass@host:5432/db task-manager-api
```

El Dockerfile usa **multi-stage build** para optimizar la imagen:
- **Stage 1 (builder)**: Instala dependencias de produccion
- **Stage 2 (production)**: Copia solo lo necesario, usuario non-root, healthcheck incluido

### Docker Compose (recomendado)

```bash
# Levantar todos los servicios (app + PostgreSQL)
docker-compose up -d

# Verificar que los servicios estan corriendo
docker-compose ps

# Ver logs de la app
docker-compose logs -f app

# Detener servicios
docker-compose down

# Detener y eliminar volumenes
docker-compose down -v
```

**Servicios incluidos:**

| Servicio | Puerto | Descripcion |
|----------|--------|-------------|
| `app` | 3000 | API Express + Frontend |
| `db` | 5432 | PostgreSQL 16 Alpine |

**Caracteristicas del Compose:**
- Version 3.8+
- Health checks en ambos servicios
- Volumen `pgdata` para persistencia de datos
- Variables de entorno configuradas
- Networking automatico entre servicios
- Restart policy: `unless-stopped`

---

## Documentacion API (Swagger)

La API cuenta con documentacion interactiva generada con Swagger/OpenAPI 3.0:

| Recurso | URL Local | URL Produccion |
|---------|-----------|---------------|
| **Frontend** | http://localhost:3000 | https://finalproyect-production-8ea8.up.railway.app |
| **Swagger UI** | http://localhost:3000/api/docs | https://finalproyect-production-8ea8.up.railway.app/api/docs |
| **JSON Spec** | http://localhost:3000/api/docs.json | https://finalproyect-production-8ea8.up.railway.app/api/docs.json |

---

## Endpoints

### Health Check

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| GET | `/api/health` | Estado del servidor y la base de datos |

```bash
curl https://finalproyect-production-8ea8.up.railway.app/api/health

# Respuesta:
# { "status": "ok", "timestamp": "2026-03-27T..." }
```

### Tasks CRUD

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| GET | `/api/tasks` | Listar tareas (con filtros, busqueda y paginacion) |
| GET | `/api/tasks/stats` | Estadisticas de tareas |
| GET | `/api/tasks/:id` | Obtener tarea por ID |
| POST | `/api/tasks` | Crear nueva tarea |
| POST | `/api/tasks/bulk` | Crear multiples tareas |
| PUT | `/api/tasks/:id` | Actualizar tarea |
| DELETE | `/api/tasks/:id` | Eliminar tarea |

### Parametros de Query (GET /api/tasks)

| Parametro | Tipo | Descripcion | Ejemplo |
|-----------|------|-------------|---------|
| `completed` | boolean | Filtrar por estado | `?completed=true` |
| `priority` | string | Filtrar por prioridad | `?priority=high` |
| `search` | string | Buscar en titulo/descripcion | `?search=docker` |
| `page` | integer | Numero de pagina | `?page=1` |
| `limit` | integer | Tareas por pagina (max 100) | `?limit=10` |

### Ejemplos

```bash
# Listar todas las tareas
curl https://finalproyect-production-8ea8.up.railway.app/api/tasks

# Filtrar pendientes con prioridad alta
curl "https://finalproyect-production-8ea8.up.railway.app/api/tasks?completed=false&priority=high"

# Buscar tareas
curl "https://finalproyect-production-8ea8.up.railway.app/api/tasks?search=docker"

# Crear tarea
curl -X POST https://finalproyect-production-8ea8.up.railway.app/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Estudiar Docker", "description": "Completar proyecto final", "priority": "high"}'

# Respuesta:
# {
#   "id": 1,
#   "title": "Estudiar Docker",
#   "description": "Completar proyecto final",
#   "completed": false,
#   "priority": "high",
#   "created_at": "2026-03-27T...",
#   "updated_at": "2026-03-27T..."
# }

# Crear varias tareas a la vez
curl -X POST https://finalproyect-production-8ea8.up.railway.app/api/tasks/bulk \
  -H "Content-Type: application/json" \
  -d '{"tasks": [{"title": "Tarea 1", "priority": "high"}, {"title": "Tarea 2"}, {"title": "Tarea 3", "priority": "low"}]}'

# Ver estadisticas
curl https://finalproyect-production-8ea8.up.railway.app/api/tasks/stats

# Respuesta:
# { "total": 10, "completed": 6, "pending": 4, "high": 3, "medium": 5, "low": 2, "completion_rate": "60.0" }

# Actualizar tarea
curl -X PUT https://finalproyect-production-8ea8.up.railway.app/api/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"completed": true, "priority": "medium"}'

# Eliminar tarea
curl -X DELETE https://finalproyect-production-8ea8.up.railway.app/api/tasks/1
```

---

## Testing

```bash
# Ejecutar tests
npm test

# Ejecutar tests con cobertura
npm run test:coverage

# Ejecutar linter
npm run lint
```

### Tests incluidos (22 tests)

| Suite | Tests | Descripcion |
|-------|-------|-------------|
| Health Check | 1 | Verifica conexion al servidor y BD |
| GET /api/tasks | 4 | Lista vacia, lista con datos, filtro por estado, busqueda, filtro por prioridad |
| GET /api/tasks/stats | 2 | Stats vacios, stats con datos |
| POST /api/tasks | 5 | Crear tarea, prioridad default, titulo requerido, titulo vacio, prioridad invalida |
| POST /api/tasks/bulk | 3 | Bulk create, array vacio, titulo faltante |
| GET /api/tasks/:id | 3 | Tarea existente, inexistente (404), ID invalido (400) |
| PUT /api/tasks/:id | 2 | Actualizar con prioridad, tarea inexistente |
| DELETE /api/tasks/:id | 2 | Eliminar tarea, tarea inexistente |
| 404 handler | 1 | Ruta no encontrada |

**Cobertura de codigo**: >= 70% (lineas, ramas, funciones)

---

## Pipeline CI/CD

### CI - Integracion Continua (`.github/workflows/ci.yml`)

**Triggers**: Se ejecuta en cada `push` a cualquier rama y en `pull_request` a `main`.

```
Checkout --> Setup Node.js 20 (con cache npm) --> Install --> ESLint --> Jest + Coverage --> Upload Artifacts
                                                                          |
                                                                PostgreSQL 16 (service container)
```

**Caracteristicas:**
- PostgreSQL como servicio en el workflow
- Cache de dependencias npm para agilidad
- Reporte de cobertura como artefacto descargable
- Badge de estado visible en este README

### CD - Despliegue Continuo (`.github/workflows/cd.yml`)

**Trigger**: Se ejecuta en cada `push` a `main`.

```
Checkout --> Setup Node.js 20 --> Install --> Lint --> Tests + Coverage --> Railway Auto-Deploy
                                                                            |
                                                                  "Wait for CI" enabled
```

**Caracteristicas:**
- Ejecuta lint y tests antes del deploy
- Railway despliega automaticamente despues de que CI pasa
- Deploy solo a rama `main` (produccion)
- Variables de entorno configuradas en Railway

---

## Deploy

La aplicacion esta desplegada en **Railway**:

| Recurso | URL |
|---------|-----|
| **App (Frontend + API)** | https://finalproyect-production-8ea8.up.railway.app |
| **Swagger Docs** | https://finalproyect-production-8ea8.up.railway.app/api/docs |
| **Health Check** | https://finalproyect-production-8ea8.up.railway.app/api/health |

- PostgreSQL provisionado como servicio interno de Railway
- Variables de entorno: `DATABASE_URL`, `PORT`, `NODE_ENV`
- Deploy automatico en cada push a `main` (Wait for CI)

---

## Variables de Entorno

| Variable | Descripcion | Ejemplo |
|----------|-------------|---------|
| `PORT` | Puerto del servidor | `3000` |
| `DATABASE_URL` | Connection string PostgreSQL | `postgresql://user:pass@host:5432/db` |
| `NODE_ENV` | Entorno de ejecucion | `production` |

---

## Estructura del Proyecto

```
final_proyect/
├── src/
│   ├── app.js                # Express app (middleware, rutas, static)
│   ├── server.js             # Entry point (listen + init DB)
│   ├── config/
│   │   ├── database.js       # Pool de conexion PostgreSQL
│   │   ├── swagger.js        # Configuracion OpenAPI 3.0
│   │   └── init-db.js        # Script de inicializacion
│   ├── routes/
│   │   └── tasks.js          # Rutas + Swagger JSDoc annotations
│   ├── controllers/
│   │   └── tasks.js          # Logica de negocio + validaciones
│   ├── models/
│   │   └── task.js           # Queries SQL (CRUD, stats, filtros)
│   └── public/
│       └── index.html        # Frontend web (SPA)
├── tests/
│   └── tasks.test.js         # 22 tests con Jest + Supertest
├── .github/
│   └── workflows/
│       ├── ci.yml            # Pipeline CI (lint + test + coverage)
│       └── cd.yml            # Pipeline CD (deploy a Railway)
├── Dockerfile                # Multi-stage build (Alpine, non-root)
├── docker-compose.yml        # App + PostgreSQL + volumes + healthchecks
├── .dockerignore             # Excluir archivos innecesarios
├── .eslintrc.json            # Configuracion ESLint
├── .env.example              # Variables de entorno de ejemplo
├── .gitignore                # Archivos ignorados por Git
├── package.json              # Dependencias y scripts
├── CHECKLIST.md              # Checklist de entrega
└── README.md                 # Este archivo
```

---

## Screenshots

### Frontend Web (Gestion de Tareas)
> Disponible en: https://finalproyect-production-8ea8.up.railway.app

- Dashboard con contadores animados (total, completadas, pendientes, progreso %)
- Health monitor en tiempo real con latencia
- Filtros por estado (Todas/Pendientes/Completadas) y prioridad (Alta/Media/Baja)
- Barra de busqueda con debounce
- Crear tareas individuales con selector de prioridad
- Creacion en lote (bulk) con formato `titulo | descripcion | prioridad`
- Editar y eliminar tareas con modal y confirmacion
- Priority badges con colores (rojo=alta, amarillo=media, violeta=baja)
- Paginacion automatica
- Dark mode, responsive, animaciones

### Swagger UI (Documentacion Interactiva)
> Disponible en: https://finalproyect-production-8ea8.up.railway.app/api/docs

- Todos los endpoints documentados con schemas
- Probar endpoints directamente desde el navegador
- Schemas: Task, TaskInput, TaskUpdate, StatsResponse, HealthResponse

---

## Autor

- **Camilo** - Desarrollo completo del proyecto

---

## Licencia

MIT
