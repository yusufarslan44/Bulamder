import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const eventsIndexPath = path.resolve(__dirname, '../pages/etkinlikler/index.vue')
const eventDetailPath = path.resolve(__dirname, '../pages/etkinlikler/[id].vue')

test('etkinlik karti modal acmaz, detay sayfasina yonlendirir', () => {
  assert.ok(
    fs.existsSync(eventsIndexPath),
    'Etkinlik liste sayfasi pages/etkinlikler/index.vue konumunda olmali'
  )

  assert.ok(
    fs.existsSync(eventDetailPath),
    'Etkinlik detay sayfasi pages/etkinlikler/[id].vue olarak bulunmali'
  )

  const listSource = fs.readFileSync(eventsIndexPath, 'utf8')
  const detailSource = fs.readFileSync(eventDetailPath, 'utf8')

  assert.doesNotMatch(
    listSource,
    /<v-dialog|dialog\s*=\s*ref\(|selectedEvent\s*=\s*ref\(/,
    'Liste sayfasinda modal detayi kalmamali'
  )

  assert.match(
    listSource,
    /navigateTo\(\s*`\/etkinlikler\/\$\{event\._id\}`\s*\)/,
    'Kart tiklamasi etkinlik detay rotasina yonlenmeli'
  )

  assert.match(
    detailSource,
    /const\s+route\s*=\s*useRoute\(\)/,
    'Detay sayfasi route parametresini okumali'
  )

  assert.match(
    detailSource,
    /route\.params\.id/,
    'Detay sayfasi etkinlik id parametresini kullanmali'
  )
})
