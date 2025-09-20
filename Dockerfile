# ベース
#なんか脆弱性出てるみたいなのでデプロイ前には修正する
FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
