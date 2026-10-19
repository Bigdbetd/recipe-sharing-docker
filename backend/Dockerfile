FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN mkdir -p /app/data
ENV PORT=5000
ENV DB_PATH=/app/data/recipes.db
EXPOSE 5000
CMD ["npm", "start"]
