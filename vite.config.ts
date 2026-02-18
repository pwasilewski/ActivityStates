
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // IMPORTANT: You must replace 'your-repo-name' with the name of your GitHub repository
  // for GitHub Pages to work correctly. For example, if your repo URL is
  // https://github.com/username/my-riziv-app, then the base should be '/my-riziv-app/'.
  base: '/your-repo-name/', 
})
