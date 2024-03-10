FROM node:18

# copy base files
COPY package*.json /usr/src/
COPY yarn.lock /usr/src/
COPY tsconfig.json /usr/src/
COPY .eslintrc.json /usr/src/

# copy the common package
COPY common/. /usr/src/common/

# prepare server and copy files
RUN mkdir -p /usr/src/server
WORKDIR /usr/src/server
COPY server/. /usr/src/server/

RUN yarn install
# RUN yarn install --frozen-lockfile

RUN yarn build

EXPOSE 3001

CMD [ "yarn", "start" ]
