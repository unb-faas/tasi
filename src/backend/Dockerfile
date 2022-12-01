FROM index.docker.io/library/node:14-slim
LABEL application="Tasi"
LABEL maintainer="University of Brasilia"
LABEL component="Backend"
WORKDIR "/backend"
COPY package.json /backend/package.json
RUN npm i knex -g
RUN npm i --no-optional
COPY . /backend
EXPOSE 3001
#CMD export DEBUG=knex:* && knex migrate:latest && npm start
CMD knex migrate:latest && npm start