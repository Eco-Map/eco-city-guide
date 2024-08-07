run-dev:
	docker-compose build
	docker-compose watch

run-prod:
	docker compose -f docker-compose.prod.yml up --build --detach

test-backend:
	docker compose exec back-end npm run test:watch

test-webapp:
	docker compose exec web-app npm run test:watch

test-specific:
	docker-compose exec back-end node "node_modules/jest/bin/jest.js" "src/tests/$(directory)/$(name).test.ts" -c "jest.config.js" -t

coverage-test:
	docker compose exec back-end npm run test:coverage

logs-dev:
	docker compose logs -f

logs-prod:
	docker compose -f docker-compose.prod.yml logs -f

clean-database: 
	docker-compose exec back-end npx ts-node src/utils/cleanDatabase.ts

clean-cache:
	docker-compose exec back-end npx ts-node src/utils/cleanCache.ts

insert-mocks:
	docker-compose exec back-end npx ts-node src/mocks/categoryMock.ts
	docker-compose exec back-end npx ts-node src/mocks/cityMock.ts
	docker-compose exec back-end npx ts-node src/mocks/placeMock.ts
	docker-compose exec back-end npx ts-node src/mocks/userMock.ts

graphql-codegen:
	cd web-app/ && npm run graphql-codegen

tailwind:
	cd web-app/ && npx tailwindcss -i ./src/styles/input.css -o ./src/styles/output.css --watch
