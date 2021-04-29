import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'
import * as z from 'zod'

const SessionWithUser = z.object({
  user: z.object({
    email: z.string(),
  }),
})
type SessionWithUser = z.infer<typeof SessionWithUser>

type AuthenticatedRequestHandler<T> = (
  req: NextApiRequest,
  res: NextApiResponse<T>,
  session: SessionWithUser
) => Promise<void>

export function withAuth<T>(handler: AuthenticatedRequestHandler<T>) {
  const sessionHandler: NextApiHandler = async (req, res) => {
    const session = await getSession({ req })
    const sessionWithUser = SessionWithUser.safeParse(session)
    if (sessionWithUser.success) {
      return await handler(req, res, sessionWithUser.data)
    }
    return res.status(401).json({ error: 'Unauthorized' })
  }
  return sessionHandler
}
