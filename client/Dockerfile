FROM node:18 as node

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY tsconfig.json /usr/src/
COPY common/. /usr/src/common/

COPY client/package*.json /usr/src/app/
COPY yarn.lock /usr/src/app/
COPY client/tsconfig.json /usr/src/app/

COPY client/. /usr/src/app/
# this just overrides the default .eslintrc.json file, but need a better solution
COPY .eslintrc.json /usr/src/app/

RUN yarn install

RUN yarn build

# use Nginx as the production server
FROM nginx:alpine
# copy the custom Nginx configuration file to the container
COPY client/nginx/nginx.conf /etc/nginx/conf.d/default.conf
# copy the built React app to Nginx's web server directory
COPY --from=node /usr/src/app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
