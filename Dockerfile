FROM node:16-alpine

# Crear y establecer el directorio de trabajo
WORKDIR /usr/src/app

# Copiar package.json y package-lock.json
COPY package*.json ./
 
# Instalar dependencias
RUN npm install

# Copiar todo el código al contenedor
COPY . .

# Exponer el puerto
EXPOSE 3004

# Comando para iniciar la aplicación
CMD ["node", "src/app.js"]