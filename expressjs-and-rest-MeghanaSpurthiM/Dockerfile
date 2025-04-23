# Use Node.js LTS for multi-architecture support
FROM node:lts
WORKDIR /app

# Install build tools required for better-sqlite3
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

# Copy only package.json and package-lock.json first to leverage Docker caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Remove and rebuild better-sqlite3 to ensure compatibility
RUN npm rebuild better-sqlite3

EXPOSE 3000
CMD ["node", "app.js"]