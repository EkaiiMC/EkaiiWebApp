#!/bin/sh
DATABASE_URL="postgres://ekaii:ekaii@db:5432/ekaii" npx prisma migrate deploy
DATABASE_URL="postgres://ekaii:ekaii@db:5432/ekaii" node server.js