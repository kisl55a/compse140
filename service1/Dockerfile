FROM node:22-alpine

RUN apk add --no-cache docker-cli

WORKDIR /app

COPY index.js .
COPY stop_containers.sh .
COPY start.sh .

CMD ["./start.sh"]