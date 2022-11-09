db.createUser({
  user: "sciencedb",
  pwd: "sciencedb",
  roles: [
    {
      role: "readWrite",
      db: "sciencedb_development",
    },
  ],
});
