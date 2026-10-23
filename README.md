# 🐾 Animal Clinic API

REST API for managing pet data in a veterinary clinic.

---

## Quick Start

### Option 1: Docker (Recommended)

```bash
# 1. Configure environment variables
cp .env.example .env
# Edit .env if you need to change default credentials

# 2. Start all services
docker compose up --build

# 3. Populate database with test data (optional)
docker compose exec app npm run seed

# 4. Access the API
# API: http://localhost:3000/api
# Health: http://localhost:3000/health
# Mongo Express: http://localhost:8081
# Swagger Docs: http://localhost:3000/api-docs
```

### Option 2: Local

```bash
# Requirements: Node.js 14+, MongoDB running locally

# 1. Configure environment variables
cp .env.example .env
# Edit .env with your MongoDB credentials

# 2. Install dependencies
npm install

# 3. Start server
npm start
```

---

## 🏗️ Architecture

```
                         ┌──────────────────────────────┐
                         │ Express routes + controllers │
                         │       Primary adapter        │
                         └──────────────┬───────────────┘
                                        ↓
┌─────────────┐    ┌──────────────────────────┐    ┌──────────────────────────┐
│   Client    │ →  │ ClinicService (use cases)│ →  │ ClinicRepositoryPort     │
└─────────────┘    └──────────────────────────┘    └──────────────┬───────────┘
                                                                  ↑
                                      ┌───────────────────────────┴────────────┐
                                      │ MongoClinicRepositoryAdapter           │
                                      │ Secondary adapter                     │
                                      └───────────────────────────┬────────────┘
                                                                  ↓
                                                              MongoDB
```

**Pattern**: Hexagonal architecture (ports and adapters) foundation. The clinic service depends on a repository port, and the MongoDB adapter is selected by the dependency-injection container.

**Current boundary**: The clinic port still exposes `IClinic` from the Mongoose entity. Replacing MongoDB does not require changing the service implementation, but fully isolating the domain from Mongoose also requires introducing persistence-independent domain types and mapping them in the adapter.

---

## 🐳 Docker Services

| Service | Container | Port | Description |
|---------|-----------|------|-------------|
| **API** | `animal-clinic-api` | 3000 | Node.js/Express application |
| **Database** | `animal-clinic-db` | 27017 | MongoDB 7 |
| **Admin UI** | `animal-clinic-mongo-express` | 8081 | Web interface for MongoDB |
| **AI** | `animal-clinic-ollama` | 11434 | AI service (optional, not used) |

**Useful commands:**
```bash
# View logs
docker compose logs -f app

# Access container
docker exec -it animal-clinic-api /bin/bash

# Stop services
docker compose down

# Restart services
docker compose restart
```

---

## 🌐 Deployed API

