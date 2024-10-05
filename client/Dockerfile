FROM node:20.13.1 as node

# copy base files
COPY package*.json /usr/src/
COPY yarn.lock /usr/src/
COPY tsconfig.json /usr/src/
COPY .eslintrc.json /usr/src/

# prepare client and copy files
RUN mkdir -p /usr/src/client
WORKDIR /usr/src/client
COPY client/. /usr/src/client/

RUN yarn install

RUN yarn build

# use Nginx as the production server
FROM nginx:alpine
# copy the custom Nginx configuration file to the container
COPY client/nginx/nginx.conf /etc/nginx/conf.d/default.conf
# copy the built React app to Nginx's web server directory
COPY --from=node /usr/src/client/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
