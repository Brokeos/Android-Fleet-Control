#!/bin/sh
cd ./server
npm install -y fastify
npm install winston
npm install winston-daily-rotate-file
npm run build && npm run start

