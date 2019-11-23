# Use nodejs as the base container image
FROM node:12

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available.
# COPY package*.json ./
# RUN npm ci

# Bundle app source
COPY . .

RUN npm install

RUN npm audit fix

EXPOSE 8080

CMD [ "npm", "run", "dev" ]