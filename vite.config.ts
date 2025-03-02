import react from '@vitejs/plugin-react-swc'
import { defineConfig, loadEnv } from 'vite'
import { resolve } from 'node:path'
import svgr from 'vite-plugin-svgr'

import { version } from './package.json'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '');
	const port = Number(env.VITE_PORT) || 3000;

	return {
		server: {
      port,
      host: true,
      strictPort: true,
      allowedHosts: ['app.troya.dev'],
    },
		preview: {
      port,
    },
		define: {
			APP_ENV: JSON.stringify(env.APP_ENV),
			APP_VERSION: JSON.stringify(version),
		},
		resolve: {
			alias: {
				'@': resolve(__dirname, 'src'),
			},
		},
		build: {
			outDir: 'dist',
			sourcemap: true,
			target: 'esnext',
			rollupOptions: {
				output: {
					chunkFileNames: '[name]-[hash].js',
					entryFileNames: '[name]-[hash].js',
					sourcemapFileNames: '[name]-[hash].js.map',
				},
			},
		},
		plugins: [
			react(),

			svgr({
        include: '**/*.svg',
        svgrOptions: {
          plugins: ['@svgr/plugin-svgo', '@svgr/plugin-jsx'],
          svgoConfig: {
            plugins: [
              {
                name: 'prefixIds',
                params: {
                  prefixIds: false,
                  prefixClassNames: false,
                },
              },
            ],
          },
        },
      }),
		],
	}
})
