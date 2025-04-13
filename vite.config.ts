import react from '@vitejs/plugin-react-swc'
import { resolve } from 'node:path'
import { defineConfig, loadEnv } from 'vite'
import svgr from 'vite-plugin-svgr'
import tsconfigPaths from "vite-tsconfig-paths"
import { version } from './package.json'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '')
	const port = Number(env.VITE_PORT) || 80

	return {
		server: {
			port,
			host: true,
			strictPort: true,
			allowedHosts: ['troya.internal'],
<<<<<<< HEAD
      cors: false
=======
>>>>>>> d6e942680f4e297951932a2ecc58c548cc61d19b
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
				'~': resolve(__dirname, 'src'),
				'@app': resolve(__dirname, 'src/app'),
				'@entities': resolve(__dirname, 'src/entities'),
				'@features': resolve(__dirname, 'src/features'),
				'@pages': resolve(__dirname, 'src/pages'),
				'@shared': resolve(__dirname, 'src/shared'),
				'@widgets': resolve(__dirname, 'src/widgets'),
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
			tsconfigPaths(),
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
