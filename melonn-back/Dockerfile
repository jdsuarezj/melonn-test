FROM node:alpine

WORKDIR /app
COPY package.json .
RUN npm install
COPY . .

EXPOSE ${NEST_PORT}

CMD ["npm", "run", "start"]