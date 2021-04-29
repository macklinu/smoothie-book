import { NextApiRequest, NextApiResponse, NextApiHandler } from 'next'
import * as z from 'zod'

const Method = z.enum(['get', 'post', 'put', 'patch', 'delete'])
type Method = z.infer<typeof Method>

type Handlers = Partial<Record<Method, NextApiHandler>>

export function createApiHandler(handlers: Handlers) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const method = Method.safeParse(req.method?.toLowerCase())
    if (!method.success) {
      return res.status(405).json({ error: 'Method Not Allowed' })
    }
    const handler = handlers[method.data]
    if (handler) {
      await handler(req, res)
    } else {
      return res.status(405).json({ error: 'Method Not Allowed' })
    }
  }
}
