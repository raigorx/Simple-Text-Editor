import test from 'node:test'
import { strict as assert } from 'node:assert'
import { isValid } from './main.js'

test('Invalid object, equal strings 0', () => {
  assert.strictEqual(isValid(
    'Repl.it uses operational transformations.',
    'Repl.it uses operational transformations.',
    '{[]}'
  ), true)
})

test('Empty object, equal strings 1', () => {
  assert.strictEqual(isValid(
    'Repl.it uses operational transformations.',
    'Repl.it uses operational transformations.',
    '{}'
  ), true)
})

test('Array with empty object, equal strings 2', () => {
  assert.strictEqual(isValid(
    'Repl.it uses operational transformations.',
    'Repl.it uses operational transformations.',
    '[{}]'
  ), true)
})

test('Empty object, distinct strings 3', () => {
  assert.strictEqual(isValid(
    'Repl.it uses operational transformations to keep everyone in a multiplayer repl in sync.',
    'Repl.it uses operational transformations.',
    '{}'
  ), false)
})

test('Array with empty object, distinct strings 4', () => {
  assert.strictEqual(isValid(
    'Repl.it uses operational transformations to keep everyone in a multiplayer repl in sync.',
    'Repl.it uses operational transformations.',
    '[{}]'
  ), false)
})

test('Same after stale 5', () => {
  assert.strictEqual(isValid(
    'Repl.it uses operational transformations to keep everyone in a multiplayer repl in sync.',
    'Repl.it uses operational transformations.',
    '[{"op": "skip", "count": 40}, {"op": "delete", "count": 47}]'
  ), true)
})

test('Delete past end is false 6', () => {
  assert.strictEqual(isValid(
    'Repl.it uses operational transformations to keep everyone in a multiplayer repl in sync.',
    'Repl.it uses operational transformations.',
    '[{"op": "skip", "count": 45}, {"op": "delete", "count": 47}]'
  ), false)
})

test('Skip past end is false 7', () => {
  assert.strictEqual(isValid(
    'Repl.it uses operational transformations to keep everyone in a multiplayer repl in sync.',
    'Repl.it uses operational transformations.',
    '[{"op": "skip", "count": 40}, {"op": "delete", "count": 47}, {"op": "skip", "count": 2}]'
  ), false)
})

test('Same after stale 8', () => {
  assert.strictEqual(isValid(
    'Repl.it uses operational transformations to keep everyone in a multiplayer repl in sync.',
    'We use operational transformations to keep everyone in a multiplayer repl in sync.',
    '[{"op": "delete", "count": 7}, {"op": "insert", "chars": "We"}, {"op": "skip", "count": 4}, {"op": "delete", "count": 1}]'
  ), true)
})

test('Distinct after stale 9', () => {
  assert.strictEqual(isValid(
    'Repl.it uses operational transformations to keep everyone in a multiplayer repl in sync.',
    'We can use operational transformations to keep everyone in a multiplayer repl in sync.',
    '[{"op": "delete", "count": 7}, {"op": "insert", "chars": "We"}, {"op": "skip", "count": 4}, {"op": "delete", "count": 1}]'
  ), false)
})

test('Same no operation 10', () => {
  assert.strictEqual(isValid(
    'Repl.it uses operational transformations to keep everyone in a multiplayer repl in sync.',
    'Repl.it uses operational transformations to keep everyone in a multiplayer repl in sync.',
    '[]'
  ), true)
})
