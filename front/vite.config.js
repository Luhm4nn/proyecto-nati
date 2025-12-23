import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  // Validar variables de entorno requeridas
  const requiredEnvVars = ['VITE_API_URL'];
  const missingEnvVars = requiredEnvVars.filter(varName => !env[varName]);
  
  if (missingEnvVars.length > 0) {
    throw new Error(
      `Faltan las siguientes variables de entorno:\n${missingEnvVars.map(v => `  - ${v}`).join('\n')}\n\nCrea un archivo .env con estas variables.`
    );
  }

  return {
    plugins: [react()],
  };
})