**URL**: [https://api-animalclinic.onrender.com](https://api-animalclinic.onrender.com)

---

## 📡 API Endpoints

To view complete documentation of available endpoints, visit:

**Swagger UI**: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

**OpenAPI Spec**: [http://localhost:3000/api-docs.json](http://localhost:3000/api-docs.json)

---

## 🗄️ Database Seeding

To facilitate development, includes a script that generates 50 test pets:

```bash
# With DB running
npm run seed
```

---

## 🧪 Tests

```bash
npm test
```

---

## 📄 PDF Generation

The API includes PDF report generation using **@sparticuz/chromium** - a lightweight Chromium build optimized for serverless and containerized environments (Kubernetes, Docker, Lambda).

**Why @sparticuz/chromium?**
- ⚡ **80% lighter** than full Chromium (~50MB vs ~300MB)
- 🚀 **Kubernetes-ready** - minimal resource footprint
- 🔧 **Production-optimized** for containers

**Features:**
- Generate clinic PDF reports with dynamic data
- Handlebars templates for customization
- Automatic styling and formatting

---

## 🤖 AI Features (Optional)

The **Ollama** service is available but **not used by default**.

**To activate:**
```bash
# Download model
docker exec -it animal-clinic-ollama ollama pull llama2

# Verify
curl http://localhost:11434/api/tags
```

**Available features:**
- Pet health analysis
- Recommendations based on medical history
- AI-assisted veterinary consultations

---

## 📝 Environment Variables

The project requires a `.env` file with configuration variables.

**Initial setup:**

```bash
# 1. Copy the example file
cp .env.example .env

# 2. Edit .env with your credentials
nano .env  # or use your preferred editor
```

**Required variables:**

| Variable | Description | Example |
|----------|-------------|---------|
| `DB_HOST` | MongoDB host | `localhost` or `db` (Docker) |
| `DB_PORT` | MongoDB port | `27017` |
| `DB_USER` | Database user | `admin` |
| `DB_PASSWORD` | Database password | `your_secure_password` |
| `DB_NAME` | Database name | `animalClinic` |
| `PORT` | API port | `3000` |
| `NODE_ENV` | Execution environment | `development` or `production` |
| `FRONT_HOST` | Frontend URL (CORS) | `http://localhost:4200` |

> ⚠️ **Important**: Never commit the `.env` file to Git. It's already included in `.gitignore`.

---

## 👨‍💻 Development

```bash
# Development with hot reload
npm run dev

# Build for production
npm run build

# Run production
npm start

# Linting
npm run lint
```
---

## 📂 Detailed Directory Structure

```
src/
├── app.ts                    # Express configuration
├── server.ts                 # Application entry point
│
├── modules/                  # DOMAIN MODULES
│   ├── clinic/              # Clinic Module
│   │   ├── clinic.controller.ts
│   │   ├── clinic.service.ts
│   │   ├── clinic.repository.port.ts
│   │   ├── mongo-clinic.repository.adapter.ts
│   │   ├── clinic.entity.ts     # MongoDB schema
│   │   ├── clinic.model.ts      # API DTO
│   │   ├── clinic.router.ts
│   │   ├── dto/
│   │   │   ├── Request/         # Input DTOs
│   │   │   └── Response/        # Output DTOs
│   │   ├── property-validator/
│   │   └── index.ts             # Module exports
│   │
│   ├── pet/                 # Pet Module
│   │   ├── pet.entity.ts
│   │   ├── pet.model.ts
│   │   ├── dto/
│   │   │   ├── Request/
│   │   │   └── response/
│   │   ├── enums/
│   │   │   ├── pet-gender.enum.ts
│   │   │   └── pet-species.enum.ts
│   │   └── index.ts
│   │
│   ├── veterinarian/        # Veterinarian Module
│   │   ├── veterinarian.entity.ts
│   │   ├── veterinarian.model.ts
│   │   └── index.ts
│   │
│   ├── medical-report/      # Medical Reports Module
│   │   ├── medical-report.entity.ts
│   │   └── index.ts
│   │
│   ├── specialty/           # Specialties Module
│   │   ├── specialty.entity.ts
│   │   └── index.ts
│   │
│   └── ai/                  # AI Module
│       ├── ai.service.ts
│       ├── ai-query.model.ts
│       └── index.ts
│
└── shared/                   # 🔧 SHARED CODE
    ├── application/          # Application layer
    │   └── logging/
    │       ├── logger.interface.ts
    │       └── logger.ts
    │
    ├── config/              # Configurations
    │   ├── ai.config.ts
    │   ├── container.config.ts    # Dependency injection
    │   └── database.config.ts
    │
    ├── documentation/       # Swagger
    │   └── swagger.ts
    │
    ├── middlewares/         # Global middlewares
    │   ├── errors/
    │   │   ├── app-error.ts
    │   │   ├── error-handler.middleware.ts
    │   │   └── errors.index.ts
    │   └── request.validator.ts
    │
    ├── pdf-render/          # PDF generation service
    │   ├── pdf-render.ts
    │   └── pdf-render.interface.ts
    │
    ├── templates/           # Handlebars templates
    │   └── pdf/
    │       └── clinic-report.hbs
    │
    ├── routes/              # Main router
    │   └── routes.index.ts
    │
    ├── scripts/             # Utility scripts
    │   ├── seedRunner.ts
    │   └── seeds/
    │       └── 001_initial_seed.ts
    │
    ├── utils/               # Utilities
    │   └── http-status.util.ts
    │
    └── associations.entity.ts    # Mongoose relationships
```
