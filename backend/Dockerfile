FROM node:20-alpine
WORKDIR /app

# Install dependencies first (layer cache)
COPY package*.json ./
RUN npm install --omit=dev

COPY src/ ./src/

ENV PORT=5000
EXPOSE 5000

# Run as non-root user for security
USER node

CMD ["node", "src/index.js"]
