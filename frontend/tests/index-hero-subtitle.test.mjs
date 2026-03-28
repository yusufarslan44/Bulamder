import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const indexPagePath = path.resolve(__dirname, '../pages/index.vue')

test('hero alt baslik metni sabit degil, heroSection.subtitle ile render edilir', () => {
  const pageSource = fs.readFileSync(indexPagePath, 'utf8')

  assert.match(
    pageSource,
    /{{\s*heroSection\.subtitle\s*}}/,
    'Hero alt baslik alani heroSection.subtitle baglamasi kullanmali'
  )

  assert.doesNotMatch(
    pageSource,
    /<span[^>]*>\s*DOĞAYLA\s+İÇ\s+İÇE\s*<\/span>/u,
    'Hero alt baslik alani sabit metin icermemeli'
  )
})
