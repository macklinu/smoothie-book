import { AddIcon } from '@chakra-ui/icons'
import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Heading,
  Spacer,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import * as React from 'react'
import { useRecipes } from 'src/apiHooks'
import { CreateRecipeModal } from 'src/CreateRecipeModal'
import { Recipe } from 'src/models'
import { RecipeCard } from 'src/RecipeCard'
import { UpdateRecipeModal } from 'src/UpdateRecipeModal'

export function RecipesView() {
  const createRecipeModal = useDisclosure()
  const [selectedRecipe, setSelectedRecipe] = React.useState<Recipe | undefined>(undefined)
  const recipes = useRecipes()
  return (
    <main>
      <Flex py={4} alignItems='center'>
        <Heading>Recipes</Heading>
        <Spacer />{' '}
        <Button leftIcon={<AddIcon />} onClick={createRecipeModal.onOpen} colorScheme='blue'>
          Create Recipe
        </Button>
      </Flex>
      <Grid templateColumns='repeat(3, 1fr)' gap={4}>
        {recipes.isSuccess
          ? recipes.data.map((recipe) => (
              <GridItem>
                <RecipeCard
                  key={recipe.id}
                  name={recipe.name}
                  ingredients={recipe.ingredients}
                  onClick={() => {
                    setSelectedRecipe(recipe)
                  }}
                />
              </GridItem>
            ))
          : null}
        {/* TODO support empty state? */}
        <GridItem>
          <Box
            as='button'
            borderStyle='dashed'
            borderWidth={4}
            p={12}
            width='100%'
            onClick={createRecipeModal.onOpen}
          >
            <Flex direction='column' alignItems='center'>
              <AddIcon h={8} w={8} color='gray.600' my={2} />
              <Text>Add a New Recipe</Text>
            </Flex>
          </Box>
        </GridItem>
      </Grid>
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
