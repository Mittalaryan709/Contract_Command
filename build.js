import { execSync } from 'child_process'
import fs from 'fs'

console.log('Building frontend Vite bundle...')
execSync('npm --prefix frontend run build', { stdio: 'inherit' })

console.log('Cleaning and copying frontend/dist to dist...')
fs.rmSync('dist', { recursive: true, force: true })
fs.cpSync('frontend/dist', 'dist', { recursive: true })

console.log('Build complete!')
