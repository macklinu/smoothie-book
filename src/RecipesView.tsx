import { AddIcon } from '@chakra-ui/icons'
import { Box, Flex, Grid, GridItem, Text } from '@chakra-ui/react'
import * as React from 'react'
import { useRecipes } from 'src/apiHooks'
import { Recipe } from 'src/models'
import { RecipeCard } from 'src/RecipeCard'

export interface RecipesViewProps {
  onCreateRecipeClick(): void
  onViewRecipeClick(recipe: Recipe): void
}

export function RecipesView({ onCreateRecipeClick, onViewRecipeClick }: RecipesViewProps) {
  const recipes = useRecipes()
  return (
    <main>
      <Grid templateColumns='repeat(3, 1fr)' gap={4} p={4}>
        {recipes.isSuccess
          ? recipes.data.map((recipe) => (
              <GridItem>
                <RecipeCard
                  key={recipe.id}
                  name={recipe.name}
                  ingredients={recipe.ingredients}
                  onClick={() => {
                    onViewRecipeClick(recipe)
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
            onClick={onCreateRecipeClick}
          >
            <Flex direction='column' alignItems='center'>
              <AddIcon h={8} w={8} color='gray.600' my={2} />
              <Text>Add a New Recipe</Text>
            </Flex>
          </Box>
        </GridItem>
      </Grid>
    </main>
  )
}
