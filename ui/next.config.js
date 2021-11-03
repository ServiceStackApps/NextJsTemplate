const isProd = process.env.NODE_ENV === 'production'

module.exports = {
    async rewrites() {
        let rules = [];
        if (!isProd) {
            process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; // when it works https://github.com/vercel/next.js/issues/21537
            rules.push({
                source: '/api/:path*',
                destination: 'http://localhost:5000/api/:path*', 
            });
        }
        return rules;
    },

    env: {
        apiBaseUrl: isProd ? 'https://nextjs.web-templates.io/' : '/'
    },

    // Use the CDN in production and localhost for development.
    assetPrefix: isProd ? 'https://nextjs-gh.web-templates.io' : '',
}
