FROM node:18-alpine

WORKDIR /app

# 1. Copiamos el package.json de la RAÍZ (ISSI)
COPY package*.json ./

# 2. Instalamos todas las dependencias (Express, Mysql, React, etc.)
# Aunque instala las de React también, es la forma segura de que funcione tu backend.
RUN npm install

# 3. Copiamos TODO el código (Server y Src)
COPY . .

# 4. Exponemos el puerto
EXPOSE 3001

# 5. Ejecutamos el comando que tienes definido en tus scripts
# Tu package.json dice: "server": "nodemon ./server/app.js"
CMD ["npm", "run", "server"]