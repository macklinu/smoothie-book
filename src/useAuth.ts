import { useSession } from 'next-auth/client'
import * as React from 'react'

export function useAuth() {
  const [session, isSessionLoading] = useSession()
  const isLoggedIn = React.useMemo(() => Boolean(session), [session])
  return { session, isSessionLoading, isLoggedIn }
}
