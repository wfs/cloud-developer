# PROJECT 3 - Refactor Udagram App into Microservices and Deploy

## 1. CI/CD, Github & Code Quality

- [GitHub code repository](https://github.com/wfs/cloud-developer/tree/master/course-03/exercises)
- ### Setup and deploy project
  - Simply clone or download the main project from [Github](https://github.com/wfs/cloud-developer)
  - build the docker images
  ```terminal
  $ sudo docker-compose -f course-03/exercises/udacity-c3-deployment/docker/docker-compose-build.yaml build
  ```
  - Run the docker containers
  ```terminal
  course-03/exercises/udacity-c3-deployment/docker$ sudo docker-compose up
  ```
- ### Main building blocks

  ![Manual and Automatic build activity diagram](kubernetes_cluster_creation_process_20191208.png)

  #### Manual build / deploy

  1. Local development / test / docker image build and push to dockerhub repository.
  2. Terraform / Kubeone the aws kubernetes cluster of Worker and Master nodes to manage / host the pods.
  3. `kubectl apply` the docker containers into the kubernetes pods.

  #### Automated CI / CD

  1. With `./.travis.yml` in project root, add a webhook in Github with travis-ci, select your Github repository from travis-ci to monitor for new code pushes. Automated builds of the docker services images will occur on each new git push from Local.
     ![Automated CI build in travis-ci](travis_build_success_20191208.png)

## 2. Container

### Docker files

```terminal
./udacity-c3-deployment/docker/Dockerfile
./udacity-c3-frontend/Dockerfile
./udacity-c3-restapi-feed/Dockerfile
./udacity-c3-restapi-user/Dockerfile
```

### Docker images

```terminal
$ sudo docker images

REPOSITORY                        TAG                 IMAGE ID            CREATED             SIZE
openflocks/udacity-frontend       latest              7a366b0fb0f0        2 hours ago         37.2MB
openflocks/udacity-restapi-feed   latest              295c0dcd3752        2 hours ago         1.15GB
openflocks/udacity-restapi-user   latest              a8f754846f80        2 hours ago         1.15GB
openflocks/reverseproxy           latest              7552e69cb96b        2 hours ago         21.5MB
node                              12                  961bb6b05db5        2 weeks ago         908MB
beevelop/ionic                    latest              a831ad5b9e77        2 weeks ago         2.81GB
nginx                             alpine              a624d888d69f        2 weeks ago         21.5MB
alpine                            latest              965ea09ff2eb        6 weeks ago         5.55MB
```

### Dockerhub images

![Dockerhub images are available for the application](dockerhub_images_20191208.png)

### Docker container services running locally

![Docker container services running locally](docker_container_services_running_locally_20191208.png)

## 3. Deployment

- Deployed to kubernetes cluster on aws
  ![Deployed to kubernetes cluster on aws](deployed_to_kubernetes_cluster_on_aws_20191208.png)

- Upgrade a service

```terminal
andrew@andrew-Alienware-Aurora-R5:$ cd udacity-c3-deployment/k8s

andrew@andrew-Alienware-Aurora-R5:$ kubectl convert -f backend-user-deployment.yaml | kubectl create -f -
kubectl convert is DEPRECATED and will be removed in a future version.
In order to convert, kubectl apply the object to the cluster, then kubectl get at the desired version.
deployment.apps/backend-user created

andrew@andrew-Alienware-Aurora-R5:$ kubectl apply --dry-run=true --validate=true -f backend-user-deployment.yaml
deployment.apps/backend-user configured (dry run)

andrew@andrew-Alienware-Aurora-R5:$ kubectl apply -f backend-user-deployment.yaml
Warning: kubectl apply should be used on resource created by either kubectl create --save-config or kubectl apply
deployment.apps/backend-user configured
```

- Rolling update

- A/B deployment of the application

- Monitoring via Amazon Cloudwatch
