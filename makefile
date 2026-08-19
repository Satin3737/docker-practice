dev:
	docker compose up

dev-rebuild:
	docker compose up --build -V

build:
	docker build --target prod -t docker-practice:prod .

prod:
	docker compose --profile prod up --build docker-practice-app-prod

prod-logs:
	docker compose logs docker-practice-app-prod -f --no-log-prefix | pnpm exec pino-pretty

sh:
	docker compose exec docker-practice-app sh

migrate:
	docker compose exec docker-practice-app pnpm db:migrate

create-migration:
	docker compose exec docker-practice-app pnpm db:create-migration

seed:
	docker compose exec docker-practice-app pnpm db:seed

down:
	docker compose down

clear:
	docker compose down -v