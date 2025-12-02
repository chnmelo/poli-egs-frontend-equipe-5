# --- Estágio 1: Construção (Build) ---
# Dê um nome ao estágio: 'AS build'
FROM node:18-alpine AS build

WORKDIR /app

# 1. Declare o argumento que vem do docker-compose
ARG VITE_url_backend

# 2. Exponha-o como uma variável de ambiente para o build
ENV VITE_url_backend=$VITE_url_backend

COPY package*.json ./
RUN npm install

COPY . .
# Crie os arquivos estáticos de produção
RUN npm run build

# --- Estágio 2: Servidor (Serve) ---
# Use uma imagem Nginx super leve
FROM nginx:1.25-alpine

# Copie os arquivos estáticos do Estágio 1 ('build') para a pasta do Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copia nossa nova configuração para o Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# O Nginx escuta na porta 80 por padrão
EXPOSE 80

# Comando para iniciar o Nginx (este é o padrão da imagem Nginx)
CMD ["nginx", "-g", "daemon off;"]