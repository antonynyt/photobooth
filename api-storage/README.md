# Setup
0. Open terminal at /api-storage or open in project root and use "cd api-storage"
1. npm i
2. rename .env.exemple to .env
(2.5 change key for deployment)

## Start
(0. Install Docker Desktop)
1. Start docker desktop
2. docker run --name mongodb -p 27017:27017 -d mongodb/mongodb-community-server:latest
3. npm start

# Deployment checklist
1. Change corsOptions in app.js 
2. Change DATABASE_URL in .env