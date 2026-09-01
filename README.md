# RiwiMediCare Plus API

A REST API for managing medical-supply requests between clinics and warehouses. It provides authentication with JWT, role-based access control, inventory tracking, and interactive API documentation.

## Main features

- User registration, login, token refresh, and logout.
- Management of clinics, warehouses, medicines, and inventory.
- Supply-request lifecycle with automatic inventory adjustments.
- `ADMIN` and `REQUEST_MANAGER` roles.
- Optional initial data upload from a JSON file.
- Swagger UI documentation.

## Requirements

- Node.js 22 or later
- PostgreSQL 16 or later, or Docker with Docker Compose

## Run locally

1. Install the dependencies:

   ```bash
   npm install
   ```

2. Create your environment file and adjust the database and JWT values if needed:

   ```bash
   cp .env.example .env
   ```

3. Create the PostgreSQL database specified by `DB_NAME` and make sure PostgreSQL is running.

4. Build and start the API:

   ```bash
   npm run build
   npm start
   ```

The server starts on `http://localhost:3000` by default. Tables are synchronized automatically when the application starts.

## Run with Docker

Create `.env` from `.env.example`, then run:

```bash
docker compose up --build
```

This starts both the API and PostgreSQL. To stop the containers, press `Ctrl+C` and run `docker compose down`.

## How to use the API

Open the interactive documentation at [http://localhost:3000/api-docs](http://localhost:3000/api-docs). A health check is available at [http://localhost:3000/health](http://localhost:3000/health).

1. Register a user with `POST /api/v1/auth/register`.
2. Log in with `POST /api/v1/auth/login` and copy the `accessToken`.
3. In Swagger, click **Authorize** and paste the access token.
4. As an `ADMIN`, create clinics, warehouses, medicines, and inventory, or upload [examples/seed-data.example.json](examples/seed-data.example.json) through `POST /api/v1/seed`.
5. Create and manage supply requests through `/api/v1/requests`. `REQUEST_MANAGER` users can create requests; administration endpoints require the `ADMIN` role.

## Environment variables

| Variable | Description |
| --- | --- |
| `PORT` | API port (default: `3000`) |
| `DB_HOST`, `DB_PORT` | PostgreSQL connection host and port |
| `DB_NAME`, `DB_USER`, `DB_PASSWORD` | PostgreSQL database credentials |
| `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET` | Secrets used to sign JWTs |
| `JWT_ACCESS_EXPIRES_IN`, `JWT_REFRESH_EXPIRES_IN` | Token lifetimes, such as `15m` or `7d` |

Do not use the example JWT secrets in production; replace them with strong, private values.

## API base URL

```text
http://localhost:3000/api/v1
```
# Link repository GitHub

https://github.com/Luyss264/nodePruebaDesemp.git