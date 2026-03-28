import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const pagePath = path.resolve(__dirname, '../pages/iletisim.vue')

test('iletisim dis kutusu black temada siyah gradient yerine daha yumusak surface kullanir', () => {
  const source = fs.readFileSync(pagePath, 'utf8')

  assert.match(
    source,
    /:global\(body\.bw-theme\)\s+\.contact-shell\s*\{/,
    'Scoped stilde black tema secicisi global olarak tanimlanmali'
  )

  assert.match(
    source,
    /background:\s*rgba\(255,\s*255,\s*255,\s*0\.06\)/,
    'Dis kutu black temada yumusak yarı-seffaf surface arka plan kullanmali'
  )

  assert.doesNotMatch(
    source,
    /#192338|#1d2a42/,
    'Dis kutuda koyu siyah/lacivert gradient renkleri kullanilmamali'
  )

  assert.match(
    source,
    /:global\(body\.bw-theme\)\s+\.page-container\s*\{[\s\S]*background:\s*transparent/,
    'Iletisim sayfasinin ana container arka plani black temada transparent olmali'
  )
})
