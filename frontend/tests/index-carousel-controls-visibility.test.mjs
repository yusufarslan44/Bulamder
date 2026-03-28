import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const indexPath = path.resolve(__dirname, '../pages/index.vue')

test('anasayfa carousel noktalari kart altinda ve temaya gore gorunur tonda olmalidir', () => {
  const source = fs.readFileSync(indexPath, 'utf8')

  assert.match(
    source,
    /\.news-carousel\s*:deep\(\.v-carousel__controls\)[\s\S]*bottom:\s*-\d+px;/,
    'Haber carousel kontrol noktaları kartın altına taşınmalı'
  )

  assert.match(
    source,
    /\.news-carousel\s*:deep\(\.v-carousel__controls\s+\.v-btn\)[\s\S]*color:\s*rgba\(11,\s*114,\s*49,/,
    'Açık temada noktalar daha görünür yeşil tona sahip olmalı'
  )

  assert.match(
    source,
    /:global\(body\.bw-theme\)\s+\.news-carousel\s*:deep\(\.v-carousel__controls\s+\.v-btn--active\)[\s\S]*#34d399/,
    'Dark temada aktif nokta kontrastlı yeşil ton kullanmalı'
  )
})

