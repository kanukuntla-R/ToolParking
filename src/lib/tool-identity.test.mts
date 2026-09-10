import assert from 'node:assert/strict'
import test from 'node:test'
import { isSameTool, normalizeToolUrl } from './tool-identity.ts'

test('tool identity ignores harmless name and URL differences', () => {
  assert.equal(isSameTool({ name: ' Next.js ' }, { name: 'next.js' }), true)
  assert.equal(isSameTool({ name: 'Next', url: 'https://www.nextjs.org/' }, { name: 'Next.js', url: 'http://nextjs.org' }), true)
  assert.equal(isSameTool({ name: 'React', url: 'https://react.dev' }, { name: 'Vue', url: 'https://vuejs.org' }), false)
  assert.equal(normalizeToolUrl('https://example.com/docs/'), 'example.com/docs')
})
