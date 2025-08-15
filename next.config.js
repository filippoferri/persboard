module.exports = {
    swcMinify: false,
    trailingSlash: true,
    optimizeFonts: false, // Disable font optimization to avoid timeout issues
    webpack: (config) => {
        config.experiments = {
            asyncWebAssembly: true,
            layers: true,
        };

        return config;
    },
};