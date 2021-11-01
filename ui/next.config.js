module.exports = {
    async rewrites() {
        let rules = [];
        console.log(process.env.NODE_ENV)
        const dev = process.env.NODE_ENV === 'development';
        if (dev) {
            process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; // when it works https://github.com/vercel/next.js/issues/21537
            rules.push({
                source: '/api/:path*',
                destination: 'http://localhost:5000/json/reply/:path*', 
            });
        }
        return rules;
    },
  }