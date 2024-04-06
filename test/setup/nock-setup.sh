clear

export POSTGRES_DATABASE=trackabl-api-test-db

export NOCK_TEST=true


node_modules/.bin/sequelize db:create
npm run migrate:dev:up
npx sequelize-cli db:seed:all
