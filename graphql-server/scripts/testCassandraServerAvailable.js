const { cassandraClient } = require('../connection')

async function checkCassandraConnection() {
  try {
    await cassandraClient.connect();
    if (cassandraClient.connected) {
      console.log('****** Cassandra host is up! ******');
      return process.exit(0);
    } else {
      console.log('=== Waiting for Cassandra ===');
    }
  } catch (e) {
    return process.exit(1);
  }
}

checkCassandraConnection();