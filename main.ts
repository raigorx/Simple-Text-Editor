import { z } from 'zod'

const GetOtJsonSchema = (() => {
  const numberArraySchema = z.array(z.number())
  const result = numberArraySchema.safeParse([])
  if (result.success) console.log(result.data)

  const OperationSchema = z.union([
    z.object({ op: z.literal('skip'), count: z.number() }),
    z.object({ op: z.literal('delete'), count: z.number() }),
    z.object({ op: z.literal('insert'), chars: z.string() })
  ])
  const OtJsonSchema = z.array(OperationSchema)

  return (OtJsonParse: any) => {
    return OtJsonSchema.safeParse(OtJsonParse)
  }
})()

export function isValid (stale: string, latest: string, otjson: string): boolean {
  const otObject = (() => {
    try {
      const OtJsonParse = JSON.parse(otjson)
      const otObject = GetOtJsonSchema(OtJsonParse)
      if (otObject.success) return otObject.data
      throw new Error(otObject.error.toString())
    } catch (error) {
      return null
    }
  })()

  if (otObject === null) return stale === latest
  if (otObject.length === 0) return stale === latest
  if (!Object.hasOwn(otObject[0], 'op')) return stale === latest

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
