import { defineConfig } from 'vite'

export default defineConfig({
  base: '/',
  server: {
    port: 3000,
    open: false
  },
  preview: {
    port: process.env.PORT || 3000,
    host: '0.0.0.0',
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      'healthcheck.railway.app',
      'berealartest-production.up.railway.app'
    ]
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: 'index.html',
        reveal: 'reveal.html',
        admin: 'admin.html'
      }
    },
    copyPublicDir: true
  },
  publicDir: 'public',
  optimizeDeps: {
    include: ['qrcode', 'qr-scanner']
  },
  plugins: [
    {
      name: 'multi-page-dev',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url && req.url.endsWith('.html')) {
            return next();
          }
          
          if (req.url === '/reveal') {
            req.url = '/reveal.html';
            return next();
          }
          
          if (req.url === '/admin') {
            req.url = '/admin.html';
            return next();
          }
          
          next();
        });
      }
    }
  ]
}) 