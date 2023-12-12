<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center"></p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

This is a small code challenge for [Nest](https://github.com/nestjs/nest)

## Stories:

1. A user can login with a username and password
2. Return success and a JWT token if username and password are correct
3. Return fail if username and password are not matched
4. A user has a maximum of 3 attempts within 5 minutes, otherwise, the user will be locked.
5. Return fail if a user is locked

## Requirements:

1. Use Nest.js framework and typescript is required.
2. Use MongoDB (You can design your own data structure, just create your own seed data.
   No need to do user signup).
3. Unit testing is required
4. Integration testing is required
5. Dockerize your code and your database
6. Upload your project to github and write a proper readme

## Implementation:

1. Use Nest.js framework and typescript.
2. The feature satisfies the user stories mentioned above.
3. Utilising [Atlas](https://www.mongodb.com/atlas/database) as the cloud database.
4. Try to add an user module to POC on
   1. microservice architecture
   2. validate generated JWT token for authentication. 
5. Try to add a rabbitmq module to POC on event driven architecture.
6. Dockerized the apps.

## Give a play in local:

Clone the repo, in project folder run commands to start the app.

```bash
# start apps in docker
$ docker-compose up --build -V

# run below command, or using postman
$ curl --location 'http://localhost:3010/auth/login' \
--header 'Content-Type: application/json' \
--data '{
    "username": "userA",
    "password": "password"
}'
```

## Known defect:

Time is up. The following items are taking as known defect, might work on it soon later
1. UT coverage is not ideal, and not designed thoroughly yet.
2. Integration testing is not really implemented yet. 

## To Do: 

Really planned to pick up, but time run out, will try out later for fun.
1. Set up proper integration testing
2. Add more UT coverage
3. Generate API document from code. [OpenAPI](https://docs.nestjs.com/openapi/introduction')
4. Event Driven Architecture. [KAFKA](https://docs.nestjs.com/microservices/kafka)
5. CI/CD pipeline
6. Cloud hosting (ECS/EKS/K8S)

## License - N/A

This is a code challenge for Nest.js 