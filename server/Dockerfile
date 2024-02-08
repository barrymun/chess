# Use the official Node.js image
FROM node:18

# create and set working directory in the container
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Copy package.json and package-lock.json before other files
# Utilize Docker cache to save re-installing dependencies if unchanged
COPY server/package*.json /usr/src/app/
RUN yarn install
COPY tsconfig.json /usr/src
COPY server/tsconfig.json /usr/src/app/

# Copy local code to the container image
COPY server/. /usr/src/app/

RUN yarn build

EXPOSE 3001

# Specify the command to run on container start
CMD [ "yarn", "start" ]
