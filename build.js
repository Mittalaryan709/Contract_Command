import { execSync } from 'child_process'
import fs from 'fs'

console.log('Building frontend Vite bundle...')
execSync('npm --prefix frontend run build', { stdio: 'inherit' })

console.log('Copying frontend/dist to dist...')
fs.cpSync('frontend/dist', 'dist', { recursive: true })

console.log('Build complete!')
