# Define the base image
FROM node:22.15.1-alpine

# Define the working directory
WORKDIR /app

# Copy the package.json & lockfile from the root
COPY package*.json ./

# Install dependencies in /app/node_modules
RUN npm install

# Copy all your project files into /app
COPY . .

# Expose port 3000 for the express server
EXPOSE 3000

# Run the express server
CMD ["node", "server/app.js"]
