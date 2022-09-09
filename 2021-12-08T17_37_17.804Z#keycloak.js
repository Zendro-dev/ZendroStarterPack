"use strict";
const { DOWN_MIGRATION } = require("../config/globals");
const waitOn = require("wait-on");
const path = require("path");
const fs = require("fs");

const GQL_ENV = require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});
const SPA_PRD_ENV = require("dotenv").config({
  path: path.resolve(__dirname, "../../single-page-app/.env.production"),
});
const GIQL_PRD_ENV = require("dotenv").config({
  path: path.resolve(__dirname, "../../graphiql-auth/.env.production"),
});
const SPA_DEV_ENV = require("dotenv").config({
  path: path.resolve(__dirname, "../../single-page-app/.env.development"),
});
const GIQL_DEV_ENV = require("dotenv").config({
  path: path.resolve(__dirname, "../../graphiql-auth/.env.development"),
});

const {
  setupKeyCloak,
  cleanupKeyCloak,
  KEYCLOAK_BASEURL,
  KEYCLOAK_GIQL_CLIENT,
  KEYCLOAK_SPA_CLIENT,
  KEYCLOAK_GQL_CLIENT,
} = require("../utils/setup-keycloak");
const axios = require("axios");
/**
 * @module - Migrations to create or to drop a table correspondent to a sequelize model.
 */
module.exports = {
  /**
   * up - configure the keycloak instance with zendro defaults
   *
   * @param  {object} zendro initialized zendro object
   */
  up: async (zendro) => {
    function writeEnvFile(file, env) {
      const parsedEnvString = Object.entries(env)
        .map((entry) => `${entry[0]}="${entry[1]}"`)
        .reduce((a, c) => {
          a += c + "\n";
          return a;
        }, "");
      fs.writeFileSync(file, parsedEnvString);
    }

    try {
      // wait for keycloak service to be available
      await waitOn({ resources: [KEYCLOAK_BASEURL], timeout: 120000 });
      // setup default keycloak instance
      const {
        KEYCLOAK_PUBLIC_KEY,
        KEYCLOAK_GIQL_CLIENT_SECRET,
        KEYCLOAK_SPA_CLIENT_SECRET,
      } = await setupKeyCloak();

      console.log(`Successfully created default keycloak zendro realm, client, roles.
          A default user "zendro-admin" with password "admin" was created to login to the
          zendro services. Please delete that user before publically deploying zendro.
          To login to the keycloak admin console use credentials user: "admin"
          pw: "admin" at "${KEYCLOAK_BASEURL}". Change that user / password to your liking.
          `);

      // graphql-server
      let envPath = path.resolve(__dirname, "../.env");
      let parsedEnv = GQL_ENV.parsed;
      parsedEnv.OAUTH2_PUBLIC_KEY = KEYCLOAK_PUBLIC_KEY;
      parsedEnv.OAUTH2_CLIENT_ID = KEYCLOAK_GQL_CLIENT;
      writeEnvFile(envPath, parsedEnv);

      // graphiql-auth
      if (GIQL_PRD_ENV.parsed) {
        envPath = path.resolve(
          __dirname,
          "../../graphiql-auth/.env.production"
        );
        parsedEnv = GIQL_PRD_ENV.parsed;
        parsedEnv.OAUTH2_CLIENT_ID = KEYCLOAK_GIQL_CLIENT;
        parsedEnv.OAUTH2_CLIENT_SECRET = KEYCLOAK_GIQL_CLIENT_SECRET;
        writeEnvFile(envPath, parsedEnv);
      }

      if (GIQL_DEV_ENV.parsed) {
        envPath = path.resolve(
          __dirname,
          "../../graphiql-auth/.env.development"
        );
        parsedEnv = GIQL_DEV_ENV.parsed;
        parsedEnv.OAUTH2_CLIENT_ID = KEYCLOAK_GIQL_CLIENT;
        parsedEnv.OAUTH2_CLIENT_SECRET = KEYCLOAK_GIQL_CLIENT_SECRET;
        writeEnvFile(envPath, parsedEnv);
      }

      // single-page-app
      if (SPA_PRD_ENV.parsed) {
        envPath = path.resolve(
          __dirname,
          "../../single-page-app/.env.production"
        );
        parsedEnv = SPA_PRD_ENV.parsed;
        parsedEnv.OAUTH2_CLIENT_ID = KEYCLOAK_SPA_CLIENT;
        parsedEnv.OAUTH2_CLIENT_SECRET = KEYCLOAK_SPA_CLIENT_SECRET;
        writeEnvFile(envPath, parsedEnv);
      }

      if (SPA_DEV_ENV.parsed) {
        envPath = path.resolve(
          __dirname,
          "../../single-page-app/.env.development"
        );
        parsedEnv = SPA_DEV_ENV.parsed;
        parsedEnv.OAUTH2_CLIENT_ID = KEYCLOAK_SPA_CLIENT;
        parsedEnv.OAUTH2_CLIENT_SECRET = KEYCLOAK_SPA_CLIENT_SECRET;
        writeEnvFile(envPath, parsedEnv);
      }

      console.log(
        "Successfully added OAuth2 keycloak PUBLIC_KEY, CLIENT_ID and CLIENT_SECRET environment variables."
      );
    } catch (error) {
      throw new Error(error);
    }
  },

  /**
   * down - Drop a table.
   *
   * @param  {object} zendro initialized zendro object
   */
  down: async (zendro) => {
    try {
      await cleanupKeyCloak();
    } catch (error) {
      throw new Error(error);
    }
  },
};
