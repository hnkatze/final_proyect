const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Task Manager API',
      version: '1.0.0',
      description: 'REST API para gestion de tareas con Express y PostgreSQL. Proyecto final de CI/CD.',
      contact: {
        name: 'Camilo',
      },
      license: {
        name: 'MIT',
      },
    },
    servers: [
      {
        url: '/api',
        description: 'API Server',
      },
    ],
    components: {
      schemas: {
        Task: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID unico de la tarea',
              example: 1,
            },
            title: {
              type: 'string',
              description: 'Titulo de la tarea',
              example: 'Estudiar Docker',
            },
            description: {
              type: 'string',
              nullable: true,
              description: 'Descripcion detallada de la tarea',
              example: 'Completar el proyecto final de CI/CD',
            },
            completed: {
              type: 'boolean',
              description: 'Estado de completado',
              example: false,
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de creacion',
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de ultima actualizacion',
            },
          },
        },
        TaskInput: {
          type: 'object',
          required: ['title'],
          properties: {
            title: {
              type: 'string',
              description: 'Titulo de la tarea (obligatorio)',
              example: 'Estudiar Docker',
            },
            description: {
              type: 'string',
              description: 'Descripcion de la tarea (opcional)',
              example: 'Completar el proyecto final',
            },
          },
        },
        TaskUpdate: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
              description: 'Nuevo titulo',
              example: 'Estudiar Docker avanzado',
            },
            description: {
              type: 'string',
              description: 'Nueva descripcion',
              example: 'Incluir Docker Compose y multi-stage builds',
            },
            completed: {
              type: 'boolean',
              description: 'Marcar como completada',
              example: true,
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              example: 'Task not found',
            },
          },
        },
        HealthResponse: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'ok',
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        DeleteResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'Task deleted successfully',
            },
            task: {
              $ref: '#/components/schemas/Task',
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.js', './src/app.js'],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
