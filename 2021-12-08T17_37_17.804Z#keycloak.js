"use strict";
const { DOWN_MIGRATION } = require("../config/globals");
const waitOn = require("wait-on");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");



const GQL_ENV_PATH = "../.env";
const GQL_ENV = require("dotenv").config({
  path: path.resolve(__dirname, GQL_ENV_PATH),
});
const SPA_PRD_ENV_PATH = "../../single-page-app/.env.production";
const SPA_PRD_ENV = require("dotenv").config({
  path: path.resolve(__dirname, SPA_PRD_ENV_PATH),
});
const SPA_DEV_ENV_PATH = "../../single-page-app/.env.development";
const SPA_DEV_ENV = require("dotenv").config({
  path: path.resolve(__dirname, SPA_DEV_ENV_PATH),
});

const {
  setupKeyCloak,
  cleanupKeyCloak,
  KEYCLOAK_BASEURL,
  KEYCLOAK_GIQL_CLIENT,
  KEYCLOAK_SPA_CLIENT,
  KEYCLOAK_GQL_CLIENT,
} = require("../utils/setup-keycloak");

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
      await waitOn({ resources: [`${KEYCLOAK_BASEURL}/realms/master`], timeout: 120000 });
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

      // graphql-server - the only service with real Keycloak credentials.
      // graphiql-auth needs none of its own: it reverse-proxies /auth/* to
      // graphql-server's own top-level /auth endpoints (see zendro-graphiql's
      // README, "Acting as an auth backend for other origins") using the
      // OAUTH2_GRAPHIQL_* client below.
      let envPath = path.resolve(__dirname, "../.env");
      let parsedEnv = GQL_ENV.parsed;
      parsedEnv.OAUTH2_PUBLIC_KEY = KEYCLOAK_PUBLIC_KEY;
      parsedEnv.OAUTH2_CLIENT_ID = KEYCLOAK_GQL_CLIENT;
      parsedEnv.OAUTH2_GRAPHIQL_CLIENT_ID = KEYCLOAK_GIQL_CLIENT;
      parsedEnv.OAUTH2_GRAPHIQL_CLIENT_SECRET = KEYCLOAK_GIQL_CLIENT_SECRET;
      // Required once AUTH_ENABLED is "true" (the zendro CLI's env template
      // default) - nothing else generates this one, unlike the Keycloak
      // client secrets above, so a fresh `zendro set-up`/`new` would
      // otherwise crash gqs on first boot. Only generated when not already
      // set, so an explicit `zendro set-next-auth-secret gqs ...` (or a
      // hand-edited .env) is never clobbered on a later `migration:up`.
      parsedEnv.SESSION_SECRET = parsedEnv.SESSION_SECRET || crypto.randomBytes(32).toString("base64");
      writeEnvFile(envPath, parsedEnv);

      // single-page-app
      if (SPA_PRD_ENV.parsed) {
        envPath = path.resolve(
          __dirname,
          SPA_PRD_ENV_PATH
        );
        parsedEnv = SPA_PRD_ENV.parsed;
        parsedEnv.OAUTH2_CLIENT_ID = KEYCLOAK_SPA_CLIENT;
        parsedEnv.OAUTH2_CLIENT_SECRET = KEYCLOAK_SPA_CLIENT_SECRET;
        writeEnvFile(envPath, parsedEnv);
      }

      if (SPA_DEV_ENV.parsed) {
        envPath = path.resolve(
          __dirname,
          SPA_DEV_ENV_PATH
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
