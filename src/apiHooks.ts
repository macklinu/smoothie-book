import axios, { AxiosError, AxiosResponse } from 'axios'
import { MutationOptions, QueryOptions, useMutation, useQuery } from 'react-query'
import { CreateRecipe, Recipe } from 'src/models'

export function useRecipes(queryOptions?: QueryOptions<Array<Recipe>, AxiosError>) {
  return useQuery(
    'recipes',
    () => {
      return axios.get('/api/v1/recipes').then((response) => response.data)
    },
    queryOptions
  )
}

export function useCreateRecipeMutation(
  mutationOptions?: MutationOptions<Recipe, AxiosError, CreateRecipe>
) {
  return useMutation((body) => {
    return axios.post('/api/v1/recipes', body)
  }, mutationOptions)
}

export function useUpdateRecipeMutation(
  recipeId: string,
  mutationOptions?: MutationOptions<Recipe, AxiosError, Recipe>
) {
  return useMutation((body) => {
    return axios.put(`/api/v1/recipe/${recipeId}`, body)
  }, mutationOptions)
}

export function useDeleteRecipeMutation(
  recipeId: string,
  mutationOptions?: MutationOptions<AxiosResponse<void>, Error, Recipe>
) {
  return useMutation(() => {
    return axios.delete(`/api/v1/recipe/${recipeId}`)
  }, mutationOptions)
}
