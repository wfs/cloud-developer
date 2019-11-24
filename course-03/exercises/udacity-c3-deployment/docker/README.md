# Udagram Image Filtering Microservice

Udagram is a simple cloud application developed alongside the Udacity Cloud Engineering Nanodegree. It allows users to register and log into a web client, post photos to the feed, and process photos using an image filtering microservice.

> STEP 1: must create .env file, update it with your environment variables (passwords, etc) + create .gitignore file with `.env` in it and save them in `/udacity-c3-deployment/docker/` folder.

```terminal
POSTGRES_USERNAME=TODO
POSTGRES_PASSWORD=TODO
POSTGRES_DATABASE_NAME=TODO
POSTGRES_HOST=TODO
AWS_REGION=TODO
AWS_PROFILE=TODO
AWS_MEDIA_BUCKET=TODO
JWT_SECRET=TODO
```

> STEP 2: you need to create `.dockerignore` file in root of each microservice with `node_modules` in it for `/udacity-c3-deployment/docker $ sudo docker-compose up` to work.

## Tasks

### Setup Docker Environment

You'll need to install docker https://docs.docker.com/install/. Open a new terminal within the project directory and run:

1. Build the images: `docker-compose -f docker-compose-build.yaml build --parallel`
2. Push the images: `docker-compose -f docker-compose-build.yaml push`
3. Run the container: `docker-compose up`
