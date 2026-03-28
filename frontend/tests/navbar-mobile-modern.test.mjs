import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const navbarPath = path.resolve(__dirname, '../components/Navbar.vue')

test('mobil navbar drawer modern siniflar ve zengin menu metadatasi kullanir', () => {
  const source = fs.readFileSync(navbarPath, 'utf8')

  assert.match(
    source,
    /class="mobile-drawer"/,
    'Mobil drawer modern stil sinifini kullanmali'
  )

  assert.match(
    source,
    /description:\s*['"]/,
    'Mobil menu ogeleri aciklayici description metadatasi icermeli'
  )

  assert.match(
    source,
    /class="mobile-theme-toggle"/,
    'Mobil drawer icinde modern tema degistirme alani olmali'
  )

  assert.match(
    source,
    /const handleOutsideClick\s*=\s*\(/,
    'Drawer acikken dis alana tiklama icin handler olmali'
  )

  assert.match(
    source,
    /document\.addEventListener\(\s*'click'\s*,\s*handleOutsideClick/,
    'Dis alana tiklamayi dinleyen click listener olmali'
  )
})
