module.exports = function (api) {
  api.cache(true);

  const plugins = ["react-native-reanimated/plugin"];

  // nativewind/babel is incompatible with Jest's Babel transform
  // See: https://github.com/expo/expo/issues/36133
  if (process.env.NODE_ENV !== "test") {
    plugins.unshift("nativewind/babel");
  }

  return {
    presets: ["babel-preset-expo"],
    plugins,
  };
};
