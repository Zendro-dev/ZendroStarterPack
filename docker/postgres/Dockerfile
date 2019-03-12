FROM postgres:11.1-alpine

COPY docker/postgres/init_db.sh /docker-entrypoint-initdb.d/init_db.sh
RUN chmod 755 /docker-entrypoint-initdb.d/init_db.sh