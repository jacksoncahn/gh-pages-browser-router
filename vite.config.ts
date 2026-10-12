import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { execSync } from 'node:child_process'
import { readFileSync } from 'node:fs'

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8')) as {
  version?: string
}

function getLastCommitDate(): string {
  try {
    return execSync('git log -1 --date=format:%m.%d.%Y --format=%cd', {
      stdio: ['ignore', 'pipe', 'ignore']
    })
      .toString()
      .trim()
  } catch {
    return new Date().toLocaleDateString('en-US')
  }
}

const appVersion = pkg.version ?? '1.0.0'
const appLastModified = getLastCommitDate()

export default defineConfig({
  define: {
    APP_VERSION: JSON.stringify(appVersion),
    APP_LAST_MODIFIED: JSON.stringify(appLastModified)
  },
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']]
      }
    }),
    tailwindcss()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  base: '/gh-pages-browser-router/'
})
