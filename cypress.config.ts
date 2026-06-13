import { defineConfig } from 'cypress';
import * as fs from 'fs';
import * as path from 'path';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(_on, config) {
      const envPath = path.resolve(__dirname, '.env');
      if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf-8');
        envContent.split('\n').forEach((line) => {
          const trimmed = line.trim();
          if (trimmed && !trimmed.startsWith('#')) {
            const eqIndex = trimmed.indexOf('=');
            if (eqIndex > 0) {
              const key = trimmed.slice(0, eqIndex).trim();
              const value = trimmed.slice(eqIndex + 1).trim();
              if (key === 'NUXT_PUBLIC_CYPRESS_EMAIL') {
                config.env.CYPRESS_EMAIL = value;
              } else if (key === 'NUXT_PUBLIC_CYPRESS_PASSWORD') {
                config.env.CYPRESS_PASSWORD = value;
              } else if (key === 'NEXT_PUBLIC_API_URL') {
                config.env.API_URL = value;
              }
            }
          }
        });
      }
      return config;
    },
  },
});
