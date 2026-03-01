FROM node:20-bookworm-slim

# Install Chromium + required libraries + Khmer fonts
RUN apt-get update && apt-get install -y --no-install-recommends \
  chromium \
  ca-certificates \
  fonts-liberation \
  fonts-khmeros \
  fonts-noto-core \
  fonts-noto-ui-core \
  fonts-noto-color-emoji \
  fonts-noto-extra \
  fonts-noto-unhinted \
  libnss3 \
  libatk-bridge2.0-0 \
  libatk1.0-0 \
  libcups2 \
  libdrm2 \
  libxkbcommon0 \
  libxcomposite1 \
  libxdamage1 \
  libxfixes3 \
  libxrandr2 \
  libgbm1 \
  libasound2 \
  libpangocairo-1.0-0 \
  libpango-1.0-0 \
  libgtk-3-0 \
  && rm -rf /var/lib/apt/lists/* \
  && fc-cache -f -v

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

ENV PORT=8080
ENV CHROME_BIN=/usr/bin/chromium
EXPOSE 8080

CMD ["npm", "start"]