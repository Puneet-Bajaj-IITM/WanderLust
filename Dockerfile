# Use a smaller base image for Node.js
FROM node:14

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port on which your Node.js application will run
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]
