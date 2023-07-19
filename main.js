// Apply otjson operations to stale and compare to latest
export function isValid (stale, latest, otjson) {
  if (typeof stale !== 'string' || typeof latest !== 'string') return false

  const otObject = (() => {
    try {
      return Object.freeze(JSON.parse(otjson))
    } catch (error) {
      return null
    }
  })()

  try {
    if (!Object.hasOwn(otObject[0], 'op')) return stale === latest
  } catch (error) {
    return stale === latest
  }

  let cursor = 0

  for (const opTrans of otObject) {
    if (opTrans.op === 'skip') {
      cursor += opTrans.count
      if (stale.at(cursor) === undefined) return false
    }
    if (opTrans.op === 'delete') {
      if (stale.at(opTrans.count) === undefined) return false
      stale = stale.slice(0, cursor) + stale.slice(cursor + opTrans.count)
    }

    if (opTrans.op === 'insert') {
      stale = stale.slice(0, cursor) + opTrans.chars + stale.slice(cursor)
      cursor += opTrans.chars.length
    }
  }

  return stale === latest
}
