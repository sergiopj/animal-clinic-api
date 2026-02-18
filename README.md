# 🐾 Animal Clinic API

REST API desarrollada con **Node.js**, **TypeScript** y **MongoDB** para gestionar datos de mascotas en una clínica veterinaria.

---

## 🚀 Quick Start

### Opción 1: Docker (Recomendado)

```bash
# 1. Levantar todos los servicios
docker compose up --build

# 2. Poblar la base de datos con datos de prueba (opcional)
docker compose exec app npm run seed

# 3. Acceder a la API
# API: http://localhost:3000/api
# Health: http://localhost:3000/health
# Mongo Express: http://localhost:8081
# Swagger Docs: http://localhost:3000/api-docs
```

### Opción 2: Local

```bash
# Requisitos: Node.js 14+, MongoDB corriendo localmente

npm install
npm start
```

---

## 🏗️ Arquitectura

```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │ HTTP
       ↓
┌─────────────┐
│   Routes    │ ← Define endpoints
└──────┬──────┘
       ↓
┌─────────────┐
│ Controllers │ ← Maneja request/response
└──────┬──────┘
       ↓
┌─────────────┐
│  Services   │ ← Lógica de negocio
└──────┬──────┘
       ↓
┌─────────────┐
│   Models    │ ← Schemas de Mongoose
└──────┬──────┘
       ↓
┌─────────────┐
│   MongoDB   │
└─────────────┘
```

**Patrón**: Arquitectura por capas con separación de responsabilidades.

---

## 🐳 Servicios Docker

| Servicio | Contenedor | Puerto | Descripción |
|----------|-----------|--------|-------------|
| **API** | `animal-clinic-api` | 3000 | Aplicación Node.js/Express |
| **Database** | `animal-clinic-db` | 27017 | MongoDB 7 |
| **Admin UI** | `animal-clinic-mongo-express` | 8081 | Interfaz web para MongoDB |
| **AI** | `animal-clinic-ollama` | 11434 | Servicio IA (opcional, no usado) |

**Comandos útiles:**
```bash
# Ver logs
docker compose logs -f app

# Acceder al contenedor
docker exec -it animal-clinic-api /bin/bash

# Detener servicios
docker compose down

# Reiniciar servicios
docker compose restart
```

---

## 🌐 Deployed API

**URL**: [https://api-animalclinic.onrender.com](https://api-animalclinic.onrender.com)

---

## 📡 API Endpoints

Para ver la documentación completa de los endpoints disponibles, accede a:

**Swagger UI**: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

**OpenAPI Spec**: [http://localhost:3000/api-docs.json](http://localhost:3000/api-docs.json)

---

## 🗄️ Database Seeding

Para facilitar el desarrollo, incluye un script que genera 50 mascotas de prueba:

```bash
# Con DB corriendo
npm run seed
```

---

## 🧪 Tests

```bash
npm test
```

---

## 🤖 AI Features (Opcional)

El servicio **Ollama** está disponible pero **no se usa por defecto**.

**Para activar:**
```bash
# Descargar modelo
docker exec -it animal-clinic-ollama ollama pull llama2

# Verificar
curl http://localhost:11434/api/tags
```

**Características disponibles:**
- Análisis de salud de mascotas
- Recomendaciones basadas en historial médico
- Consultas veterinarias asistidas por IA

---

## 📁 Estructura del Proyecto

```
src/
├── config/          # Configuraciones (DB, Logger, AI)
├── controllers/     # Controladores HTTP
├── services/        # Lógica de negocio
├── models/          # Schemas de Mongoose
├── routes/          # Definición de rutas
├── middlewares/     # Validaciones y middleware
├── docs/            # Swagger configuration
└── scripts/         # Scripts de seeding
```

---

## 🔧 Tecnologías

- **Runtime**: Node.js 14+
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: MongoDB 7
- **ODM**: Mongoose
- **Validation**: express-validator
- **Documentation**: Swagger/OpenAPI
- **Logging**: log4js
- **Testing**: Jest
- **Containerization**: Docker & Docker Compose

---

## 📝 Variables de Entorno

Archivo `.env`:

```env
# Database
DB_USER=admin
DB_PASSWORD=admin123
DB_HOST=db
DB_PORT=27017
DB_NAME=animalClinic

# API
PORT=3000
NODE_ENV=development

# Frontend (CORS)
FRONT_HOST=http://localhost:4200
```

---

## 👨‍💻 Desarrollo

```bash
# Desarrollo con hot reload
npm run dev

# Build para producción
npm run build

# Ejecutar producción
npm start

# Linting
npm run lint
```

---

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

