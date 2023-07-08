function isValid(stale, latest, otjson) {
  const otObject = JSON.parse(otjson)
  
  if (otjson.length === 0) return stale === latest
  
  cursor = 0
  
  for (const opTrans of otObject) {
    if (opTrans.op === 'skip') {
      cursor += opTrans.count
      if (stale.at(cursor) === undefined) return false
    }
    if (opTrans.op === 'delete') {
      if (stale.at(opTrans.count) === undefined) return false
      stale = stale.slice(0, cursor) + stale.slice(cursor + opTrans.count)
    }
      
    if (opTrans.op === 'insert'){
      stale = stale.slice(0, cursor) + opTrans.chars + stale.slice(cursor);
      cursor += opTrans.chars.length
    }
  }
  
  return stale === latest
}

isValid(
  'Repl.it uses operational transformations to keep everyone in a multiplayer repl in sync.',
  'Repl.it uses operational transformations.',
  '[{"op": "skip", "count": 40}, {"op": "delete", "count": 47}]'
); // true

isValid(
  'Repl.it uses operational transformations to keep everyone in a multiplayer repl in sync.',
  'Repl.it uses operational transformations.',
  '[{"op": "skip", "count": 45}, {"op": "delete", "count": 47}]'
); // false, delete past end

isValid(
  'Repl.it uses operational transformations to keep everyone in a multiplayer repl in sync.',
  'Repl.it uses operational transformations.',
  '[{"op": "skip", "count": 40}, {"op": "delete", "count": 47}, {"op": "skip", "count": 2}]'
); // false, skip past end

isValid(
  'Repl.it uses operational transformations to keep everyone in a multiplayer repl in sync.',
  'We use operational transformations to keep everyone in a multiplayer repl in sync.',
  '[{"op": "delete", "count": 7}, {"op": "insert", "chars": "We"}, {"op": "skip", "count": 4}, {"op": "delete", "count": 1}]'
); // true

isValid(
  'Repl.it uses operational transformations to keep everyone in a multiplayer repl in sync.',
  'We can use operational transformations to keep everyone in a multiplayer repl in sync.',
  '[{"op": "delete", "count": 7}, {"op": "insert", "chars": "We"}, {"op": "skip", "count": 4}, {"op": "delete", "count": 1}]'
); // false

isValid(
  'Repl.it uses operational transformations to keep everyone in a multiplayer repl in sync.',
  'Repl.it uses operational transformations to keep everyone in a multiplayer repl in sync.',
  '[]'
); // true