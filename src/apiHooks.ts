import { useToast } from '@chakra-ui/toast'
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
  const toast = useToast()
  const queryClient = useQueryClient()
  return useMutation((body) => axios.post('/api/v1/recipes', body).then(({ data }) => data), {
    ...mutationOptions,
    onSuccess() {
      queryClient.invalidateQueries(queryKeys.recipes)
      toast({
        title: 'Recipe created',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    },
    onError() {
      toast({
        title: 'Failed to create recipe',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    },
  })
}

export function useUpdateRecipeMutation(
  mutationOptions?: MutationOptions<Recipe, AxiosError, Recipe>
) {
  const toast = useToast()
  const queryClient = useQueryClient()
  return useMutation(
    (recipe) => axios.put(`/api/v1/recipes/${recipe.id}`, recipe).then(({ data }) => data),
    {
      ...mutationOptions,
      onSuccess() {
        queryClient.invalidateQueries(queryKeys.recipes)
        toast({
          title: 'Recipe updated',
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
      },
      onError() {
        toast({
          title: 'Failed to update recipe',
          status: 'error',
          duration: 3000,
          isClosable: true,
        })
      },
    }
  )
}

export function useDeleteRecipeMutation(
  mutationOptions?: MutationOptions<AxiosResponse<void>, Error, Recipe>
) {
  const toast = useToast()
  const queryClient = useQueryClient()
  return useMutation((recipe) => axios.delete(`/api/v1/recipes/${recipe.id}`), {
    ...mutationOptions,
    onSuccess() {
      queryClient.invalidateQueries(queryKeys.recipes)
      toast({
        title: 'Recipe deleted',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    },
    onError() {
      toast({
        title: 'Failed to delete recipe',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    },
  })
}
