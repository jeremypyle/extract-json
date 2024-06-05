# Use the official Node.js image as the base image
FROM node:14

# Install necessary libraries
RUN apt-get update && apt-get install -y \
    libnss3 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libxcomposite1 \
    libxrandr2 \
    libxdamage1 \
    libpango-1.0-0 \
    libxshmfence1 \
    libpangocairo-1.0-0 \
    libgbm-dev \
    libasound2 \
    libx11-xcb1 \
    libx11-6 \
    libx11-dev \
    libxss1 \
    libxtst6 \
    libxrandr-dev \
    libxcursor1 \
    libxfixes3 \
    libxrender1 \
    libxcomposite-dev \
    libxi6 \
    libxkbcommon-x11-0

# Create and change to the app directory
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Run the application
CMD ["node", "index.js"]
