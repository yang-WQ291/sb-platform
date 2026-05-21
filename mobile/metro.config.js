const { getDefaultConfig } = require("expo/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// NativeWind - EAS cloud server (Linux) can load this, Windows may not
// Use try/catch so local validation doesn't block the build
try {
  const { withNativeWind } = require("nativewind/metro");
  const path = require("path");
  module.exports = withNativeWind(config, {
    input: path.resolve(__dirname, "global.css"),
  });
} catch (e) {
  console.warn("⚠️ nativewind/metro not available, continuing without CSS processing");
  module.exports = config;
}
