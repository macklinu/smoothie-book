import { Box, BoxProps, Heading, List, ListItem } from '@chakra-ui/react'
import * as React from 'react'
import { Recipe } from 'src/models'

export type RecipeCardProps = BoxProps & Pick<Recipe, 'name' | 'ingredients'>

export function RecipeCard({ name, ingredients, ...props }: RecipeCardProps) {
  return (
    <Box p={5} shadow='md' borderWidth='1px' width='100%' cursor='pointer' {...props}>
      <Heading fontSize='lg'>{name}</Heading>
      <List mt={4}>
        {ingredients.map((ingredient, index) => (
          <ListItem key={`${ingredient.name}-${index}`}>
            {ingredient.amount} {ingredient.name}
          </ListItem>
        ))}
      </List>
    </Box>
  )
}
