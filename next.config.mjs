/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
       turbo: {}
    },
    images: {
        remotePatterns: [
            {
                "protocol": "https",
                "hostname": "mc-heads.net",
            },
            {
                "protocol": "https",
                "hostname": "**.ekaii.fr",
            }
        ],
    },
    reactStrictMode: true,
    webpack: (config, { _, __, ___, ____, webpack }) => {
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
    output: "standalone",
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'Content-Security-Policy',
                        value: "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; object-src 'self' map.ekaii.fr; frame-src 'self' map.ekaii.fr;",
                    },
                ],
            },
        ];
    }
};

export default nextConfig;
