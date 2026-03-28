import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const detailPath = path.resolve(__dirname, '../pages/etkinlikler/[id].vue')

test('etkinlik detayinda tek takvim aksiyonu ve calisan paylasim butonlari vardir', () => {
  const source = fs.readFileSync(detailPath, 'utf8')

  assert.doesNotMatch(
    source,
    /Hatırlatıcı Kur/,
    'Detay sayfasinda hatirlatici kur butonu olmamali'
  )

  assert.match(
    source,
    /@click="shareEvent\('facebook'\)"/,
    'Facebook paylasim butonu shareEvent ile calismali'
  )

  assert.match(
    source,
    /@click="shareEvent\('twitter'\)"/,
    'Twitter paylasim butonu shareEvent ile calismali'
  )

  assert.match(
    source,
    /@click="shareEvent\('whatsapp'\)"/,
    'WhatsApp paylasim butonu shareEvent ile calismali'
  )

  assert.match(
    source,
    /const\s+shareEvent\s*=\s*(async\s*)?\(platform\)\s*=>/,
    'Paylasim mantigi script tarafinda tanimli olmali'
  )

  assert.match(
    source,
    /:global\(body\.bw-theme\)\s+\.share-sheet/,
    'Black theme icin paylasim alani ozel stil icermeli'
  )
})
