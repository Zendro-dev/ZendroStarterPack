const { getModulesSync } = require("../utils/module-helpers");
const { getConnectionInstances, ConnectionError } = require("../connection");
const { join } = require("path");

// require all cassandra migrations
let migrations_cassandra = {};
const migrationPath = "../migrations/default-cassandra";
getModulesSync(join(__dirname, migrationPath)).forEach((file) => {
  let migration = require(`${join(migrationPath, file)}`);
  migrations_cassandra[file.slice(0, file.length - 3)] = migration;
});

// This only does the migration once and creates the db_migrated table. migrations won't be rerun for newly added models and/or attributes.
async function createTableMigrated() {
  // get the default cassandra client
  const connectionInstances = await getConnectionInstances();
  const cassandraClient = connectionInstances.get("default-cassandra")
    .connection;
  if (!cassandraClient) throw new Error("cassandra client is undefined");
  const tableQuery =
    "SELECT table_name FROM system_schema.tables WHERE keyspace_name='sciencedb';";
  let result = await cassandraClient.execute(tableQuery);
  console.log('Check for tables in keyspace "sciencedb" executed');
  let migrationTable = false;
  let migrateToDo = true;
  for (let i = 0; i < result.rowLength; i++) {
    if (result.rows[i].table_name === "db_migrated") {
      migrationTable = true;
      console.log("Migration table found.");
    }
  }
  if (migrationTable) {
    let queryMigration = "SELECT migrated_at FROM db_migrated;";
    result = await cassandraClient.execute(queryMigration);
    if (result.rowLength >= 1) {
      migrateToDo = false;
      console.log("Migration table filled, no more migration to do.");
      return process.exit(0);
    }
  }
  if (migrateToDo) {
    await Promise.allSettled(
      Object.values(migrations_cassandra).map(
        async (cassandraHandler) => await cassandraHandler.up()
      )
    );
    const createTable =
      "CREATE TABLE IF NOT EXISTS db_migrated ( migrated_at timeuuid PRIMARY KEY )";
    await cassandraClient.execute(createTable);
    console.log("Migration table created");
    const rowInsert = "INSERT INTO db_migrated (migrated_at) VALUES (now())";
    await cassandraClient.execute(rowInsert);
    console.log("Migration table filled.");
    return process.exit(0);
  }
}

createTableMigrated();
