import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const stylePath = path.resolve(__dirname, '../assets/styles/main.css')

test('black temada carousel kontrol alaninda koyu serit arka plan olmamalidir', () => {
  const source = fs.readFileSync(stylePath, 'utf8')

  assert.match(
    source,
    /body\.bw-theme\s+\.v-carousel__controls\s*\{[\s\S]*background:\s*transparent\s*!important;/,
    'Dark temada carousel kontrollerinin arka plani saydam olmalidir'
  )

  assert.doesNotMatch(
    source,
    /body\.bw-theme\s+\.v-carousel__controls\s*\{[\s\S]*background:\s*rgba\(\s*0\s*,\s*0\s*,\s*0\s*,\s*0\.4\s*\)\s*!important;/,
    'Dark temada carousel kontrolleri icin siyah serit arka plan kullanilmamali'
  )
})

