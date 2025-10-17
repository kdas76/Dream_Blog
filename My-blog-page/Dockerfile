# FROM node:18

# WORKDIR /usr/src/app

# COPY package*.json ./
# RUN npm install

# COPY . .

# # Build the React app
# RUN npm run build

# # Serve using a lightweight HTTP server
# RUN npm install -g serve

# EXPOSE 3000
# CMD ["serve", "-s", "build", "-l", "3000"]



# 1️⃣ Base image
FROM node:22
# 🔍 WHY: Same Node.js environment as dev; ensures npm + vite work.

# 2️⃣ Set working directory
WORKDIR /usr/src/app

# 3️⃣ Copy package files and install deps
COPY package*.json ./
RUN npm install
# 🔍 WHY: Installs React, Vite, Tailwind, etc.
# 🚫 Without it: `npm run build` will fail instantly.

# 4️⃣ Copy rest of frontend source
COPY . .

# 5️⃣ Build optimized React app
RUN npm run build
# 🔍 WHY: Creates production “dist/” folder.
# 🚫 Without it: There’s no static site to serve.

# 6️⃣ Install a lightweight static server
RUN npm install -g serve
# 🔍 WHY: Needed to host the built files.
# 🚫 Without it: App would build but never display in browser.

# 7️⃣ Expose frontend port
EXPOSE 3000
# 🔍 WHY: Makes the container reachable from host at port 3000.

# 8️⃣ Default command to start server
CMD ["serve", "-s", "dist", "-l", "3000"]
# 🔍 WHY: Serve the built site.
# 🚫 Without it: Container exits right after building.
