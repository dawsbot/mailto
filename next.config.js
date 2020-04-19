// from https://dev.to/akhilaariyachandra/environment-variables-in-next-js-1lkg
const Dotenv = require('dotenv-webpack');

module.exports = {
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Add the new plugin to the existing webpack plugins
    config.plugins.push(new Dotenv({ silent: true }));

    return config;
  }
};
