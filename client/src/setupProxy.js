const proxy = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(proxy('/api', {
        target: 'https://mighty-ravine-36409.herokuapp.com',
        changeOrigin: true,
        pathRewrite: { '^/api': '' },
      }));
};