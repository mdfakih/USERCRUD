import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  base: '/USERCRUD/', // <-- 👈 add this line (use your repo name)
  plugins: [react()],
});
