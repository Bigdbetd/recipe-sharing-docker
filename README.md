# Assignment 5 - Recipe Sharing with Docker

React/Vite frontend, Express API, and a persistent SQLite database. Created from RizeComputerScience/COMPSVIII-Assignment5.

## Run the complete application

Install and start Docker Desktop, then run from the repository root:

```bash
docker compose up --build
```

The legacy command `docker-compose up --build` also works when Docker Compose v1 is installed.

- Frontend: http://localhost:3000
- Recipes API: http://localhost:5000/api/recipes
- Health check: http://localhost:5000/api/health

The backend runs on port 5000. References to port 8080 in the starter instructions do not match the server configuration.

## Container configuration

- `backend/Dockerfile`: Node 18 Alpine, npm install, port 5000, and npm start.
- `frontend/Dockerfile`: Node 18 Alpine builds the production assets; nginx serves them on port 80.
- `docker-compose.yml`: builds both services, publishes ports 5000 and 3000, and starts the backend first.
- `.dockerignore` files exclude host node_modules and local build/data files.

Vite embeds `VITE_API_URL` at build time, so Compose supplies it as a build argument as well as the requested runtime environment variable. Rebuild the frontend after changing this value. The localhost address is for a browser on the computer running Docker.

SQLite uses `DB_PATH=/app/data/recipes.db` inside the backend container. The named `recipe_data` volume persists this directory. Local development without DB_PATH continues using backend/recipes.db.

## Verify the application and persistence

1. Start the stack and wait for both services to finish starting.
2. Open the frontend and confirm sample recipes appear.
3. Add a recipe and confirm it appears in the frontend and recipes API.
4. Run `docker compose down`, then `docker compose up -d`.
5. Confirm the added recipe is still present.

`docker compose down` preserves the database volume. Adding `-v` deletes that volume and its recipes.

## Test individual containers

```bash
docker build -t recipe-backend ./backend
docker run --rm -p 5000:5000 recipe-backend
```

In another terminal:

```bash
docker build -t recipe-frontend ./frontend
docker run --rm -p 3000:80 recipe-frontend
```

Stop the individual containers before starting Compose so the ports are available.

## Validation status

Compose YAML and the modified database JavaScript passed syntax checks. Docker was unavailable in the editing environment, so image builds and runtime/persistence tests still need to be run on a Docker-enabled machine.
