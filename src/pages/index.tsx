import { Container } from '@chakra-ui/react'
import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/client'
import * as React from 'react'
import { MarketingView } from 'src/MarketingView'
import { NavigationBar } from 'src/NavigationBar'
import { RecipesView } from 'src/RecipesView'
import { useAuth } from 'src/useAuth'

export default function IndexPage() {
  const { isLoggedIn } = useAuth()
  return (
    <>
      <NavigationBar isLoggedIn={isLoggedIn} />
      <Container maxW='container.xl'>{isLoggedIn ? <RecipesView /> : <MarketingView />}</Container>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req })
  return {
    props: { session },
  }
}
