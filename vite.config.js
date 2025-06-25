import react from '@vitejs/plugin-react';

/** @type {import('vite').UserConfig} */
export default {
  plugins: [react()],
  optimizeDeps: {
    include: ['jspdf', 'jspdf-autotable']  // ✅ Important fix
  }
};
