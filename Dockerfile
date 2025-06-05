FROM node:18-alpine AS runtime
WORKDIR /app

RUN apk add --no-cache python3 py3-pip

RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
RUN pip install --no-cache-dir paho-mqtt

COPY package*.json ./
RUN npm install --omit=dev --legacy-peer-deps

COPY .next ./.next
COPY public ./public
COPY .env.production .env.production
COPY scripts ./scripts

RUN chown -R node:node .next

EXPOSE 3000
USER node
CMD ["npm", "start"]
