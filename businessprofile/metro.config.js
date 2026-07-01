const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const { withNativeWind } = require('nativewind/metro');

const defaultConfig = getDefaultConfig(__dirname);

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  resolver: {
    blockList: [
      /[/\\]\.cxx([/\\]|$)/,
      /[/\\]android[/\\]app[/\\]build([/\\]|$)/,
    ].concat(defaultConfig.resolver.blockList || []),
  },
};

module.exports = withNativeWind(
  mergeConfig(defaultConfig, config),
  { input: './global.css' }
);
