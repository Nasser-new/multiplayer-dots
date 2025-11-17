# Use official Node.js runtime as a parent image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json if available
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Expose the port environment variable or default
ENV PORT=3000
EXPOSE $PORT

# Start the application
CMD ["npm", "start"]
