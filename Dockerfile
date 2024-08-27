# Use an official Node runtime as a parent image
FROM node:20-alpine

# Set the working directory
WORKDIR /usr/src/app

# Install pnpm
RUN npm install -g pnpm

# Copy package.json and pnpm-lock.yaml to the working directory
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the Nuxt 3 application
RUN pnpm build

# Expose the port the app runs on
EXPOSE 4200

# Define the command to run the application
CMD ["pnpm", "start:prod"]