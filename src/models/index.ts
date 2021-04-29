import * as z from 'zod'

const EMPTY_STRING_MESSAGE = 'Required'

export const Ingredient = z.object({
  name: z.string().nonempty({ message: EMPTY_STRING_MESSAGE }),
  amount: z.string().nonempty({ message: EMPTY_STRING_MESSAGE }),
})
export type Ingredient = z.infer<typeof Ingredient>

export const Recipe = z.object({
  id: z.string(),
  name: z.string().nonempty({ message: EMPTY_STRING_MESSAGE }),
  ingredients: z.array(Ingredient).nonempty(),
})
export type Recipe = z.infer<typeof Recipe>

export const CreateRecipe = Recipe.omit({ id: true })
export type CreateRecipe = z.infer<typeof CreateRecipe>
