# Use official Node runtime as a parent image
FROM node:18-alpine

# Install curl for health check
RUN apk add --no-cache curl

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies (only production for smaller image)
RUN npm install --only=production

# Bundle app source
COPY . .

# Expose port
EXPOSE 5000

# Define environment variable for production
ENV NODE_ENV=production

# Command to run the application
CMD ["npm", "start"]
