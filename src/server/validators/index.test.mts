import assert from 'node:assert/strict'
import test from 'node:test'
import { validateProjectDraft, validateStackItem, validateToolDraft } from './index.ts'

test('validators reject malformed and unsafe input', () => {
  assert.equal(validateToolDraft({ name: 'Safe', url: 'https://example.com' }).valid, true)
  assert.equal(validateToolDraft({ name: 'Unsafe', url: 'javascript:alert(1)' }).valid, false)
  assert.equal(validateToolDraft({ name: 'Bad', description: 42 }).valid, false)
  assert.equal(validateProjectDraft(null).valid, false)
  assert.equal(validateStackItem({ projectId: 'p', toolId: 't', lane: 'Other', order: NaN }).valid, false)
})
