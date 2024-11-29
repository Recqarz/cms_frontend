import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // host: '0.0.0.0',  // Allow access from any IP address
    port: 3005,       // Ensure the port is the same (3005)
  },
});
