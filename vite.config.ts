import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { defineConfig } from 'vite'

// https://vite.dev/config/
// En GitHub Pages la app se sirve en https://<usuario>.github.io/pasapalabra/,
// así que el compilado usa esa ruta base. En desarrollo se sigue usando "/".
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/pasapalabra/' : '/',
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
}))
