import { defineConfig } from "vite";
import dyadComponentTagger from "@dyad-sh/react-vite-component-tagger";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(() => ({
  server: {
    host: "0.0.0.0", // Разрешить доступ из любого IP
    port: 8080,
    headers: {
      'Permissions-Policy': 'geolocation=(self)',
      'Feature-Policy': 'geolocation \'self\''
    }
  },
  plugins: [dyadComponentTagger(), react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Разделяем вендорные библиотеки
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': [
            '@radix-ui/react-accordion',
            '@radix-ui/react-alert-dialog',
            '@radix-ui/react-aspect-ratio',
            '@radix-ui/react-avatar',
            '@radix-ui/react-checkbox',
            '@radix-ui/react-collapsible',
            '@radix-ui/react-context-menu',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-hover-card',
            '@radix-ui/react-label',
            '@radix-ui/react-menubar',
            '@radix-ui/react-navigation-menu',
            '@radix-ui/react-popover',
            '@radix-ui/react-progress',
            '@radix-ui/react-radio-group',
            '@radix-ui/react-scroll-area',
            '@radix-ui/react-select',
            '@radix-ui/react-separator',
            '@radix-ui/react-slider',
            '@radix-ui/react-slot',
            '@radix-ui/react-switch',
            '@radix-ui/react-tabs',
            '@radix-ui/react-toast',
            '@radix-ui/react-toggle',
            '@radix-ui/react-toggle-group',
            '@radix-ui/react-tooltip'
          ],
          'charts-vendor': ['recharts'],
          'utils-vendor': [
            'clsx',
            'class-variance-authority',
            'tailwind-merge',
            'cmdk',
            'date-fns',
            'zod'
          ],
          'i18n-vendor': ['i18next', 'react-i18next'],
          'forms-vendor': ['react-hook-form', '@hookform/resolvers'],
          'pdf-vendor': ['jspdf', 'html2canvas'],
          'carousel-vendor': ['embla-carousel-react'],
          'icons-vendor': ['lucide-react'],
          'theme-vendor': ['next-themes'],
          'query-vendor': ['@tanstack/react-query'],
          'notifications-vendor': ['sonner'],
          'resizable-vendor': ['react-resizable-panels'],
          'otp-vendor': ['input-otp'],
          'drawer-vendor': ['vaul']
        }
      }
    },
    // Увеличиваем лимит предупреждения до 1000kb, но стремимся к меньшему
    chunkSizeWarningLimit: 1000,
    // Включаем минификацию
    minify: 'terser' as const,
    terserOptions: {
      compress: {
        drop_console: true, // Удаляем console.log в продакшене
        drop_debugger: true
      }
    }
  },
}));
