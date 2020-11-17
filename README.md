# Xendit API

Technical assesment for Xendit

#

## Specifications
* Node.js with express using typescript
* Supertest/Jest for unit testing

## Requirements

* Yarn
* Docker
* Docker-compose

<br>

## Installation
1. copy `.env.dist` to `.env`
```bash
$ cp .env.dist .env
```

2. install all dependencies
```bash
$ yarn install
```

3. build docker containers
```bash
$ docker-compose up -d --build
```

4. migrate PostgreSQL data

    verify node docker (*`xendit_node_xendit_1`*) container is running, verify by running `docker ps -a`

    ```bash
    $ docker ps -a

    CONTAINER ID        IMAGE                 PORTS                    NAMES
    88d7c9ab3dfb        xendit_node_xendit                             xendit_node_xendit_1
    421078ab7b46        postgres:11.6         0.0.0.0:5432->5432/tcp   xendit_postgres_1
    4ac02d653a37        nginx:1.17-alpine     0.0.0.0:3800->80/tcp     xendit_nginx_1
    ```

    execute migration script using docker exec
    ```bash
    $ docker exec xendit_node_xendit_1 yarn migrate up
    ```
    replace **<docker_node_name>** if docker name is changed or different.
    ```bash
    $ docker exec <docker_node_name> yarn migrate up
    ```

5. You can now access the application at [http://localhost:3800](http://localhost:3800)


<br>

## API Routes
| METHOD    | Route                                          |
| ----------|:----------------------------------------------:|
| **POST**  | `http://localhost:3800/notifications/<merchantId>/notify/test`|
| **POST**|`http://localhost:3800/notifications/<merchantId>/notify` |
| **POST**|`http://localhost:3800/notifications/<notificationId>/retry` |
| **GET**   |`http://localhost:3800/merchants`  |
| **PATCH**   | `http://localhost:3800/merchants/<merchantId>`|


<br>

## Swagger Docs

Access docs at [http://localhost:3800/api-docs](http://localhost:3800/api-docs)

<br>

## Running Test
```bash
$ docker exec xendit_node_xendit_1 yarn test
```
or replace **<docker_node_name>** if docker name is different.
```bash
$ docker exec <xendit_node_service_name> yarn test
```
