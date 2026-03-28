import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const eventsIndexPath = path.resolve(__dirname, '../pages/etkinlikler/index.vue')

test('one cikan etkinlik kartinda bilgi metinleri gorsel ustunde degil icerik alaninda gosterilir', () => {
  const source = fs.readFileSync(eventsIndexPath, 'utf8')

  assert.match(
    source,
    /<v-col\s+cols="12"\s+md="11"\s+class="featured-card-col">/,
    'One cikan etkinlik dis card kapsayiicisi daha genis md=11 olmalidir'
  )

  assert.doesNotMatch(
    source,
    /class="featured-image-meta"/,
    'Bilgiler gorselin ustune yazdirilmamali'
  )

  assert.match(
    source,
    /<v-img[\s\S]*height="100%"[\s\S]*cover/,
    'One cikan kart gorseli alanini tam dolduracak sekilde cover ve yukseklik kullanmali'
  )

  assert.doesNotMatch(
    source,
    /<v-img[\s\S]*aspect-ratio="16\/9"/,
    'One cikan kart gorseli sabit oran yerine alani dolduran yapida olmali'
  )

  assert.doesNotMatch(
    source,
    /\.featured-image-meta\s*\{/,
    'Gorsel uzerine yazan eski meta stili kaldirilmali'
  )

  assert.match(
    source,
    /\{\{\s*eventDateRangeText\(upcomingEvent\)\s*\}\}/,
    'One cikan kart tarih bilgisi fallbackli helper ile render edilmeli'
  )

  assert.match(
    source,
    /\{\{\s*eventLocationText\(upcomingEvent\)\s*\}\}/,
    'One cikan kart konum bilgisi fallbackli helper ile render edilmeli'
  )

  assert.match(
    source,
    /const\s+eventDateRangeText\s*=\s*\(event\)\s*=>/,
    'Tarih araligini fallbackli ureten helper tanimli olmali'
  )

  assert.match(
    source,
    /const\s+eventLocationText\s*=\s*\(event\)\s*=>/,
    'Konum bilgisini fallbackli ureten helper tanimli olmali'
  )

  assert.match(
    source,
    /Tarih bilgisi eklenecek/,
    'Tarih verisi yoksa bilgilendirici fallback metni olmali'
  )

  assert.match(
    source,
    /Konum bilgisi eklenecek/,
    'Konum verisi yoksa bilgilendirici fallback metni olmali'
  )
})
