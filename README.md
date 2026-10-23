# Animal Clinic API

A REST API for managing clinics, pets, and veterinarians, built with NestJS and MongoDB.

## Architecture

The application uses a simple hexagonal architecture: HTTP controllers call application services, which depend on ports (interfaces). Adapters implement those ports for infrastructure such as MongoDB repositories and PDF reports. This keeps application logic separate from infrastructure.

## Requirements

- Node.js 22+
- MongoDB 7+, running locally or with Docker

## Run locally

1. Copy `.env.example` to `.env` and configure the database connection.
2. Install dependencies and start the API:

```bash
npm install
npm run dev
```

For a local MongoDB instance, set `DB_HOST=localhost`.

## Run with Docker

Set `DB_HOST=db` in `.env`, then start the services:

```bash
docker compose up --build
```

Stop the services with `Ctrl+C` or `docker compose down`.

## URLs

- Swagger UI: http://localhost:3000/api-docs
- API base path: http://localhost:3000/api
- Health check: http://localhost:3000/health

## Configuration

The application reads configuration from `.env`:

| Variable | Description |
| --- | --- |
| `PORT` | HTTP port (default: `3000`). |
| `DB_HOST`, `DB_PORT` | MongoDB address; use `localhost` locally or `db` with Docker Compose. |
| `DB_USER`, `DB_PASSWORD`, `DB_NAME` | MongoDB credentials and database name. |
| `FRONT_HOST` | Allowed CORS origin. |
| `JWT_SECRET` | JWT signing secret, at least 32 characters. |
| `AUTH_BOOTSTRAP_ADMIN_EMAIL`, `AUTH_BOOTSTRAP_ADMIN_PASSWORD` | Optional. Set both to create the initial platform admin; the password must be at least 12 characters. |
| `OLLAMA_HOST`, `OLLAMA_MODEL` | Ollama URL and model used to generate pet care reports. |
| `AI_TEMPERATURE`, `AI_MAX_TOKENS`, `AI_TIMEOUT_MS` | Optional Ollama generation settings (defaults: `0.7`, `2000`, and `120000`). |

Use a private value for `JWT_SECRET`. Do not commit `.env`.

## Roles

- `platform_admin`: manages clinics and veterinarians, and can manage pets across all clinics.
- `clinic_admin`: manages pets in their own clinic.
- `clinic_user`: reads pets and clinical histories in their own clinic.

Sign in at `POST /api/auth/login` and include the returned token in the `Authorization` header using the Bearer scheme. Clinic and veterinarian routes are restricted to the platform admin.

## AI-assisted pet care report

`POST /api/pets/:id/care-report` returns a PDF containing the pet's calculated age, breed, registered medical history, and Ollama-generated care recommendations and suggested clinic follow-up. It is available to authenticated clinic users for pets in their clinic and to platform administrators. The report is informational and does not replace a veterinarian's assessment. Ollama must be reachable at `OLLAMA_HOST` and have the configured model available; the endpoint returns `503` if generation fails.

## Useful commands

```bash
npm run build       # Build
npm test            # Run tests
npm run lint        # Lint
npm run seed        # Load sample data
```
