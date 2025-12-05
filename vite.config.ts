import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		sveltekit({
			onwarn: (warning: any, defaultHandler: any) => {
				// Suppress all A11y warnings
				if (warning.code?.startsWith('a11y-')) {
					return;
				}
				defaultHandler(warning);
			}
		})
	]
});

