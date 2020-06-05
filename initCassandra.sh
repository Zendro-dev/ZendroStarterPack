#!/bin/bash

# Create default keyspace for single node cluster
CQL="CREATE KEYSPACE IF NOT EXISTS sciencedb WITH REPLICATION = {'class': 'SimpleStrategy', 'replication_factor': 1};"
until echo $CQL | cqlsh; do
  echo "cqlsh: Cassandra is unavailable - retry later"
  sleep 2
done &

exec /docker-entrypoint.sh "$@"