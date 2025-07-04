FROM node:20-alpine

WORKDIR /app

ARG REACT_APP_PUSHER_KEY
ARG REACT_APP_BASE_URL

ENV REACT_APP_PUSHER_KEY=$REACT_APP_PUSHER_KEY
ENV REACT_APP_BASE_URL=$REACT_APP_BASE_URL

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM nginx:alpine
COPY --from=0 /app/build /usr/share/nginx/html
COPY default.conf /etc/nginx/conf.d/default.conf


EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
