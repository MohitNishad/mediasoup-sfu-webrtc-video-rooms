FROM node:20

WORKDIR /app

# Install build tools and dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    g++\
    build-essential \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Copy package.json and package-lock.json separately
COPY package.json .
COPY package-lock.json .

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose ports
EXPOSE 3016
EXPOSE 10000-10100

# Install nodemon globally
RUN npm install -g nodemon

# Command to start the application
CMD ["npm", "start"]

