# EkaiiWebApp

## Local Development
1. Clone the repository
2. Fill in the `.env` file with the necessary environment variables
3. Run `yarn install` to install dependencies

This project needs a PostgreSQL database with pg_cron extension to run. You can use the ekaii-db docker image in this repository to run the database.

## Deployment

This project is deployed using docker-compose. You can use the `docker-compose.yml` file in this repository to deploy the project. Just fill in the necessary environment variables in the `.env` file, or add env variables and run `docker-compose up -d` to deploy the project.