import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 3000,
    open: false
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
    }
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