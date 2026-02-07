# Define the base image
FROM node:14.21.2

# Set the working directory
WORKDIR /app

# Copy project files to the container
COPY package*.json ./
COPY tsconfig*.json ./
COPY src ./src

# Install dependencies
RUN npm install

# Compile TypeScript
RUN npm run build

# Expose port 3000
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
