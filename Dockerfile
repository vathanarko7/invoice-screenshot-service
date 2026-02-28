FROM node:20-bullseye

# Install Google Chrome Stable
RUN apt-get update && apt-get install -y \
  wget gnupg ca-certificates fonts-liberation \
  && wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | apt-key add - \
  && echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google.list \
  && apt-get update && apt-get install -y google-chrome-stable \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ENV PORT=8080
ENV CHROME_BIN=/usr/bin/google-chrome-stable

EXPOSE 8080
CMD ["npm", "start"]
