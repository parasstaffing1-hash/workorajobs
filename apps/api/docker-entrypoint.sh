#!/bin/sh
set -e

pnpm prisma:deploy
exec node dist/main.js
