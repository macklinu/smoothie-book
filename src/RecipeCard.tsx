import { AddIcon } from '@chakra-ui/icons'
import {
  Box,
  BoxProps,
  Flex,
  Heading,
  List,
  ListItem,
  Skeleton,
  SkeletonText,
  Text,
} from '@chakra-ui/react'
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

export function SkeletonRecipeCard() {
  return (
    <Flex p={5} shadow='md' borderWidth='1px' width='100%' flexDirection='column'>
      <Skeleton noOfLines={1} height={6} />
      <SkeletonText noOfLines={4} mt={4} />
    </Flex>
  )
}

export interface EmptyRecipeCardProps {
  onCreateClick(): void
}

export function EmptyRecipeCard({ onCreateClick }: EmptyRecipeCardProps) {
  return (
    <Flex
      as='button'
      p={6}
      shadow='md'
      borderWidth='1px'
      flexDirection='column'
      alignItems='center'
      onClick={onCreateClick}
    >
      <AddIcon h={8} w={8} color='gray.600' my={2} />
      <Text>Start by adding a recipe to your smoothie book</Text>
    </Flex>
  )
}
