FROM node:22.14.0

WORKDIR /app

RUN npm install -g @angular/cli

COPY . .

ENTRYPOINT [ "ng", "serve", "--host", "0.0.0.0" ]

RUN npm install