import { AddIcon } from '@chakra-ui/icons'
import { Button, Flex, Heading, SimpleGrid, Spacer, useDisclosure } from '@chakra-ui/react'
import * as React from 'react'
import { useRecipes } from 'src/apiHooks'
import { CreateRecipeModal } from 'src/CreateRecipeModal'
import { Recipe } from 'src/models'
import { EmptyRecipeCard, RecipeCard, SkeletonRecipeCard } from 'src/RecipeCard'
import { UpdateRecipeModal } from 'src/UpdateRecipeModal'

export function RecipesView() {
  const createRecipeModal = useDisclosure()
  const [selectedRecipe, setSelectedRecipe] = React.useState<Recipe | undefined>(undefined)
  const recipes = useRecipes()
  return (
    <main>
      <Flex py={4} alignItems='center'>
        <Heading>Recipes</Heading>
        <Spacer />
        <Button leftIcon={<AddIcon />} onClick={createRecipeModal.onOpen} colorScheme='blue'>
          Create Recipe
        </Button>
      </Flex>
      <SimpleGrid columns={[1, null, 3]} gap={4}>
        {recipes.isLoading ? [...Array(9)].map((_, i) => <SkeletonRecipeCard key={i} />) : null}
        {recipes.isSuccess
          ? recipes.data.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                name={recipe.name}
                ingredients={recipe.ingredients}
                onClick={() => {
                  setSelectedRecipe(recipe)
                }}
              />
            ))
          : null}
        {recipes.isSuccess && recipes.data.length === 0 ? (
          <EmptyRecipeCard onCreateClick={createRecipeModal.onOpen} />
        ) : null}
      </SimpleGrid>
      {createRecipeModal.isOpen ? <CreateRecipeModal onClose={createRecipeModal.onClose} /> : null}
      {selectedRecipe ? (
        <UpdateRecipeModal
          recipe={selectedRecipe}
          onClose={() => {
            setSelectedRecipe(undefined)
          }}
        />
      ) : null}
    </main>
  )
}
