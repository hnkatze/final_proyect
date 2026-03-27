# Checklist de Entrega - Proyecto Final CI/CD

## Stack Elegido
- **Backend**: Node.js + Express
- **Base de datos**: PostgreSQL
- **Testing**: Jest + Supertest
- **Deploy**: Railway (app + PostgreSQL)
- **CI/CD**: GitHub Actions

---

## 1. Aplicacion Funcional + Tests (2 pts)

### Endpoints CRUD
- [ ] `GET /api/tasks` - Listar todas las tareas
- [ ] `GET /api/tasks/:id` - Obtener tarea por ID
- [ ] `POST /api/tasks` - Crear nueva tarea
- [ ] `PUT /api/tasks/:id` - Actualizar tarea
- [ ] `DELETE /api/tasks/:id` - Eliminar tarea
- [ ] `GET /api/health` - Health check

### Tests Unitarios (minimo 5)
- [ ] Test 1: GET /api/tasks retorna lista vacia
- [ ] Test 2: POST /api/tasks crea una tarea
- [ ] Test 3: GET /api/tasks/:id retorna tarea especifica
- [ ] Test 4: PUT /api/tasks/:id actualiza tarea
- [ ] Test 5: DELETE /api/tasks/:id elimina tarea
- [ ] Test 6: POST /api/tasks con datos invalidos retorna 400
- [ ] Test 7: GET /api/tasks/:id con ID inexistente retorna 404
- [ ] Test 8: GET /api/health retorna status OK

### Cobertura
- [ ] Cobertura de lineas >= 70%
- [ ] Cobertura de ramas >= 70%
- [ ] Cobertura de funciones >= 70%

---

## 2. Docker + Docker Compose (2 pts)

### Dockerfile
- [ ] Multi-stage build (builder + production)
- [ ] Imagen base optimizada (node:20-alpine)
- [ ] .dockerignore configurado
- [ ] Solo copia archivos necesarios
- [ ] Usuario no-root

### docker-compose.yml
- [ ] Version 3.8+
- [ ] Servicio `app` (Express)
- [ ] Servicio `db` (PostgreSQL)
- [ ] Volumenes para persistencia de datos
- [ ] Health checks configurados
- [ ] Environment variables via .env
- [ ] Networking correcto entre servicios
- [ ] `docker-compose up -d` funciona sin errores

---

## 3. Pipeline CI - Integracion Continua (2 pts)

### GitHub Actions (.github/workflows/ci.yml)
- [ ] Trigger en `push` a todas las ramas
- [ ] Trigger en `pull_request` a main
- [ ] Paso: Checkout del codigo
- [ ] Paso: Setup Node.js
- [ ] Paso: Cache de node_modules
- [ ] Paso: Instalar dependencias
- [ ] Paso: Lint (ESLint)
- [ ] Paso: Ejecutar tests
- [ ] Paso: Reporte de cobertura
- [ ] PostgreSQL como servicio en CI
- [ ] Badge CI en README

---

## 4. Pipeline CD - Despliegue Continuo (2 pts)

### Railway
- [ ] Proyecto creado en Railway
- [ ] PostgreSQL provisionado en Railway
- [ ] Variables de entorno configuradas
- [ ] Deploy automatico al mergear a `main`
- [ ] URL publica funcional y accesible
- [ ] Health check verificado en produccion

### GitHub
- [ ] Secrets configurados (RAILWAY_TOKEN)
- [ ] Workflow CD separado o integrado
- [ ] Deploy solo en push a `main`

---

## 5. Documentacion (2 pts)

### README.md
- [ ] Descripcion del proyecto y objetivo
- [ ] Instrucciones de instalacion local
- [ ] Instrucciones Docker (build + compose)
- [ ] Diagrama de arquitectura (ASCII art)
- [ ] Screenshots de la app funcionando
- [ ] Listado de endpoints con ejemplos
- [ ] Badge CI (build status)
- [ ] Autores y contribuidores

### Historial de Commits
- [ ] Commit 1: feat: initial project setup
- [ ] Commit 2: feat: add database configuration
- [ ] Commit 3: feat: add task model and migration
- [ ] Commit 4: feat: add GET endpoints
- [ ] Commit 5: feat: add POST endpoint
- [ ] Commit 6: feat: add PUT and DELETE endpoints
- [ ] Commit 7: test: add unit tests
- [ ] Commit 8: docker: add Dockerfile and compose
- [ ] Commit 9: ci: add GitHub Actions workflow
- [ ] Commit 10: docs: add complete README
- [ ] (extras segun avancemos)

---

## Estructura Final del Proyecto

```
final_proyect/
├── src/
│   ├── app.js              # Express app (sin listen)
│   ├── server.js            # Entry point (listen)
│   ├── config/
│   │   └── database.js      # Conexion PostgreSQL
│   ├── routes/
│   │   └── tasks.js         # Rutas CRUD
│   ├── controllers/
│   │   └── tasks.js         # Logica de negocio
│   └── models/
│       └── task.js           # Modelo de tarea
├── tests/
│   └── tasks.test.js        # Tests con Jest + Supertest
├── .github/
│   └── workflows/
│       └── ci.yml           # Pipeline CI/CD
├── Dockerfile               # Multi-stage build
├── docker-compose.yml       # App + PostgreSQL
├── .dockerignore
├── .eslintrc.json           # Configuracion ESLint
├── .env.example             # Variables de entorno ejemplo
├── .gitignore
├── package.json
├── CHECKLIST.md             # Este archivo
└── README.md                # Documentacion completa
```

---

## URLs Finales
- **Repositorio**: `https://github.com/[usuario]/final_proyect`
- **Deploy**: `https://[app-name].up.railway.app`
- **CI Badge**: En README.md

---

## Notas
- Railway ofrece PostgreSQL nativo (no necesitas Docker para la DB en produccion)
- Railway hace deploy automatico desde GitHub (sin necesidad de workflow CD extra)
- El CI corre lint + tests + coverage en GitHub Actions
- Railway detecta el Dockerfile o usa Nixpacks automaticamente
