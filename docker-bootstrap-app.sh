#!/bin/sh
# Need to explicit pass DATABASE_URL here, otherwise migration doesn't work
# Run migrations
DATABASE_URL="postgres://ekaii:ekaii@db:5432/ekaii" npx prisma migrate deploy
# start app
DATABASE_URL="postgres://ekaii:ekaii@db:5432/ekaii" node server.js