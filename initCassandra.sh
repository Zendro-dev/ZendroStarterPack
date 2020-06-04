#!/bin/bash
cqlsh localhost -e "CREATE KEYSPACE IF NOT EXISTS default WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 1};"