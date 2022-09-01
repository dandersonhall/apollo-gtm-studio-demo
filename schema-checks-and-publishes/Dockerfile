FROM node:18-buster

WORKDIR /app
COPY ./package.json /app/

RUN npm install

COPY ./build-error-schema.graphql /app/
COPY ./operations-error-schema.graphql /app/
COPY ./good-schema.graphql /app/
COPY ./actual-schema.graphql /app/
COPY ./schema-check.sh /app/

CMD ["./schema-check.sh"]