# Load Testing a GraphQL API using Artillery

This example shows you how to load test on a GraphQL API using Artillery.

## Running the GraphQL server

This example runs a GraphQL server using [Apollo Server](https://www.apollographql.com/docs/apollo-server/) and [Prisma](https://www.prisma.io/) for data persistence. Prisma is configured to use PostgreSQL.

First, install the server dependencies:

```shell
npm install
```

Next, configure your PostgreSQL server connection string by setting the `DATABASE_URL` environment variable (either on the server or through the `.env` file). With the database created and configured, set up the required database tables by running the Prisma database migrations:

```shell
npx prisma migrate dev
```

After installing the dependencies and setting up the database, start the GraphQL server:

```shell
node app.js
```

This command will start the GraphQL API server listening at http://localhost:4000/. Once the server is up and running, you can explore the server using the [Apollo Sandbox](https://studio.apollographql.com/sandbox/).

## Running Artillery tests

This repo contains two test scripts ([`tests/performance/graphql.yml`] and [`tests/performance/users.yml`]) which runs a few end-to-end flows against the GraphQL server. Once the GraphQL server is up and running, execute the test scripts:

```
npm run test:graphql
npm run test:users
```
