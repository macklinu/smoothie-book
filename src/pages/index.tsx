import { Container, useDisclosure } from '@chakra-ui/react'
import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/client'
import * as React from 'react'
import { CreateRecipeModal } from 'src/CreateRecipeModal'
import { MarketingView } from 'src/MarketingView'
import { Recipe } from 'src/models'
import { NavigationBar } from 'src/NavigationBar'
import { RecipesView } from 'src/RecipesView'
import { UpdateRecipeModal } from 'src/UpdateRecipeModal'
import { useAuth } from 'src/useAuth'

export default function IndexPage() {
  const { isLoggedIn } = useAuth()
  const createRecipeModal = useDisclosure()
  const [selectedRecipe, setSelectedRecipe] = React.useState<Recipe | undefined>(undefined)
  return (
    <>
      <NavigationBar isLoggedIn={isLoggedIn} onCreateRecipeClick={createRecipeModal.onOpen} />
      <Container maxW='container.xl'>
        {isLoggedIn ? (
          <RecipesView
            onCreateRecipeClick={createRecipeModal.onOpen}
            onViewRecipeClick={(recipe) => {
              setSelectedRecipe(recipe)
            }}
          />
        ) : (
          <MarketingView />
        )}
      </Container>
      {createRecipeModal.isOpen ? <CreateRecipeModal onClose={createRecipeModal.onClose} /> : null}
      {selectedRecipe ? (
        <UpdateRecipeModal
          recipe={selectedRecipe}
          onClose={() => {
            setSelectedRecipe(undefined)
          }}
        />
      ) : null}
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req })
  return {
    props: { session },
  }
}
