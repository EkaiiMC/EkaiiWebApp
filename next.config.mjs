/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                "protocol": "https",
                "hostname": "mc-heads.net",
            },
        ],
    },
    experimental: {
        instrumentationHook: true,
    },
    reactStrictMode: true,
    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
        config.plugins.push(
            new webpack.IgnorePlugin({ resourceRegExp: /osx-temperature-sensor/ })
        );
        // Enable polling based on env variable being set
        if(process.env.NEXT_WEBPACK_USEPOLLING) {
            config.watchOptions = {
                poll: 500,
                aggregateTimeout: 300
            }
        }
        return config
    },
};

export default nextConfig;
