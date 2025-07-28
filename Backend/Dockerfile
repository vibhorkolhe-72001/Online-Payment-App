FROM node

WORKDIR /PayTM App/backend

COPY package.json package-lock.json ./
COPY prisma ./prisma
COPY .gitignore .gitignore
COPY .env .env
COPY index.js index.js

RUN npm install

ENTRYPOINT ["node", "index.js"]
