git clone

add .env:
MONGO_URL=mongodb://mongo:27017/my-database
REDIS_URL=redis://redis:6379
PORT=3001
SESSION_SECRET=supersecretstring12345!

docker-compose up

http://localhost:3000

http://localhost:3001/api-docs/ - Swagger
