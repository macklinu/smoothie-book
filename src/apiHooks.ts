import axios, { AxiosError, AxiosResponse } from 'axios'
import { MutationOptions, QueryOptions, useMutation, useQuery, useQueryClient } from 'react-query'
import { CreateRecipe, Recipe } from 'src/models'

const queryKeys = {
  recipes: 'recipes',
}

export function useRecipes(queryOptions?: QueryOptions<Array<Recipe>, AxiosError>) {
  return useQuery(
    queryKeys.recipes,
    () => axios.get('/api/v1/recipes').then(({ data }) => data),
    queryOptions
  )
}

export function useCreateRecipeMutation(
  mutationOptions?: MutationOptions<Recipe, AxiosError, CreateRecipe>
) {
  const queryClient = useQueryClient()
  return useMutation((body) => axios.post('/api/v1/recipes', body).then(({ data }) => data), {
    ...mutationOptions,
    onSuccess() {
      queryClient.invalidateQueries(queryKeys.recipes)
    },
  })
}

export function useUpdateRecipeMutation(
  recipeId: string,
  mutationOptions?: MutationOptions<Recipe, AxiosError, Recipe>
) {
  const queryClient = useQueryClient()
  return useMutation(
    (body) => axios.put(`/api/v1/recipe/${recipeId}`, body).then(({ data }) => data),
    {
      ...mutationOptions,
      onSuccess() {
        queryClient.invalidateQueries(queryKeys.recipes)
      },
    }
  )
}

export function useDeleteRecipeMutation(
  recipeId: string,
  mutationOptions?: MutationOptions<AxiosResponse<void>, Error, Recipe>
) {
  const queryClient = useQueryClient()
  return useMutation(() => axios.delete(`/api/v1/recipe/${recipeId}`), {
    ...mutationOptions,
    onSuccess() {
      queryClient.invalidateQueries(queryKeys.recipes)
    },
  })
}
