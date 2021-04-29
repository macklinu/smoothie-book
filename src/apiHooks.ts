import { MutationOptions, QueryOptions, useMutation, useQuery } from 'react-query'
import { CreateRecipe, Recipe } from 'src/models'

export function useRecipes(queryOptions?: QueryOptions<Array<Recipe>, Error>) {
  return useQuery(
    'recipes',
    () => {
      return fetch('/api/v1/recipes').then((response) => {
        if (response.ok) {
          return response.json()
        }
        throw new Error(response.statusText)
      })
    },
    queryOptions
  )
}

export function useCreateRecipeMutation(
  mutationOptions?: MutationOptions<Recipe, Error, CreateRecipe>
) {
  return useMutation((body) => {
    return fetch('/api/v1/recipes', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'content-type': 'application/json', accept: 'application/json' },
    }).then((response) => {
      if (response.ok) {
        return response.json()
      }
      throw new Error(response.statusText)
    })
  }, mutationOptions)
}

export function useUpdateRecipeMutation(
  recipeId: string,
  mutationOptions?: MutationOptions<Recipe, Error, Recipe>
) {
  return useMutation((body) => {
    return fetch(`/api/v1/recipe/${recipeId}`, {
      method: 'PUT',
      body: JSON.stringify(body),
      headers: { 'content-type': 'application/json', accept: 'application/json' },
    }).then((response) => {
      if (response.ok) {
        return response.json()
      }
      throw new Error(response.statusText)
    })
  }, mutationOptions)
}

export function useDeleteRecipeMutation(
  recipeId: string,
  mutationOptions?: MutationOptions<void, Error, Recipe>
) {
  return useMutation(() => {
    return fetch(`/api/v1/recipe/${recipeId}`, {
      method: 'DELETE',
    }).then((response) => {
      if (response.ok) {
        return
      }
      throw new Error(response.statusText)
    })
  }, mutationOptions)
}
