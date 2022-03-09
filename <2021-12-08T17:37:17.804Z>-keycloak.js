"use strict";
const { DOWN_MIGRATION } = require("../config/globals");
const waitOn = require("wait-on");
const path = require("path");

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
 * @module - Migrations to create or to drop a table correpondant to a sequelize model.
 */
module.exports = {
  /**
   * up - configure the keycloak instance with zendro defaults
   *
   * @param  {object} zendro initialized zendro object
   */
  up: async (zendro) => {
    // wait for keycloak service to be available
    await waitOn({ resources: [KEYCLOAK_BASEURL] });
    // setup default keycloak instance
    try {
      const {
        KEYCLOAK_PUBLIC_KEY,
        KEYCLOAK_GIQL_CLIENT_SECRET,
        KEYCLOAK_SPA_CLIENT_SECRET,
      } = await setupKeyCloak();

      console.log(`Successfully created default keycloak zendro realm, client, roles.
          A default user "zendro-admin" with password "admin" was created to login to the
          zendro services. Please delete that user before publically deploying zendro.
          To login to the keycloak admin console use credentials user: "admin"
          pw: "admin" at "${KEYCLOAK_BASEURL}/auth". Change that user / password to your liking.
          `);

      // write ENV variables
      // graphql-server
      fs.appendFileSync(
        path.resolve(__dirname, "../.env"),
        `\nOAUTH2_PUBLIC_KEY="${KEYCLOAK_PUBLIC_KEY}"\nOAUTH2_CLIENT_ID=${KEYCLOAK_GQL_CLIENT}`
      );

      // graphiql-auth
      fs.appendFileSync(
        path.resolve(__dirname, "../../graphiql-auth/.env.development"),
        `\nOAUTH2_CLIENT_SECRET=${KEYCLOAK_GIQL_CLIENT_SECRET}\nOAUTH2_CLIENT_ID=${KEYCLOAK_GIQL_CLIENT}`
      );

      fs.appendFileSync(
        path.resolve(__dirname, "../../graphiql-auth/.env.production"),
        `\nOAUTH2_CLIENT_SECRET=${KEYCLOAK_GIQL_CLIENT_SECRET}\nOAUTH2_CLIENT_ID=${KEYCLOAK_GIQL_CLIENT}`
      );

      // single-page-app
      fs.appendFileSync(
        path.resolve(__dirname, "../../single-page-app/.env.development"),
        `\nOAUTH2_CLIENT_SECRET=${KEYCLOAK_SPA_CLIENT_SECRET}\nOAUTH2_CLIENT_ID=${KEYCLOAK_SPA_CLIENT}`
      );

      fs.appendFileSync(
        path.resolve(__dirname, "../../single-page-app/.env.production"),
        `\nOAUTH2_CLIENT_SECRET=${KEYCLOAK_SPA_CLIENT_SECRET}\nOAUTH2_CLIENT_ID=${KEYCLOAK_SPA_CLIENT}`
      );

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
