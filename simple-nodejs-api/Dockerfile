FROM node:18-alpine

# Create log directory
RUN mkdir -p /var/log/nodejs && \
    chown -R node:node /var/log/nodejs

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Switch to non-root user
USER node

EXPOSE 3000

CMD ["node", "app.js"]
