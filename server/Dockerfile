# # Use official Node.js image
# FROM node:18

# # Set working directory
# WORKDIR /usr/src/app

# # Copy backend package files and install dependencies
# COPY package.json ./
# RUN npm install

# # Copy the rest of the backend code
# COPY . .

# # Expose port
# EXPOSE 5000

# # Start the server
# CMD ["npm", "start"]











# 1️⃣ Start from official Node.js image
FROM node:22
# 🔍 WHY: Provides Node runtime + npm preinstalled.
# 🚫 Without it: The container won’t understand “node” or “npm” commands.

# 2️⃣ Set working directory inside container
WORKDIR /usr/src/app
# 🔍 WHY: All future paths (COPY, RUN) are relative here.
# 🚫 Without it: Files copy to random root folders; code won’t run correctly.

# 3️⃣ Copy package.json and install dependencies
COPY package*.json ./
RUN npm install
# 🔍 WHY: Install only what's in package.json (express, dotenv, etc.)
# 🚫 Without it: Server won’t have libraries like express, pg, etc.

# 4️⃣ Copy rest of backend code
COPY . .
# 🔍 WHY: Brings in your index.js, routes, uploads, etc.
# 🚫 Without it: Container would only have dependencies, no code to run.

# 5️⃣ Expose the backend port
EXPOSE 5000
# 🔍 WHY: Makes port 5000 accessible from host.
# 🚫 Without it: Container runs internally, but nothing reaches localhost.

# 6️⃣ Run the backend
CMD ["npm", "start"]
# 🔍 WHY: Uses “start” script in package.json (node index.js)
# 🚫 Without it: Container starts, then does nothing and stops.
