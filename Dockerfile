FROM node:22.15.1-alpine

# Set up the backend working directory and install dependencies
WORKDIR /app
COPY package*.json ./
RUN npm install

# Set up the frontend working directory and install dependencies
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install

# Copy the entire project into the container
WORKDIR /app
COPY . .

# Build the React frontend
WORKDIR /app/client
RUN npm run build

# Switch back to app directory for server
WORKDIR /app

# Expose the backend server port
EXPOSE 3000

# Start the backend server
CMD ["node", "server/app.js"]