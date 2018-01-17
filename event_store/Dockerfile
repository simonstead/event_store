FROM node:latest

# Create app directory
WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./

RUN yarn
# If you are building your code for production
# RUN npm install --only=production
RUN npm install -g mocha

# Bundle app source
COPY . .

EXPOSE 3000
CMD [ "yarn", "start" ]
