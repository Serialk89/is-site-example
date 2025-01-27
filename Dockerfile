# Usamos una imagen base de Node.js para construir la aplicación
FROM node:18-alpine AS builder

# Establecemos el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos los archivos de configuración del proyecto
COPY package.json package-lock.json* ./

# Instalamos las dependencias
RUN npm install

# Copiamos el resto de los archivos del proyecto
COPY . .

# Generamos el build de producción
RUN npm run build

# Usamos una imagen ligera de Nginx para servir la aplicación
FROM nginx:alpine

# Copiamos el build de la aplicación a la carpeta de Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Exponemos el puerto 80
EXPOSE 80

# Iniciamos Nginx
CMD ["nginx", "-g", "daemon off;"]