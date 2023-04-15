module.exports = {
  swcMinify: false,
  trailingSlash: true,
  webpack: (config) => {
    config.experiments = {
      asyncWebAssembly: true,
      layers: true,
    };

    return config;
  },
};