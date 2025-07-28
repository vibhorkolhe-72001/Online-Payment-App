FROM node:18

WORKDIR /project

COPY package.json package-lock.json ./
COPY public ./public
COPY src ./src
COPY .gitignore .gitignore
COPY index.html index.html
COPY eslint.config.js eslint.config.js
COPY vite.config.js vite.config.js
COPY README.md README.md

RUN npm install

EXPOSE 5173

CMD ["npm", "run", "dev"]
