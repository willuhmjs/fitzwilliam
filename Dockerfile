FROM node:22

WORKDIR /usr/app

COPY package*.json ./

# Install production dependencies.
RUN npm ci

# Copy local code to the container image.
COPY . .

RUN npm run build

# Run the web service on container startup.
CMD [ "node", "build/index.js" ]