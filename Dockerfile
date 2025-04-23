FROM node:18-alpine AS runtime
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev --legacy-peer-deps
COPY .next ./.next
COPY public ./public
COPY .env.production .env.production

RUN chown -R node:node .next


EXPOSE 3000
USER node
CMD ["npm","start"]