clear

export POSTGRES_DATABASE=trackabl-api-test-db

export NOCK_TEST=false


node_modules/.bin/sequelize db:create
npm run migrate:test
npx sequelize-cli db:seed:all
