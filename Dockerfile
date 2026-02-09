FROM node:18-alpine

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./
COPY tsconfig.json ./

# Instalar dependências
RUN npm install

# Copiar código fonte
COPY src/ ./src/
COPY config/ ./config/

# Expor porta do backend
EXPOSE 5000

# Comando para rodar o backend
CMD ["npm", "run", "dev"]

