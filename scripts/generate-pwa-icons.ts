/* eslint-disable no-console */
/**
 * Generate raster PWA icons from the canonical SVG sources in /public.
 *
 * Outputs (all under /public):
 *   • icon-192.png            — any purpose, 192×192
 *   • icon-512.png            — any purpose, 512×512
 *   • icon-192-maskable.png   — maskable purpose, 192×192
 *   • icon-512-maskable.png   — maskable purpose, 512×512
 *   • apple-touch-icon.png    — 180×180, opaque background for iOS
 *
 * Run:  npm run pwa:icons
 * (Sharp is already in dependencies — no extra install needed.)
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import sharp from 'sharp'

const root = process.cwd()
const pub = (p: string) => resolve(root, 'public', p)

type Target = {
  src: string
  out: string
  size: number
  /** Extra padding flattened as background for iOS home-screen. */
  flattenBg?: string
}

const TARGETS: Target[] = [
  { src: 'icon.svg', out: 'icon-192.png', size: 192 },
  { src: 'icon.svg', out: 'icon-512.png', size: 512 },
  { src: 'icon-maskable.svg', out: 'icon-192-maskable.png', size: 192 },
  { src: 'icon-maskable.svg', out: 'icon-512-maskable.png', size: 512 },
  { src: 'icon.svg', out: 'apple-touch-icon.png', size: 180, flattenBg: '#09090b' },
]

async function run(): Promise<void> {
  for (const t of TARGETS) {
    const srcPath = pub(t.src)
    if (!existsSync(srcPath)) {
      console.error(`[pwa-icons] Missing source: ${srcPath}`)
      process.exitCode = 1
      continue
    }
    const svg = readFileSync(srcPath)
    let pipeline = sharp(svg, { density: 384 }).resize(t.size, t.size, { fit: 'cover' })
    if (t.flattenBg) pipeline = pipeline.flatten({ background: t.flattenBg })
    const buf = await pipeline.png({ compressionLevel: 9 }).toBuffer()
    writeFileSync(pub(t.out), buf)
    console.log(`[pwa-icons] ✓ ${t.out} (${t.size}×${t.size}, ${buf.byteLength.toLocaleString()}B)`)
  }
}

run().catch((err) => {
  console.error('[pwa-icons] failed:', err)
  process.exit(1)
})
