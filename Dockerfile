FROM node:20-alpine

# Set working directory
WORKDIR /app

COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

EXPOSE 3000

# Default command (overridden by docker-compose in dev)
CMD ["npm", "run", "dev"]